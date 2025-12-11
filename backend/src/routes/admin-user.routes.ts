// Rotas de gestão de utilizadores para administradores
import { Router } from "express";
import { AdminUserController } from "../controllers/admin-user.controller";
import { authenticateToken, authorize } from "../middlewares/auth.middleware";
import {
  updateUserStatusValidation,
  sendUserEmailValidation,
} from "../validators/admin-user.validator";

const router = Router();

// Todas as rotas requerem autenticação + ADMIN
router.use(authenticateToken);
router.use(authorize("ADMIN"));

// ==========================================
// GESTÃO DE UTILIZADORES
// ==========================================

// GET /api/admin/users/stats - Estatísticas gerais
router.get("/users/stats", AdminUserController.getUserStats);

// GET /api/admin/users - Listar utilizadores com filtros
router.get("/users", AdminUserController.listUsers);

// GET /api/admin/users/:id - Detalhes de utilizador específico
router.get("/users/:id", AdminUserController.getUserDetails);

// PATCH /api/admin/users/:id/status - Alterar status (ativar/suspender)
router.patch(
  "/users/:id/status",
  updateUserStatusValidation,
  AdminUserController.updateUserStatus
);

// DELETE /api/admin/users/:id - Eliminar utilizador
router.delete("/users/:id", AdminUserController.deleteUser);

// POST /api/admin/users/:id/email - Enviar email personalizado
router.post(
  "/users/:id/email",
  sendUserEmailValidation,
  AdminUserController.sendEmailToUser
);

export default router;

