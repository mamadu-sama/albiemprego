// Controller de gestão de notificações para administradores
import { Request, Response } from "express";
import { prisma } from "../config/database";
import { logger } from "../config/logger";
import { NotFoundError } from "../utils/errors";
import { NotificationType, UserType } from "@prisma/client";
import { EmailService } from "../services/email.service";
import { validationResult } from "express-validator";

export class AdminNotificationController {
  /**
   * POST /api/admin/notifications - Enviar notificação global
   */
  static async sendNotification(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Dados inválidos",
          errors: errors.array(),
        });
      }

      const { title, message, type, recipients, sendEmail, actionUrl, actionLabel } = req.body;

      // Determinar quais utilizadores receberão a notificação
      const userFilter: any = { status: "ACTIVE" };

      if (recipients === "candidates") {
        userFilter.type = "CANDIDATO";
      } else if (recipients === "companies") {
        userFilter.type = "EMPRESA";
      } else if (recipients === "all") {
        // Todos os utilizadores ativos (exceto admins para não poluir)
        userFilter.type = { in: ["CANDIDATO", "EMPRESA"] };
      }
      // Se recipients === "all", envia para candidatos e empresas

      // Buscar utilizadores
      const users = await prisma.user.findMany({
        where: userFilter,
        select: { id: true, email: true, name: true },
      });

      const totalRecipients = users.length;

      // Criar notificações para todos os utilizadores
      const notifications = users.map((user) => ({
        userId: user.id,
        type: type as NotificationType,
        title,
        message,
        actionUrl: actionUrl || null,
        actionLabel: actionLabel || null,
        read: false,
      }));

      // Inserir notificações em batch
      await prisma.notification.createMany({
        data: notifications,
      });

      logger.info(
        `Admin enviou ${totalRecipients} notificações (${type}) para ${recipients}`
      );

      // Enviar emails se solicitado
      if (sendEmail) {
        const emailPromises = users.map((user) =>
          EmailService.sendNotificationEmail(user, title, message, actionUrl)
        );

        // Enviar emails em paralelo (mas não aguardar todas)
        Promise.all(emailPromises).catch((error) => {
          logger.error("Erro ao enviar alguns emails de notificação:", error);
        });
      }

      return res.status(201).json({
        message: "Notificação enviada com sucesso",
        totalRecipients,
        sendEmail,
      });
    } catch (error) {
      logger.error("Error sending notification:", error);
      throw error;
    }
  }

  /**
   * GET /api/admin/notifications/history - Histórico de notificações enviadas
   */
  static async getNotificationHistory(req: Request, res: Response) {
    try {
      const { type, page = "1", limit = "20" } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      // Construir filtros
      const where: any = {};

      if (type && type !== "all") {
        where.type = type as NotificationType;
      }

      // Buscar notificações agrupadas por tipo, título e mensagem
      // Para obter estatísticas de leitura
      const notifications = await prisma.notification.groupBy({
        by: ["type", "title", "message", "createdAt", "actionUrl", "actionLabel"],
        _count: {
          _all: true,
        },
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      });

      // Para cada grupo, buscar quantas foram lidas
      const enrichedNotifications = await Promise.all(
        notifications.map(async (notif) => {
          const readCount = await prisma.notification.count({
            where: {
              type: notif.type,
              title: notif.title,
              message: notif.message,
              createdAt: notif.createdAt,
              read: true,
            },
          });

          return {
            type: notif.type,
            title: notif.title,
            message: notif.message,
            sentAt: notif.createdAt,
            totalRecipients: notif._count._all,
            readCount,
            actionUrl: notif.actionUrl,
            actionLabel: notif.actionLabel,
          };
        })
      );

      const total = await prisma.notification.count({ where });

      logger.info("Admin consultou histórico de notificações");

      return res.status(200).json({
        notifications: enrichedNotifications,
        pagination: {
          total: enrichedNotifications.length,
          page: parseInt(page as string),
          limit: parseInt(limit as string),
        },
      });
    } catch (error) {
      logger.error("Error getting notification history:", error);
      throw error;
    }
  }

  /**
   * DELETE /api/admin/notifications/:id - Eliminar notificação específica
   */
  static async deleteNotification(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Verificar se notificação existe
      const notification = await prisma.notification.findUnique({
        where: { id },
      });

      if (!notification) {
        throw new NotFoundError(
          "Notificação não encontrada",
          "NOTIFICATION_NOT_FOUND"
        );
      }

      // Eliminar notificação
      await prisma.notification.delete({
        where: { id },
      });

      logger.info(`Admin eliminou notificação: ${notification.title}`);

      return res.status(200).json({
        message: "Notificação eliminada com sucesso",
      });
    } catch (error) {
      logger.error("Error deleting notification:", error);
      throw error;
    }
  }

  /**
   * DELETE /api/admin/notifications/bulk - Eliminar notificações em lote
   */
  static async deleteNotificationsBulk(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Dados inválidos",
          errors: errors.array(),
        });
      }

      const { title, message, type, createdBefore } = req.body;

      // Construir filtro
      const where: any = {};

      if (title) where.title = title;
      if (message) where.message = message;
      if (type) where.type = type;
      if (createdBefore) {
        where.createdAt = { lt: new Date(createdBefore) };
      }

      // Eliminar notificações que correspondem aos critérios
      const result = await prisma.notification.deleteMany({
        where,
      });

      logger.info(`Admin eliminou ${result.count} notificações em lote`);

      return res.status(200).json({
        message: `${result.count} notificações eliminadas com sucesso`,
        count: result.count,
      });
    } catch (error) {
      logger.error("Error deleting notifications in bulk:", error);
      throw error;
    }
  }

  /**
   * GET /api/admin/notifications/stats - Estatísticas de notificações
   */
  static async getNotificationStats(req: Request, res: Response) {
    try {
      const [
        totalNotifications,
        unreadNotifications,
        notificationsByType,
      ] = await Promise.all([
        prisma.notification.count(),
        prisma.notification.count({ where: { read: false } }),
        prisma.notification.groupBy({
          by: ["type"],
          _count: {
            _all: true,
          },
        }),
      ]);

      logger.info("Admin obteve estatísticas de notificações");

      return res.status(200).json({
        total: totalNotifications,
        unread: unreadNotifications,
        read: totalNotifications - unreadNotifications,
        byType: notificationsByType.reduce((acc, item) => {
          acc[item.type] = item._count._all;
          return acc;
        }, {} as Record<string, number>),
      });
    } catch (error) {
      logger.error("Error getting notification stats:", error);
      throw error;
    }
  }
}

