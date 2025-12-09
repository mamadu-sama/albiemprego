// Service de envio de emails
import { User } from "@prisma/client";
import { transporter } from "../config/email";
import { logger } from "../config/logger";
import { AppError } from "../utils/errors";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  /**
   * Enviar email genérico
   */
  static async sendEmail({ to, subject, html, text }: SendEmailOptions) {
    try {
      const info = await transporter.sendMail({
        from: `"AlbiEmprego" <${process.env.EMAIL_FROM}>`,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ""), // Fallback para texto
      });

      logger.info(`Email enviado: ${info.messageId} para ${to}`);
      return info;
    } catch (error) {
      logger.error("Erro ao enviar email:", error);
      throw new AppError("Erro ao enviar email", 500, "EMAIL_SEND_ERROR");
    }
  }

  /**
   * Email de boas-vindas
   */
  static async sendWelcomeEmail(user: User) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9fafb; }
            .button { display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Bem-vindo ao AlbiEmprego!</h1>
            </div>
            <div class="content">
              <p>Olá <strong>${user.name}</strong>,</p>
              <p>A sua conta foi criada com sucesso na plataforma AlbiEmprego!</p>
              ${
                user.type === "EMPRESA"
                  ? `<p><strong>Nota:</strong> A sua conta de empresa está pendente de aprovação pela nossa equipa. Receberá um email assim que for aprovada.</p>`
                  : `<p>Comece já a explorar oportunidades de emprego na região de Castelo Branco!</p>`
              }
              <center>
                <a href="${process.env.FRONTEND_URL}" class="button">Aceder à Plataforma</a>
              </center>
              <p>Se tiver alguma dúvida, não hesite em contactar-nos.</p>
              <p>Bem-vindo a bordo!</p>
            </div>
            <div class="footer">
              <p>© 2024 AlbiEmprego - Plataforma Regional de Emprego</p>
              <p>Este email foi enviado automaticamente. Por favor não responda.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: user.email,
      subject: "Bem-vindo ao AlbiEmprego!",
      html,
    });
  }

  /**
   * Email de reset de password
   */
  static async sendPasswordResetEmail(user: User, token: string) {
    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9fafb; }
            .button { display: inline-block; padding: 12px 24px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
            .warning { background-color: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Redefinir Password</h1>
            </div>
            <div class="content">
              <p>Olá <strong>${user.name}</strong>,</p>
              <p>Recebemos um pedido para redefinir a password da sua conta no AlbiEmprego.</p>
              <p>Clique no botão abaixo para criar uma nova password:</p>
              <center>
                <a href="${resetUrl}" class="button">Redefinir Password</a>
              </center>
              <p>Ou copie e cole este link no seu navegador:</p>
              <p style="word-break: break-all; background-color: #e5e7eb; padding: 10px; border-radius: 5px;">
                ${resetUrl}
              </p>
              <div class="warning">
                <strong>⚠️ Importante:</strong>
                <ul>
                  <li>Este link expira em <strong>1 hora</strong></li>
                  <li>Se não solicitou esta alteração, ignore este email</li>
                  <li>A sua password atual permanece válida até criar uma nova</li>
                </ul>
              </div>
            </div>
            <div class="footer">
              <p>© 2024 AlbiEmprego - Plataforma Regional de Emprego</p>
              <p>Este email foi enviado automaticamente. Por favor não responda.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: user.email,
      subject: "Redefinir Password - AlbiEmprego",
      html,
    });
  }
}

