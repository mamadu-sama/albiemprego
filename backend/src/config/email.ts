// Configuração do Nodemailer
import nodemailer from "nodemailer";
import { logger } from "./logger";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Verificar conexão SMTP
transporter
  .verify()
  .then(() => {
    logger.info("✓ Servidor SMTP pronto para enviar emails");
  })
  .catch((error) => {
    logger.error("✗ Erro ao conectar ao servidor SMTP:", error);
    logger.warn("⚠ Emails não serão enviados. Verifique as configurações SMTP no .env");
  });

export default transporter;

