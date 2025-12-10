// Service de analytics para créditos (ROI tracking)
import { prisma } from "../config/database";
import { logger } from "../config/logger";
import { NotFoundError } from "../utils/errors";

export class CreditAnalyticsService {
  /**
   * Registar visualização de vaga com crédito ativo
   */
  static async trackView(usageId: string) {
    await prisma.creditUsage.update({
      where: { id: usageId },
      data: {
        views: { increment: 1 },
      },
    });
  }

  /**
   * Registar click em vaga com crédito ativo
   */
  static async trackClick(usageId: string) {
    await prisma.creditUsage.update({
      where: { id: usageId },
      data: {
        clicks: { increment: 1 },
      },
    });
  }

  /**
   * Registar candidatura em vaga com crédito ativo
   */
  static async trackApplication(usageId: string) {
    await prisma.creditUsage.update({
      where: { id: usageId },
      data: {
        applications: { increment: 1 },
      },
    });
  }

  /**
   * Obter analytics de um uso específico
   */
  static async getUsageAnalytics(usageId: string) {
    const usage = await prisma.creditUsage.findUnique({
      where: { id: usageId },
      include: {
        job: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!usage) {
      throw new NotFoundError('Uso de crédito não encontrado', 'USAGE_NOT_FOUND');
    }

    // Calcular métricas
    const clickRate = usage.views > 0 ? (usage.clicks / usage.views) * 100 : 0;
    const applicationRate = usage.clicks > 0 ? (usage.applications / usage.clicks) * 100 : 0;
    const conversionRate = usage.views > 0 ? (usage.applications / usage.views) * 100 : 0;

    return {
      usageId: usage.id,
      jobId: usage.jobId,
      jobTitle: usage.job.title,
      creditType: usage.creditType,
      duration: usage.duration,
      isActive: usage.isActive,
      startDate: usage.startDate,
      endDate: usage.endDate,
      metrics: {
        views: usage.views,
        clicks: usage.clicks,
        applications: usage.applications,
      },
      rates: {
        clickRate: Number(clickRate.toFixed(2)),
        applicationRate: Number(applicationRate.toFixed(2)),
        conversionRate: Number(conversionRate.toFixed(2)),
      },
    };
  }

  /**
   * Obter analytics de uma vaga (todos os usos de créditos)
   */
  static async getJobAnalytics(jobId: string) {
    const usages = await prisma.creditUsage.findMany({
      where: { jobId },
      orderBy: {
        startDate: 'desc',
      },
    });

    if (usages.length === 0) {
      return {
        jobId,
        hasCredits: false,
        usages: [],
        totals: {
          views: 0,
          clicks: 0,
          applications: 0,
        },
      };
    }

    const totals = usages.reduce(
      (acc, usage) => ({
        views: acc.views + usage.views,
        clicks: acc.clicks + usage.clicks,
        applications: acc.applications + usage.applications,
      }),
      { views: 0, clicks: 0, applications: 0 }
    );

    const clickRate = totals.views > 0 ? (totals.clicks / totals.views) * 100 : 0;
    const applicationRate = totals.clicks > 0 ? (totals.applications / totals.clicks) * 100 : 0;
    const conversionRate = totals.views > 0 ? (totals.applications / totals.views) * 100 : 0;

    return {
      jobId,
      hasCredits: true,
      usages: usages.map((u) => ({
        id: u.id,
        creditType: u.creditType,
        duration: u.duration,
        isActive: u.isActive,
        startDate: u.startDate,
        endDate: u.endDate,
        views: u.views,
        clicks: u.clicks,
        applications: u.applications,
      })),
      totals,
      rates: {
        clickRate: Number(clickRate.toFixed(2)),
        applicationRate: Number(applicationRate.toFixed(2)),
        conversionRate: Number(conversionRate.toFixed(2)),
      },
    };
  }

  /**
   * Obter ROI geral da empresa (todos os créditos usados)
   */
  static async getCompanyROI(companyId: string) {
    const usages = await prisma.creditUsage.findMany({
      where: { companyId },
    });

    if (usages.length === 0) {
      return {
        companyId,
        totalCreditsUsed: 0,
        totals: {
          views: 0,
          clicks: 0,
          applications: 0,
        },
        byType: [],
      };
    }

    const totals = usages.reduce(
      (acc, usage) => ({
        views: acc.views + usage.views,
        clicks: acc.clicks + usage.clicks,
        applications: acc.applications + usage.applications,
      }),
      { views: 0, clicks: 0, applications: 0 }
    );

    // Agrupar por tipo de crédito
    const byType = ['FEATURED', 'HOMEPAGE', 'URGENT'].map((type) => {
      const typeUsages = usages.filter((u) => u.creditType === type);
      const typeTotal = typeUsages.reduce(
        (acc, u) => ({
          views: acc.views + u.views,
          clicks: acc.clicks + u.clicks,
          applications: acc.applications + u.applications,
        }),
        { views: 0, clicks: 0, applications: 0 }
      );

      const clickRate = typeTotal.views > 0 ? (typeTotal.clicks / typeTotal.views) * 100 : 0;
      const conversionRate = typeTotal.views > 0 ? (typeTotal.applications / typeTotal.views) * 100 : 0;

      return {
        creditType: type,
        count: typeUsages.length,
        totals: typeTotal,
        clickRate: Number(clickRate.toFixed(2)),
        conversionRate: Number(conversionRate.toFixed(2)),
      };
    });

    const clickRate = totals.views > 0 ? (totals.clicks / totals.views) * 100 : 0;
    const applicationRate = totals.clicks > 0 ? (totals.applications / totals.clicks) * 100 : 0;
    const conversionRate = totals.views > 0 ? (totals.applications / totals.views) * 100 : 0;

    return {
      companyId,
      totalCreditsUsed: usages.length,
      totals,
      rates: {
        clickRate: Number(clickRate.toFixed(2)),
        applicationRate: Number(applicationRate.toFixed(2)),
        conversionRate: Number(conversionRate.toFixed(2)),
      },
      byType: byType.filter((t) => t.count > 0), // Apenas tipos usados
    };
  }
}

