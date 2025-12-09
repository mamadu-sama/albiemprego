import { param } from "express-validator";

export const jobIdValidation = [
  param("jobId")
    .isUUID()
    .withMessage("ID da vaga inválido"),
];

