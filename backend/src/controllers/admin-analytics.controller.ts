import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { AnalyticsService } from "../services/analytics.service";
import { AppError } from "../middlewares/errorHandler";

/**
 * Obter crescimento de utilizadores
 * GET /api/v1/admin/analytics/users
 */
export const getUserGrowth = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Dados inválidos",
        errors: errors.array(),
      });
    }

    const { days = 30 } = req.query;

    const data = await AnalyticsService.getUserGrowth(parseInt(days as string));

    return res.json(data);
  } catch (error) {
    console.error("Error fetching user growth:", error);
    throw new AppError(
      "Erro ao buscar crescimento de utilizadores",
      500,
      "USER_GROWTH_ERROR"
    );
  }
};

/**
 * Obter métricas de vagas
 * GET /api/v1/admin/analytics/jobs
 */
export const getJobMetrics = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Dados inválidos",
        errors: errors.array(),
      });
    }

    const { days = 30 } = req.query;

    const data = await AnalyticsService.getJobMetrics(parseInt(days as string));

    return res.json(data);
  } catch (error) {
    console.error("Error fetching job metrics:", error);
    throw new AppError(
      "Erro ao buscar métricas de vagas",
      500,
      "JOB_METRICS_ERROR"
    );
  }
};

/**
 * Obter métricas de candidaturas
 * GET /api/v1/admin/analytics/applications
 */
export const getApplicationMetrics = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Dados inválidos",
        errors: errors.array(),
      });
    }

    const { days = 30 } = req.query;

    const data = await AnalyticsService.getApplicationMetrics(
      parseInt(days as string)
    );

    return res.json(data);
  } catch (error) {
    console.error("Error fetching application metrics:", error);
    throw new AppError(
      "Erro ao buscar métricas de candidaturas",
      500,
      "APPLICATION_METRICS_ERROR"
    );
  }
};

/**
 * Obter estatísticas gerais do dashboard
 * GET /api/v1/admin/analytics/dashboard
 */
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const data = await AnalyticsService.getDashboardStats();

    return res.json(data);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw new AppError(
      "Erro ao buscar estatísticas do dashboard",
      500,
      "DASHBOARD_STATS_ERROR"
    );
  }
};

/**
 * Obter dados completos para relatórios
 * GET /api/v1/admin/analytics/reports
 */
export const getReportsData = async (req: Request, res: Response) => {
  try {
    const { period = "6months" } = req.query;

    console.log(`[Analytics] Buscando relatórios para período: ${period}`);

    const data = await AnalyticsService.getReportsData(period as string);

    console.log(`[Analytics] Dados retornados:`, {
      kpis: Object.keys(data.kpis),
      monthlyGrowthCount: data.monthlyGrowth.length,
      categoryDataCount: data.categoryData.length,
      locationDataCount: data.locationData.length,
      topCompaniesCount: data.topCompanies.length,
    });

    return res.json(data);
  } catch (error) {
    console.error("[Analytics] Erro ao buscar dados de relatórios:", error);
    throw new AppError(
      "Erro ao buscar dados de relatórios",
      500,
      "REPORTS_DATA_ERROR"
    );
  }
};

