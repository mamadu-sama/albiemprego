// Controller de gestão de vagas
import { Request, Response, NextFunction } from "express";
import { JobService } from "../services/job.service";
import {
  JobSearchService,
  JobSearchFilters,
} from "../services/job-search.service";
import { MatchService } from "../services/match.service";
import { CreditService } from "../services/credit.service";
import { CreditAnalyticsService } from "../services/credit-analytics.service";
import { JobLimitService } from "../services/job-limit.service";
import { validationResult } from "express-validator";
import { logger } from "../config/logger";
import { prisma } from "../config/database";
import { JobType, WorkMode } from "@prisma/client";

export class JobController {
  /**
   * GET /jobs - Listar vagas (público + filtros)
   */
  static async listJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Dados inválidos",
          errors: errors.array(),
        });
      }

      const filters = {
        search: req.query.search as string,
        location: req.query.location as string,
        type: req.query.type as string,
        workMode: req.query.workMode as string,
        experienceLevel: req.query.experienceLevel as string,
        sector: req.query.sector as string,
        salaryMin: req.query.salaryMin
          ? parseInt(req.query.salaryMin as string)
          : undefined,
        salaryMax: req.query.salaryMax
          ? parseInt(req.query.salaryMax as string)
          : undefined,
        companyId: req.query.companyId as string,
        status: req.query.status as any,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      };

      const result = await JobService.listJobs(filters);
      return res.status(200).json(result);
    } catch (error) {
      logger.error("Error listing jobs:", error);
      return next(error);
    }
  }

  /**
   * GET /jobs/:id - Detalhes da vaga (público)
   */
  static async getJob(req: Request, res: Response, next: NextFunction) {
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
      const userId = req.user?.userId; // Opcional para tracking

      const job = await JobService.getJob(id, userId);
      return res.status(200).json(job);
    } catch (error) {
      logger.error("Error getting job:", error);
      return next(error);
    }
  }

  /**
   * POST /jobs - Criar vaga (Empresa)
   */
  static async createJob(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Dados inválidos",
          errors: errors.array(),
        });
      }

      const userId = req.user?.userId!;
      const job = await JobService.createJob(userId, req.body);
      return res.status(201).json(job);
    } catch (error) {
      logger.error("Error creating job:", error);
      return next(error);
    }
  }

  /**
   * PATCH /jobs/:id - Atualizar vaga (Empresa)
   */
  static async updateJob(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Dados inválidos",
          errors: errors.array(),
        });
      }

      const userId = req.user?.userId!;
      const { id } = req.params;

      const job = await JobService.updateJob(userId, id, req.body);
      return res.status(200).json(job);
    } catch (error) {
      logger.error("Error updating job:", error);
      return next(error);
    }
  }

  /**
   * DELETE /jobs/:id - Remover vaga (Empresa)
   */
  static async deleteJob(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Dados inválidos",
          errors: errors.array(),
        });
      }

      const userId = req.user?.userId!;
      const { id } = req.params;

      const result = await JobService.deleteJob(userId, id);
      return res.status(200).json(result);
    } catch (error) {
      logger.error("Error deleting job:", error);
      return next(error);
    }
  }

  /**
   * PATCH /jobs/:id/publish - Publicar vaga (Empresa)
   */
  static async publishJob(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Dados inválidos",
          errors: errors.array(),
        });
      }

      const userId = req.user?.userId!;
      const { id } = req.params;

      const job = await JobService.publishJob(userId, id);
      return res.status(200).json(job);
    } catch (error) {
      logger.error("Error publishing job:", error);
      return next(error);
    }
  }

  /**
   * PATCH /jobs/:id/pause - Pausar vaga (Empresa)
   */
  static async pauseJob(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Dados inválidos",
          errors: errors.array(),
        });
      }

      const userId = req.user?.userId!;
      const { id } = req.params;

      const job = await JobService.pauseJob(userId, id);
      return res.status(200).json(job);
    } catch (error) {
      logger.error("Error pausing job:", error);
      return next(error);
    }
  }

  /**
   * PATCH /jobs/:id/close - Fechar vaga (Empresa)
   */
  static async closeJob(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Dados inválidos",
          errors: errors.array(),
        });
      }

      const userId = req.user?.userId!;
      const { id } = req.params;

      const job = await JobService.closeJob(userId, id);
      return res.status(200).json(job);
    } catch (error) {
      logger.error("Error closing job:", error);
      return next(error);
    }
  }

  /**
   * PATCH /jobs/:id/reactivate - Reativar vaga pausada (Empresa)
   */
  static async reactivateJob(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Dados inválidos",
          errors: errors.array(),
        });
      }

      const userId = req.user?.userId!;
      const { id } = req.params;

      const job = await JobService.reactivateJob(userId, id);
      return res.status(200).json(job);
    } catch (error) {
      logger.error("Error reactivating job:", error);
      return next(error);
    }
  }

  /**
   * GET /jobs/my-jobs - Listar vagas da empresa logada (Empresa)
   */
  static async getMyJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId!;
      const status = req.query.status as any;

      const jobs = await JobService.getMyJobs(userId, status);
      return res.status(200).json(jobs);
    } catch (error) {
      logger.error("Error getting my jobs:", error);
      return next(error);
    }
  }

  /**
   * GET /jobs/my-jobs/stats - Estatísticas das vagas da empresa (Empresa)
   */
  static async getMyJobsStats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId!;

      const stats = await JobService.getMyJobsStats(userId);
      return res.status(200).json(stats);
    } catch (error) {
      logger.error("Error getting jobs stats:", error);
      return next(error);
    }
  }

  /**
   * GET /jobs/search - Busca pública avançada de vagas (autenticação opcional)
   */
  static async searchPublicJobs(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Dados inválidos",
          errors: errors.array(),
        });
      }

      const userId = req.user?.userId; // Opcional (para match score)
      const userType = req.user?.userType;

      // Construir filtros
      const filters: JobSearchFilters = {
        search: req.query.search as string,
        location: req.query.location as string,
        type: req.query.type
          ? Array.isArray(req.query.type)
            ? (req.query.type as JobType[])
            : [req.query.type as JobType]
          : undefined,
        workMode: req.query.workMode
          ? Array.isArray(req.query.workMode)
            ? (req.query.workMode as WorkMode[])
            : [req.query.workMode as WorkMode]
          : undefined,
        salaryMin: req.query.salaryMin
          ? parseInt(req.query.salaryMin as string)
          : undefined,
        salaryMax: req.query.salaryMax
          ? parseInt(req.query.salaryMax as string)
          : undefined,
        showSalaryOnly: req.query.showSalaryOnly === "true",
        sector: req.query.sector as string,
        experienceLevel: req.query.experienceLevel as string,
        goodMatchesOnly: req.query.goodMatchesOnly === "true",
        sortBy: (req.query.sortBy as any) || "recent",
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      };

      // Calcular match scores se utilizador autenticado e for candidato
      let matchScores: Record<string, number> | undefined;

      if (userId && userType === "CANDIDATO") {
        // Primeiro buscar vagas sem filtro de match para calcular scores
        const initialResults = await JobSearchService.searchJobs({
          ...filters,
          goodMatchesOnly: false, // Desabilitar temporariamente
        });

        // Calcular match scores para todas as vagas
        const jobIds = initialResults.jobs.map((job) => job.id);
        const matchResults = await MatchService.calculateBulkMatchScores(
          jobIds,
          userId
        );

        // Converter para formato simples (apenas overall score)
        matchScores = {};
        for (const [jobId, result] of Object.entries(matchResults)) {
          matchScores[jobId] = result.overall;
        }

        // Agora buscar novamente com filtro de match se necessário
        if (filters.goodMatchesOnly) {
          const result = await JobSearchService.searchJobs(
            filters,
            matchScores
          );

          return res.status(200).json({
            ...result,
            matchScores,
          });
        }
      }

      // Buscar vagas
      const result = await JobSearchService.searchJobs(filters, matchScores);

      // Retornar com ou sem match scores
      return res.status(200).json({
        ...result,
        ...(matchScores && { matchScores }),
      });
    } catch (error) {
      logger.error("Error searching jobs:", error);
      return next(error);
    }
  }

  /**
   * GET /jobs/:id/match-score - Calcular match score para uma vaga específica (Candidato)
   */
  static async getMatchScore(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Dados inválidos",
          errors: errors.array(),
        });
      }

      const userId = req.user?.userId!;
      const userType = req.user?.userType;
      const { id: jobId } = req.params;

      // Apenas candidatos podem calcular match score
      if (userType !== "CANDIDATO") {
        return res.status(403).json({
          error: "FORBIDDEN",
          message: "Apenas candidatos podem ver match score",
        });
      }

      // Calcular match score
      const matchScore = await MatchService.calculateMatchScore(jobId, userId);

      if (!matchScore) {
        return res.status(404).json({
          error: "NOT_FOUND",
          message: "Vaga não encontrada ou perfil incompleto",
        });
      }

      return res.status(200).json(matchScore);
    } catch (error) {
      logger.error("Error calculating match score:", error);
      return next(error);
    }
  }

  /**
   * GET /jobs/recommended - Obter vagas recomendadas para o candidato
   */
  static async getRecommendedJobs(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          error: "UNAUTHORIZED",
          message: "Utilizador não autenticado",
        });
      }

      const limit = parseInt(req.query.limit as string) || 6;
      const recommendedJobs = await JobService.getRecommendedJobs(
        userId,
        limit
      );

      return res.status(200).json({
        jobs: recommendedJobs,
        total: recommendedJobs.length,
      });
    } catch (error) {
      logger.error("Error getting recommended jobs:", error);
      return next(error);
    }
  }

  /**
   * POST /jobs/:id/apply-credit - Aplicar crédito numa vaga
   */
  static async applyCredit(req: Request, res: Response, next: NextFunction) {
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
      const { creditType } = req.body;
      const userId = req.user?.userId;

      // Buscar empresa do usuário
      const company = await prisma.company.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (!company) {
        return res.status(400).json({
          error: "BAD_REQUEST",
          message: "Empresa não encontrada no utilizador",
        });
      }

      const companyId = company.id;

      // Verificar se a vaga pertence à empresa
      const job = await JobService.getJob(id);
      if (job.companyId !== companyId) {
        return res.status(403).json({
          error: "FORBIDDEN",
          message: "Esta vaga não pertence à sua empresa",
        });
      }

      // Usar crédito
      const usage = await CreditService.useCredit(companyId, id, creditType);

      return res.status(200).json({
        message: "Crédito aplicado com sucesso",
        usage,
      });
    } catch (error) {
      logger.error("Error applying credit:", error);
      return next(error);
    }
  }

  /**
   * DELETE /jobs/credit-usage/:usageId - Remover destaque/crédito aplicado
   */
  static async removeCreditUsage(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { usageId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError("Não autenticado", 401, "UNAUTHORIZED");
      }

      // Buscar company
      const company = await prisma.company.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (!company) {
        throw new AppError("Empresa não encontrada", 404, "COMPANY_NOT_FOUND");
      }

      // Buscar credit usage
      const usage = await prisma.creditUsage.findUnique({
        where: { id: usageId },
        include: {
          job: {
            select: {
              companyId: true,
            },
          },
        },
      });

      if (!usage) {
        throw new AppError(
          "Uso de crédito não encontrado",
          404,
          "USAGE_NOT_FOUND"
        );
      }

      // Verificar permissão
      if (usage.job.companyId !== company.id) {
        throw new AppError("Não tem permissão", 403, "FORBIDDEN");
      }

      // Remover
      await prisma.creditUsage.delete({
        where: { id: usageId },
      });

      res.json({
        success: true,
        message: "Destaque removido com sucesso",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /jobs/:id/analytics - Obter analytics de uma vaga
   */
  static async getJobAnalytics(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      // Buscar empresa do usuário
      const company = await prisma.company.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (!company) {
        return res.status(400).json({
          error: "BAD_REQUEST",
          message: "Empresa não encontrada no utilizador",
        });
      }

      const companyId = company.id;

      // Verificar se a vaga pertence à empresa
      const job = await JobService.getJob(id);
      if (job.companyId !== companyId) {
        return res.status(403).json({
          error: "FORBIDDEN",
          message: "Esta vaga não pertence à sua empresa",
        });
      }

      const analytics = await CreditAnalyticsService.getJobAnalytics(id);

      return res.status(200).json(analytics);
    } catch (error) {
      logger.error("Error getting job analytics:", error);
      return next(error);
    }
  }

  /**
   * GET /jobs/featured/homepage - Vagas em destaque na homepage
   */
  static async getFeaturedHomepageJobs(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const limit = req.query.limit
        ? parseInt(req.query.limit as string)
        : 6;

      const jobs = await JobService.getFeaturedHomepageJobs(limit);

      return res.status(200).json(jobs);
    } catch (error) {
      logger.error("Error getting featured homepage jobs:", error);
      return next(error);
    }
  }

  /**
   * GET /jobs/featured/listing - Vagas em destaque na listagem
   */
  static async getFeaturedJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit
        ? parseInt(req.query.limit as string)
        : 20;

      const jobs = await JobService.getFeaturedJobs(limit);

      return res.status(200).json(jobs);
    } catch (error) {
      logger.error("Error getting featured jobs:", error);
      return next(error);
    }
  }

  /**
   * GET /jobs/urgent - Vagas urgentes
   */
  static async getUrgentJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit
        ? parseInt(req.query.limit as string)
        : 10;

      const jobs = await JobService.getUrgentJobs(limit);

      return res.status(200).json(jobs);
    } catch (error) {
      logger.error("Error getting urgent jobs:", error);
      return next(error);
    }
  }
}
