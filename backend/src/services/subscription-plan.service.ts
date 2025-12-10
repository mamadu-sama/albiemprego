// Service de gestão de planos de assinatura
import { prisma } from "../config/database";
import { NotFoundError, BadRequestError } from "../utils/errors";
import { logger } from "../config/logger";
import { CreditDuration } from "@prisma/client";

export interface CreatePlanDTO {
  name: string;
  description?: string;
  price: number;
  maxJobs: number;
  featuredCreditsMonthly: number;
  homepageCreditsMonthly: number;
  urgentCreditsMonthly: number;
  creditDuration?: CreditDuration;
  features: string[];
  isPopular?: boolean;
  displayOrder?: number;
}

export interface UpdatePlanDTO {
  name?: string;
  description?: string;
  price?: number;
  maxJobs?: number;
  featuredCreditsMonthly?: number;
  homepageCreditsMonthly?: number;
  urgentCreditsMonthly?: number;
  creditDuration?: CreditDuration;
  features?: string[];
  isPopular?: boolean;
  displayOrder?: number;
}

export class SubscriptionPlanService {
  /**
   * Listar todos os planos
   */
  static async listPlans(includeInactive: boolean = false) {
    const where = includeInactive ? {} : { isActive: true };

    const plans = await prisma.subscriptionPlan.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });

    // Parsear features JSON para array
    const plansWithParsedFeatures = plans.map(plan => ({
      ...plan,
      features: typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features,
    }));

    logger.info(`Listed ${plans.length} subscription plans`);
    return plansWithParsedFeatures;
  }

  /**
   * Obter plano específico
   */
  static async getPlan(id: string) {
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      throw new NotFoundError('Plano não encontrado', 'PLAN_NOT_FOUND');
    }

    // Parsear features JSON para array
    return {
      ...plan,
      features: typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features,
    };
  }

  /**
   * Criar novo plano (Admin)
   */
  static async createPlan(data: CreatePlanDTO) {
    // Verificar se já existe plano com mesmo nome
    const existing = await prisma.subscriptionPlan.findUnique({
      where: { name: data.name },
    });

    if (existing) {
      throw new BadRequestError('Já existe um plano com esse nome', 'PLAN_NAME_EXISTS');
    }

    const plan = await prisma.subscriptionPlan.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        maxJobs: data.maxJobs,
        featuredCreditsMonthly: data.featuredCreditsMonthly,
        homepageCreditsMonthly: data.homepageCreditsMonthly,
        urgentCreditsMonthly: data.urgentCreditsMonthly,
        creditDuration: data.creditDuration || CreditDuration.DAYS_7,
        features: JSON.stringify(data.features),
        isPopular: data.isPopular || false,
        displayOrder: data.displayOrder || 0,
      },
    });

    logger.info(`Created subscription plan: ${plan.name} (ID: ${plan.id})`);
    
    // Retornar com features parseado
    return {
      ...plan,
      features: data.features,
    };
  }

  /**
   * Atualizar plano (Admin)
   */
  static async updatePlan(id: string, data: UpdatePlanDTO) {
    const plan = await this.getPlan(id);

    // Se mudar o nome, verificar se não conflita
    if (data.name && data.name !== plan.name) {
      const existing = await prisma.subscriptionPlan.findUnique({
        where: { name: data.name },
      });

      if (existing) {
        throw new BadRequestError('Já existe um plano com esse nome', 'PLAN_NAME_EXISTS');
      }
    }

    const updated = await prisma.subscriptionPlan.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.maxJobs !== undefined && { maxJobs: data.maxJobs }),
        ...(data.featuredCreditsMonthly !== undefined && { featuredCreditsMonthly: data.featuredCreditsMonthly }),
        ...(data.homepageCreditsMonthly !== undefined && { homepageCreditsMonthly: data.homepageCreditsMonthly }),
        ...(data.urgentCreditsMonthly !== undefined && { urgentCreditsMonthly: data.urgentCreditsMonthly }),
        ...(data.creditDuration && { creditDuration: data.creditDuration }),
        ...(data.features && { features: JSON.stringify(data.features) }),
        ...(data.isPopular !== undefined && { isPopular: data.isPopular }),
        ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
      },
    });

    logger.info(`Updated subscription plan: ${updated.name} (ID: ${id})`);
    
    // Retornar com features parseado
    return {
      ...updated,
      features: typeof updated.features === 'string' ? JSON.parse(updated.features) : updated.features,
    };
  }

  /**
   * Ativar/Desativar plano (Admin)
   */
  static async togglePlanActive(id: string) {
    const plan = await this.getPlan(id);

    const updated = await prisma.subscriptionPlan.update({
      where: { id },
      data: { isActive: !plan.isActive },
    });

    logger.info(`Toggled plan ${updated.name} to ${updated.isActive ? 'active' : 'inactive'}`);
    
    // Retornar com features parseado
    return {
      ...updated,
      features: typeof updated.features === 'string' ? JSON.parse(updated.features) : updated.features,
    };
  }

  /**
   * Deletar plano (Admin)
   * Apenas se não tiver assinaturas ativas
   */
  static async deletePlan(id: string) {
    const plan = await this.getPlan(id);

    // Verificar se tem assinaturas
    const subscriptions = await prisma.companySubscription.count({
      where: { planId: id },
    });

    if (subscriptions > 0) {
      throw new BadRequestError(
        'Não é possível deletar plano com assinaturas ativas',
        'PLAN_HAS_SUBSCRIPTIONS'
      );
    }

    await prisma.subscriptionPlan.delete({
      where: { id },
    });

    logger.info(`Deleted subscription plan: ${plan.name} (ID: ${id})`);
    return { message: 'Plano deletado com sucesso' };
  }
}

