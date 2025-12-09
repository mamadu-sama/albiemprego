// Rotas de empresa
import { Router } from "express";
import { CompanyController } from "../controllers/company.controller";
import { authenticateToken, authorize, optionalAuth } from "../middlewares/auth.middleware";
import {
  updateCompanyProfileValidation,
  getPublicCompanyProfileValidation,
} from "../validators/company.validator";
import { uploadLogo } from "../middlewares/upload.middleware";

const router = Router();

/**
 * GET /companies/me
 * Obter perfil completo da empresa autenticada
 * IMPORTANTE: Esta rota deve vir ANTES de /:id para não ser capturada pelo parâmetro
 */
router.get(
  "/me",
  authenticateToken,
  authorize("EMPRESA"),
  CompanyController.getProfile
);

/**
 * GET /companies/:id
 * Obter perfil público da empresa (sem autenticação ou com autenticação opcional)
 */
router.get(
  "/:id",
  optionalAuth,
  getPublicCompanyProfileValidation,
  CompanyController.getPublicProfile
);

/**
 * Rotas protegidas - Requerem autenticação como EMPRESA
 */
router.use(authenticateToken);
router.use(authorize("EMPRESA"));

/**
 * PATCH /companies/me
 * Atualizar perfil da empresa
 */
router.patch(
  "/me",
  updateCompanyProfileValidation,
  CompanyController.updateProfile
);

/**
 * POST /companies/me/logo
 * Upload de logo da empresa (multipart/form-data com campo "logo")
 */
router.post("/me/logo", uploadLogo, CompanyController.uploadLogo);

/**
 * DELETE /companies/me/logo
 * Remover logo da empresa
 */
router.delete("/me/logo", CompanyController.deleteLogo);

export default router;

