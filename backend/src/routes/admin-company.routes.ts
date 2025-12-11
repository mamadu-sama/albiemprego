// Rotas de gestão de empresas para administradores
import { Router } from "express";
import { AdminCompanyController } from "../controllers/admin-company.controller";
import { authenticateToken, authorize } from "../middlewares/auth.middleware";
import {
  updateCompanyStatusValidation,
  sendCompanyEmailValidation,
} from "../validators/admin-company.validator";

const router = Router();

// Todas as rotas requerem autenticação + ADMIN
router.use(authenticateToken);
router.use(authorize("ADMIN"));

// ==========================================
// GESTÃO DE EMPRESAS
// ==========================================

// GET /api/admin/companies/stats - Estatísticas gerais
router.get("/companies/stats", AdminCompanyController.getCompanyStats);

// GET /api/admin/companies - Listar empresas com filtros
router.get("/companies", AdminCompanyController.listCompanies);

// GET /api/admin/companies/:id - Detalhes de empresa específica
router.get("/companies/:id", AdminCompanyController.getCompanyDetails);

// PATCH /api/admin/companies/:id/status - Alterar status (aprovar/suspender/ativar)
router.patch(
  "/companies/:id/status",
  updateCompanyStatusValidation,
  AdminCompanyController.updateCompanyStatus
);

// DELETE /api/admin/companies/:id - Eliminar empresa
router.delete("/companies/:id", AdminCompanyController.deleteCompany);

// POST /api/admin/companies/:id/email - Enviar email personalizado
router.post(
  "/companies/:id/email",
  sendCompanyEmailValidation,
  AdminCompanyController.sendEmailToCompany
);

export default router;

