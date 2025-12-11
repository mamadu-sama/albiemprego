// Validadores para rotas de modo de manutenção
import { body } from "express-validator";

export const updateMaintenanceValidation = [
  body("enabled")
    .optional({ nullable: true })
    .isBoolean()
    .withMessage("Enabled deve ser um valor booleano"),

  body("message")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Mensagem deve ter no máximo 500 caracteres"),

  body("estimatedEndTime")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage("Previsão de retorno deve ter no máximo 200 caracteres"),
];

