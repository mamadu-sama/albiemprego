// Rotas de notificações para utilizadores
import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

// Rota pública para notificações de manutenção
router.get("/maintenance", NotificationController.getMaintenanceNotifications);

// Rotas protegidas (requerem autenticação)
router.get("/", authenticateToken, NotificationController.getNotifications);
router.get(
  "/unread-count",
  authenticateToken,
  NotificationController.getUnreadCount
);
router.patch(
  "/:id/read",
  authenticateToken,
  NotificationController.markAsRead
);
router.patch(
  "/mark-all-read",
  authenticateToken,
  NotificationController.markAllAsRead
);
router.delete("/:id", authenticateToken, NotificationController.deleteNotification);
router.delete("/read/all", authenticateToken, NotificationController.deleteAllRead);

export default router;

