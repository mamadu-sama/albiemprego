import { Router } from "express";
import * as CompanyApplicationController from "../controllers/company-application.controller";
import { authenticateToken, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import {
  updateStatusValidation,
  updateNotesValidation,
  applicationIdValidation,
  companyApplicationsQueryValidation,
} from "../validators/company-application.validator";
import { generalLimiter } from "../middlewares/rateLimit";

const router = Router();

// Todas as rotas exigem autenticação de EMPRESA
router.use(authenticateToken);
router.use(authorize("EMPRESA"));

/**
 * @route   GET /api/v1/company/applications
 * @desc    Obter todas as candidaturas das vagas da empresa
 * @access  Empresa
 * @query   jobId (optional) - Filtrar por vaga específica
 * @query   status (optional) - Filtrar por status
 */
router.get(
  "/",
  generalLimiter,
  companyApplicationsQueryValidation,
  validate,
  CompanyApplicationController.getCompanyApplications
);

/**
 * @route   GET /api/v1/company/applications/stats
 * @desc    Obter estatísticas de candidaturas
 * @access  Empresa
 */
router.get(
  "/stats",
  generalLimiter,
  CompanyApplicationController.getApplicationStats
);

/**
 * @route   GET /api/v1/company/applications/:applicationId
 * @desc    Obter detalhes de uma candidatura
 * @access  Empresa
 */
router.get(
  "/:applicationId",
  generalLimiter,
  applicationIdValidation,
  validate,
  CompanyApplicationController.getApplicationDetails
);

/**
 * @route   PATCH /api/v1/company/applications/:applicationId/status
 * @desc    Alterar status de uma candidatura
 * @access  Empresa
 */
router.patch(
  "/:applicationId/status",
  generalLimiter,
  updateStatusValidation,
  validate,
  CompanyApplicationController.updateApplicationStatus
);

/**
 * @route   PATCH /api/v1/company/applications/:applicationId/notes
 * @desc    Adicionar/atualizar notas internas
 * @access  Empresa
 */
router.patch(
  "/:applicationId/notes",
  generalLimiter,
  updateNotesValidation,
  validate,
  CompanyApplicationController.updateApplicationNotes
);

export default router;

