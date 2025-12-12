import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { AuditService } from "../services/audit.service";
import { AppError } from "../middlewares/errorHandler";

/**
 * Obter logs de auditoria
 * GET /api/v1/admin/audit-logs
 */
export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Dados inválidos",
        errors: errors.array(),
      });
    }

    const {
      userId,
      action,
      entityType,
      startDate,
      endDate,
      limit = 50,
      offset = 0,
    } = req.query;

    const filters: any = {
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    };

    if (userId) filters.userId = userId as string;
    if (action) filters.action = action as string;
    if (entityType) filters.entityType = entityType as string;
    if (startDate) filters.startDate = new Date(startDate as string);
    if (endDate) filters.endDate = new Date(endDate as string);

    const result = await AuditService.getLogs(filters);

    return res.json(result);
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    throw new AppError(
      "Erro ao buscar logs de auditoria",
      500,
      "AUDIT_FETCH_ERROR"
    );
  }
};

/**
 * Obter estatísticas de auditoria
 * GET /api/v1/admin/audit-logs/stats
 */
export const getAuditStats = async (req: Request, res: Response) => {
  try {
    const { days = 30 } = req.query;

    const stats = await AuditService.getStats(parseInt(days as string));

    return res.json(stats);
  } catch (error) {
    console.error("Error fetching audit stats:", error);
    throw new AppError(
      "Erro ao buscar estatísticas de auditoria",
      500,
      "AUDIT_STATS_ERROR"
    );
  }
};

