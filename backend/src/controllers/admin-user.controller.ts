// Controller de gestão de utilizadores para administradores
import { Request, Response } from "express";
import { prisma } from "../config/database";
import { logger } from "../config/logger";
import { NotFoundError, BadRequestError } from "../utils/errors";
import { UserStatus, UserType } from "@prisma/client";
import { EmailService } from "../services/email.service";
import { validationResult } from "express-validator";

export class AdminUserController {
  /**
   * GET /api/admin/users - Listar todos os utilizadores com filtros
   */
  static async listUsers(req: Request, res: Response) {
    try {
      const {
        type,
        status,
        search,
        page = "1",
        limit = "20",
      } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      // Construir filtros
      const where: any = {};

      if (type && type !== "all") {
        where.type = type as UserType;
      }

      if (status && status !== "all") {
        where.status = status as UserStatus;
      }

      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: "insensitive" } },
          { email: { contains: search as string, mode: "insensitive" } },
        ];
      }

      // Buscar utilizadores
      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: "desc" },
          include: {
            candidate: {
              include: {
                _count: {
                  select: { applications: true },
                },
              },
            },
            company: {
              include: {
                _count: {
                  select: { jobs: true },
                },
              },
            },
          },
        }),
        prisma.user.count({ where }),
      ]);

      // Remover dados sensíveis
      const sanitizedUsers = users.map((user) => {
        const {
          password,
          passwordResetToken,
          passwordResetExpires,
          emailVerificationToken,
          emailVerificationExpires,
          ...userWithoutPassword
        } = user;

        return {
          ...userWithoutPassword,
          applicationCount:
            user.candidate?._count?.applications || 0,
          jobCount: user.company?._count?.jobs || 0,
        };
      });

      logger.info(
        `Admin listou utilizadores: ${sanitizedUsers.length} resultados`
      );

      return res.status(200).json({
        users: sanitizedUsers,
        pagination: {
          total,
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          totalPages: Math.ceil(total / take),
        },
      });
    } catch (error) {
      logger.error("Error listing users:", error);
      throw error;
    }
  }

  /**
   * GET /api/admin/users/:id - Obter detalhes de um utilizador específico
   */
  static async getUserDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          candidate: {
            include: {
              experiences: { orderBy: { startDate: "desc" } },
              educations: { orderBy: { startDate: "desc" } },
              languages: true,
              applications: {
                include: {
                  job: {
                    select: {
                      id: true,
                      title: true,
                      company: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
                },
                orderBy: { appliedAt: "desc" },
                take: 10,
              },
              _count: {
                select: { applications: true, savedJobs: true },
              },
            },
          },
          company: {
            include: {
              jobs: {
                include: {
                  _count: {
                    select: { applications: true },
                  },
                },
                orderBy: { createdAt: "desc" },
                take: 10,
              },
              _count: {
                select: { jobs: true },
              },
            },
          },
        },
      });

      if (!user) {
        throw new NotFoundError(
          "Utilizador não encontrado",
          "USER_NOT_FOUND"
        );
      }

      // Remover dados sensíveis
      const {
        password,
        passwordResetToken,
        passwordResetExpires,
        emailVerificationToken,
        emailVerificationExpires,
        ...userWithoutPassword
      } = user;

      logger.info(`Admin visualizou detalhes do utilizador: ${user.email}`);

      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      logger.error("Error getting user details:", error);
      throw error;
    }
  }

  /**
   * PATCH /api/admin/users/:id/status - Alterar status do utilizador
   */
  static async updateUserStatus(req: Request, res: Response) {
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
      const { status } = req.body;

      // Verificar se utilizador existe
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundError(
          "Utilizador não encontrado",
          "USER_NOT_FOUND"
        );
      }

      // Não permitir alterar status de admins
      if (user.type === "ADMIN") {
        throw new BadRequestError(
          "Não é possível alterar o status de administradores",
          "CANNOT_MODIFY_ADMIN"
        );
      }

      // Atualizar status
      const updated = await prisma.user.update({
        where: { id },
        data: { status },
        include: {
          candidate: true,
          company: true,
        },
      });

      // Remover dados sensíveis
      const {
        password,
        passwordResetToken,
        passwordResetExpires,
        emailVerificationToken,
        emailVerificationExpires,
        ...userWithoutPassword
      } = updated;

      logger.info(
        `Admin alterou status do utilizador ${user.email} para ${status}`
      );

      // Enviar email notificando mudança de status
      if (status === "SUSPENDED") {
        await EmailService.sendAccountSuspendedEmail(updated);
      } else if (status === "ACTIVE" && user.status !== "ACTIVE") {
        await EmailService.sendAccountActivatedEmail(updated);
      }

      return res.status(200).json({
        message: "Status atualizado com sucesso",
        user: userWithoutPassword,
      });
    } catch (error) {
      logger.error("Error updating user status:", error);
      throw error;
    }
  }

  /**
   * DELETE /api/admin/users/:id - Eliminar utilizador permanentemente
   */
  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Verificar se utilizador existe
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundError(
          "Utilizador não encontrado",
          "USER_NOT_FOUND"
        );
      }

      // Não permitir eliminar admins
      if (user.type === "ADMIN") {
        throw new BadRequestError(
          "Não é possível eliminar administradores",
          "CANNOT_DELETE_ADMIN"
        );
      }

      // Eliminar utilizador (cascade delete através do schema)
      await prisma.user.delete({
        where: { id },
      });

      logger.info(`Admin eliminou utilizador: ${user.email}`);

      return res.status(200).json({
        message: "Utilizador eliminado com sucesso",
      });
    } catch (error) {
      logger.error("Error deleting user:", error);
      throw error;
    }
  }

  /**
   * POST /api/admin/users/:id/email - Enviar email personalizado para utilizador
   */
  static async sendEmailToUser(req: Request, res: Response) {
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

      // Verificar se utilizador existe
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundError(
          "Utilizador não encontrado",
          "USER_NOT_FOUND"
        );
      }

      // Enviar email
      await EmailService.sendAdminEmail(user, subject, message);

      logger.info(`Admin enviou email para utilizador: ${user.email}`);

      return res.status(200).json({
        message: "Email enviado com sucesso",
      });
    } catch (error) {
      logger.error("Error sending email to user:", error);
      throw error;
    }
  }

  /**
   * GET /api/admin/users/stats - Estatísticas gerais de utilizadores
   */
  static async getUserStats(req: Request, res: Response) {
    try {
      const [
        totalUsers,
        activeUsers,
        suspendedUsers,
        pendingUsers,
        totalCandidates,
        totalCompanies,
        totalAdmins,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { status: "ACTIVE" } }),
        prisma.user.count({ where: { status: "SUSPENDED" } }),
        prisma.user.count({ where: { status: "PENDING" } }),
        prisma.user.count({ where: { type: "CANDIDATO" } }),
        prisma.user.count({ where: { type: "EMPRESA" } }),
        prisma.user.count({ where: { type: "ADMIN" } }),
      ]);

      logger.info("Admin obteve estatísticas de utilizadores");

      return res.status(200).json({
        total: totalUsers,
        active: activeUsers,
        suspended: suspendedUsers,
        pending: pendingUsers,
        byType: {
          candidates: totalCandidates,
          companies: totalCompanies,
          admins: totalAdmins,
        },
      });
    } catch (error) {
      logger.error("Error getting user stats:", error);
      throw error;
    }
  }
}

