// Middlewares de autenticação e autorização
import { Request, Response, NextFunction } from "express";
import { UserType } from "@prisma/client";
import { verifyAccessToken } from "../utils/jwt";
import { UnauthorizedError, ForbiddenError } from "../utils/errors";

/**
 * Middleware de autenticação JWT
 * Verifica se o token está presente e válido
 */
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      throw new UnauthorizedError("Token não fornecido");
    }

    const decoded = verifyAccessToken(token);
    req.user = {
      userId: decoded.userId,
      userType: decoded.userType,
    };

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(error.statusCode).json({
        error: error.errorCode,
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(401).json({
        error: "INVALID_TOKEN",
        message: "Token inválido ou expirado",
        timestamp: new Date().toISOString(),
      });
    }
  }
};

/**
 * Middleware de autorização por role
 * Verifica se o utilizador tem a role necessária
 */
export const authorize = (...roles: UserType[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user?.userId || !req.user?.userType) {
        throw new UnauthorizedError("Utilizador não autenticado");
      }

      if (!roles.includes(req.user.userType)) {
        throw new ForbiddenError(
          "Não tem permissão para aceder a este recurso"
        );
      }

      next();
    } catch (error) {
      if (error instanceof ForbiddenError) {
        res.status(error.statusCode).json({
          error: error.errorCode,
          message: error.message,
          timestamp: new Date().toISOString(),
        });
      } else {
        res.status(403).json({
          error: "FORBIDDEN",
          message: "Acesso negado",
          timestamp: new Date().toISOString(),
        });
      }
    }
  };
};

/**
 * Middleware opcional de autenticação
 * Tenta autenticar mas não falha se não houver token
 */
export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (token) {
      const decoded = verifyAccessToken(token);
      req.user = {
        userId: decoded.userId,
        userType: decoded.userType,
      };
    }

    next();
  } catch (error) {
    // Ignora erros e continua sem autenticação
    next();
  }
};

