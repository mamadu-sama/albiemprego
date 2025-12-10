import { Router } from "express";
import * as CompanyPlanRequestController from "../controllers/company-plan-request.controller";
import { authenticateToken, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import {
  requestPlanValidation,
  requestCreditsValidation,
} from "../validators/plan-request.validator";
import { generalLimiter } from "../middlewares/rateLimit";

const router = Router();

// Proteger todas as rotas - apenas EMPRESA
router.use(authenticateToken);
router.use(authorize("EMPRESA"));
router.use(generalLimiter);

/**
 * @route   POST /api/v1/company/requests/plan
 * @desc    Solicitar plano de subscrição
 * @access  Empresa
 */
router.post(
  "/plan",
  requestPlanValidation,
  validate,
  CompanyPlanRequestController.requestPlan
);

/**
 * @route   POST /api/v1/company/requests/credits
 * @desc    Solicitar pacote de créditos
 * @access  Empresa
 */
router.post(
  "/credits",
  requestCreditsValidation,
  validate,
  CompanyPlanRequestController.requestCredits
);

/**
 * @route   GET /api/v1/company/requests
 * @desc    Listar minhas solicitações
 * @access  Empresa
 */
router.get("/", CompanyPlanRequestController.getMyRequests);

/**
 * @route   DELETE /api/v1/company/requests/:requestId
 * @desc    Cancelar solicitação
 * @access  Empresa
 */
router.delete("/:requestId", CompanyPlanRequestController.cancelRequest);

export default router;

