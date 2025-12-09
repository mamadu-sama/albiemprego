// Rotas de autenticação
import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  refreshTokenValidation,
} from "../validators/auth.validator";
import { authLimiter } from "../middlewares/rateLimit";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

// POST /api/v1/auth/register
router.post(
  "/register",
  authLimiter,
  registerValidation,
  AuthController.register
);

// POST /api/v1/auth/login
router.post(
  "/login",
  authLimiter,
  loginValidation,
  AuthController.login
);

// POST /api/v1/auth/forgot-password
router.post(
  "/forgot-password",
  authLimiter,
  forgotPasswordValidation,
  AuthController.forgotPassword
);

// POST /api/v1/auth/reset-password
router.post(
  "/reset-password",
  authLimiter,
  resetPasswordValidation,
  AuthController.resetPassword
);

// POST /api/v1/auth/refresh
router.post(
  "/refresh",
  refreshTokenValidation,
  AuthController.refresh
);

// POST /api/v1/auth/logout
router.post(
  "/logout",
  authenticateToken,
  AuthController.logout
);

export default router;

