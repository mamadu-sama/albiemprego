import prisma from "../config/database";

export class AnalyticsService {
  /**
   * Crescimento de utilizadores (últimos X dias)
   */
  static async getUserGrowth(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const users = await prisma.user.groupBy({
      by: ["type"],
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      _count: true,
    });

    // Obter crescimento diário
    const dailyGrowth = await prisma.$queryRaw<
      Array<{ date: Date; type: string; count: number }>
    >`
      SELECT 
        DATE(created_at) as date,
        type,
        COUNT(*)::int as count
      FROM users
      WHERE created_at >= ${startDate}
      GROUP BY DATE(created_at), type
      ORDER BY date ASC
    `;

    return {
      totalByType: users,
      dailyGrowth,
      period: `${days} days`,
    };
  }

  /**
   * Métricas de vagas
   */
  static async getJobMetrics(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Total de vagas por status
    const jobsByStatus = await prisma.job.groupBy({
      by: ["status"],
      _count: true,
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    // Vagas mais vistas
    const topViewed = await prisma.job.findMany({
      where: {
        status: "ACTIVE",
      },
      orderBy: {
        viewsCount: "desc",
      },
      take: 10,
      select: {
        id: true,
        title: true,
        viewsCount: true,
        company: {
          select: {
            name: true,
          },
        },
      },
    });

    // Sectores mais procurados
    const topSectors = await prisma.job.groupBy({
      by: ["sector"],
      where: {
        status: "ACTIVE",
      },
      _count: true,
      _sum: {
        viewsCount: true,
      },
      orderBy: {
        _sum: {
          viewsCount: "desc",
        },
      },
      take: 10,
    });

    return {
      jobsByStatus,
      topViewed,
      topSectors,
      period: `${days} days`,
    };
  }

  /**
   * Métricas de candidaturas
   */
  static async getApplicationMetrics(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Total de candidaturas
    const totalApplications = await prisma.application.count({
      where: {
        appliedAt: {
          gte: startDate,
        },
      },
    });

    // Candidaturas por status
    const byStatus = await prisma.application.groupBy({
      by: ["status"],
      where: {
        appliedAt: {
          gte: startDate,
        },
      },
      _count: true,
    });

    // Candidaturas diárias
    const dailyApplications = await prisma.$queryRaw<
      Array<{ date: Date; count: number }>
    >`
      SELECT 
        DATE(applied_at) as date,
        COUNT(*)::int as count
      FROM applications
      WHERE applied_at >= ${startDate}
      GROUP BY DATE(applied_at)
      ORDER BY date ASC
    `;

    // Vagas com mais candidaturas
    const topJobs = await prisma.job.findMany({
      where: {
        status: "ACTIVE",
      },
      orderBy: {
        applications: {
          _count: "desc",
        },
      },
      take: 10,
      select: {
        id: true,
        title: true,
        company: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    // Taxa de conversão (visualizações → candidaturas)
    const jobsWithStats = await prisma.job.findMany({
      where: {
        status: "ACTIVE",
        viewsCount: {
          gt: 0,
        },
      },
      select: {
        viewsCount: true,
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    const totalViews = jobsWithStats.reduce(
      (sum, job) => sum + job.viewsCount,
      0
    );
    const totalApps = jobsWithStats.reduce(
      (sum, job) => sum + job._count.applications,
      0
    );
    const conversionRate = totalViews > 0 ? (totalApps / totalViews) * 100 : 0;

    return {
      totalApplications,
      byStatus,
      dailyApplications,
      topJobs,
      conversionRate: conversionRate.toFixed(2),
      period: `${days} days`,
    };
  }

  /**
   * Dashboard geral - todas as métricas principais
   */
  static async getDashboardStats() {
    const [
      totalUsers,
      totalCandidates,
      totalCompanies,
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApprovals,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { type: "CANDIDATO" } }),
      prisma.user.count({ where: { type: "EMPRESA" } }),
      prisma.job.count(),
      prisma.job.count({ where: { status: "ACTIVE" } }),
      prisma.application.count(),
      prisma.company.count({
        where: {
          approvedAt: null,
          rejectedAt: null,
        },
      }),
    ]);

    // Últimos 7 dias
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const [newUsers, newJobs, newApplications] = await Promise.all([
      prisma.user.count({
        where: {
          createdAt: {
            gte: last7Days,
          },
        },
      }),
      prisma.job.count({
        where: {
          createdAt: {
            gte: last7Days,
          },
        },
      }),
      prisma.application.count({
        where: {
          appliedAt: {
            gte: last7Days,
          },
        },
      }),
    ]);

    return {
      totals: {
        users: totalUsers,
        candidates: totalCandidates,
        companies: totalCompanies,
        jobs: totalJobs,
        activeJobs,
        applications: totalApplications,
        pendingApprovals,
      },
      last7Days: {
        newUsers,
        newJobs,
        newApplications,
      },
    };
  }

  /**
   * Relatórios completos para a página de Analytics
   */
  static async getReportsData(period: string = "6months") {
    try {
      console.log(`[Analytics] Iniciando getReportsData - período: ${period}`);
    // Determinar o número de dias com base no período
    let days = 180; // 6 meses por padrão
    switch (period) {
      case "7days":
        days = 7;
        break;
      case "30days":
        days = 30;
        break;
      case "1year":
        days = 365;
        break;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // ==========================================
    // 1. KPIs com comparação percentual
    // ==========================================
    const now = new Date();
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - days);

    const [
      totalUsers,
      previousTotalUsers,
      totalCompanies,
      previousTotalCompanies,
      activeJobs,
      previousActiveJobs,
      totalApplications,
      previousTotalApplications,
    ] = await Promise.all([
      // Período atual
      prisma.user.count(),
      // Período anterior
      prisma.user.count({
        where: {
          createdAt: {
            lt: startDate,
          },
        },
      }),
      // Empresas
      prisma.user.count({ where: { type: "EMPRESA" } }),
      prisma.user.count({
        where: {
          type: "EMPRESA",
          createdAt: {
            lt: startDate,
          },
        },
      }),
      // Vagas ativas
      prisma.job.count({ where: { status: "ACTIVE" } }),
      prisma.job.count({
        where: {
          status: "ACTIVE",
          createdAt: {
            lt: startDate,
          },
        },
      }),
      // Candidaturas
      prisma.application.count(),
      prisma.application.count({
        where: {
          appliedAt: {
            lt: startDate,
          },
        },
      }),
    ]);

    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const kpis = {
      totalUsers: {
        value: totalUsers,
        change: calculateChange(totalUsers, previousTotalUsers),
      },
      totalCompanies: {
        value: totalCompanies,
        change: calculateChange(totalCompanies, previousTotalCompanies),
      },
      activeJobs: {
        value: activeJobs,
        change: calculateChange(activeJobs, previousActiveJobs),
      },
      totalApplications: {
        value: totalApplications,
        change: calculateChange(totalApplications, previousTotalApplications),
      },
    };

    // ==========================================
    // 2. Crescimento mensal - SIMPLIFICADO
    // ==========================================
    console.log(`[Analytics] Buscando crescimento mensal...`);
    
    // Buscar todos os utilizadores
    const allUsers = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        createdAt: true,
        type: true,
      },
    });

    // Buscar todas as vagas
    const allJobs = await prisma.job.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        createdAt: true,
      },
    });

    // Buscar todas as candidaturas
    const allApplications = await prisma.application.findMany({
      where: {
        appliedAt: {
          gte: startDate,
        },
      },
      select: {
        appliedAt: true,
      },
    });

    // Agrupar por mês
    const monthsMap = new Map<string, any>();
    
    // Função para formatar mês em português
    const formatMonth = (date: Date) => {
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      return months[date.getMonth()];
    };

    // Inicializar meses
    const currentDate = new Date(startDate);
    while (currentDate <= now) {
      const key = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
      const monthLabel = formatMonth(currentDate);
      monthsMap.set(key, {
        month: monthLabel,
        utilizadores: 0,
        empresas: 0,
        vagas: 0,
        candidaturas: 0,
      });
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Contar utilizadores
    allUsers.forEach(user => {
      const date = new Date(user.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (monthsMap.has(key)) {
        monthsMap.get(key).utilizadores++;
        if (user.type === 'EMPRESA') {
          monthsMap.get(key).empresas++;
        }
      }
    });

    // Contar vagas
    allJobs.forEach(job => {
      const date = new Date(job.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (monthsMap.has(key)) {
        monthsMap.get(key).vagas++;
      }
    });

    // Contar candidaturas
    allApplications.forEach(app => {
      const date = new Date(app.appliedAt);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (monthsMap.has(key)) {
        monthsMap.get(key).candidaturas++;
      }
    });

    const monthlyGrowth = Array.from(monthsMap.values());
    console.log(`[Analytics] Crescimento mensal calculado: ${monthlyGrowth.length} meses`);

    // ==========================================
    // 3. Distribuição por categoria (setores)
    // ==========================================
    console.log(`[Analytics] Buscando distribuição por categoria...`);
    
    const categoryDistribution = await prisma.job.groupBy({
      by: ["sector"],
      where: {
        status: "ACTIVE",
      },
      _count: true,
    });

    const totalJobsForCategories = categoryDistribution.reduce(
      (sum, cat) => sum + cat._count,
      0
    );

    const categoryData = categoryDistribution
      .map((cat) => ({
        name: cat.sector || "Não especificado",
        value: cat._count,
        percentage: totalJobsForCategories
          ? Math.round((cat._count / totalJobsForCategories) * 100)
          : 0,
      }))
      .sort((a, b) => b.value - a.value);
    
    console.log(`[Analytics] Categorias encontradas: ${categoryData.length}`);

    // ==========================================
    // 4. Distribuição geográfica - SIMPLIFICADO
    // ==========================================
    console.log(`[Analytics] Buscando distribuição geográfica...`);
    
    const jobsByLocation = await prisma.job.groupBy({
      by: ["location"],
      where: {
        status: "ACTIVE",
      },
      _count: {
        id: true,
      },
    });

    const locationData = await Promise.all(
      jobsByLocation.slice(0, 10).map(async (loc) => {
        const applicationCount = await prisma.application.count({
          where: {
            job: {
              location: loc.location,
              status: "ACTIVE",
            },
          },
        });

        return {
          location: loc.location || "Não especificada",
          vagas: loc._count.id,
          candidaturas: applicationCount,
        };
      })
    );

    locationData.sort((a, b) => b.vagas - a.vagas);
    console.log(`[Analytics] Localizações encontradas: ${locationData.length}`);

    // ==========================================
    // 5. Top Empresas - SIMPLIFICADO
    // ==========================================
    console.log(`[Analytics] Buscando top empresas...`);
    
    const companiesWithJobs = await prisma.company.findMany({
      where: {
        jobs: {
          some: {
            status: "ACTIVE",
          },
        },
      },
      select: {
        name: true,
        jobs: {
          where: {
            status: "ACTIVE",
          },
          select: {
            id: true,
            _count: {
              select: {
                applications: true,
              },
            },
          },
        },
      },
    });

    const topCompanies = companiesWithJobs
      .map((company) => ({
        name: company.name,
        vagas: company.jobs.length,
        candidaturas: company.jobs.reduce(
          (sum, job) => sum + job._count.applications,
          0
        ),
      }))
      .sort((a, b) => b.vagas - a.vagas)
      .slice(0, 10);

    console.log(`[Analytics] Top empresas calculadas: ${topCompanies.length}`);
    console.log(`[Analytics] Retornando dados completos`);

    return {
      kpis,
      monthlyGrowth,
      categoryData,
      locationData,
      topCompanies,
      period,
    };
    } catch (error) {
      console.error('[Analytics] Erro ao buscar dados:', error);
      throw error;
    }
  }
}


