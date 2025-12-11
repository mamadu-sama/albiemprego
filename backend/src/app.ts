// Configuração da aplicação Express
import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

// Carregar variáveis de ambiente
dotenv.config();

// Importar configurações
import { corsOptions } from "./config/cors";
import { morganStream } from "./config/logger";
import { logger } from "./config/logger";

// Importar middlewares
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";
import { generalLimiter } from "./middlewares/rateLimit";

// Importar rotas
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import candidateRoutes from "./routes/candidate.routes";
import companyRoutes from "./routes/company.routes";
import jobRoutes from "./routes/job.routes";
import savedJobRoutes from "./routes/saved-job.routes";
import adminSubscriptionRoutes from "./routes/admin-subscription.routes";
import adminUserRoutes from "./routes/admin-user.routes";
import adminCompanyRoutes from "./routes/admin-company.routes";
import adminJobRoutes from "./routes/admin-job.routes";
import adminMaintenanceRoutes from "./routes/admin-maintenance.routes";
import adminNotificationRoutes from "./routes/admin-notification.routes";
import maintenanceRoutes from "./routes/maintenance.routes";
import companySubscriptionRoutes from "./routes/company-subscription.routes";
import companyPlanRequestRoutes from "./routes/company-plan-request.routes";
import adminPlanRequestRoutes from "./routes/admin-plan-request.routes";
import applicationRoutes from "./routes/application.routes";
import companyApplicationRoutes from "./routes/company-application.routes";

// Criar aplicação Express
const app: Application = express();

// ============================================
// MIDDLEWARES GLOBAIS
// ============================================

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

// CORS
app.use(cors(corsOptions));

// HTTP request logging
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    { stream: morganStream }
  )
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting geral
app.use(generalLimiter);

// ============================================
// ROTAS
// ============================================

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// Root
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "AlbiEmprego API v1.0",
    documentation: "/api/v1",
    health: "/health",
  });
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/candidates", candidateRoutes);
app.use("/api/v1/companies", companyRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/saved-jobs", savedJobRoutes);
app.use("/api/v1/maintenance", maintenanceRoutes); // Rota pública
app.use("/api/v1/admin", adminSubscriptionRoutes);
app.use("/api/v1/admin", adminUserRoutes);
app.use("/api/v1/admin", adminCompanyRoutes);
app.use("/api/v1/admin", adminJobRoutes);
app.use("/api/v1/admin", adminMaintenanceRoutes);
app.use("/api/v1/admin", adminNotificationRoutes);
app.use("/api/v1/admin/requests", adminPlanRequestRoutes);
app.use("/api/v1/subscriptions", companySubscriptionRoutes);
app.use("/api/v1/company/requests", companyPlanRequestRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/company/applications", companyApplicationRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler (deve vir antes do error handler)
app.use(notFoundHandler);

// Global error handler (deve ser o último middleware)
app.use(errorHandler);

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

process.on("SIGTERM", () => {
  logger.info("SIGTERM recebido. A encerrar gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info("SIGINT recebido. A encerrar gracefully...");
  process.exit(0);
});

// Erros não tratados
process.on("unhandledRejection", (reason: Error) => {
  logger.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error: Error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

export default app;

