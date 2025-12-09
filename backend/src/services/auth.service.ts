// Service de autenticação
import { UserType } from "@prisma/client";
import { prisma } from "../config/database";
import { hashPassword, comparePassword } from "../utils/password";
import { generateTokens } from "../utils/jwt";
import { ConflictError, UnauthorizedError } from "../utils/errors";
import crypto from "crypto";
import { EmailService } from "./email.service";
import { logger } from "../config/logger";

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
  type: "candidato" | "empresa";
  companyName?: string;
  nif?: string;
  phone?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export class AuthService {
  /**
   * Registar novo utilizador
   */
  static async register(data: RegisterDTO) {
    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictError("Este email já está registado.", "EMAIL_EXISTS");
    }

    // Verificar NIF único para empresas
    if (data.type === "empresa" && data.nif) {
      const existingCompany = await prisma.company.findUnique({
        where: { nif: data.nif },
      });

      if (existingCompany) {
        throw new ConflictError("Este NIF já está registado.", "NIF_EXISTS");
      }
    }

    // Hash da password
    const hashedPassword = await hashPassword(data.password);

    // Gerar token de verificação de email
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    // Criar utilizador e perfil numa transação
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
          phone: data.phone,
          type: data.type.toUpperCase() as UserType,
          status: data.type === "empresa" ? "PENDING" : "ACTIVE",
          emailVerificationToken,
          emailVerificationExpires,
        },
      });

      // Criar perfil de candidato
      if (data.type === "candidato") {
        await tx.candidate.create({
          data: {
            userId: newUser.id,
            skills: [],
            profileCompleteness: 20, // Email e nome preenchidos
          },
        });
      }

      // Criar perfil de empresa
      if (data.type === "empresa") {
        await tx.company.create({
          data: {
            userId: newUser.id,
            name: data.companyName!,
            nif: data.nif!,
          },
        });
      }

      return newUser;
    });

    logger.info(`Novo utilizador registado: ${user.email} (${user.type})`);

    // Enviar email de boas-vindas (async, não bloqueia)
    EmailService.sendWelcomeEmail(user).catch((error) => {
      logger.error("Erro ao enviar email de boas-vindas:", error);
    });

    // Gerar tokens
    const tokens = generateTokens(user.id, user.type);

    // Remover password do retorno
    const { password, passwordResetToken, emailVerificationToken: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokens,
      message: user.type === "EMPRESA" 
        ? "Registo efetuado. A sua conta está pendente de aprovação."
        : "Registo efetuado com sucesso!",
    };
  }

  /**
   * Login de utilizador
   */
  static async login(data: LoginDTO) {
    // Buscar utilizador por email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: {
        candidate: true,
        company: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError("Email ou password incorretos.");
    }

    // Verificar password
    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Email ou password incorretos.");
    }

    // Verificar se conta está suspensa
    if (user.status === "SUSPENDED") {
      throw new UnauthorizedError("A sua conta foi suspensa. Contacte o suporte.");
    }

    // Atualizar lastLoginAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    logger.info(`Login efetuado: ${user.email} (${user.type})`);

    // Gerar tokens
    const tokens = generateTokens(user.id, user.type);

    // Remover password do retorno
    const { password, passwordResetToken, emailVerificationToken, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  /**
   * Solicitar reset de password
   */
  static async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Não revelar se email existe ou não (segurança)
    if (!user) {
      return {
        message: "Se o email existir, receberá instruções de recuperação.",
      };
    }

    // Gerar token de reset
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
      },
    });

    logger.info(`Reset de password solicitado: ${user.email}`);

    // Enviar email com token (async)
    EmailService.sendPasswordResetEmail(user, resetToken).catch((error) => {
      logger.error("Erro ao enviar email de reset:", error);
    });

    return {
      message: "Se o email existir, receberá instruções de recuperação.",
    };
  }

  /**
   * Reset de password com token
   */
  static async resetPassword(token: string, newPassword: string) {
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      throw new UnauthorizedError("Token inválido ou expirado.");
    }

    // Hash da nova password
    const hashedPassword = await hashPassword(newPassword);

    // Atualizar password e remover token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    logger.info(`Password alterada: ${user.email}`);

    return {
      message: "Password alterada com sucesso.",
    };
  }

  /**
   * Renovar access token usando refresh token
   */
  static async refreshToken(refreshToken: string) {
    // Nota: Implementação básica. Em produção, guardar refresh tokens no Redis
    // e verificar se não foram revogados
    
    const { verifyRefreshToken } = require("../utils/jwt");
    const decoded = verifyRefreshToken(refreshToken);

    // Buscar utilizador
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new UnauthorizedError("Utilizador não encontrado.");
    }

    if (user.status === "SUSPENDED") {
      throw new UnauthorizedError("Conta suspensa.");
    }

    // Gerar novo access token
    const { generateAccessToken } = require("../utils/jwt");
    const accessToken = generateAccessToken(user.id, user.type);

    return {
      accessToken,
      expiresIn: 900, // 15 minutos
    };
  }

  /**
   * Logout (invalidar token)
   * Nota: Em produção, adicionar token a blacklist no Redis
   */
  static async logout(userId: string) {
    logger.info(`Logout: userId ${userId}`);
    
    // TODO: Adicionar token a blacklist no Redis
    // await cacheSet(`blacklist:${token}`, true, 900);

    return {
      message: "Logout efetuado com sucesso.",
    };
  }
}

