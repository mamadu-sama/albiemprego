// Service de gestão de transações
import { prisma } from "../config/database";
import { logger } from "../config/logger";
import { TransactionType, TransactionStatus } from "@prisma/client";

export interface CreateTransactionDTO {
  companyId: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  description: string;
  planId?: string;
  packageId?: string;
  adminId?: string;
  adminNotes?: string;
  metadata?: any;
}

export interface TransactionFilters {
  status?: TransactionStatus;
  type?: TransactionType;
  startDate?: Date;
  endDate?: Date;
}

export class TransactionService {
  /**
   * Criar transação
   */
  static async createTransaction(data: CreateTransactionDTO) {
    const transaction = await prisma.transaction.create({
      data: {
        companyId: data.companyId,
        type: data.type,
        status: data.status,
        amount: data.amount,
        description: data.description,
        planId: data.planId,
        packageId: data.packageId,
        adminId: data.adminId,
        adminNotes: data.adminNotes,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      },
    });

    logger.info(`Created transaction ${transaction.id} for company ${data.companyId}: ${data.description}`);
    return transaction;
  }

  /**
   * Listar transações de uma empresa
   */
  static async listCompanyTransactions(
    companyId: string,
    filters?: TransactionFilters
  ) {
    const where: any = { companyId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        package: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return transactions;
  }

  /**
   * Listar todas as transações (Admin)
   */
  static async listAllTransactions(filters?: TransactionFilters) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        package: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100, // Limitar a 100 mais recentes
    });

    return transactions;
  }

  /**
   * Obter estatísticas de transações (Admin)
   */
  static async getTransactionStats() {
    // Total de receita
    const revenueResult = await prisma.transaction.aggregate({
      where: {
        status: TransactionStatus.COMPLETED,
      },
      _sum: {
        amount: true,
      },
    });

    const totalRevenue = revenueResult._sum.amount || 0;

    // Receita mensal (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const monthlyRevenueResult = await prisma.transaction.aggregate({
      where: {
        status: TransactionStatus.COMPLETED,
        createdAt: { gte: thirtyDaysAgo },
      },
      _sum: {
        amount: true,
      },
    });

    const monthlyRevenue = monthlyRevenueResult._sum.amount || 0;

    // Total de assinantes ativos
    const activeSubscribers = await prisma.companySubscription.count({
      where: {
        status: 'ACTIVE',
      },
    });

    // Assinantes por plano
    const subscriptionsByPlan = await prisma.companySubscription.groupBy({
      by: ['planId'],
      where: {
        status: 'ACTIVE',
      },
      _count: {
        id: true,
      },
    });

    // Buscar nomes dos planos
    const planIds = subscriptionsByPlan.map((sub) => sub.planId);
    const plans = await prisma.subscriptionPlan.findMany({
      where: {
        id: { in: planIds },
      },
    });

    const byPlanWithNames = subscriptionsByPlan.map((sub) => {
      const plan = plans.find((p) => p.id === sub.planId);
      return {
        planId: sub.planId,
        planName: plan?.name || 'Desconhecido',
        count: sub._count.id,
      };
    });

    // Créditos vendidos (pacotes)
    const creditPackagesSold = await prisma.transaction.count({
      where: {
        type: TransactionType.CREDIT_PURCHASE,
        status: TransactionStatus.COMPLETED,
      },
    });

    // Taxa de conversão (empresas que mudaram de básico para pago)
    const totalCompanies = await prisma.company.count();
    const paidSubscribers = await prisma.companySubscription.count({
      where: {
        status: 'ACTIVE',
        plan: {
          price: { gt: 0 },
        },
      },
    });

    const conversionRate = totalCompanies > 0
      ? ((paidSubscribers / totalCompanies) * 100).toFixed(1)
      : '0';

    logger.info('Generated transaction statistics');

    return {
      totalRevenue: Number(totalRevenue),
      monthlyRevenue: Number(monthlyRevenue),
      activeSubscribers,
      subscriptionsByPlan: byPlanWithNames,
      creditPackagesSold,
      conversionRate: `${conversionRate}%`,
      totalCompanies,
      paidSubscribers,
    };
  }
}

