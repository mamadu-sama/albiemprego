// Controller de pacotes de créditos (Admin)
import { Request, Response, NextFunction } from "express";
import { CreditPackageService } from "../services/credit-package.service";
import { validationResult } from "express-validator";
import { logger } from "../config/logger";

export class CreditPackageController {
  /**
   * GET /admin/credit-packages - Listar todos os pacotes
   */
  static async listPackages(req: Request, res: Response, next: NextFunction) {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const packages = await CreditPackageService.listPackages(includeInactive);
      return res.status(200).json(packages);
    } catch (error) {
      logger.error("Error listing packages:", error);
      return next(error);
    }
  }

  /**
   * GET /admin/credit-packages/:id - Obter pacote específico
   */
  static async getPackage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const pkg = await CreditPackageService.getPackage(id);
      return res.status(200).json(pkg);
    } catch (error) {
      logger.error("Error getting package:", error);
      return next(error);
    }
  }

  /**
   * POST /admin/credit-packages - Criar novo pacote
   */
  static async createPackage(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Dados inválidos",
          errors: errors.array(),
        });
      }

      const pkg = await CreditPackageService.createPackage(req.body);
      return res.status(201).json(pkg);
    } catch (error) {
      logger.error("Error creating package:", error);
      return next(error);
    }
  }

  /**
   * PATCH /admin/credit-packages/:id - Atualizar pacote
   */
  static async updatePackage(req: Request, res: Response, next: NextFunction) {
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
      const pkg = await CreditPackageService.updatePackage(id, req.body);
      return res.status(200).json(pkg);
    } catch (error) {
      logger.error("Error updating package:", error);
      return next(error);
    }
  }

  /**
   * PATCH /admin/credit-packages/:id/toggle - Ativar/Desativar pacote
   */
  static async togglePackageActive(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const pkg = await CreditPackageService.togglePackageActive(id);
      return res.status(200).json(pkg);
    } catch (error) {
      logger.error("Error toggling package:", error);
      return next(error);
    }
  }

  /**
   * DELETE /admin/credit-packages/:id - Deletar pacote
   */
  static async deletePackage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await CreditPackageService.deletePackage(id);
      return res.status(200).json(result);
    } catch (error) {
      logger.error("Error deleting package:", error);
      return next(error);
    }
  }
}

