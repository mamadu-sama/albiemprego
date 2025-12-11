// Controller de gestão de modo de manutenção
import { Request, Response } from "express";
import { prisma } from "../config/database";
import { logger } from "../config/logger";
import { validationResult } from "express-validator";

export class AdminMaintenanceController {
  /**
   * GET /api/admin/maintenance - Obter estado do modo de manutenção
   */
  static async getMaintenanceStatus(req: Request, res: Response) {
    try {
      // Buscar ou criar registro de manutenção
      let maintenance = await prisma.maintenanceMode.findFirst();

      if (!maintenance) {
        // Criar registro inicial se não existir
        maintenance = await prisma.maintenanceMode.create({
          data: {
            enabled: false,
            message: "Estamos a realizar melhorias na plataforma. Voltaremos em breve!",
          },
        });
      }

      logger.info("Admin consultou estado de manutenção");

      return res.status(200).json(maintenance);
    } catch (error) {
      logger.error("Error getting maintenance status:", error);
      throw error;
    }
  }

  /**
   * PUT /api/admin/maintenance - Atualizar estado do modo de manutenção
   */
  static async updateMaintenance(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Dados inválidos",
          errors: errors.array(),
        });
      }

      const { enabled, message, estimatedEndTime } = req.body;

      // Buscar ou criar registro
      let maintenance = await prisma.maintenanceMode.findFirst();

      if (!maintenance) {
        // Criar se não existir
        maintenance = await prisma.maintenanceMode.create({
          data: {
            enabled: enabled ?? false,
            message: message || "Estamos a realizar melhorias na plataforma. Voltaremos em breve!",
            estimatedEndTime: estimatedEndTime ? new Date(estimatedEndTime) : null,
          },
        });
      } else {
        // Atualizar existente
        const updateData: any = {};

        if (enabled !== undefined) {
          updateData.enabled = enabled;
        }

        if (message !== undefined) {
          updateData.message = message;
        }

        if (estimatedEndTime !== undefined) {
          updateData.estimatedEndTime = estimatedEndTime ? new Date(estimatedEndTime) : null;
        }

        maintenance = await prisma.maintenanceMode.update({
          where: { id: maintenance.id },
          data: updateData,
        });
      }

      logger.info(
        `Admin ${maintenance.enabled ? "ativou" : "desativou"} modo de manutenção`
      );

      return res.status(200).json({
        message: `Modo de manutenção ${maintenance.enabled ? "ativado" : "desativado"} com sucesso`,
        maintenance,
      });
    } catch (error) {
      logger.error("Error updating maintenance:", error);
      throw error;
    }
  }

  /**
   * GET /api/maintenance/status - Endpoint público para verificar estado (sem auth)
   */
  static async getPublicMaintenanceStatus(req: Request, res: Response) {
    try {
      const maintenance = await prisma.maintenanceMode.findFirst();

      if (!maintenance) {
        return res.status(200).json({
          enabled: false,
          message: null,
          estimatedEndTime: null,
        });
      }

      // Retornar apenas informações públicas
      return res.status(200).json({
        enabled: maintenance.enabled,
        message: maintenance.message,
        estimatedEndTime: maintenance.estimatedEndTime,
      });
    } catch (error) {
      logger.error("Error getting public maintenance status:", error);
      throw error;
    }
  }
}

