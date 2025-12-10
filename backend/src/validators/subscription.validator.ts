// Validators para endpoints de assinaturas e créditos
import { body, param } from "express-validator";

/**
 * Validação para criar plano
 */
export const createPlanValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Nome do plano é obrigatório")
    .isLength({ max: 100 })
    .withMessage("Nome não pode ter mais de 100 caracteres"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Descrição não pode ter mais de 500 caracteres"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Preço deve ser um número positivo"),
  body("maxJobs")
    .isInt({ min: -1 })
    .withMessage("maxJobs deve ser -1 (ilimitado) ou número positivo"),
  body("featuredCreditsMonthly")
    .isInt({ min: 0 })
    .withMessage("Créditos Featured devem ser um número positivo"),
  body("homepageCreditsMonthly")
    .isInt({ min: 0 })
    .withMessage("Créditos Homepage devem ser um número positivo"),
  body("urgentCreditsMonthly")
    .isInt({ min: 0 })
    .withMessage("Créditos Urgente devem ser um número positivo"),
  body("creditDuration")
    .optional()
    .isIn(["DAYS_7", "DAYS_14", "DAYS_30"])
    .withMessage("Duração deve ser DAYS_7, DAYS_14 ou DAYS_30"),
  body("features")
    .isArray()
    .withMessage("Features deve ser um array")
    .notEmpty()
    .withMessage("Deve ter pelo menos 1 feature"),
  body("isPopular")
    .optional()
    .isBoolean()
    .withMessage("isPopular deve ser boolean"),
  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("displayOrder deve ser um número positivo"),
];

/**
 * Validação para atualizar plano
 */
export const updatePlanValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Nome não pode estar vazio")
    .isLength({ max: 100 })
    .withMessage("Nome não pode ter mais de 100 caracteres"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Descrição não pode ter mais de 500 caracteres"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Preço deve ser um número positivo"),
  body("maxJobs")
    .optional()
    .isInt({ min: -1 })
    .withMessage("maxJobs deve ser -1 (ilimitado) ou número positivo"),
  body("featuredCreditsMonthly")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Créditos Featured devem ser um número positivo"),
  body("homepageCreditsMonthly")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Créditos Homepage devem ser um número positivo"),
  body("urgentCreditsMonthly")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Créditos Urgente devem ser um número positivo"),
  body("creditDuration")
    .optional()
    .isIn(["DAYS_7", "DAYS_14", "DAYS_30"])
    .withMessage("Duração deve ser DAYS_7, DAYS_14 ou DAYS_30"),
  body("features")
    .optional()
    .isArray()
    .withMessage("Features deve ser um array"),
  body("isPopular")
    .optional()
    .isBoolean()
    .withMessage("isPopular deve ser boolean"),
  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("displayOrder deve ser um número positivo"),
];

/**
 * Validação para criar pacote de créditos
 */
export const createPackageValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Nome do pacote é obrigatório")
    .isLength({ max: 100 })
    .withMessage("Nome não pode ter mais de 100 caracteres"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Descrição é obrigatória")
    .isLength({ max: 500 })
    .withMessage("Descrição não pode ter mais de 500 caracteres"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Preço deve ser um número positivo"),
  body("featuredCredits")
    .isInt({ min: 0 })
    .withMessage("Créditos Featured devem ser um número positivo"),
  body("homepageCredits")
    .isInt({ min: 0 })
    .withMessage("Créditos Homepage devem ser um número positivo"),
  body("urgentCredits")
    .isInt({ min: 0 })
    .withMessage("Créditos Urgente devem ser um número positivo"),
  body("creditDuration")
    .optional()
    .isIn(["DAYS_7", "DAYS_14", "DAYS_30"])
    .withMessage("Duração deve ser DAYS_7, DAYS_14 ou DAYS_30"),
  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("displayOrder deve ser um número positivo"),
];

/**
 * Validação para atualizar pacote de créditos
 */
export const updatePackageValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Nome não pode estar vazio")
    .isLength({ max: 100 })
    .withMessage("Nome não pode ter mais de 100 caracteres"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Descrição não pode estar vazia")
    .isLength({ max: 500 })
    .withMessage("Descrição não pode ter mais de 500 caracteres"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Preço deve ser um número positivo"),
  body("featuredCredits")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Créditos Featured devem ser um número positivo"),
  body("homepageCredits")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Créditos Homepage devem ser um número positivo"),
  body("urgentCredits")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Créditos Urgente devem ser um número positivo"),
  body("creditDuration")
    .optional()
    .isIn(["DAYS_7", "DAYS_14", "DAYS_30"])
    .withMessage("Duração deve ser DAYS_7, DAYS_14 ou DAYS_30"),
  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("displayOrder deve ser um número positivo"),
];

/**
 * Validação para atribuir plano
 */
export const assignPlanValidation = [
  param("companyId")
    .isUUID()
    .withMessage("ID da empresa inválido"),
  body("planId")
    .isUUID()
    .withMessage("ID do plano inválido"),
];

/**
 * Validação para adicionar créditos manualmente
 */
export const addCreditsValidation = [
  param("companyId")
    .isUUID()
    .withMessage("ID da empresa inválido"),
  body("featured")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Créditos Featured devem ser um número positivo"),
  body("homepage")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Créditos Homepage devem ser um número positivo"),
  body("urgent")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Créditos Urgente devem ser um número positivo"),
  body("duration")
    .isIn(["DAYS_7", "DAYS_14", "DAYS_30"])
    .withMessage("Duração deve ser DAYS_7, DAYS_14 ou DAYS_30"),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notas não podem ter mais de 500 caracteres"),
];

/**
 * Validação para aplicar crédito numa vaga
 */
export const applyCreditValidation = [
  param("id")
    .isUUID()
    .withMessage("ID da vaga inválido"),
  body("creditType")
    .isIn(["FEATURED", "HOMEPAGE", "URGENT"])
    .withMessage("Tipo de crédito deve ser FEATURED, HOMEPAGE ou URGENT"),
];

