// Validadores para busca de vagas
import { query } from "express-validator";
import { JobType, WorkMode } from "@prisma/client";

// Concelhos válidos da região de Castelo Branco
const VALID_MUNICIPALITIES = [
  "Todos os concelhos",
  "Castelo Branco",
  "Covilhã",
  "Fundão",
  "Idanha-a-Nova",
  "Penamacor",
  "Vila Velha de Ródão",
  "Oleiros",
  "Proença-a-Nova",
  "Sertã",
  "Vila de Rei",
  "Belmonte",
];

// Tipos de contrato válidos
const VALID_JOB_TYPES: JobType[] = [
  "FULL_TIME",
  "PART_TIME",
  "TEMPORARY",
  "INTERNSHIP",
  "FREELANCE",
];

// Modos de trabalho válidos
const VALID_WORK_MODES: WorkMode[] = ["PRESENCIAL", "REMOTO", "HIBRIDO"];

// Opções de ordenação válidas
const VALID_SORT_OPTIONS = [
  "recent",
  "salary-high",
  "salary-low",
  "relevance",
];

export const searchJobsValidation = [
  // Busca por texto
  query("search")
    .optional()
    .isString()
    .withMessage("Busca deve ser texto")
    .trim()
    .isLength({ max: 100 })
    .withMessage("Busca deve ter no máximo 100 caracteres")
    .escape(),

  // Localização
  query("location")
    .optional()
    .isString()
    .withMessage("Localização deve ser texto")
    .trim()
    .custom((value) => {
      if (!VALID_MUNICIPALITIES.includes(value)) {
        throw new Error("Concelho inválido");
      }
      return true;
    }),

  // Tipo de contrato (pode ser múltiplo)
  query("type")
    .optional()
    .custom((value) => {
      // Pode ser string única ou array
      const types = Array.isArray(value) ? value : [value];

      for (const type of types) {
        if (!VALID_JOB_TYPES.includes(type as JobType)) {
          throw new Error(`Tipo de contrato inválido: ${type}`);
        }
      }
      return true;
    }),

  // Modo de trabalho (pode ser múltiplo)
  query("workMode")
    .optional()
    .custom((value) => {
      const modes = Array.isArray(value) ? value : [value];

      for (const mode of modes) {
        if (!VALID_WORK_MODES.includes(mode as WorkMode)) {
          throw new Error(`Modo de trabalho inválido: ${mode}`);
        }
      }
      return true;
    }),

  // Salário mínimo
  query("salaryMin")
    .optional()
    .isInt({ min: 0, max: 10000 })
    .withMessage("Salário mínimo deve ser entre 0 e 10000")
    .toInt(),

  // Salário máximo
  query("salaryMax")
    .optional()
    .isInt({ min: 0, max: 10000 })
    .withMessage("Salário máximo deve ser entre 0 e 10000")
    .toInt()
    .custom((value, { req }) => {
      if (req.query.salaryMin && value < parseInt(req.query.salaryMin)) {
        throw new Error("Salário máximo deve ser maior que o mínimo");
      }
      return true;
    }),

  // Apenas com salário visível
  query("showSalaryOnly")
    .optional()
    .isBoolean()
    .withMessage("showSalaryOnly deve ser boolean")
    .toBoolean(),

  // Setor
  query("sector")
    .optional()
    .isString()
    .withMessage("Setor deve ser texto")
    .trim()
    .isLength({ max: 50 })
    .withMessage("Setor deve ter no máximo 50 caracteres")
    .escape(),

  // Nível de experiência
  query("experienceLevel")
    .optional()
    .isString()
    .withMessage("Nível de experiência deve ser texto")
    .trim()
    .isLength({ max: 50 })
    .withMessage("Nível de experiência deve ter no máximo 50 caracteres")
    .escape(),

  // Apenas boas matches (>70%)
  query("goodMatchesOnly")
    .optional()
    .isBoolean()
    .withMessage("goodMatchesOnly deve ser boolean")
    .toBoolean(),

  // Ordenação
  query("sortBy")
    .optional()
    .isString()
    .withMessage("sortBy deve ser texto")
    .trim()
    .isIn(VALID_SORT_OPTIONS)
    .withMessage(
      `sortBy deve ser um de: ${VALID_SORT_OPTIONS.join(", ")}`
    ),

  // Página
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Página deve ser número inteiro maior que 0")
    .toInt(),

  // Limite de resultados
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limite deve ser entre 1 e 50")
    .toInt(),
];

