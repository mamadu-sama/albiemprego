// Controller de autenticação
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { AuthService } from "../services/auth.service";
import { ValidationError } from "../utils/errors";

export class AuthController {
  /**
   * POST /api/v1/auth/register
   */
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      // Validar input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError("Dados inválidos", errors.array());
      }

      const result = await AuthService.register(req.body);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/login
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      // Validar input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError("Dados inválidos", errors.array());
      }

      const result = await AuthService.login(req.body);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/forgot-password
   */
  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      // Validar input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError("Dados inválidos", errors.array());
      }

      const result = await AuthService.forgotPassword(req.body.email);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/reset-password
   */
  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      // Validar input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError("Dados inválidos", errors.array());
      }

      const { token, password } = req.body;
      const result = await AuthService.resetPassword(token, password);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/refresh
   */
  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      // Validar input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError("Dados inválidos", errors.array());
      }

      const result = await AuthService.refreshToken(req.body.refreshToken);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/logout
   */
  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // req.userId é injetado pelo middleware authenticateToken
      const userId = req.userId;

      if (!userId) {
        throw new ValidationError("Utilizador não autenticado");
      }

      await AuthService.logout(userId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
