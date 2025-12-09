// Rotas de vagas
import { Router } from "express";
import { JobController } from "../controllers/job.controller";
import { authenticateToken, authorize, optionalAuth } from "../middlewares/auth.middleware";
import {
  createJobValidation,
  updateJobValidation,
  getJobByIdValidation,
  listJobsValidation,
} from "../validators/job.validator";
import { searchJobsValidation } from "../validators/job-search.validator";
import { searchLimiter } from "../middlewares/rateLimit";

const router = Router();

/**
 * Rotas protegidas - Requerem autenticação como EMPRESA
 * IMPORTANTE: Estas rotas devem vir ANTES das rotas públicas
 * para evitar conflito com rotas parametrizadas (:id)
 */

/**
 * GET /jobs/my-jobs/stats
 * Estatísticas das vagas da empresa (contadores por status, candidaturas, visualizações)
 * DEVE vir antes de /my-jobs para evitar conflito
 */
router.get("/my-jobs/stats", authenticateToken, authorize("EMPRESA"), JobController.getMyJobsStats);

/**
 * GET /jobs/my-jobs
 * Listar vagas da empresa logada (com filtro opcional por status)
 * Query params: status (opcional) = DRAFT | ACTIVE | PAUSED | CLOSED | PENDING | REJECTED
 */
router.get("/my-jobs", authenticateToken, authorize("EMPRESA"), JobController.getMyJobs);

/**
 * Rotas públicas (sem autenticação obrigatória)
 */

/**
 * GET /jobs/search
 * Busca pública avançada com filtros e Match Score (autenticação opcional)
 * Suporta: busca texto, localização, tipo, workMode, salário, match score
 * Rate limit: 30 requisições por minuto
 */
router.get("/search", searchLimiter, optionalAuth, searchJobsValidation, JobController.searchPublicJobs);

/**
 * GET /jobs
 * Listar vagas públicas com filtros e paginação (endpoint legado)
 */
router.get("/", listJobsValidation, JobController.listJobs);

/**
 * GET /jobs/:id
 * Obter detalhes de uma vaga específica
 * Autenticação opcional para tracking de visualizações
 */
router.get("/:id", optionalAuth, getJobByIdValidation, JobController.getJob);

/**
 * Rotas protegidas de modificação - Requerem autenticação como EMPRESA
 */
router.use(authenticateToken);
router.use(authorize("EMPRESA"));

/**
 * POST /jobs
 * Criar nova vaga (apenas empresas)
 */
router.post("/", createJobValidation, JobController.createJob);

/**
 * PATCH /jobs/:id
 * Atualizar vaga existente (apenas dono)
 */
router.patch("/:id", updateJobValidation, JobController.updateJob);

/**
 * DELETE /jobs/:id
 * Remover vaga (apenas dono, sem candidaturas)
 */
router.delete("/:id", getJobByIdValidation, JobController.deleteJob);

/**
 * PATCH /jobs/:id/publish
 * Publicar vaga (mudar de DRAFT para ACTIVE)
 */
router.patch("/:id/publish", getJobByIdValidation, JobController.publishJob);

/**
 * PATCH /jobs/:id/pause
 * Pausar vaga ativa
 */
router.patch("/:id/pause", getJobByIdValidation, JobController.pauseJob);

/**
 * PATCH /jobs/:id/reactivate
 * Reativar vaga pausada (voltar para ACTIVE)
 */
router.patch("/:id/reactivate", getJobByIdValidation, JobController.reactivateJob);

/**
 * PATCH /jobs/:id/close
 * Fechar vaga
 */
router.patch("/:id/close", getJobByIdValidation, JobController.closeJob);

export default router;

