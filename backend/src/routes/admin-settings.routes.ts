import { Router } from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/admin-settings.controller";
import { authenticateToken, authorize } from "../middlewares/auth.middleware";
import { updateSettingsValidation } from "../validators/admin-settings.validator";

const router = Router();

// Todas as rotas requerem autenticação de admin
router.use(authenticateToken);
router.use(authorize("ADMIN"));

/**
 * @route   GET /api/v1/admin/settings
 * @desc    Obter configurações da plataforma
 * @access  Admin
 */
router.get("/settings", getSettings);

/**
 * @route   PUT /api/v1/admin/settings
 * @desc    Atualizar configurações da plataforma
 * @access  Admin
 */
router.put("/settings", updateSettingsValidation, updateSettings);

export default router;

