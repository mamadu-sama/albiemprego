// Service de gestão de assinaturas de empresas
import { prisma } from "../config/database";
import { NotFoundError, BadRequestError, ForbiddenError } from "../utils/errors";
import { logger } from "../config/logger";
import { SubscriptionStatus, TransactionType, TransactionStatus } from "@prisma/client";
import { CreditService } from "./credit.service";
import { TransactionService } from "./transaction.service";

export class CompanySubscriptionService {
  /**
   * Obter assinatura atual da empresa
   */
  static async getCurrentSubscription(companyId: string) {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundError('Empresa não encontrada', 'COMPANY_NOT_FOUND');
    }

    const subscription = await prisma.companySubscription.findFirst({
      where: {
        companyId,
        status: SubscriptionStatus.ACTIVE,
      },
      include: {
        plan: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Parsear features do plano se subscription existir
    if (subscription && subscription.plan) {
      return {
        ...subscription,
        plan: {
          ...subscription.plan,
          features: typeof subscription.plan.features === 'string' 
            ? JSON.parse(subscription.plan.features) 
            : subscription.plan.features,
        },
      };
    }

    return subscription;
  }

  /**
   * Atribuir assinatura manualmente (Admin)
   */
  static async assignSubscriptionManually(
    companyId: string,
    planId: string,
    adminId: string
  ) {
    // Verificar se empresa existe
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundError('Empresa não encontrada', 'COMPANY_NOT_FOUND');
    }

    // Verificar se plano existe
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundError('Plano não encontrado', 'PLAN_NOT_FOUND');
    }

    // Cancelar assinatura atual se existir
    const currentSubscription = await this.getCurrentSubscription(companyId);
    if (currentSubscription) {
      await prisma.companySubscription.update({
        where: { id: currentSubscription.id },
        data: {
          status: SubscriptionStatus.CANCELLED,
          cancelledAt: new Date(),
          cancelReason: 'Substituído por novo plano',
        },
      });
    }

    // Criar nova assinatura
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1 mês

    const subscriptionRaw = await prisma.companySubscription.create({
      data: {
        companyId,
        planId,
        status: SubscriptionStatus.ACTIVE,
        startDate,
        endDate,
      },
      include: {
        plan: true,
      },
    });

    // Parsear features do plano
    const subscription = {
      ...subscriptionRaw,
      plan: {
        ...subscriptionRaw.plan,
        features: typeof subscriptionRaw.plan.features === 'string' 
          ? JSON.parse(subscriptionRaw.plan.features) 
          : subscriptionRaw.plan.features,
      },
    };

    // Atualizar limite de vagas na empresa
    await prisma.company.update({
      where: { id: companyId },
      data: {
        maxActiveJobs: plan.maxJobs,
      },
    });

    // Adicionar créditos mensais do plano
    await CreditService.addCreditsFromPlan(companyId, planId);

    // Criar transação
    await TransactionService.createTransaction({
      companyId,
      type: TransactionType.ADMIN_SUBSCRIPTION_GRANT,
      status: TransactionStatus.COMPLETED,
      amount: 0, // Grátis via admin
      description: `Plano ${plan.name} atribuído pelo administrador`,
      planId,
      adminId,
      adminNotes: 'Atribuição manual pelo admin',
    });

    logger.info(`Admin ${adminId} assigned plan ${plan.name} to company ${companyId}`);
    return subscription;
  }

  /**
   * Cancelar assinatura
   */
  static async cancelSubscription(companyId: string) {
    const subscription = await this.getCurrentSubscription(companyId);

    if (!subscription) {
      throw new NotFoundError('Assinatura ativa não encontrada', 'NO_ACTIVE_SUBSCRIPTION');
    }

    const updated = await prisma.companySubscription.update({
      where: { id: subscription.id },
      data: {
        status: SubscriptionStatus.CANCELLED,
        cancelledAt: new Date(),
      },
    });

    logger.info(`Cancelled subscription for company ${companyId}`);
    return updated;
  }

  /**
   * Renovar assinatura (cron job)
   */
  static async renewSubscription(subscriptionId: string) {
    const subscription = await prisma.companySubscription.findUnique({
      where: { id: subscriptionId },
      include: { plan: true },
    });

    if (!subscription) {
      throw new NotFoundError('Assinatura não encontrada', 'SUBSCRIPTION_NOT_FOUND');
    }

    // Renovar por mais 1 mês
    const newEndDate = new Date(subscription.endDate);
    newEndDate.setMonth(newEndDate.getMonth() + 1);

    await prisma.companySubscription.update({
      where: { id: subscriptionId },
      data: {
        endDate: newEndDate,
        status: SubscriptionStatus.ACTIVE,
      },
    });

    // Adicionar créditos mensais novamente
    await CreditService.addCreditsFromPlan(subscription.companyId, subscription.planId);

    // Criar transação de renovação
    await TransactionService.createTransaction({
      companyId: subscription.companyId,
      type: TransactionType.SUBSCRIPTION_RENEWAL,
      status: TransactionStatus.COMPLETED,
      amount: 0, // Por enquanto grátis (sem Stripe)
      description: `Renovação automática do plano ${subscription.plan.name}`,
      planId: subscription.planId,
    });

    logger.info(`Renewed subscription ${subscriptionId} for company ${subscription.companyId}`);
  }

  /**
   * Verificar e renovar todas as assinaturas expiradas (cron job)
   */
  static async checkAndRenewExpiredSubscriptions() {
    const now = new Date();

    // Buscar assinaturas que expiraram
    const expiredSubscriptions = await prisma.companySubscription.findMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        endDate: {
          lte: now,
        },
      },
      include: { plan: true },
    });

    logger.info(`Found ${expiredSubscriptions.length} expired subscriptions to renew`);

    for (const subscription of expiredSubscriptions) {
      try {
        await this.renewSubscription(subscription.id);
      } catch (error) {
        logger.error(`Failed to renew subscription ${subscription.id}:`, error);
      }
    }
  }

  /**
   * Obter assinaturas próximas de renovar (para notificações)
   */
  static async getUpcomingRenewals(daysAhead: number = 3) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const now = new Date();

    const upcoming = await prisma.companySubscription.findMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        endDate: {
          gte: now,
          lte: futureDate,
        },
      },
      include: {
        plan: true,
        company: true,
      },
    });

    // Parsear features dos planos
    return upcoming.map(sub => ({
      ...sub,
      plan: {
        ...sub.plan,
        features: typeof sub.plan.features === 'string' 
          ? JSON.parse(sub.plan.features) 
          : sub.plan.features,
      },
    }));
  }
}

