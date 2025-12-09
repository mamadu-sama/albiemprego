import { Router } from "express";
import { SavedJobController } from "../controllers/saved-job.controller";
import { authenticateToken, authorize } from "../middlewares/auth.middleware";
import { jobIdValidation } from "../validators/saved-job.validator";

const router = Router();

/**
 * Todas as rotas de saved jobs requerem autenticação como CANDIDATO
 */

// Obter todas as vagas guardadas do candidato
router.get(
  "/",
  authenticateToken,
  authorize("CANDIDATO"),
  SavedJobController.getSavedJobs
);

// Obter IDs das vagas guardadas (para marcar na listagem)
router.get(
  "/ids",
  authenticateToken,
  authorize("CANDIDATO"),
  SavedJobController.getSavedJobIds
);

// Verificar se uma vaga está guardada
router.get(
  "/:jobId/check",
  authenticateToken,
  authorize("CANDIDATO"),
  jobIdValidation,
  SavedJobController.checkIfSaved
);

// Guardar uma vaga
router.post(
  "/:jobId",
  authenticateToken,
  authorize("CANDIDATO"),
  jobIdValidation,
  SavedJobController.saveJob
);

// Remover vaga guardada
router.delete(
  "/:jobId",
  authenticateToken,
  authorize("CANDIDATO"),
  jobIdValidation,
  SavedJobController.unsaveJob
);

export default router;

