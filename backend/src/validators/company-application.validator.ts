import { body, param, query } from "express-validator";

export const updateStatusValidation = [
  param("applicationId")
    .trim()
    .notEmpty()
    .withMessage("ID da candidatura é obrigatório")
    .isUUID()
    .withMessage("ID da candidatura inválido"),
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status é obrigatório")
    .isIn(["NEW", "VIEWED", "IN_REVIEW", "INTERVIEW", "REJECTED", "ACCEPTED"])
    .withMessage("Status inválido"),
  body("note")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Nota não pode exceder 500 caracteres"),
];

export const updateNotesValidation = [
  param("applicationId")
    .trim()
    .notEmpty()
    .withMessage("ID da candidatura é obrigatório")
    .isUUID()
    .withMessage("ID da candidatura inválido"),
  body("internalNotes")
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Notas não podem exceder 2000 caracteres"),
];

export const applicationIdValidation = [
  param("applicationId")
    .trim()
    .notEmpty()
    .withMessage("ID da candidatura é obrigatório")
    .isUUID()
    .withMessage("ID da candidatura inválido"),
];

export const companyApplicationsQueryValidation = [
  query("jobId")
    .optional()
    .trim()
    .isUUID()
    .withMessage("ID da vaga inválido"),
  query("status")
    .optional()
    .trim()
    .isIn(["NEW", "VIEWED", "IN_REVIEW", "INTERVIEW", "REJECTED", "ACCEPTED"])
    .withMessage("Status inválido"),
];

