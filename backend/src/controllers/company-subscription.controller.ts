// Controller de assinaturas e créditos para Empresas
import { Request, Response, NextFunction } from "express";
import { SubscriptionPlanService } from "../services/subscription-plan.service";
import { CreditPackageService } from "../services/credit-package.service";
import { CompanySubscriptionService } from "../services/company-subscription.service";
import { CreditService } from "../services/credit.service";
import { TransactionService } from "../services/transaction.service";
import { CompanyNotificationService } from "../services/company-notification.service";
import { logger } from "../config/logger";
import { prisma } from "../config/database";

export class CompanySubscriptionController {
  /**
   * GET /subscriptions/plans - Listar planos disponíveis
   */
  static async listPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const plans = await SubscriptionPlanService.listPlans(false); // Apenas ativos
      return res.status(200).json(plans);
    } catch (error) {
      logger.error("Error listing plans for company:", error);
      return next(error);
    }
  }

  /**
   * GET /subscriptions/credit-packages - Listar pacotes de créditos disponíveis
   */
  static async listPackages(req: Request, res: Response, next: NextFunction) {
    try {
      const packages = await CreditPackageService.listPackages(false); // Apenas ativos
      return res.status(200).json(packages);
    } catch (error) {
      logger.error("Error listing packages for company:", error);
      return next(error);
    }
  }

  /**
   * GET /subscriptions/current - Obter assinatura atual e créditos
   */
  static async getCurrentSubscription(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.userId;

      // Buscar empresa do usuário
      const company = await prisma.company.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (!company) {
        return res.status(400).json({
          error: "BAD_REQUEST",
          message: "Empresa não encontrada no utilizador",
        });
      }

      const companyId = company.id;

      const data =
        await CompanySubscriptionService.getCurrentSubscription(companyId);
      const unreadNotifications =
        await CompanyNotificationService.getUnreadCount(companyId);

      return res.status(200).json({
        ...data,
        unreadNotifications,
      });
    } catch (error) {
      logger.error("Error getting current subscription:", error);
      return next(error);
    }
  }

  /**
   * GET /subscriptions/transactions - Histórico de transações
   */
  static async getTransactions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.userId;

      // Buscar empresa do usuário
      const company = await prisma.company.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (!company) {
        return res.status(400).json({
          error: "BAD_REQUEST",
          message: "Empresa não encontrada no utilizador",
        });
      }

      const companyId = company.id;

      const filters: any = {};

      if (req.query.status) {
        filters.status = req.query.status;
      }

      if (req.query.type) {
        filters.type = req.query.type;
      }

      const transactions = await TransactionService.listCompanyTransactions(
        companyId,
        filters
      );
      return res.status(200).json(transactions);
    } catch (error) {
      logger.error("Error getting company transactions:", error);
      return next(error);
    }
  }

  /**
   * GET /subscriptions/notifications - Obter notificações da empresa
   */
  static async getNotifications(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.userId;

      // Buscar empresa do usuário
      const company = await prisma.company.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (!company) {
        return res.status(400).json({
          error: "BAD_REQUEST",
          message: "Empresa não encontrada no utilizador",
        });
      }

      const companyId = company.id;

      const unreadOnly = req.query.unreadOnly === "true";
      const notifications =
        await CompanyNotificationService.getCompanyNotifications(
          companyId,
          unreadOnly
        );

      return res.status(200).json(notifications);
    } catch (error) {
      logger.error("Error getting notifications:", error);
      return next(error);
    }
  }

  /**
   * PATCH /subscriptions/notifications/:id/read - Marcar notificação como lida
   */
  static async markNotificationAsRead(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const notification = await CompanyNotificationService.markAsRead(id);
      return res.status(200).json(notification);
    } catch (error) {
      logger.error("Error marking notification as read:", error);
      return next(error);
    }
  }
}
