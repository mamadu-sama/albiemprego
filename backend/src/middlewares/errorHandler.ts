// Global error handler middleware
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { logger } from "../config/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log do erro
  logger.error("Error:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // AppError (erros esperados/tratados)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.errorCode,
      message: err.message,
      details: err.details,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Prisma errors
  if (err.name === "PrismaClientKnownRequestError") {
    const prismaError = err as any;
    
    // Unique constraint violation
    if (prismaError.code === "P2002") {
      res.status(409).json({
        error: "CONFLICT",
        message: "Registo duplicado",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Not found
    if (prismaError.code === "P2025") {
      res.status(404).json({
        error: "NOT_FOUND",
        message: "Recurso não encontrado",
        timestamp: new Date().toISOString(),
      });
      return;
    }
  }

  // Erros de validação do Express Validator
  if (err.name === "ValidationError") {
    res.status(400).json({
      error: "VALIDATION_ERROR",
      message: err.message,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Erro não tratado (internal server error)
  res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Ocorreu um erro interno. Tente novamente mais tarde.",
    timestamp: new Date().toISOString(),
  });
};

/**
 * Handler para rotas não encontradas (404)
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(404).json({
    error: "NOT_FOUND",
    message: `Rota ${req.method} ${req.path} não encontrada`,
    timestamp: new Date().toISOString(),
  });
};

