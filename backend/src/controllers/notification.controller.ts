// Controller de notificações para utilizadores
import { Request, Response } from "express";
import { prisma } from "../config/database";
import { logger } from "../config/logger";

export class NotificationController {
  /**
   * GET /api/notifications - Obter notificações do utilizador
   */
  static async getNotifications(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { unreadOnly = "false", limit = "20" } = req.query;

      if (!userId) {
        return res.status(401).json({
          error: "UNAUTHORIZED",
          message: "Utilizador não autenticado",
        });
      }

      const where: any = { userId };

      if (unreadOnly === "true") {
        where.read = false;
      }

      const notifications = await prisma.notification.findMany({
        where,
        take: parseInt(limit as string),
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json(notifications);
    } catch (error) {
      logger.error("Error getting notifications:", error);
      throw error;
    }
  }

  /**
   * GET /api/notifications/unread-count - Obter contagem de não lidas
   */
  static async getUnreadCount(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          error: "UNAUTHORIZED",
          message: "Utilizador não autenticado",
        });
      }

      const count = await prisma.notification.count({
        where: {
          userId,
          read: false,
        },
      });

      return res.status(200).json({ count });
    } catch (error) {
      logger.error("Error getting unread count:", error);
      throw error;
    }
  }

  /**
   * PATCH /api/notifications/:id/read - Marcar notificação como lida
   */
  static async markAsRead(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({
          error: "UNAUTHORIZED",
          message: "Utilizador não autenticado",
        });
      }

      // Verificar se a notificação pertence ao utilizador
      const notification = await prisma.notification.findUnique({
        where: { id },
      });

      if (!notification) {
        return res.status(404).json({
          error: "NOT_FOUND",
          message: "Notificação não encontrada",
        });
      }

      if (notification.userId !== userId) {
        return res.status(403).json({
          error: "FORBIDDEN",
          message: "Não tem permissão para aceder a esta notificação",
        });
      }

      const updated = await prisma.notification.update({
        where: { id },
        data: { read: true },
      });

      return res.status(200).json(updated);
    } catch (error) {
      logger.error("Error marking notification as read:", error);
      throw error;
    }
  }

  /**
   * PATCH /api/notifications/mark-all-read - Marcar todas como lidas
   */
  static async markAllAsRead(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          error: "UNAUTHORIZED",
          message: "Utilizador não autenticado",
        });
      }

      await prisma.notification.updateMany({
        where: {
          userId,
          read: false,
        },
        data: { read: true },
      });

      return res.status(200).json({
        message: "Todas as notificações foram marcadas como lidas",
      });
    } catch (error) {
      logger.error("Error marking all notifications as read:", error);
      throw error;
    }
  }

  /**
   * DELETE /api/notifications/:id - Eliminar notificação
   */
  static async deleteNotification(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({
          error: "UNAUTHORIZED",
          message: "Utilizador não autenticado",
        });
      }

      // Verificar se a notificação pertence ao utilizador
      const notification = await prisma.notification.findUnique({
        where: { id },
      });

      if (!notification) {
        return res.status(404).json({
          error: "NOT_FOUND",
          message: "Notificação não encontrada",
        });
      }

      if (notification.userId !== userId) {
        return res.status(403).json({
          error: "FORBIDDEN",
          message: "Não tem permissão para eliminar esta notificação",
        });
      }

      await prisma.notification.delete({
        where: { id },
      });

      return res.status(200).json({
        message: "Notificação eliminada com sucesso",
      });
    } catch (error) {
      logger.error("Error deleting notification:", error);
      throw error;
    }
  }

  /**
   * DELETE /api/notifications/read - Eliminar todas as lidas
   */
  static async deleteAllRead(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          error: "UNAUTHORIZED",
          message: "Utilizador não autenticado",
        });
      }

      const result = await prisma.notification.deleteMany({
        where: {
          userId,
          read: true,
        },
      });

      return res.status(200).json({
        message: `${result.count} notificações eliminadas`,
        count: result.count,
      });
    } catch (error) {
      logger.error("Error deleting read notifications:", error);
      throw error;
    }
  }

  /**
   * GET /api/notifications/maintenance - Obter notificações de manutenção ativas (público)
   */
  static async getMaintenanceNotifications(req: Request, res: Response) {
    try {
      // Buscar notificações de manutenção mais recentes (últimas 24h)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const notifications = await prisma.notification.findMany({
        where: {
          type: "MAINTENANCE",
          createdAt: {
            gte: yesterday,
          },
        },
        orderBy: { createdAt: "desc" },
        take: 1, // Apenas a mais recente
        select: {
          id: true,
          title: true,
          message: true,
          createdAt: true,
        },
      });

      return res.status(200).json(notifications);
    } catch (error) {
      logger.error("Error getting maintenance notifications:", error);
      throw error;
    }
  }
}

