import { Router } from "express";
import * as ApplicationController from "../controllers/application.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import {
  applyValidation,
  jobIdValidation,
  applicationIdValidation,
} from "../validators/application.validator";
import rateLimit from "express-rate-limit";

const router = Router();

// Rate limiter específico para candidaturas (5 por hora)
const applyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5,
  message: "Demasiadas candidaturas. Tente novamente mais tarde.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Todas as rotas exigem autenticação de CANDIDATO
router.use(authenticateToken);
router.use(authorize("CANDIDATO"));

/**
 * @route   GET /api/v1/applications/my
 * @desc    Obter minhas candidaturas
 * @access  Candidato
 */
router.get("/my", ApplicationController.getMyApplications);

/**
 * @route   GET /api/v1/applications/:applicationId
 * @desc    Obter detalhes de uma candidatura
 * @access  Candidato (próprio)
 */
router.get(
  "/:applicationId",
  applicationIdValidation,
  validate,
  ApplicationController.getApplicationDetails
);

/**
 * @route   DELETE /api/v1/applications/:applicationId
 * @desc    Retirar candidatura
 * @access  Candidato (próprio)
 */
router.delete(
  "/:applicationId",
  applicationIdValidation,
  validate,
  ApplicationController.withdrawApplication
);

/**
 * @route   GET /api/v1/applications/jobs/:jobId/can-apply
 * @desc    Verificar se pode candidatar-se
 * @access  Candidato
 */
router.get(
  "/jobs/:jobId/can-apply",
  jobIdValidation,
  validate,
  ApplicationController.canApply
);

/**
 * @route   GET /api/v1/applications/jobs/:jobId/check
 * @desc    Verificar se já se candidatou
 * @access  Candidato
 */
router.get(
  "/jobs/:jobId/check",
  jobIdValidation,
  validate,
  ApplicationController.checkApplication
);

/**
 * @route   POST /api/v1/applications/jobs/:jobId/apply
 * @desc    Candidatar-se a uma vaga
 * @access  Candidato
 */
router.post(
  "/jobs/:jobId/apply",
  applyLimiter,
  applyValidation,
  validate,
  ApplicationController.applyToJob
);

export default router;

