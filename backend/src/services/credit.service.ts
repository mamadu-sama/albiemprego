// Service de gestão de créditos
import { prisma } from "../config/database";
import { NotFoundError, BadRequestError } from "../utils/errors";
import { logger } from "../config/logger";
import { CreditType, CreditDuration } from "@prisma/client";

export class CreditService {
  /**
   * Obter saldo de créditos da empresa
   */
  static async getCompanyCredits(companyId: string) {
    const credits = await prisma.creditBalance.findMany({
      where: {
        companyId,
        amount: { gt: 0 },
      },
      orderBy: {
        expiresAt: 'asc', // Priorizar os que expiram primeiro
      },
    });

    // Agrupar por tipo
    const summary = {
      featured: 0,
      homepage: 0,
      urgent: 0,
    };

    credits.forEach((credit) => {
      if (credit.creditType === CreditType.FEATURED) {
        summary.featured += credit.amount;
      } else if (credit.creditType === CreditType.HOMEPAGE) {
        summary.homepage += credit.amount;
      } else if (credit.creditType === CreditType.URGENT) {
        summary.urgent += credit.amount;
      }
    });

    return {
      summary,
      details: credits,
    };
  }

  /**
   * Adicionar créditos mensais do plano
   */
  static async addCreditsFromPlan(companyId: string, planId: string) {
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundError('Plano não encontrado', 'PLAN_NOT_FOUND');
    }

    const creditsToAdd = [
      { type: CreditType.FEATURED, amount: plan.featuredCreditsMonthly },
      { type: CreditType.HOMEPAGE, amount: plan.homepageCreditsMonthly },
      { type: CreditType.URGENT, amount: plan.urgentCreditsMonthly },
    ];

    for (const credit of creditsToAdd) {
      if (credit.amount > 0) {
        // Usar upsert para criar ou atualizar
        await prisma.creditBalance.upsert({
          where: {
            companyId_creditType_source_sourceId: {
              companyId,
              creditType: credit.type,
              source: 'PLAN_MONTHLY',
              sourceId: planId,
            },
          },
          create: {
            companyId,
            creditType: credit.type,
            amount: credit.amount,
            source: 'PLAN_MONTHLY',
            sourceId: planId,
            duration: plan.creditDuration,
            expiresAt: null, // Créditos do plano não expiram
          },
          update: {
            amount: { increment: credit.amount },
          },
        });
      }
    }

    logger.info(`Added ${plan.featuredCreditsMonthly} featured, ${plan.homepageCreditsMonthly} homepage, ${plan.urgentCreditsMonthly} urgent credits to company ${companyId} from plan`);
  }

  /**
   * Adicionar créditos de pacote comprado
   */
  static async addCreditsFromPackage(
    companyId: string,
    packageId: string,
    adminId?: string
  ) {
    const pkg = await prisma.creditPackage.findUnique({
      where: { id: packageId },
    });

    if (!pkg) {
      throw new NotFoundError('Pacote não encontrado', 'PACKAGE_NOT_FOUND');
    }

    // Calcular data de expiração (90 dias)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90);

    const creditsToAdd = [
      { type: CreditType.FEATURED, amount: pkg.featuredCredits },
      { type: CreditType.HOMEPAGE, amount: pkg.homepageCredits },
      { type: CreditType.URGENT, amount: pkg.urgentCredits },
    ];

    for (const credit of creditsToAdd) {
      if (credit.amount > 0) {
        const source = adminId ? 'ADMIN_GRANT' : 'PURCHASE';
        
        // Usar upsert para criar ou atualizar
        await prisma.creditBalance.upsert({
          where: {
            companyId_creditType_source_sourceId: {
              companyId,
              creditType: credit.type,
              source,
              sourceId: packageId,
            },
          },
          create: {
            companyId,
            creditType: credit.type,
            amount: credit.amount,
            source,
            sourceId: packageId,
            duration: pkg.creditDuration,
            expiresAt,
          },
          update: {
            amount: { increment: credit.amount },
            expiresAt, // Atualizar data de expiração para a mais recente
            updatedAt: new Date(),
          },
        });
      }
    }

    logger.info(`Added ${pkg.featuredCredits} featured, ${pkg.homepageCredits} homepage, ${pkg.urgentCredits} urgent credits to company ${companyId} from package ${pkg.name}`);
  }

  /**
   * Adicionar créditos manualmente (Admin)
   */
  static async addCreditsManually(
    companyId: string,
    credits: { featured: number; homepage: number; urgent: number },
    duration: CreditDuration,
    adminId: string,
    notes: string
  ) {
    // Calcular data de expiração (90 dias)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90);

    const creditsToAdd = [
      { type: CreditType.FEATURED, amount: credits.featured },
      { type: CreditType.HOMEPAGE, amount: credits.homepage },
      { type: CreditType.URGENT, amount: credits.urgent },
    ];

    for (const credit of creditsToAdd) {
      if (credit.amount > 0) {
        // Para ADMIN_GRANT, usar UUID único para evitar conflitos
        const uniqueSourceId = `${adminId}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        
        await prisma.creditBalance.create({
          data: {
            companyId,
            creditType: credit.type,
            amount: credit.amount,
            source: 'ADMIN_GRANT',
            sourceId: uniqueSourceId,
            duration,
            expiresAt,
          },
        });
      }
    }

    logger.info(`Admin ${adminId} manually added credits to company ${companyId}: ${JSON.stringify(credits)}`);
  }

  /**
   * Usar crédito numa vaga
   */
  static async useCredit(companyId: string, jobId: string, creditType: CreditType) {
    // Verificar se já existe crédito ativo do mesmo tipo nesta vaga
    const existingUsage = await prisma.creditUsage.findFirst({
      where: {
        companyId,
        jobId,
        creditType,
        isActive: true,
      },
    });

    if (existingUsage) {
      throw new BadRequestError(
        `Esta vaga já tem um crédito ${creditType} ativo`,
        'CREDIT_ALREADY_APPLIED'
      );
    }

    // Buscar crédito disponível (priorizar os que expiram primeiro)
    const creditBalance = await prisma.creditBalance.findFirst({
      where: {
        companyId,
        creditType,
        amount: { gt: 0 },
      },
      orderBy: [
        { expiresAt: 'asc' }, // Primeiro os que expiram
        { createdAt: 'asc' }, // Depois os mais antigos
      ],
    });

    if (!creditBalance) {
      throw new BadRequestError(
        `Sem créditos ${creditType} disponíveis`,
        'INSUFFICIENT_CREDITS'
      );
    }

    // Calcular datas
    const startDate = new Date();
    const endDate = new Date();

    // Duração baseada no creditBalance
    switch (creditBalance.duration) {
      case CreditDuration.DAYS_7:
        endDate.setDate(endDate.getDate() + 7);
        break;
      case CreditDuration.DAYS_14:
        endDate.setDate(endDate.getDate() + 14);
        break;
      case CreditDuration.DAYS_30:
        endDate.setDate(endDate.getDate() + 30);
        break;
    }

    // Criar uso de crédito
    const usage = await prisma.creditUsage.create({
      data: {
        companyId,
        jobId,
        balanceId: creditBalance.id,
        creditType,
        duration: creditBalance.duration,
        startDate,
        endDate,
        isActive: true,
      },
    });

    // Decrementar saldo
    await prisma.creditBalance.update({
      where: { id: creditBalance.id },
      data: {
        amount: { decrement: 1 },
      },
    });

    // Atualizar flags na vaga
    const updateData: any = {};
    if (creditType === CreditType.FEATURED) {
      updateData.isFeatured = true;
    } else if (creditType === CreditType.URGENT) {
      updateData.isUrgent = true;
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.job.update({
        where: { id: jobId },
        data: updateData,
      });
    }

    logger.info(`Used ${creditType} credit for job ${jobId} (valid until ${endDate.toISOString()})`);
    return usage;
  }

  /**
   * Remover créditos expirados (cron job)
   */
  static async removeExpiredCredits() {
    const now = new Date();

    const expired = await prisma.creditBalance.deleteMany({
      where: {
        expiresAt: {
          not: null,
          lte: now,
        },
        amount: { gt: 0 },
      },
    });

    logger.info(`Removed ${expired.count} expired credit balances`);
    return expired.count;
  }

  /**
   * Desativar usos de créditos expirados (cron job)
   */
  static async deactivateExpiredCreditUsages() {
    const now = new Date();

    const expired = await prisma.creditUsage.updateMany({
      where: {
        endDate: { lte: now },
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    logger.info(`Deactivated ${expired.count} expired credit usages`);
    return expired.count;
  }

  /**
   * Obter empresas com créditos baixos (< threshold)
   */
  static async getCompaniesWithLowCredits(threshold: number = 2) {
    const lowCredits = await prisma.creditBalance.findMany({
      where: {
        amount: {
          gt: 0,
          lte: threshold,
        },
        lowCreditNotified: false,
      },
      include: {
        company: true,
      },
    });

    return lowCredits.map((credit) => ({
      companyId: credit.companyId,
      creditType: credit.creditType,
      amount: credit.amount,
    }));
  }

  /**
   * Obter créditos que vão expirar em X dias
   */
  static async getExpiringCredits(daysAhead: number = 7) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const now = new Date();

    const expiring = await prisma.creditBalance.findMany({
      where: {
        expiresAt: {
          not: null,
          gte: now,
          lte: futureDate,
        },
        amount: { gt: 0 },
        expiryNotified: false,
      },
      include: {
        company: true,
      },
    });

    return expiring.map((credit) => ({
      companyId: credit.companyId,
      creditType: credit.creditType,
      amount: credit.amount,
      expiresAt: credit.expiresAt,
    }));
  }
}

