// Service de notificações para empresas
import { prisma } from "../config/database";
import { logger } from "../config/logger";
import { NotificationPriority, CreditType } from "@prisma/client";

export interface NotificationContext {
  creditType?: CreditType;
  jobId?: string;
}

export class CompanyNotificationService {
  /**
   * Criar notificação
   */
  static async createNotification(
    companyId: string,
    type: string,
    title: string,
    message: string,
    context?: NotificationContext,
    priority: NotificationPriority = NotificationPriority.NORMAL
  ) {
    const notification = await prisma.companyNotification.create({
      data: {
        companyId,
        type,
        priority,
        title,
        message,
        creditType: context?.creditType,
        jobId: context?.jobId,
      },
    });

    logger.info(
      `Created ${type} notification for company ${companyId}: ${title}`
    );
    return notification;
  }

  /**
   * Obter notificações de uma empresa
   */
  static async getCompanyNotifications(
    companyId: string,
    unreadOnly: boolean = false
  ) {
    const where: any = { companyId };

    if (unreadOnly) {
      where.read = false;
    }

    const notifications = await prisma.companyNotification.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Últimas 50 notificações
    });

    return notifications;
  }

  /**
   * Marcar notificação como lida
   */
  static async markAsRead(notificationId: string) {
    const notification = await prisma.companyNotification.update({
      where: { id: notificationId },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    return notification;
  }

  /**
   * Marcar todas as notificações de uma empresa como lidas
   */
  static async markAllAsRead(companyId: string) {
    const result = await prisma.companyNotification.updateMany({
      where: {
        companyId,
        read: false,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    logger.info(
      `Marked ${result.count} notifications as read for company ${companyId}`
    );
    return result.count;
  }

  /**
   * Contar notificações não lidas
   */
  static async getUnreadCount(companyId: string): Promise<number> {
    const count = await prisma.companyNotification.count({
      where: {
        companyId,
        read: false,
      },
    });

    return count;
  }

  /**
   * Deletar notificações antigas (> 90 dias)
   */
  static async deleteOldNotifications() {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const result = await prisma.companyNotification.deleteMany({
      where: {
        createdAt: { lte: ninetyDaysAgo },
        read: true, // Apenas deletar as já lidas
      },
    });

    logger.info(`Deleted ${result.count} old notifications`);
    return result.count;
  }
}
