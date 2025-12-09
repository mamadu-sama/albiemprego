// Controller de gestão de utilizadores
import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { UploadService } from "../services/upload.service";
import { validationResult } from "express-validator";
import { logger } from "../config/logger";
import { BadRequestError } from "../utils/errors";

export class UserController {
  /**
   * GET /users/me - Obter perfil do utilizador autenticado
   */
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId!; // Vem do middleware de autenticação

      const profile = await UserService.getProfile(userId);

      return res.status(200).json(profile);
    } catch (error) {
      logger.error("Error getting profile:", error);
      throw error;
    }
  }

  /**
   * PATCH /users/me - Atualizar perfil do utilizador autenticado
   */
  static async updateProfile(req: Request, res: Response) {
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
      const updateData = req.body;

      const updated = await UserService.updateProfile(userId, updateData);

      return res.status(200).json(updated);
    } catch (error) {
      logger.error("Error updating profile:", error);
      throw error;
    }
  }

  /**
   * POST /users/me/avatar - Upload de avatar
   */
  static async uploadAvatar(req: Request, res: Response) {
    try {
      const userId = req.user?.userId!;
      const file = req.file;

      if (!file) {
        throw new BadRequestError("Nenhum arquivo enviado", "NO_FILE");
      }

      // Obter avatar antigo para deletar depois
      const currentUser = await UserService.getProfile(userId);
      const oldAvatar = currentUser.avatar;

      // Upload para S3
      const avatarUrl = await UploadService.uploadAvatar(file);

      // Atualizar no banco de dados
      const updated = await UserService.updateAvatar(userId, avatarUrl);

      // Deletar avatar antigo se existir
      if (oldAvatar && oldAvatar.includes("amazonaws.com")) {
        try {
          await UploadService.deleteFile(oldAvatar);
        } catch (error) {
          logger.warn("Erro ao deletar avatar antigo:", error);
          // Não falha se não conseguir deletar o antigo
        }
      }

      return res.status(200).json(updated);
    } catch (error) {
      logger.error("Error uploading avatar:", error);
      throw error;
    }
  }

  /**
   * DELETE /users/me/avatar - Remover avatar
   */
  static async deleteAvatar(req: Request, res: Response) {
    try {
      const userId = req.user?.userId!;

      // Obter avatar atual
      const currentUser = await UserService.getProfile(userId);
      const currentAvatar = currentUser.avatar;

      // Remover do banco de dados
      const updated = await UserService.deleteAvatar(userId);

      // Deletar do S3 se existir
      if (currentAvatar && currentAvatar.includes("amazonaws.com")) {
        try {
          await UploadService.deleteFile(currentAvatar);
        } catch (error) {
          logger.warn("Erro ao deletar avatar do S3:", error);
          // Não falha se não conseguir deletar do S3
        }
      }

      return res.status(200).json(updated);
    } catch (error) {
      logger.error("Error deleting avatar:", error);
      throw error;
    }
  }

  /**
   * Atualizar email do utilizador
   */
  static async updateEmail(req: Request, res: Response, next: NextFunction) {
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
      const { newEmail, currentPassword } = req.body;

      const updatedUser = await UserService.updateEmail(
        userId,
        newEmail,
        currentPassword
      );

      return res.status(200).json(updatedUser);
    } catch (error) {
      logger.error("Error updating email:", error);
      throw error;
    }
  }

  /**
   * Alterar password do utilizador
   */
  static async changePassword(req: Request, res: Response, next: NextFunction) {
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
      const { currentPassword, newPassword } = req.body;

      const result = await UserService.changePassword(
        userId,
        currentPassword,
        newPassword
      );

      return res.status(200).json(result);
    } catch (error) {
      logger.error("Error changing password:", error);
      throw error;
    }
  }

  /**
   * Eliminar conta (soft delete)
   */
  static async deleteAccount(req: Request, res: Response, next: NextFunction) {
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
      const { password } = req.body;

      const result = await UserService.softDeleteAccount(userId, password);

      return res.status(200).json(result);
    } catch (error) {
      logger.error("Error deleting account:", error);
      throw error;
    }
  }
}
