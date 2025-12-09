// Rate limiting middlewares
import rateLimit from "express-rate-limit";

/**
 * Rate limiter geral
 * 100 requisições por 15 minutos por IP
 */
export const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
  message: {
    error: "TOO_MANY_REQUESTS",
    message: "Demasiadas requisições. Tente novamente mais tarde.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip para health check e em testes
    return req.path === "/health" || process.env.NODE_ENV === "test";
  },
});

/**
 * Rate limiter para autenticação
 * 5 tentativas por 15 minutos por IP
 */
export const authLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutos
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX || "100"), // Aumentado temporariamente
  message: {
    error: "TOO_MANY_LOGIN_ATTEMPTS",
    message: "Demasiadas tentativas de login. Tente novamente em 15 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Não conta requisições bem-sucedidas
  skip: () => process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development", // Skip em dev
});

/**
 * Rate limiter para API pública
 * 50 requisições por 15 minutos por IP
 */
export const publicLimiter = rateLimit({
  windowMs: 900000, // 15 minutos
  max: 50,
  message: {
    error: "TOO_MANY_REQUESTS",
    message: "Demasiadas requisições. Tente novamente mais tarde.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter para busca de vagas
 * 30 requisições por 1 minuto por IP
 */
export const searchLimiter = rateLimit({
  windowMs: 60000, // 1 minuto
  max: 30,
  message: {
    error: "TOO_MANY_SEARCH_REQUESTS",
    message: "Muitas pesquisas. Aguarde um momento.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === "test",
});

