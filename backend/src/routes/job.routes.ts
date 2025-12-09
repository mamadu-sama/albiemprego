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

const router = Router();

/**
 * Rotas públicas (sem autenticação obrigatória)
 */

/**
 * GET /jobs
 * Listar vagas públicas com filtros e paginação
 */
router.get("/", listJobsValidation, JobController.listJobs);

/**
 * GET /jobs/:id
 * Obter detalhes de uma vaga específica
 * Autenticação opcional para tracking de visualizações
 */
router.get("/:id", optionalAuth, getJobByIdValidation, JobController.getJob);

/**
 * Rotas protegidas - Requerem autenticação como EMPRESA
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
 * PATCH /jobs/:id/close
 * Fechar vaga
 */
router.patch("/:id/close", getJobByIdValidation, JobController.closeJob);

export default router;

