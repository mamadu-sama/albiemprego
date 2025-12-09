// Rotas de gestão de perfil de candidato
import { Router } from "express";
import { CandidateController } from "../controllers/candidate.controller";
import { authenticateToken, authorize } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";
import {
  updateCandidateProfileValidation,
  createExperienceValidation,
  updateExperienceValidation,
  createEducationValidation,
  updateEducationValidation,
  createLanguageValidation,
  updateLanguageValidation,
} from "../validators/candidate.validator";

const router = Router();

// Todas as rotas requerem autenticação e ser candidato
router.use(authenticateToken);
router.use(authorize("CANDIDATO"));

// ==========================================
// PERFIL
// ==========================================

// GET /candidates/me - Obter perfil completo
router.get("/me", CandidateController.getProfile);

// GET /candidates/me/completeness - Obter completude do perfil
router.get("/me/completeness", CandidateController.getProfileCompleteness);

// PATCH /candidates/me - Atualizar perfil
router.patch(
  "/me",
  updateCandidateProfileValidation,
  CandidateController.updateProfile
);

// POST /candidates/me/cv - Upload de CV
router.post(
  "/me/cv",
  upload.single("cv"),
  CandidateController.uploadCV
);

// ==========================================
// EXPERIÊNCIAS
// ==========================================

// POST /candidates/me/experiences - Adicionar experiência
router.post(
  "/me/experiences",
  createExperienceValidation,
  CandidateController.createExperience
);

// PATCH /candidates/me/experiences/:id - Atualizar experiência
router.patch(
  "/me/experiences/:id",
  updateExperienceValidation,
  CandidateController.updateExperience
);

// DELETE /candidates/me/experiences/:id - Remover experiência
router.delete(
  "/me/experiences/:id",
  CandidateController.deleteExperience
);

// ==========================================
// EDUCAÇÃO
// ==========================================

// POST /candidates/me/education - Adicionar educação
router.post(
  "/me/education",
  createEducationValidation,
  CandidateController.createEducation
);

// PATCH /candidates/me/education/:id - Atualizar educação
router.patch(
  "/me/education/:id",
  updateEducationValidation,
  CandidateController.updateEducation
);

// DELETE /candidates/me/education/:id - Remover educação
router.delete(
  "/me/education/:id",
  CandidateController.deleteEducation
);

// ==========================================
// IDIOMAS
// ==========================================

// POST /candidates/me/languages - Adicionar idioma
router.post(
  "/me/languages",
  createLanguageValidation,
  CandidateController.createLanguage
);

// PATCH /candidates/me/languages/:id - Atualizar idioma
router.patch(
  "/me/languages/:id",
  updateLanguageValidation,
  CandidateController.updateLanguage
);

// DELETE /candidates/me/languages/:id - Remover idioma
router.delete(
  "/me/languages/:id",
  CandidateController.deleteLanguage
);

export default router;

