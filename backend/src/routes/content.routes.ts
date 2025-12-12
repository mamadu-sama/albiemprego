import { Router } from "express";
import { getPublicContent } from "../controllers/admin-content.controller";
import { slugParamValidation } from "../validators/admin-content.validator";

const router = Router();

/**
 * @route   GET /api/v1/content/:slug
 * @desc    Obter página de conteúdo pública (sem autenticação)
 * @access  Public
 */
router.get("/:slug", slugParamValidation, getPublicContent);

export default router;

