import { Router } from "express";
import { getAuditLogs, getAuditStats } from "../controllers/admin-audit.controller";
import { authenticateToken, authorize } from "../middlewares/auth.middleware";
import {
  getAuditLogsValidation,
  getAuditStatsValidation,
} from "../validators/admin-audit.validator";

const router = Router();

// Todas as rotas requerem autenticação de admin
router.use(authenticateToken);
router.use(authorize("ADMIN"));

/**
 * @route   GET /api/v1/admin/audit-logs
 * @desc    Obter logs de auditoria com filtros
 * @access  Admin
 */
router.get("/audit-logs", getAuditLogsValidation, getAuditLogs);

/**
 * @route   GET /api/v1/admin/audit-logs/stats
 * @desc    Obter estatísticas de auditoria
 * @access  Admin
 */
router.get("/audit-logs/stats", getAuditStatsValidation, getAuditStats);

export default router;

