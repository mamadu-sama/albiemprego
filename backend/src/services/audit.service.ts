import prisma from "../config/database";
import { logger } from "../config/logger";

interface CreateAuditLogParams {
  userId: string;
  userEmail: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: any;
  ipAddress?: string;
}

export class AuditService {
  /**
   * Criar registo de auditoria
   */
  static async createLog(params: CreateAuditLogParams) {
    try {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: params.userId,
          userEmail: params.userEmail,
          action: params.action,
          entityType: params.entityType,
          entityId: params.entityId || null,
          details: params.details || null,
          ipAddress: params.ipAddress || null,
        },
      });

      logger.info("Audit log created", {
        action: params.action,
        userId: params.userId,
        entityType: params.entityType,
      });

      return auditLog;
    } catch (error) {
      logger.error("Failed to create audit log", error);
      // Não lançar erro para não afetar a operação principal
      return null;
    }
  }

  /**
   * Obter logs de auditoria com filtros
   */
  static async getLogs(filters: {
    userId?: string;
    action?: string;
    entityType?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.action) where.action = filters.action;
    if (filters.entityType) where.entityType = filters.entityType;

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: filters.limit || 50,
        skip: filters.offset || 0,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { logs, total };
  }

  /**
   * Obter estatísticas de auditoria
   */
  static async getStats(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await prisma.auditLog.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        action: true,
        entityType: true,
        createdAt: true,
      },
    });

    // Agrupar por ação
    const actionCounts: Record<string, number> = {};
    const entityTypeCounts: Record<string, number> = {};

    logs.forEach((log) => {
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
      entityTypeCounts[log.entityType] =
        (entityTypeCounts[log.entityType] || 0) + 1;
    });

    return {
      totalLogs: logs.length,
      actionCounts,
      entityTypeCounts,
      period: `${days} days`,
    };
  }
}

// Ações de auditoria comuns
export const AUDIT_ACTIONS = {
  // Utilizadores
  USER_CREATED: "USER_CREATED",
  USER_UPDATED: "USER_UPDATED",
  USER_SUSPENDED: "USER_SUSPENDED",
  USER_ACTIVATED: "USER_ACTIVATED",
  USER_DELETED: "USER_DELETED",

  // Empresas
  COMPANY_CREATED: "COMPANY_CREATED",
  COMPANY_APPROVED: "COMPANY_APPROVED",
  COMPANY_REJECTED: "COMPANY_REJECTED",
  COMPANY_SUSPENDED: "COMPANY_SUSPENDED",
  COMPANY_ACTIVATED: "COMPANY_ACTIVATED",
  COMPANY_DELETED: "COMPANY_DELETED",

  // Vagas
  JOB_CREATED: "JOB_CREATED",
  JOB_UPDATED: "JOB_UPDATED",
  JOB_APPROVED: "JOB_APPROVED",
  JOB_REJECTED: "JOB_REJECTED",
  JOB_SUSPENDED: "JOB_SUSPENDED",
  JOB_DELETED: "JOB_DELETED",
  JOB_REPORTS_CLEARED: "JOB_REPORTS_CLEARED",

  // Configurações
  SETTINGS_UPDATED: "SETTINGS_UPDATED",
  CONTENT_UPDATED: "CONTENT_UPDATED",

  // Manutenção
  MAINTENANCE_ENABLED: "MAINTENANCE_ENABLED",
  MAINTENANCE_DISABLED: "MAINTENANCE_DISABLED",

  // Notificações
  NOTIFICATION_SENT: "NOTIFICATION_SENT",
};

