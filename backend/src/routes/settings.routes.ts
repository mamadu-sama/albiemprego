import { Router } from "express";
import { getPublicSettings } from "../controllers/admin-settings.controller";

const router = Router();

/**
 * @route   GET /api/v1/settings/public
 * @desc    Obter configurações públicas da plataforma (sem autenticação)
 * @access  Public
 */
router.get("/public", getPublicSettings);

export default router;

