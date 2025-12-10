import { body } from "express-validator";

export const requestPlanValidation = [
  body("planId")
    .trim()
    .notEmpty()
    .withMessage("ID do plano é obrigatório")
    .isUUID()
    .withMessage("ID do plano inválido"),
  body("message")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Mensagem não pode exceder 500 caracteres"),
];

export const requestCreditsValidation = [
  body("packageId")
    .trim()
    .notEmpty()
    .withMessage("ID do pacote é obrigatório")
    .isUUID()
    .withMessage("ID do pacote inválido"),
  body("message")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Mensagem não pode exceder 500 caracteres"),
];

export const reviewRequestValidation = [
  body("adminNotes")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Notas não podem exceder 1000 caracteres"),
];

