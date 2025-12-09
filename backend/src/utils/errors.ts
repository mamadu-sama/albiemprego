// Classes de erro customizadas
export class AppError extends Error {
  statusCode: number;
  errorCode: string;
  details?: any;

  constructor(
    message: string,
    statusCode: number,
    errorCode: string,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.name = "AppError";

    // Manter stack trace correto
    Error.captureStackTrace(this, this.constructor);
  }
}

// Errors pré-definidos comuns
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Não autenticado") {
    super(message, 401, "UNAUTHORIZED", undefined);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Não tem permissão para aceder a este recurso") {
    super(message, 403, "FORBIDDEN", undefined);
    this.name = "ForbiddenError";
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, errorCode: string = "BAD_REQUEST") {
    super(message, 400, errorCode, undefined);
    this.name = "BadRequestError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Recurso não encontrado", errorCode: string = "NOT_FOUND") {
    super(message, 404, errorCode, undefined);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message: string, errorCode: string = "CONFLICT") {
    super(message, 409, errorCode, undefined);
    this.name = "ConflictError";
  }
}

