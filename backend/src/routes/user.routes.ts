// Rotas de utilizador
import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import {
  updateProfileValidation,
  updateEmailValidation,
  changePasswordValidation,
  deleteAccountValidation,
} from "../validators/user.validator";
import { uploadAvatar } from "../middlewares/upload.middleware";

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

/**
 * GET /users/me
 * Obter perfil do utilizador autenticado
 */
router.get("/me", UserController.getProfile);

/**
 * PATCH /users/me
 * Atualizar perfil do utilizador autenticado
 */
router.patch("/me", updateProfileValidation, UserController.updateProfile);

/**
 * POST /users/me/avatar
 * Upload de avatar (multipart/form-data com campo "avatar")
 */
router.post("/me/avatar", uploadAvatar, UserController.uploadAvatar);

/**
 * DELETE /users/me/avatar
 * Remover avatar
 */
router.delete("/me/avatar", UserController.deleteAvatar);

/**
 * PATCH /users/me/email
 * Atualizar email do utilizador
 */
router.patch("/me/email", updateEmailValidation, UserController.updateEmail);

/**
 * PATCH /users/me/password
 * Alterar password do utilizador
 */
router.patch(
  "/me/password",
  changePasswordValidation,
  UserController.changePassword
);

/**
 * DELETE /users/me
 * Eliminar conta do utilizador (soft delete)
 */
router.delete("/me", deleteAccountValidation, UserController.deleteAccount);

export default router;
