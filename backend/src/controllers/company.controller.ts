// Controller de gestão de empresas
import { Request, Response, NextFunction } from "express";
import { CompanyService } from "../services/company.service";
import { UploadService } from "../services/upload.service";
import { validationResult } from "express-validator";
import { logger } from "../config/logger";

export class CompanyController {
  /**
   * GET /companies/:id - Obter perfil público da empresa
   */
  static async getPublicProfile(req: Request, res: Response, next: NextFunction) {
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
      const profile = await CompanyService.getPublicProfile(id);
      return res.status(200).json(profile);
    } catch (error) {
      logger.error("Error getting public company profile:", error);
      return next(error);
    }
  }

  /**
   * GET /companies/me - Obter perfil completo da empresa autenticada
   */
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId!;
      const profile = await CompanyService.getProfile(userId);
      return res.status(200).json(profile);
    } catch (error) {
      logger.error("Error getting company profile:", error);
      return next(error);
    }
  }

  /**
   * PATCH /companies/me - Atualizar perfil da empresa
   */
  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Dados inválidos",
          errors: errors.array(),
        });
      }

      const userId = req.user?.userId!;
      const updated = await CompanyService.updateProfile(userId, req.body);
      return res.status(200).json(updated);
    } catch (error) {
      logger.error("Error updating company profile:", error);
      return next(error);
    }
  }

  /**
   * POST /companies/me/logo - Upload de logo
   */
  static async uploadLogo(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "NO_FILE",
          message: "Nenhum arquivo enviado",
        });
      }

      const userId = req.user?.userId!;
      const updated = await CompanyService.uploadLogo(userId, req.file);
      return res.status(200).json(updated);
    } catch (error) {
      logger.error("Error uploading company logo:", error);
      return next(error);
    }
  }

  /**
   * DELETE /companies/me/logo - Remover logo
   */
  static async deleteLogo(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId!;
      const updated = await CompanyService.deleteLogo(userId);
      return res.status(200).json(updated);
    } catch (error) {
      logger.error("Error deleting company logo:", error);
      return next(error);
    }
  }
}

