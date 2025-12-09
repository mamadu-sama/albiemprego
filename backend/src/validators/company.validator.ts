// Validadores para rotas de empresa
import { body, param } from "express-validator";

// Validação para atualizar perfil da empresa
export const updateCompanyProfileValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Nome da empresa deve ter no mínimo 2 caracteres")
    .isLength({ max: 200 })
    .withMessage("Nome da empresa deve ter no máximo 200 caracteres"),

  body("website")
    .optional()
    .trim()
    .isURL()
    .withMessage("Website inválido (use formato: https://exemplo.com)"),

  body("sector")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Sector deve ter no mínimo 2 caracteres")
    .isLength({ max: 100 })
    .withMessage("Sector deve ter no máximo 100 caracteres"),

  body("employees")
    .optional()
    .trim()
    .isIn([
      "1-10",
      "11-50",
      "51-200",
      "201-500",
      "501-1000",
      "1000+",
    ])
    .withMessage("Número de funcionários inválido"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Descrição deve ter no máximo 2000 caracteres"),
];

// Validação para obter perfil público
export const getPublicCompanyProfileValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("ID da empresa é obrigatório")
    .isUUID()
    .withMessage("ID da empresa inválido"),
];

