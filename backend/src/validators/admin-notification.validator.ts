// Validadores para rotas de notificações admin
import { body } from "express-validator";

export const sendNotificationValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Título é obrigatório")
    .isLength({ max: 200 })
    .withMessage("Título deve ter no máximo 200 caracteres"),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Mensagem é obrigatória")
    .isLength({ max: 1000 })
    .withMessage("Mensagem deve ter no máximo 1000 caracteres"),

  body("type")
    .isIn(["INFO", "SUCCESS", "WARNING", "ANNOUNCEMENT", "PROMOTION", "SYSTEM", "MAINTENANCE"])
    .withMessage("Tipo de notificação inválido"),

  body("recipients")
    .isIn(["all", "candidates", "companies"])
    .withMessage("Destinatários devem ser 'all', 'candidates' ou 'companies'"),

  body("sendEmail")
    .optional()
    .isBoolean()
    .withMessage("SendEmail deve ser um valor booleano"),

  body("actionUrl")
    .optional()
    .trim()
    .isURL()
    .withMessage("URL de ação inválida"),

  body("actionLabel")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Label de ação deve ter no máximo 50 caracteres"),
];

export const deleteNotificationsBulkValidation = [
  body("title").optional().trim(),
  body("message").optional().trim(),
  body("type")
    .optional()
    .isIn(["INFO", "SUCCESS", "WARNING", "ANNOUNCEMENT", "PROMOTION", "SYSTEM", "MAINTENANCE"])
    .withMessage("Tipo de notificação inválido"),
  body("createdBefore")
    .optional()
    .isISO8601()
    .withMessage("Data deve estar no formato ISO8601"),
];

