// Validadores para rotas de administração de vagas
import { body } from "express-validator";

export const updateJobStatusValidation = [
  body("status")
    .isIn(["DRAFT", "PENDING", "ACTIVE", "PAUSED", "CLOSED", "REJECTED"])
    .withMessage(
      "Status deve ser DRAFT, PENDING, ACTIVE, PAUSED, CLOSED ou REJECTED"
    ),

  body("rejectionReason")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Motivo de rejeição deve ter no máximo 500 caracteres"),
];

