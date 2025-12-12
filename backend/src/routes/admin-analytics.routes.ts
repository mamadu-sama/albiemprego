import { Router } from "express";
import {
  getUserGrowth,
  getJobMetrics,
  getApplicationMetrics,
  getDashboardStats,
  getReportsData,
} from "../controllers/admin-analytics.controller";
import { authenticateToken, authorize } from "../middlewares/auth.middleware";
import { daysQueryValidation } from "../validators/admin-analytics.validator";

const router = Router();

// Todas as rotas requerem autenticação de admin
router.use(authenticateToken);
router.use(authorize("ADMIN"));

/**
 * @route   GET /api/v1/admin/analytics/users
 * @desc    Obter crescimento de utilizadores
 * @access  Admin
 */
router.get("/analytics/users", daysQueryValidation, getUserGrowth);

/**
 * @route   GET /api/v1/admin/analytics/jobs
 * @desc    Obter métricas de vagas
 * @access  Admin
 */
router.get("/analytics/jobs", daysQueryValidation, getJobMetrics);

/**
 * @route   GET /api/v1/admin/analytics/applications
 * @desc    Obter métricas de candidaturas
 * @access  Admin
 */
router.get(
  "/analytics/applications",
  daysQueryValidation,
  getApplicationMetrics
);

/**
 * @route   GET /api/v1/admin/analytics/dashboard
 * @desc    Obter estatísticas gerais do dashboard
 * @access  Admin
 */
router.get("/analytics/dashboard", getDashboardStats);

/**
 * @route   GET /api/v1/admin/analytics/reports
 * @desc    Obter dados completos para página de relatórios
 * @access  Admin
 * @query   period - 7days, 30days, 6months, 1year
 */
router.get("/analytics/reports", getReportsData);

export default router;
