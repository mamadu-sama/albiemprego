// Validadores para rotas de candidato
import { body } from "express-validator";

export const updateCandidateProfileValidation = [
  body("skills")
    .optional()
    .isArray()
    .withMessage("Skills deve ser um array"),

  body("experienceYears")
    .optional()
    .isInt({ min: 0, max: 70 })
    .withMessage("Anos de experiência inválidos"),

  body("currentPosition")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Posição atual deve ter no máximo 200 caracteres"),
];

export const createExperienceValidation = [
  body("company")
    .trim()
    .notEmpty()
    .withMessage("Nome da empresa é obrigatório")
    .isLength({ max: 200 })
    .withMessage("Nome da empresa deve ter no máximo 200 caracteres"),

  body("position")
    .trim()
    .notEmpty()
    .withMessage("Cargo é obrigatório")
    .isLength({ max: 200 })
    .withMessage("Cargo deve ter no máximo 200 caracteres"),

  body("startDate")
    .notEmpty()
    .withMessage("Data de início é obrigatória")
    .isISO8601()
    .withMessage("Data de início inválida"),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("Data de fim inválida"),

  body("current")
    .isBoolean()
    .withMessage("Campo 'current' deve ser booleano"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Descrição deve ter no máximo 1000 caracteres"),
];

export const updateExperienceValidation = [
  body("company")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Nome da empresa deve ter no máximo 200 caracteres"),

  body("position")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Cargo deve ter no máximo 200 caracteres"),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Data de início inválida"),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("Data de fim inválida"),

  body("current")
    .optional()
    .isBoolean()
    .withMessage("Campo 'current' deve ser booleano"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Descrição deve ter no máximo 1000 caracteres"),
];

export const createEducationValidation = [
  body("institution")
    .trim()
    .notEmpty()
    .withMessage("Nome da instituição é obrigatório")
    .isLength({ max: 200 })
    .withMessage("Nome da instituição deve ter no máximo 200 caracteres"),

  body("degree")
    .trim()
    .notEmpty()
    .withMessage("Grau é obrigatório")
    .isLength({ max: 200 })
    .withMessage("Grau deve ter no máximo 200 caracteres"),

  body("field")
    .trim()
    .notEmpty()
    .withMessage("Área de estudo é obrigatória")
    .isLength({ max: 200 })
    .withMessage("Área de estudo deve ter no máximo 200 caracteres"),

  body("startDate")
    .notEmpty()
    .withMessage("Data de início é obrigatória")
    .isISO8601()
    .withMessage("Data de início inválida"),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("Data de fim inválida"),

  body("current")
    .isBoolean()
    .withMessage("Campo 'current' deve ser booleano"),
];

export const updateEducationValidation = [
  body("institution")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Nome da instituição deve ter no máximo 200 caracteres"),

  body("degree")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Grau deve ter no máximo 200 caracteres"),

  body("field")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Área de estudo deve ter no máximo 200 caracteres"),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Data de início inválida"),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("Data de fim inválida"),

  body("current")
    .optional()
    .isBoolean()
    .withMessage("Campo 'current' deve ser booleano"),
];

export const createLanguageValidation = [
  body("language")
    .trim()
    .notEmpty()
    .withMessage("Nome do idioma é obrigatório")
    .isLength({ max: 100 })
    .withMessage("Nome do idioma deve ter no máximo 100 caracteres"),

  body("level")
    .notEmpty()
    .withMessage("Nível é obrigatório")
    .isIn(["BASIC", "INTERMEDIATE", "ADVANCED", "NATIVE"])
    .withMessage("Nível inválido. Valores aceites: BASIC, INTERMEDIATE, ADVANCED, NATIVE"),
];

export const updateLanguageValidation = [
  body("level")
    .notEmpty()
    .withMessage("Nível é obrigatório")
    .isIn(["BASIC", "INTERMEDIATE", "ADVANCED", "NATIVE"])
    .withMessage("Nível inválido. Valores aceites: BASIC, INTERMEDIATE, ADVANCED, NATIVE"),
];

