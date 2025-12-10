// Rotas de assinaturas e créditos para Empresas
import { Router } from "express";
import { CompanySubscriptionController } from "../controllers/company-subscription.controller";
import { authenticateToken, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Todas as rotas requerem autenticação + EMPRESA
router.use(authenticateToken);
router.use(authorize("EMPRESA"));

// ==========================================
// VISUALIZAÇÃO DE PLANOS E PACOTES
// ==========================================

// GET /subscriptions/plans - Listar planos disponíveis
router.get("/plans", CompanySubscriptionController.listPlans);

// GET /subscriptions/credit-packages - Listar pacotes disponíveis
router.get("/credit-packages", CompanySubscriptionController.listPackages);

// ==========================================
// ASSINATURA ATUAL E CRÉDITOS
// ==========================================

// GET /subscriptions/current - Obter assinatura atual, créditos e alertas
router.get("/current", CompanySubscriptionController.getCurrentSubscription);

// ==========================================
// HISTÓRICO E NOTIFICAÇÕES
// ==========================================

// GET /subscriptions/transactions - Histórico de transações
router.get("/transactions", CompanySubscriptionController.getTransactions);

// GET /subscriptions/notifications - Notificações da empresa
router.get("/notifications", CompanySubscriptionController.getNotifications);

// PATCH /subscriptions/notifications/:id/read - Marcar notificação como lida
router.patch("/notifications/:id/read", CompanySubscriptionController.markNotificationAsRead);

export default router;

