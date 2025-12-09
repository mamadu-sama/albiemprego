// Validadores para rotas de autenticação
import { body } from "express-validator";

export const registerValidation = [
  body("email")
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail()
    .trim(),
  
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password deve ter no mínimo 8 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password deve conter maiúsculas, minúsculas e números"),
  
  body("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Nome deve ter no mínimo 2 caracteres")
    .isLength({ max: 100 })
    .withMessage("Nome deve ter no máximo 100 caracteres"),
  
  body("type")
    .isIn(["candidato", "empresa"])
    .withMessage("Tipo deve ser 'candidato' ou 'empresa'"),
  
  // Validações específicas para empresa
  body("companyName")
    .if(body("type").equals("empresa"))
    .trim()
    .notEmpty()
    .withMessage("Nome da empresa é obrigatório")
    .isLength({ max: 200 })
    .withMessage("Nome da empresa deve ter no máximo 200 caracteres"),
  
  body("nif")
    .if(body("type").equals("empresa"))
    .trim()
    .notEmpty()
    .withMessage("NIF é obrigatório")
    .matches(/^\d{9}$/)
    .withMessage("NIF deve ter 9 dígitos"),
  
  body("phone")
    .optional()
    .trim()
    .matches(/^(\+351)?[29]\d{8}$/)
    .withMessage("Telefone inválido"),
];

export const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail()
    .trim(),
  
  body("password")
    .notEmpty()
    .withMessage("Password é obrigatória"),
];

export const forgotPasswordValidation = [
  body("email")
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail()
    .trim(),
];

export const resetPasswordValidation = [
  body("token")
    .notEmpty()
    .withMessage("Token é obrigatório"),
  
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password deve ter no mínimo 8 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password deve conter maiúsculas, minúsculas e números"),
];

export const refreshTokenValidation = [
  body("refreshToken")
    .notEmpty()
    .withMessage("Refresh token é obrigatório"),
];

