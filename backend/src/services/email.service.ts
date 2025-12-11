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

  /**
   * Email de conta suspensa
   */
  static async sendAccountSuspendedEmail(user: User) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9fafb; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
            .warning { background-color: #fee2e2; padding: 15px; border-left: 4px solid #dc2626; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Conta Suspensa</h1>
            </div>
            <div class="content">
              <p>Olá <strong>${user.name}</strong>,</p>
              <div class="warning">
                <p>A sua conta no AlbiEmprego foi <strong>suspensa</strong> temporariamente.</p>
              </div>
              <p>Durante este período, não poderá aceder à plataforma.</p>
              <p>Se acredita que isto é um erro ou deseja esclarecer a situação, por favor contacte-nos:</p>
              <ul>
                <li>Email: <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a></li>
                <li>Referência da conta: ${user.id}</li>
              </ul>
            </div>
            <div class="footer">
              <p>© 2024 AlbiEmprego - Plataforma Regional de Emprego</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: user.email,
      subject: "Conta Suspensa - AlbiEmprego",
      html,
    });
  }

  /**
   * Email de conta ativada
   */
  static async sendAccountActivatedEmail(user: User) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #16a34a; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9fafb; }
            .button { display: inline-block; padding: 12px 24px; background-color: #16a34a; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Conta Ativada</h1>
            </div>
            <div class="content">
              <p>Olá <strong>${user.name}</strong>,</p>
              <p>Boas notícias! A sua conta no AlbiEmprego foi <strong>ativada</strong>.</p>
              <p>Pode agora aceder normalmente à plataforma.</p>
              <center>
                <a href="${process.env.FRONTEND_URL}" class="button">Aceder à Plataforma</a>
              </center>
              <p>Bem-vindo de volta!</p>
            </div>
            <div class="footer">
              <p>© 2024 AlbiEmprego - Plataforma Regional de Emprego</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: user.email,
      subject: "Conta Ativada - AlbiEmprego",
      html,
    });
  }

  /**
   * Email de empresa aprovada
   */
  static async sendCompanyApprovedEmail(company: any) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #16a34a; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9fafb; }
            .button { display: inline-block; padding: 12px 24px; background-color: #16a34a; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
            .success-box { background-color: #d1fae5; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Empresa Aprovada!</h1>
            </div>
            <div class="content">
              <p>Olá <strong>${company.name}</strong>,</p>
              <div class="success-box">
                <p><strong>Boas notícias!</strong> A sua empresa foi aprovada no AlbiEmprego.</p>
              </div>
              <p>Pode agora publicar vagas e começar a procurar os melhores talentos da região de Castelo Branco!</p>
              <center>
                <a href="${process.env.FRONTEND_URL}/empresa/dashboard" class="button">Aceder ao Dashboard</a>
              </center>
              <p>Se tiver alguma dúvida, a nossa equipa está disponível para ajudar.</p>
              <p>Bem-vindo à plataforma AlbiEmprego!</p>
            </div>
            <div class="footer">
              <p>© 2024 AlbiEmprego - Plataforma Regional de Emprego</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: company.user.email,
      subject: "Empresa Aprovada - AlbiEmprego",
      html,
    });
  }

  /**
   * Email de notificação
   */
  static async sendNotificationEmail(
    user: { email: string; name: string },
    title: string,
    message: string,
    actionUrl?: string
  ) {
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
            .message { background-color: white; padding: 20px; border-radius: 5px; border-left: 4px solid #2563eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${title}</h1>
            </div>
            <div class="content">
              <p>Olá <strong>${user.name}</strong>,</p>
              <div class="message">
                ${message.replace(/\n/g, "<br>")}
              </div>
              ${
                actionUrl
                  ? `<center>
                      <a href="${actionUrl}" class="button">Ver Mais</a>
                    </center>`
                  : ""
              }
            </div>
            <div class="footer">
              <p>© 2024 AlbiEmprego - Plataforma Regional de Emprego</p>
              <p>Esta é uma notificação automática da plataforma.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: user.email,
      subject: `AlbiEmprego - ${title}`,
      html,
    });
  }

  /**
   * Email personalizado de administrador
   */
  static async sendAdminEmail(user: User, subject: string, message: string) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9fafb; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
            .message { background-color: white; padding: 20px; border-radius: 5px; border-left: 4px solid #2563eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Mensagem do AlbiEmprego</h1>
            </div>
            <div class="content">
              <p>Olá <strong>${user.name}</strong>,</p>
              <div class="message">
                ${message.replace(/\n/g, "<br>")}
              </div>
              <p>Se tiver alguma dúvida, pode responder a este email ou contactar-nos em: <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a></p>
            </div>
            <div class="footer">
              <p>© 2024 AlbiEmprego - Plataforma Regional de Emprego</p>
              <p>Este email foi enviado pela administração da plataforma.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: user.email,
      subject: `AlbiEmprego - ${subject}`,
      html,
    });
  }
}

