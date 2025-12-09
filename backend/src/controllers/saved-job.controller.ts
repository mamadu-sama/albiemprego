import { Request, Response, NextFunction } from "express";
import { SavedJobService } from "../services/saved-job.service";
import { CandidateService } from "../services/candidate.service";
import { validationResult } from "express-validator";
import { logger } from "../config/logger";
import { AppError } from "../middlewares/errorHandler";

export class SavedJobController {
  /**
   * Guardar uma vaga
   * POST /api/v1/saved-jobs/:jobId
   */
  static async saveJob(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Dados inválidos",
          errors: errors.array(),
        });
      }

      const { jobId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          error: "UNAUTHORIZED",
          message: "Utilizador não autenticado",
        });
      }

      // Obter o candidato pelo userId
      const candidate = await CandidateService.getCandidateByUserId(userId);

      if (!candidate) {
        return res.status(404).json({
          error: "CANDIDATE_NOT_FOUND",
          message: "Perfil de candidato não encontrado",
        });
      }

      const savedJob = await SavedJobService.saveJob(candidate.id, jobId);

      return res.status(201).json({
        message: "Vaga guardada com sucesso",
        savedJob,
      });
    } catch (error) {
      logger.error("Error in saveJob controller:", error);
      return next(error);
    }
  }

  /**
   * Remover vaga guardada
   * DELETE /api/v1/saved-jobs/:jobId
   */
  static async unsaveJob(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Dados inválidos",
          errors: errors.array(),
        });
      }

      const { jobId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          error: "UNAUTHORIZED",
          message: "Utilizador não autenticado",
        });
      }

      // Obter o candidato pelo userId
      const candidate = await CandidateService.getCandidateByUserId(userId);

      if (!candidate) {
        return res.status(404).json({
          error: "CANDIDATE_NOT_FOUND",
          message: "Perfil de candidato não encontrado",
        });
      }

      const result = await SavedJobService.unsaveJob(candidate.id, jobId);

      return res.status(200).json(result);
    } catch (error) {
      logger.error("Error in unsaveJob controller:", error);
      return next(error);
    }
  }

  /**
   * Obter todas as vagas guardadas do candidato
   * GET /api/v1/saved-jobs
   */
  static async getSavedJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          error: "UNAUTHORIZED",
          message: "Utilizador não autenticado",
        });
      }

      // Obter o candidato pelo userId
      const candidate = await CandidateService.getCandidateByUserId(userId);

      if (!candidate) {
        return res.status(404).json({
          error: "CANDIDATE_NOT_FOUND",
          message: "Perfil de candidato não encontrado",
        });
      }

      const savedJobs = await SavedJobService.getSavedJobs(candidate.id);

      return res.status(200).json({
        savedJobs,
        total: savedJobs.length,
      });
    } catch (error) {
      logger.error("Error in getSavedJobs controller:", error);
      return next(error);
    }
  }

  /**
   * Obter IDs das vagas guardadas (para marcar na listagem)
   * GET /api/v1/saved-jobs/ids
   */
  static async getSavedJobIds(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        // Se não autenticado, retornar array vazio
        return res.status(200).json({ savedJobIds: [] });
      }

      // Obter o candidato pelo userId
      const candidate = await CandidateService.getCandidateByUserId(userId);

      if (!candidate) {
        return res.status(200).json({ savedJobIds: [] });
      }

      const savedJobIds = await SavedJobService.getSavedJobIds(candidate.id);

      return res.status(200).json({ savedJobIds });
    } catch (error) {
      logger.error("Error in getSavedJobIds controller:", error);
      return next(error);
    }
  }

  /**
   * Verificar se uma vaga está guardada
   * GET /api/v1/saved-jobs/:jobId/check
   */
  static async checkIfSaved(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(200).json({ isSaved: false });
      }

      // Obter o candidato pelo userId
      const candidate = await CandidateService.getCandidateByUserId(userId);

      if (!candidate) {
        return res.status(200).json({ isSaved: false });
      }

      const isSaved = await SavedJobService.isJobSaved(candidate.id, jobId);

      return res.status(200).json({ isSaved });
    } catch (error) {
      logger.error("Error in checkIfSaved controller:", error);
      return next(error);
    }
  }
}

