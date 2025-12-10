// Service de controle de limite de vagas
import { prisma } from "../config/database";
import { logger } from "../config/logger";
import { BadRequestError, NotFoundError } from "../utils/errors";
import { CompanyNotificationService } from "./company-notification.service";
import { NotificationPriority } from "@prisma/client";

export class JobLimitService {
  /**
   * Verificar se empresa pode criar mais vagas
   */
  static async checkJobLimit(companyId: string): Promise<boolean> {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundError('Empresa não encontrada', 'COMPANY_NOT_FOUND');
    }

    // -1 = ilimitado
    if (company.maxActiveJobs === -1) {
      return true;
    }

    return company.activeJobsCount < company.maxActiveJobs;
  }

  /**
   * Incrementar contador de vagas ativas
   */
  static async incrementActiveJobs(companyId: string) {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundError('Empresa não encontrada', 'COMPANY_NOT_FOUND');
    }

    // Verificar limite
    if (company.maxActiveJobs !== -1 && company.activeJobsCount >= company.maxActiveJobs) {
      throw new BadRequestError(
        `Limite de ${company.maxActiveJobs} vagas ativas atingido`,
        'JOB_LIMIT_REACHED'
      );
    }

    const updated = await prisma.company.update({
      where: { id: companyId },
      data: {
        activeJobsCount: { increment: 1 },
      },
    });

    // Se chegou ao limite, notificar
    if (updated.maxActiveJobs !== -1 && updated.activeJobsCount >= updated.maxActiveJobs) {
      await CompanyNotificationService.createNotification(
        companyId,
        'LIMIT_REACHED',
        'Limite de Vagas Atingido',
        `Você atingiu o limite de ${updated.maxActiveJobs} vagas ativas do seu plano. Considere fazer upgrade para publicar mais vagas.`,
        undefined,
        NotificationPriority.HIGH
      );
    }

    logger.info(`Incremented active jobs for company ${companyId}: ${updated.activeJobsCount}/${updated.maxActiveJobs}`);
  }

  /**
   * Decrementar contador de vagas ativas
   */
  static async decrementActiveJobs(companyId: string) {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundError('Empresa não encontrada', 'COMPANY_NOT_FOUND');
    }

    if (company.activeJobsCount <= 0) {
      logger.warn(`Attempted to decrement activeJobsCount below 0 for company ${companyId}`);
      return;
    }

    const updated = await prisma.company.update({
      where: { id: companyId },
      data: {
        activeJobsCount: { decrement: 1 },
      },
    });

    logger.info(`Decremented active jobs for company ${companyId}: ${updated.activeJobsCount}/${updated.maxActiveJobs}`);
  }

  /**
   * Atualizar contador baseado na contagem real de vagas ativas
   * Útil para corrigir inconsistências
   */
  static async updateCompanyJobCount(companyId: string) {
    const realCount = await prisma.job.count({
      where: {
        companyId,
        status: 'ACTIVE',
      },
    });

    await prisma.company.update({
      where: { id: companyId },
      data: {
        activeJobsCount: realCount,
      },
    });

    logger.info(`Updated active jobs count for company ${companyId} to ${realCount} (real count)`);
    return realCount;
  }

  /**
   * Corrigir contadores de todas as empresas (manutenção)
   */
  static async fixAllJobCounts() {
    const companies = await prisma.company.findMany();

    let fixed = 0;

    for (const company of companies) {
      const realCount = await prisma.job.count({
        where: {
          companyId: company.id,
          status: 'ACTIVE',
        },
      });

      if (realCount !== company.activeJobsCount) {
        await prisma.company.update({
          where: { id: company.id },
          data: {
            activeJobsCount: realCount,
          },
        });
        fixed++;
      }
    }

    logger.info(`Fixed job counts for ${fixed} companies`);
    return fixed;
  }
}

