// Validadores para rotas de modo de manutenção
import { body } from "express-validator";

export const updateMaintenanceValidation = [
  body("enabled")
    .optional()
    .isBoolean()
    .withMessage("Enabled deve ser um valor booleano"),

  body("message")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Mensagem deve ter no máximo 500 caracteres"),

  body("estimatedEndTime")
    .optional()
    .custom((value) => {
      if (value === null) return true;
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .withMessage("Tempo estimado deve ser uma data válida ou null"),
];

