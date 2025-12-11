// Validadores para rotas de administração de empresas
import { body } from "express-validator";

export const updateCompanyStatusValidation = [
  body("status")
    .isIn(["ACTIVE", "PENDING", "SUSPENDED"])
    .withMessage("Status deve ser ACTIVE, PENDING ou SUSPENDED"),

  body("rejectionReason")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Motivo de rejeição deve ter no máximo 500 caracteres"),
];

export const sendCompanyEmailValidation = [
  body("subject")
    .trim()
    .notEmpty()
    .withMessage("Assunto é obrigatório")
    .isLength({ max: 200 })
    .withMessage("Assunto deve ter no máximo 200 caracteres"),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Mensagem é obrigatória")
    .isLength({ max: 5000 })
    .withMessage("Mensagem deve ter no máximo 5000 caracteres"),
];

