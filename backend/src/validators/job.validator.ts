// Validadores para rotas de vagas
import { body, param, query } from "express-validator";

// Validação para criar vaga
export const createJobValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Título é obrigatório")
    .isLength({ min: 5, max: 200 })
    .withMessage("Título deve ter entre 5 e 200 caracteres"),

  body("department")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Departamento deve ter no máximo 100 caracteres"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Descrição é obrigatória")
    .isLength({ min: 50 })
    .withMessage("Descrição deve ter no mínimo 50 caracteres"),

  body("requirements")
    .isArray({ min: 1 })
    .withMessage("Adicione pelo menos um requisito"),

  body("responsibilities")
    .optional()
    .isArray()
    .withMessage("Responsabilidades deve ser um array"),

  body("benefits")
    .optional()
    .isArray()
    .withMessage("Benefícios deve ser um array"),

  body("skills")
    .optional()
    .isArray()
    .withMessage("Competências deve ser um array"),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Localização é obrigatória"),

  body("address")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Morada deve ter no máximo 500 caracteres"),

  body("type")
    .notEmpty()
    .withMessage("Tipo de contrato é obrigatório")
    .isIn(["FULL_TIME", "PART_TIME", "TEMPORARY", "INTERNSHIP", "FREELANCE"])
    .withMessage("Tipo de contrato inválido"),

  body("workMode")
    .notEmpty()
    .withMessage("Modalidade de trabalho é obrigatória")
    .isIn(["PRESENCIAL", "REMOTO", "HIBRIDO"])
    .withMessage("Modalidade de trabalho inválida"),

  body("salaryMin")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Salário mínimo deve ser um número positivo"),

  body("salaryMax")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Salário máximo deve ser um número positivo")
    .custom((value, { req }) => {
      if (req.body.salaryMin && value < req.body.salaryMin) {
        throw new Error("Salário máximo deve ser maior que o mínimo");
      }
      return true;
    }),

  body("salaryCurrency")
    .optional()
    .isIn(["EUR", "USD", "GBP"])
    .withMessage("Moeda inválida"),

  body("salaryPeriod")
    .optional()
    .isIn(["hour", "month", "year"])
    .withMessage("Período salarial inválido"),

  body("showSalary")
    .optional()
    .isBoolean()
    .withMessage("showSalary deve ser booleano"),

  body("sector")
    .trim()
    .notEmpty()
    .withMessage("Sector é obrigatório"),

  body("experienceLevel")
    .optional()
    .trim()
    .isIn(["entry", "junior", "mid", "senior"])
    .withMessage("Nível de experiência inválido"),

  body("applicationDeadline")
    .optional()
    .isISO8601()
    .withMessage("Data de prazo inválida"),
];

// Validação para atualizar vaga
export const updateJobValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("ID da vaga é obrigatório")
    .isUUID()
    .withMessage("ID da vaga inválido"),

  body("title")
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Título deve ter entre 5 e 200 caracteres"),

  body("department")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Departamento deve ter no máximo 100 caracteres"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 50 })
    .withMessage("Descrição deve ter no mínimo 50 caracteres"),

  body("requirements")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Adicione pelo menos um requisito"),

  body("responsibilities")
    .optional()
    .isArray()
    .withMessage("Responsabilidades deve ser um array"),

  body("benefits")
    .optional()
    .isArray()
    .withMessage("Benefícios deve ser um array"),

  body("skills")
    .optional()
    .isArray()
    .withMessage("Competências deve ser um array"),

  body("location")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Localização não pode estar vazia"),

  body("address")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Morada deve ter no máximo 500 caracteres"),

  body("type")
    .optional()
    .isIn(["FULL_TIME", "PART_TIME", "TEMPORARY", "INTERNSHIP", "FREELANCE"])
    .withMessage("Tipo de contrato inválido"),

  body("workMode")
    .optional()
    .isIn(["PRESENCIAL", "REMOTO", "HIBRIDO"])
    .withMessage("Modalidade de trabalho inválida"),

  body("salaryMin")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Salário mínimo deve ser um número positivo"),

  body("salaryMax")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Salário máximo deve ser um número positivo"),

  body("experienceLevel")
    .optional()
    .trim()
    .isIn(["entry", "junior", "mid", "senior"])
    .withMessage("Nível de experiência inválido"),
];

// Validação para obter vaga por ID
export const getJobByIdValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("ID da vaga é obrigatório")
    .isUUID()
    .withMessage("ID da vaga inválido"),
];

// Validação para listar vagas (query params)
export const listJobsValidation = [
  query("search")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Busca deve ter no máximo 200 caracteres"),

  query("location")
    .optional()
    .trim(),

  query("type")
    .optional()
    .isIn(["FULL_TIME", "PART_TIME", "TEMPORARY", "INTERNSHIP", "FREELANCE"])
    .withMessage("Tipo de contrato inválido"),

  query("workMode")
    .optional()
    .isIn(["PRESENCIAL", "REMOTO", "HIBRIDO"])
    .withMessage("Modalidade de trabalho inválida"),

  query("experienceLevel")
    .optional()
    .isIn(["entry", "junior", "mid", "senior"])
    .withMessage("Nível de experiência inválido"),

  query("sector")
    .optional()
    .trim(),

  query("salaryMin")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Salário mínimo deve ser um número inteiro positivo"),

  query("salaryMax")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Salário máximo deve ser um número inteiro positivo"),

  query("companyId")
    .optional()
    .isUUID()
    .withMessage("ID da empresa inválido"),

  query("status")
    .optional()
    .isIn(["DRAFT", "PENDING", "ACTIVE", "PAUSED", "CLOSED", "REJECTED"])
    .withMessage("Status inválido"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Página deve ser um número inteiro positivo"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limite deve ser entre 1 e 100"),
];

