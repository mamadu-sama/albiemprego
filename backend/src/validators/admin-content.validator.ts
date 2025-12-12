import { body, param } from "express-validator";

export const slugParamValidation = [
  param("slug")
    .isString()
    .trim()
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-z0-9-]+$/)
    .withMessage("Slug inválido (apenas letras minúsculas, números e hífens)"),
];

export const updateContentValidation = [
  ...slugParamValidation,

  body("title")
    .isString()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Título deve ter entre 3 e 200 caracteres"),

  body("content")
    .isString()
    .trim()
    .isLength({ min: 10 })
    .withMessage("Conteúdo deve ter no mínimo 10 caracteres"),
];

