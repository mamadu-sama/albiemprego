// Controller de atribuições manuais de assinaturas e créditos (Admin)
import { Request, Response, NextFunction } from "express";
import { CompanySubscriptionService } from "../services/company-subscription.service";
import { CreditService } from "../services/credit.service";
import { TransactionService } from "../services/transaction.service";
import { validationResult } from "express-validator";
import { logger } from "../config/logger";

export class AdminSubscriptionController {
  /**
   * POST /admin/companies/:companyId/assign-plan - Atribuir plano manualmente
   */
  static async assignPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Dados inválidos",
          errors: errors.array(),
        });
      }

      const { companyId } = req.params;
      const { planId } = req.body;
      const adminId = req.user?.userId!;

      const subscription = await CompanySubscriptionService.assignSubscriptionManually(
        companyId,
        planId,
        adminId
      );

      return res.status(200).json({
        message: "Plano atribuído com sucesso",
        subscription,
      });
    } catch (error) {
      logger.error("Error assigning plan:", error);
      return next(error);
    }
  }

  /**
   * POST /admin/companies/:companyId/add-credits - Adicionar créditos manualmente
   */
  static async addCredits(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Dados inválidos",
          errors: errors.array(),
        });
      }

      const { companyId } = req.params;
      const { featured, homepage, urgent, duration, notes } = req.body;
      const adminId = req.user?.userId!;

      await CreditService.addCreditsManually(
        companyId,
        { featured: featured || 0, homepage: homepage || 0, urgent: urgent || 0 },
        duration,
        adminId,
        notes || 'Créditos adicionados manualmente'
      );

      const credits = await CreditService.getCompanyCredits(companyId);

      return res.status(200).json({
        message: "Créditos adicionados com sucesso",
        credits,
      });
    } catch (error) {
      logger.error("Error adding credits:", error);
      return next(error);
    }
  }

  /**
   * GET /admin/subscriptions/stats - Estatísticas de assinaturas
   */
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await TransactionService.getTransactionStats();
      return res.status(200).json(stats);
    } catch (error) {
      logger.error("Error getting subscription stats:", error);
      return next(error);
    }
  }

  /**
   * GET /admin/transactions - Listar todas as transações
   */
  static async listTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: any = {};

      if (req.query.status) {
        filters.status = req.query.status;
      }

      if (req.query.type) {
        filters.type = req.query.type;
      }

      if (req.query.startDate) {
        filters.startDate = new Date(req.query.startDate as string);
      }

      if (req.query.endDate) {
        filters.endDate = new Date(req.query.endDate as string);
      }

      const transactions = await TransactionService.listAllTransactions(filters);
      return res.status(200).json(transactions);
    } catch (error) {
      logger.error("Error listing transactions:", error);
      return next(error);
    }
  }
}

