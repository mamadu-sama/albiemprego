import prisma from "../config/database";
import { AppError } from "../middlewares/errorHandler";
import { logger } from "../config/logger";
import { UserType } from "@prisma/client";

export class SavedJobService {
  /**
   * Guardar uma vaga
   */
  static async saveJob(candidateId: string, jobId: string) {
    try {
      // Verificar se o candidato existe
      const candidate = await prisma.candidate.findUnique({
        where: { id: candidateId },
      });

      if (!candidate) {
        throw new AppError(
          "Candidato não encontrado",
          404,
          "CANDIDATE_NOT_FOUND"
        );
      }

      // Verificar se a vaga existe e está ativa
      const job = await prisma.job.findUnique({
        where: { id: jobId },
      });

      if (!job) {
        throw new AppError("Vaga não encontrada", 404, "JOB_NOT_FOUND");
      }

      if (job.status !== "ACTIVE") {
        throw new AppError(
          "Não é possível guardar vagas inativas",
          400,
          "JOB_NOT_ACTIVE"
        );
      }

      // Verificar se já foi guardada
      const existing = await prisma.savedJob.findUnique({
        where: {
          candidateId_jobId: {
            candidateId,
            jobId,
          },
        },
      });

      if (existing) {
        throw new AppError(
          "Vaga já foi guardada anteriormente",
          409,
          "JOB_ALREADY_SAVED"
        );
      }

      // Guardar a vaga
      const savedJob = await prisma.savedJob.create({
        data: {
          candidateId,
          jobId,
        },
        include: {
          job: {
            include: {
              company: {
                select: {
                  id: true,
                  name: true,
                  logo: true,
                  sector: true,
                },
              },
              _count: {
                select: {
                  applications: true,
                },
              },
            },
          },
        },
      });

      logger.info(
        `Candidate ${candidateId} saved job ${jobId}: ${job.title}`
      );

      return savedJob;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error("Error saving job:", error);
      throw new AppError(
        "Erro ao guardar vaga",
        500,
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  /**
   * Remover vaga guardada
   */
  static async unsaveJob(candidateId: string, jobId: string) {
    try {
      // Verificar se a vaga foi guardada
      const savedJob = await prisma.savedJob.findUnique({
        where: {
          candidateId_jobId: {
            candidateId,
            jobId,
          },
        },
      });

      if (!savedJob) {
        throw new AppError(
          "Vaga guardada não encontrada",
          404,
          "SAVED_JOB_NOT_FOUND"
        );
      }

      // Remover
      await prisma.savedJob.delete({
        where: {
          id: savedJob.id,
        },
      });

      logger.info(`Candidate ${candidateId} unsaved job ${jobId}`);

      return { message: "Vaga removida dos guardados" };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error("Error unsaving job:", error);
      throw new AppError(
        "Erro ao remover vaga guardada",
        500,
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  /**
   * Verificar se uma vaga está guardada
   */
  static async isJobSaved(candidateId: string, jobId: string): Promise<boolean> {
    try {
      const savedJob = await prisma.savedJob.findUnique({
        where: {
          candidateId_jobId: {
            candidateId,
            jobId,
          },
        },
      });

      return !!savedJob;
    } catch (error) {
      logger.error("Error checking if job is saved:", error);
      return false;
    }
  }

  /**
   * Obter todas as vagas guardadas de um candidato
   */
  static async getSavedJobs(candidateId: string) {
    try {
      const savedJobs = await prisma.savedJob.findMany({
        where: {
          candidateId,
        },
        include: {
          job: {
            include: {
              company: {
                select: {
                  id: true,
                  name: true,
                  logo: true,
                  sector: true,
                },
              },
              _count: {
                select: {
                  applications: true,
                },
              },
            },
          },
        },
        orderBy: {
          savedAt: "desc",
        },
      });

      // Filtrar apenas vagas que ainda existem e estão ativas
      const activeSavedJobs = savedJobs.filter(
        (saved) => saved.job && saved.job.status === "ACTIVE"
      );

      // Remover vagas inativas/deletadas dos guardados
      const inactiveIds = savedJobs
        .filter((saved) => !saved.job || saved.job.status !== "ACTIVE")
        .map((saved) => saved.id);

      if (inactiveIds.length > 0) {
        await prisma.savedJob.deleteMany({
          where: {
            id: { in: inactiveIds },
          },
        });
        logger.info(
          `Removed ${inactiveIds.length} inactive saved jobs for candidate ${candidateId}`
        );
      }

      return activeSavedJobs.map((saved) => ({
        id: saved.id,
        savedAt: saved.savedAt,
        job: saved.job,
      }));
    } catch (error) {
      logger.error("Error getting saved jobs:", error);
      throw new AppError(
        "Erro ao obter vagas guardadas",
        500,
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  /**
   * Obter IDs das vagas guardadas de um candidato (para marcar na listagem)
   */
  static async getSavedJobIds(candidateId: string): Promise<string[]> {
    try {
      const savedJobs = await prisma.savedJob.findMany({
        where: {
          candidateId,
        },
        select: {
          jobId: true,
        },
      });

      return savedJobs.map((saved) => saved.jobId);
    } catch (error) {
      logger.error("Error getting saved job IDs:", error);
      return [];
    }
  }
}

