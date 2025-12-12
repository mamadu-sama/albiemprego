import { Router } from "express";
import {
  getAllContent,
  getContentBySlug,
  updateContent,
} from "../controllers/admin-content.controller";
import { authenticateToken, authorize } from "../middlewares/auth.middleware";
import {
  slugParamValidation,
  updateContentValidation,
} from "../validators/admin-content.validator";

const router = Router();

// Todas as rotas requerem autenticação de admin
router.use(authenticateToken);
router.use(authorize("ADMIN"));

/**
 * @route   GET /api/v1/admin/content
 * @desc    Listar todas as páginas de conteúdo
 * @access  Admin
 */
router.get("/content", getAllContent);

/**
 * @route   GET /api/v1/admin/content/:slug
 * @desc    Obter página de conteúdo específica
 * @access  Admin
 */
router.get("/content/:slug", slugParamValidation, getContentBySlug);

/**
 * @route   PUT /api/v1/admin/content/:slug
 * @desc    Atualizar ou criar página de conteúdo
 * @access  Admin
 */
router.put("/content/:slug", updateContentValidation, updateContent);

export default router;

