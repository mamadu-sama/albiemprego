// Rotas de gestão de vagas para administradores
import { Router } from "express";
import { AdminJobController } from "../controllers/admin-job.controller";
import { authenticateToken, authorize } from "../middlewares/auth.middleware";
import { updateJobStatusValidation } from "../validators/admin-job.validator";

const router = Router();

// Todas as rotas requerem autenticação + ADMIN
router.use(authenticateToken);
router.use(authorize("ADMIN"));

// ==========================================
// GESTÃO DE VAGAS
// ==========================================

// GET /api/admin/jobs/stats - Estatísticas gerais
router.get("/jobs/stats", AdminJobController.getJobStats);

// GET /api/admin/jobs - Listar vagas com filtros
router.get("/jobs", AdminJobController.listJobs);

// GET /api/admin/jobs/:id - Detalhes de vaga específica
router.get("/jobs/:id", AdminJobController.getJobDetails);

// PATCH /api/admin/jobs/:id/status - Alterar status (aprovar/rejeitar/pausar)
router.patch(
  "/jobs/:id/status",
  updateJobStatusValidation,
  AdminJobController.updateJobStatus
);

// POST /api/admin/jobs/:id/report - Incrementar denúncias
router.post("/jobs/:id/report", AdminJobController.reportJob);

// PATCH /api/admin/jobs/:id/clear-reports - Limpar denúncias
router.patch("/jobs/:id/clear-reports", AdminJobController.clearReports);

// DELETE /api/admin/jobs/:id - Eliminar vaga
router.delete("/jobs/:id", AdminJobController.deleteJob);

export default router;

