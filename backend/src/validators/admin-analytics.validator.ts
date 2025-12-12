import { query } from "express-validator";

export const daysQueryValidation = [
  query("days")
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage("days deve ser entre 1 e 365"),
];

