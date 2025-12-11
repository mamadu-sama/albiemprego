// Rotas de gestão de notificações para administradores
import { Router } from "express";
import { AdminNotificationController } from "../controllers/admin-notification.controller";
import { authenticateToken, authorize } from "../middlewares/auth.middleware";
import {
  sendNotificationValidation,
  deleteNotificationsBulkValidation,
} from "../validators/admin-notification.validator";

const router = Router();

// Todas as rotas requerem autenticação + ADMIN
router.use(authenticateToken);
router.use(authorize("ADMIN"));

// ==========================================
// GESTÃO DE NOTIFICAÇÕES
// ==========================================

// GET /api/admin/notifications/stats - Estatísticas
router.get("/notifications/stats", AdminNotificationController.getNotificationStats);

// GET /api/admin/notifications/history - Histórico de notificações
router.get("/notifications/history", AdminNotificationController.getNotificationHistory);

// POST /api/admin/notifications - Enviar notificação global
router.post(
  "/notifications",
  sendNotificationValidation,
  AdminNotificationController.sendNotification
);

// DELETE /api/admin/notifications/bulk - Eliminar notificações em lote
router.delete(
  "/notifications/bulk",
  deleteNotificationsBulkValidation,
  AdminNotificationController.deleteNotificationsBulk
);

// DELETE /api/admin/notifications/:id - Eliminar notificação específica
router.delete("/notifications/:id", AdminNotificationController.deleteNotification);

export default router;

