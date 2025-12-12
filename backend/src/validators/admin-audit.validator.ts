import { query } from "express-validator";

export const getAuditLogsValidation = [
  query("userId").optional().isUUID().withMessage("userId deve ser um UUID válido"),

  query("action").optional().isString().withMessage("action deve ser uma string"),

  query("entityType").optional().isString().withMessage("entityType deve ser uma string"),

  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("startDate deve ser uma data válida"),

  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("endDate deve ser uma data válida"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit deve ser entre 1 e 100"),

  query("offset")
    .optional()
    .isInt({ min: 0 })
    .withMessage("offset deve ser maior ou igual a 0"),
];

export const getAuditStatsValidation = [
  query("days")
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage("days deve ser entre 1 e 365"),
];

