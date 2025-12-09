// Validadores para rotas de utilizador
import { body } from "express-validator";

export const updateProfileValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Nome deve ter no mínimo 2 caracteres")
    .isLength({ max: 100 })
    .withMessage("Nome deve ter no máximo 100 caracteres"),

  body("phone")
    .optional()
    .trim()
    .matches(/^(\+351)?[29]\d{8}$/)
    .withMessage("Telefone inválido (formato: +351912345678 ou 912345678)"),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Localização deve ter no máximo 200 caracteres"),

  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio deve ter no máximo 500 caracteres"),
];

// Validação para atualizar email
export const updateEmailValidation = [
  body("newEmail")
    .trim()
    .notEmpty()
    .withMessage("Email é obrigatório")
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail(),

  body("currentPassword")
    .notEmpty()
    .withMessage("Password atual é obrigatória"),
];

// Validação para alterar password
export const changePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Password atual é obrigatória"),

  body("newPassword")
    .notEmpty()
    .withMessage("Nova password é obrigatória")
    .isLength({ min: 8 })
    .withMessage("A password deve ter no mínimo 8 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password deve conter maiúsculas, minúsculas e números"),
];

// Validação para eliminar conta
export const deleteAccountValidation = [
  body("password").notEmpty().withMessage("Password é obrigatória"),
];

