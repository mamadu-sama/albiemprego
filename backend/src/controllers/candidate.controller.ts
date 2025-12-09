// Controller de gestão de perfil de candidato
import { Request, Response, NextFunction } from "express";
import { CandidateService } from "../services/candidate.service";
import { UploadService } from "../services/upload.service";
import { validationResult } from "express-validator";
import { logger } from "../config/logger";
import { BadRequestError } from "../utils/errors";

export class CandidateController {
  /**
   * GET /candidates/me - Obter perfil completo do candidato
   */
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId!;
      const profile = await CandidateService.getProfile(userId);
      return res.status(200).json(profile);
    } catch (error) {
      logger.error("Error getting candidate profile:", error);
      return next(error);
    }
  }

  /**
   * PATCH /candidates/me - Atualizar perfil do candidato
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
      const updated = await CandidateService.updateProfile(userId, req.body);
      return res.status(200).json(updated);
    } catch (error) {
      logger.error("Error updating candidate profile:", error);
      return next(error);
    }
  }

  /**
   * POST /candidates/me/cv - Upload de CV
   */
  static async uploadCV(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId!;
      const file = req.file;

      if (!file) {
        throw new BadRequestError("Nenhum arquivo enviado", "NO_FILE");
      }

      // Upload para S3
      const cvUrl = await UploadService.uploadCV(file);

      // Atualizar no banco
      const updated = await CandidateService.updateCV(userId, cvUrl);

      return res.status(200).json(updated);
    } catch (error) {
      logger.error("Error uploading CV:", error);
      return next(error);
    }
  }

  // ==========================================
  // EXPERIÊNCIAS
  // ==========================================

  /**
   * POST /candidates/me/experiences - Adicionar experiência
   */
  static async createExperience(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
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
      const experience = await CandidateService.createExperience(
        userId,
        req.body
      );
      return res.status(201).json(experience);
    } catch (error) {
      logger.error("Error creating experience:", error);
      return next(error);
    }
  }

  /**
   * PATCH /candidates/me/experiences/:id - Atualizar experiência
   */
  static async updateExperience(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
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
      const { id } = req.params;
      const updated = await CandidateService.updateExperience(
        userId,
        id,
        req.body
      );
      return res.status(200).json(updated);
    } catch (error) {
      logger.error("Error updating experience:", error);
      return next(error);
    }
  }

  /**
   * DELETE /candidates/me/experiences/:id - Remover experiência
   */
  static async deleteExperience(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.userId!;
      const { id } = req.params;
      await CandidateService.deleteExperience(userId, id);
      return res.status(204).send();
    } catch (error) {
      logger.error("Error deleting experience:", error);
      return next(error);
    }
  }

  // ==========================================
  // EDUCAÇÃO
  // ==========================================

  /**
   * POST /candidates/me/education - Adicionar educação
   */
  static async createEducation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
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
      const education = await CandidateService.createEducation(
        userId,
        req.body
      );
      return res.status(201).json(education);
    } catch (error) {
      logger.error("Error creating education:", error);
      return next(error);
    }
  }

  /**
   * PATCH /candidates/me/education/:id - Atualizar educação
   */
  static async updateEducation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
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
      const { id } = req.params;
      const updated = await CandidateService.updateEducation(
        userId,
        id,
        req.body
      );
      return res.status(200).json(updated);
    } catch (error) {
      logger.error("Error updating education:", error);
      return next(error);
    }
  }

  /**
   * DELETE /candidates/me/education/:id - Remover educação
   */
  static async deleteEducation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.userId!;
      const { id } = req.params;
      await CandidateService.deleteEducation(userId, id);
      return res.status(204).send();
    } catch (error) {
      logger.error("Error deleting education:", error);
      return next(error);
    }
  }

  // ==========================================
  // IDIOMAS
  // ==========================================

  /**
   * POST /candidates/me/languages - Adicionar idioma
   */
  static async createLanguage(req: Request, res: Response, next: NextFunction) {
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
      const language = await CandidateService.createLanguage(userId, req.body);
      return res.status(201).json(language);
    } catch (error) {
      logger.error("Error creating language:", error);
      return next(error);
    }
  }

  /**
   * PATCH /candidates/me/languages/:id - Atualizar idioma
   */
  static async updateLanguage(req: Request, res: Response, next: NextFunction) {
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
      const { id } = req.params;
      const { level } = req.body;
      const updated = await CandidateService.updateLanguage(userId, id, level);
      return res.status(200).json(updated);
    } catch (error) {
      logger.error("Error updating language:", error);
      return next(error);
    }
  }

  /**
   * DELETE /candidates/me/languages/:id - Remover idioma
   */
  static async deleteLanguage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId!;
      const { id } = req.params;
      await CandidateService.deleteLanguage(userId, id);
      return res.status(204).send();
    } catch (error) {
      logger.error("Error deleting language:", error);
      return next(error);
    }
  }
}
