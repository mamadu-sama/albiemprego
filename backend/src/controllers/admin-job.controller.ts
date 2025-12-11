// Controller de gestão de vagas para administradores
import { Request, Response } from "express";
import { prisma } from "../config/database";
import { logger } from "../config/logger";
import { NotFoundError } from "../utils/errors";
import { JobStatus } from "@prisma/client";
import { validationResult } from "express-validator";

export class AdminJobController {
  /**
   * GET /api/admin/jobs - Listar todas as vagas com filtros
   */
  static async listJobs(req: Request, res: Response) {
    try {
      const {
        status,
        search,
        hasReports,
        page = "1",
        limit = "20",
      } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      // Construir filtros
      const where: any = {};

      if (status && status !== "all") {
        where.status = status as JobStatus;
      }

      if (hasReports === "true") {
        where.reportsCount = { gt: 0 };
      }

      if (search) {
        where.OR = [
          { title: { contains: search as string, mode: "insensitive" } },
          {
            company: {
              name: { contains: search as string, mode: "insensitive" },
            },
          },
        ];
      }

      // Buscar vagas
      const [jobs, total] = await Promise.all([
        prisma.job.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: "desc" },
          include: {
            company: {
              select: {
                id: true,
                name: true,
                user: {
                  select: {
                    email: true,
                    status: true,
                  },
                },
              },
            },
            _count: {
              select: { applications: true },
            },
          },
        }),
        prisma.job.count({ where }),
      ]);

      logger.info(`Admin listou vagas: ${jobs.length} resultados`);

      return res.status(200).json({
        jobs,
        pagination: {
          total,
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          totalPages: Math.ceil(total / take),
        },
      });
    } catch (error) {
      logger.error("Error listing jobs:", error);
      throw error;
    }
  }

  /**
   * GET /api/admin/jobs/:id - Obter detalhes de uma vaga específica
   */
  static async getJobDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const job = await prisma.job.findUnique({
        where: { id },
        include: {
          company: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  phone: true,
                  status: true,
                },
              },
            },
          },
          applications: {
            include: {
              candidate: {
                include: {
                  user: {
                    select: {
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
            orderBy: { appliedAt: "desc" },
            take: 10,
          },
          _count: {
            select: { applications: true },
          },
        },
      });

      if (!job) {
        throw new NotFoundError("Vaga não encontrada", "JOB_NOT_FOUND");
      }

      logger.info(`Admin visualizou detalhes da vaga: ${job.title}`);

      return res.status(200).json(job);
    } catch (error) {
      logger.error("Error getting job details:", error);
      throw error;
    }
  }

  /**
   * PATCH /api/admin/jobs/:id/status - Alterar status da vaga
   */
  static async updateJobStatus(req: Request, res: Response) {
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

      // Verificar se vaga existe
      const job = await prisma.job.findUnique({
        where: { id },
        include: {
          company: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!job) {
        throw new NotFoundError("Vaga não encontrada", "JOB_NOT_FOUND");
      }

      // Preparar dados de atualização
      const updateData: any = { status };

      if (status === "ACTIVE") {
        updateData.approvedAt = new Date();
        updateData.publishedAt = updateData.publishedAt || new Date();
        updateData.rejectedAt = null;
        updateData.rejectionReason = null;
      } else if (status === "REJECTED") {
        updateData.rejectedAt = new Date();
        if (rejectionReason) {
          updateData.rejectionReason = rejectionReason;
        }
      }

      // Atualizar vaga
      const updatedJob = await prisma.job.update({
        where: { id },
        data: updateData,
        include: {
          company: true,
        },
      });

      logger.info(
        `Admin alterou status da vaga "${job.title}" para ${status}`
      );

      // TODO: Enviar email à empresa notificando mudança de status
      // Adicionar método no EmailService se necessário

      return res.status(200).json({
        message: "Status da vaga atualizado com sucesso",
        job: updatedJob,
      });
    } catch (error) {
      logger.error("Error updating job status:", error);
      throw error;
    }
  }

  /**
   * DELETE /api/admin/jobs/:id - Eliminar vaga permanentemente
   */
  static async deleteJob(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Verificar se vaga existe
      const job = await prisma.job.findUnique({
        where: { id },
        include: {
          _count: {
            select: { applications: true },
          },
        },
      });

      if (!job) {
        throw new NotFoundError("Vaga não encontrada", "JOB_NOT_FOUND");
      }

      // Eliminar vaga (cascade delete eliminará candidaturas)
      await prisma.job.delete({
        where: { id },
      });

      logger.info(
        `Admin eliminou vaga: "${job.title}" (${job._count.applications} candidaturas)`
      );

      return res.status(200).json({
        message: "Vaga eliminada com sucesso",
      });
    } catch (error) {
      logger.error("Error deleting job:", error);
      throw error;
    }
  }

  /**
   * POST /api/admin/jobs/:id/report - Incrementar contador de denúncias
   */
  static async reportJob(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Verificar se vaga existe
      const job = await prisma.job.findUnique({
        where: { id },
      });

      if (!job) {
        throw new NotFoundError("Vaga não encontrada", "JOB_NOT_FOUND");
      }

      // Incrementar contador de denúncias
      const updatedJob = await prisma.job.update({
        where: { id },
        data: {
          reportsCount: { increment: 1 },
        },
      });

      logger.info(
        `Vaga "${job.title}" denunciada. Total: ${updatedJob.reportsCount}`
      );

      return res.status(200).json({
        message: "Denúncia registada com sucesso",
        reportsCount: updatedJob.reportsCount,
      });
    } catch (error) {
      logger.error("Error reporting job:", error);
      throw error;
    }
  }

  /**
   * PATCH /api/admin/jobs/:id/clear-reports - Limpar denúncias
   */
  static async clearReports(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Verificar se vaga existe
      const job = await prisma.job.findUnique({
        where: { id },
      });

      if (!job) {
        throw new NotFoundError("Vaga não encontrada", "JOB_NOT_FOUND");
      }

      // Limpar contador de denúncias
      const updatedJob = await prisma.job.update({
        where: { id },
        data: {
          reportsCount: 0,
        },
      });

      logger.info(`Admin limpou denúncias da vaga: "${job.title}"`);

      return res.status(200).json({
        message: "Denúncias limpas com sucesso",
        job: updatedJob,
      });
    } catch (error) {
      logger.error("Error clearing reports:", error);
      throw error;
    }
  }

  /**
   * GET /api/admin/jobs/stats - Estatísticas gerais de vagas
   */
  static async getJobStats(req: Request, res: Response) {
    try {
      const [
        totalJobs,
        activeJobs,
        pendingJobs,
        rejectedJobs,
        pausedJobs,
        reportedJobs,
        totalApplications,
      ] = await Promise.all([
        prisma.job.count(),
        prisma.job.count({ where: { status: "ACTIVE" } }),
        prisma.job.count({ where: { status: "PENDING" } }),
        prisma.job.count({ where: { status: "REJECTED" } }),
        prisma.job.count({ where: { status: "PAUSED" } }),
        prisma.job.count({ where: { reportsCount: { gt: 0 } } }),
        prisma.application.count(),
      ]);

      logger.info("Admin obteve estatísticas de vagas");

      return res.status(200).json({
        total: totalJobs,
        active: activeJobs,
        pending: pendingJobs,
        rejected: rejectedJobs,
        paused: pausedJobs,
        reported: reportedJobs,
        totalApplications,
      });
    } catch (error) {
      logger.error("Error getting job stats:", error);
      throw error;
    }
  }
}

