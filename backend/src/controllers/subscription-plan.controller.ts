// Controller de planos de assinatura (Admin)
import { Request, Response, NextFunction } from "express";
import { SubscriptionPlanService } from "../services/subscription-plan.service";
import { validationResult } from "express-validator";
import { logger } from "../config/logger";

export class SubscriptionPlanController {
  /**
   * GET /admin/plans - Listar todos os planos
   */
  static async listPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const plans = await SubscriptionPlanService.listPlans(includeInactive);
      return res.status(200).json(plans);
    } catch (error) {
      logger.error("Error listing plans:", error);
      return next(error);
    }
  }

  /**
   * GET /admin/plans/:id - Obter plano específico
   */
  static async getPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const plan = await SubscriptionPlanService.getPlan(id);
      return res.status(200).json(plan);
    } catch (error) {
      logger.error("Error getting plan:", error);
      return next(error);
    }
  }

  /**
   * POST /admin/plans - Criar novo plano
   */
  static async createPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Dados inválidos",
          errors: errors.array(),
        });
      }

      const plan = await SubscriptionPlanService.createPlan(req.body);
      return res.status(201).json(plan);
    } catch (error) {
      logger.error("Error creating plan:", error);
      return next(error);
    }
  }

  /**
   * PATCH /admin/plans/:id - Atualizar plano
   */
  static async updatePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Dados inválidos",
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      const plan = await SubscriptionPlanService.updatePlan(id, req.body);
      return res.status(200).json(plan);
    } catch (error) {
      logger.error("Error updating plan:", error);
      return next(error);
    }
  }

  /**
   * PATCH /admin/plans/:id/toggle - Ativar/Desativar plano
   */
  static async togglePlanActive(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const plan = await SubscriptionPlanService.togglePlanActive(id);
      return res.status(200).json(plan);
    } catch (error) {
      logger.error("Error toggling plan:", error);
      return next(error);
    }
  }

  /**
   * DELETE /admin/plans/:id - Deletar plano
   */
  static async deletePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await SubscriptionPlanService.deletePlan(id);
      return res.status(200).json(result);
    } catch (error) {
      logger.error("Error deleting plan:", error);
      return next(error);
    }
  }
}

