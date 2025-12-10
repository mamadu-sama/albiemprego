import { Router } from "express";
import * as AdminPlanRequestController from "../controllers/admin-plan-request.controller";
import { authenticateToken, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { reviewRequestValidation } from "../validators/plan-request.validator";
import { generalLimiter } from "../middlewares/rateLimit";

const router = Router();

// Proteger todas as rotas - apenas ADMIN
router.use(authenticateToken);
router.use(authorize("ADMIN"));
router.use(generalLimiter);

/**
 * @route   GET /api/v1/admin/requests/stats
 * @desc    Estatísticas de solicitações
 * @access  Admin
 */
router.get("/stats", AdminPlanRequestController.getRequestStats);

/**
 * @route   GET /api/v1/admin/requests
 * @desc    Listar todas as solicitações
 * @access  Admin
 */
router.get("/", AdminPlanRequestController.getAllRequests);

/**
 * @route   GET /api/v1/admin/requests/:requestId
 * @desc    Obter detalhes de uma solicitação
 * @access  Admin
 */
router.get("/:requestId", AdminPlanRequestController.getRequestById);

/**
 * @route   POST /api/v1/admin/requests/:requestId/approve
 * @desc    Aprovar solicitação
 * @access  Admin
 */
router.post(
  "/:requestId/approve",
  reviewRequestValidation,
  validate,
  AdminPlanRequestController.approveRequest
);

/**
 * @route   POST /api/v1/admin/requests/:requestId/reject
 * @desc    Rejeitar solicitação
 * @access  Admin
 */
router.post(
  "/:requestId/reject",
  reviewRequestValidation,
  validate,
  AdminPlanRequestController.rejectRequest
);

export default router;

