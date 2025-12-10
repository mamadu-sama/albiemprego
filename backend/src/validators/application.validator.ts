import { body, param } from "express-validator";

export const applyValidation = [
  param("jobId")
    .trim()
    .notEmpty()
    .withMessage("ID da vaga é obrigatório")
    .isUUID()
    .withMessage("ID da vaga inválido"),
  body("coverLetter")
    .optional()
    .trim()
    .isLength({ min: 50, max: 2000 })
    .withMessage("Carta de apresentação deve ter entre 50 e 2000 caracteres"),
  body("portfolio")
    .optional()
    .trim()
    .isURL()
    .withMessage("Portfolio deve ser um URL válido"),
  body("availability")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Disponibilidade não pode exceder 200 caracteres"),
  body("expectedSalary")
    .optional()
    .isNumeric()
    .withMessage("Pretensão salarial deve ser um número"),
];

export const jobIdValidation = [
  param("jobId")
    .trim()
    .notEmpty()
    .withMessage("ID da vaga é obrigatório")
    .isUUID()
    .withMessage("ID da vaga inválido"),
];

export const applicationIdValidation = [
  param("applicationId")
    .trim()
    .notEmpty()
    .withMessage("ID da candidatura é obrigatório")
    .isUUID()
    .withMessage("ID da candidatura inválido"),
];

