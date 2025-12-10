import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

/**
 * Middleware de validação usando express-validator
 * Valida os dados da requisição e retorna erros se houver
 */
export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Erro de validação nos dados enviados",
      errors: errors.array(),
      timestamp: new Date().toISOString(),
    });
    return;
  }

  next();
};

