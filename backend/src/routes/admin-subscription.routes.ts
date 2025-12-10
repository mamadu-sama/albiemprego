// Rotas de gestão de assinaturas e créditos (Admin)
import { Router } from "express";
import { SubscriptionPlanController } from "../controllers/subscription-plan.controller";
import { CreditPackageController } from "../controllers/credit-package.controller";
import { AdminSubscriptionController } from "../controllers/admin-subscription.controller";
import { authenticateToken, authorize } from "../middlewares/auth.middleware";
import {
  createPlanValidation,
  updatePlanValidation,
  createPackageValidation,
  updatePackageValidation,
  assignPlanValidation,
  addCreditsValidation,
} from "../validators/subscription.validator";

const router = Router();

// Todas as rotas requerem autenticação + ADMIN
router.use(authenticateToken);
router.use(authorize("ADMIN"));

// ==========================================
// PLANOS
// ==========================================

// GET /admin/plans - Listar todos os planos
router.get("/plans", SubscriptionPlanController.listPlans);

// GET /admin/plans/:id - Obter plano específico
router.get("/plans/:id", SubscriptionPlanController.getPlan);

// POST /admin/plans - Criar plano
router.post("/plans", createPlanValidation, SubscriptionPlanController.createPlan);

// PATCH /admin/plans/:id - Atualizar plano
router.patch("/plans/:id", updatePlanValidation, SubscriptionPlanController.updatePlan);

// PATCH /admin/plans/:id/toggle - Ativar/Desativar plano
router.patch("/plans/:id/toggle", SubscriptionPlanController.togglePlanActive);

// DELETE /admin/plans/:id - Deletar plano
router.delete("/plans/:id", SubscriptionPlanController.deletePlan);

// ==========================================
// PACOTES DE CRÉDITOS
// ==========================================

// GET /admin/credit-packages - Listar todos os pacotes
router.get("/credit-packages", CreditPackageController.listPackages);

// GET /admin/credit-packages/:id - Obter pacote específico
router.get("/credit-packages/:id", CreditPackageController.getPackage);

// POST /admin/credit-packages - Criar pacote
router.post("/credit-packages", createPackageValidation, CreditPackageController.createPackage);

// PATCH /admin/credit-packages/:id - Atualizar pacote
router.patch("/credit-packages/:id", updatePackageValidation, CreditPackageController.updatePackage);

// PATCH /admin/credit-packages/:id/toggle - Ativar/Desativar pacote
router.patch("/credit-packages/:id/toggle", CreditPackageController.togglePackageActive);

// DELETE /admin/credit-packages/:id - Deletar pacote
router.delete("/credit-packages/:id", CreditPackageController.deletePackage);

// ==========================================
// ATRIBUIÇÕES MANUAIS
// ==========================================

// POST /admin/companies/:companyId/assign-plan - Atribuir plano manualmente
router.post(
  "/companies/:companyId/assign-plan",
  assignPlanValidation,
  AdminSubscriptionController.assignPlan
);

// POST /admin/companies/:companyId/add-credits - Adicionar créditos manualmente
router.post(
  "/companies/:companyId/add-credits",
  addCreditsValidation,
  AdminSubscriptionController.addCredits
);

// ==========================================
// ESTATÍSTICAS E TRANSAÇÕES
// ==========================================

// GET /admin/subscriptions/stats - Estatísticas
router.get("/subscriptions/stats", AdminSubscriptionController.getStats);

// GET /admin/transactions - Listar transações
router.get("/transactions", AdminSubscriptionController.listTransactions);

export default router;

