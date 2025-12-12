import { body } from "express-validator";

export const updateSettingsValidation = [
  body("siteName")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Nome do site deve ter entre 2 e 100 caracteres"),

  body("siteDescription")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("Descrição deve ter entre 10 e 500 caracteres"),

  body("contactEmail")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Email de contacto inválido"),

  body("supportEmail")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Email de suporte inválido"),

  body("requireCompanyApproval")
    .optional()
    .isBoolean()
    .withMessage("Aprovação de empresas deve ser booleano"),

  body("requireJobApproval")
    .optional()
    .isBoolean()
    .withMessage("Aprovação de vagas deve ser booleano"),

  body("allowGuestApplications")
    .optional()
    .isBoolean()
    .withMessage("Candidaturas de visitantes deve ser booleano"),

  body("enableNotifications")
    .optional()
    .isBoolean()
    .withMessage("Notificações deve ser booleano"),

  body("enableEmailAlerts")
    .optional()
    .isBoolean()
    .withMessage("Alertas por email deve ser booleano"),

  body("maxJobsPerCompany")
    .optional()
    .isInt({ min: 0, max: 1000 })
    .withMessage("Máximo de vagas por empresa deve ser entre 0 e 1000"),

  body("maxApplicationsPerCandidate")
    .optional()
    .isInt({ min: 0, max: 1000 })
    .withMessage("Máximo de candidaturas por candidato deve ser entre 0 e 1000"),

  body("jobExpirationDays")
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage("Expiração de vagas deve ser entre 1 e 365 dias"),
];

