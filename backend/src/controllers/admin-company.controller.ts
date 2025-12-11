// Controller de gestão de empresas para administradores
import { Request, Response } from "express";
import { prisma } from "../config/database";
import { logger } from "../config/logger";
import { NotFoundError, BadRequestError } from "../utils/errors";
import { UserStatus } from "@prisma/client";
import { EmailService } from "../services/email.service";
import { validationResult } from "express-validator";

export class AdminCompanyController {
  /**
   * GET /api/admin/companies - Listar todas as empresas com filtros
   */
  static async listCompanies(req: Request, res: Response) {
    try {
      const {
        status,
        search,
        page = "1",
        limit = "20",
      } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      // Construir filtros
      const where: any = {};

      // Filtrar pelo status do User relacionado
      const userWhere: any = {};
      if (status && status !== "all") {
        userWhere.status = status as UserStatus;
      }

      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: "insensitive" } },
          { nif: { contains: search as string, mode: "insensitive" } },
          {
            user: {
              email: { contains: search as string, mode: "insensitive" },
            },
          },
        ];
      }

      // Buscar empresas
      const [companies, total] = await Promise.all([
        prisma.company.findMany({
          where: {
            ...where,
            user: userWhere,
          },
          skip,
          take,
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                status: true,
                createdAt: true,
                lastLoginAt: true,
              },
            },
            _count: {
              select: { jobs: true },
            },
          },
        }),
        prisma.company.count({
          where: {
            ...where,
            user: userWhere,
          },
        }),
      ]);

      logger.info(
        `Admin listou empresas: ${companies.length} resultados`
      );

      return res.status(200).json({
        companies,
        pagination: {
          total,
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          totalPages: Math.ceil(total / take),
        },
      });
    } catch (error) {
      logger.error("Error listing companies:", error);
      throw error;
    }
  }

  /**
   * GET /api/admin/companies/:id - Obter detalhes de uma empresa específica
   */
  static async getCompanyDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const company = await prisma.company.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              phone: true,
              status: true,
              createdAt: true,
              lastLoginAt: true,
            },
          },
          jobs: {
            include: {
              _count: {
                select: { applications: true },
              },
            },
            orderBy: { createdAt: "desc" },
          },
          subscriptions: {
            where: { status: "ACTIVE" },
            include: {
              plan: true,
            },
          },
          _count: {
            select: {
              jobs: true,
            },
          },
        },
      });

      if (!company) {
        throw new NotFoundError(
          "Empresa não encontrada",
          "COMPANY_NOT_FOUND"
        );
      }

      logger.info(`Admin visualizou detalhes da empresa: ${company.name}`);

      return res.status(200).json(company);
    } catch (error) {
      logger.error("Error getting company details:", error);
      throw error;
    }
  }

  /**
   * PATCH /api/admin/companies/:id/status - Alterar status da empresa
   */
  static async updateCompanyStatus(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Dados inválidos",
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      const { status, rejectionReason } = req.body;

      // Verificar se empresa existe
      const company = await prisma.company.findUnique({
        where: { id },
        include: { user: true },
      });

      if (!company) {
        throw new NotFoundError(
          "Empresa não encontrada",
          "COMPANY_NOT_FOUND"
        );
      }

      // Atualizar status do utilizador
      const updatedUser = await prisma.user.update({
        where: { id: company.userId },
        data: { status },
      });

      // Atualizar informações de aprovação/rejeição na empresa
      const companyUpdateData: any = {};

      if (status === "ACTIVE") {
        companyUpdateData.approvedAt = new Date();
        companyUpdateData.rejectedAt = null;
        companyUpdateData.rejectionReason = null;
      } else if (status === "SUSPENDED") {
        companyUpdateData.rejectedAt = new Date();
        if (rejectionReason) {
          companyUpdateData.rejectionReason = rejectionReason;
        }
      }

      const updatedCompany = await prisma.company.update({
        where: { id },
        data: companyUpdateData,
        include: { user: true },
      });

      logger.info(
        `Admin alterou status da empresa ${company.name} para ${status}`
      );

      // Enviar email notificando mudança de status
      if (status === "ACTIVE" && company.user.status !== "ACTIVE") {
        await EmailService.sendCompanyApprovedEmail(updatedCompany);
      } else if (status === "SUSPENDED") {
        await EmailService.sendAccountSuspendedEmail(updatedUser);
      }

      return res.status(200).json({
        message: "Status atualizado com sucesso",
        company: updatedCompany,
      });
    } catch (error) {
      logger.error("Error updating company status:", error);
      throw error;
    }
  }

  /**
   * DELETE /api/admin/companies/:id - Eliminar empresa permanentemente
   */
  static async deleteCompany(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Verificar se empresa existe
      const company = await prisma.company.findUnique({
        where: { id },
        include: {
          user: true,
          _count: {
            select: { jobs: true },
          },
        },
      });

      if (!company) {
        throw new NotFoundError(
          "Empresa não encontrada",
          "COMPANY_NOT_FOUND"
        );
      }

      // Eliminar o utilizador (cascade delete eliminará a empresa)
      await prisma.user.delete({
        where: { id: company.userId },
      });

      logger.info(
        `Admin eliminou empresa: ${company.name} (${company._count.jobs} vagas)`
      );

      return res.status(200).json({
        message: "Empresa eliminada com sucesso",
      });
    } catch (error) {
      logger.error("Error deleting company:", error);
      throw error;
    }
  }

  /**
   * POST /api/admin/companies/:id/email - Enviar email personalizado para empresa
   */
  static async sendEmailToCompany(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Dados inválidos",
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      const { subject, message } = req.body;

      // Verificar se empresa existe
      const company = await prisma.company.findUnique({
        where: { id },
        include: { user: true },
      });

      if (!company) {
        throw new NotFoundError(
          "Empresa não encontrada",
          "COMPANY_NOT_FOUND"
        );
      }

      // Enviar email
      await EmailService.sendAdminEmail(company.user, subject, message);

      logger.info(`Admin enviou email para empresa: ${company.name}`);

      return res.status(200).json({
        message: "Email enviado com sucesso",
      });
    } catch (error) {
      logger.error("Error sending email to company:", error);
      throw error;
    }
  }

  /**
   * GET /api/admin/companies/stats - Estatísticas gerais de empresas
   */
  static async getCompanyStats(req: Request, res: Response) {
    try {
      const [
        totalCompanies,
        activeCompanies,
        suspendedCompanies,
        pendingCompanies,
        totalJobs,
        totalApplications,
      ] = await Promise.all([
        prisma.company.count(),
        prisma.company.count({
          where: { user: { status: "ACTIVE" } },
        }),
        prisma.company.count({
          where: { user: { status: "SUSPENDED" } },
        }),
        prisma.company.count({
          where: { user: { status: "PENDING" } },
        }),
        prisma.job.count(),
        prisma.application.count(),
      ]);

      logger.info("Admin obteve estatísticas de empresas");

      return res.status(200).json({
        total: totalCompanies,
        active: activeCompanies,
        suspended: suspendedCompanies,
        pending: pendingCompanies,
        totalJobs,
        totalApplications,
      });
    } catch (error) {
      logger.error("Error getting company stats:", error);
      throw error;
    }
  }
}

