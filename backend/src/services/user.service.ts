// Service de gestão de utilizadores
import { prisma } from "../config/database";
import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../utils/errors";
import { logger } from "../config/logger";
import { hashPassword, comparePassword } from "../utils/password";

export interface UpdateProfileDTO {
  name?: string;
  phone?: string;
  location?: string;
  bio?: string;
}

export class UserService {
  /**
   * Obter perfil do utilizador
   */
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        candidate: true,
        company: true,
      },
    });

    if (!user) {
      throw new NotFoundError("Utilizador não encontrado", "USER_NOT_FOUND");
    }

    // Remover campos sensíveis
    const {
      password,
      passwordResetToken,
      passwordResetExpires,
      emailVerificationToken,
      emailVerificationExpires,
      ...userWithoutSensitiveData
    } = user;

    logger.info(`Perfil obtido: ${user.email}`);
    return userWithoutSensitiveData;
  }

  /**
   * Atualizar perfil do utilizador
   */
  static async updateProfile(userId: string, data: UpdateProfileDTO) {
    // Verificar se utilizador existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("Utilizador não encontrado", "USER_NOT_FOUND");
    }

    // Validar telefone se fornecido
    if (data.phone) {
      const phoneRegex = /^(\+351)?[29]\d{8}$/;
      if (!phoneRegex.test(data.phone)) {
        throw new BadRequestError("Telefone inválido", "INVALID_PHONE");
      }
    }

    // Atualizar apenas campos permitidos
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.bio !== undefined) updateData.bio = data.bio;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        candidate: true,
        company: true,
      },
    });

    // Remover campos sensíveis
    const {
      password,
      passwordResetToken,
      passwordResetExpires,
      emailVerificationToken,
      emailVerificationExpires,
      ...userWithoutSensitiveData
    } = updated;

    logger.info(`Perfil atualizado: ${updated.email}`);
    return userWithoutSensitiveData;
  }

  /**
   * Atualizar avatar do utilizador
   */
  static async updateAvatar(userId: string, avatarUrl: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("Utilizador não encontrado", "USER_NOT_FOUND");
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        type: true,
      },
    });

    logger.info(`Avatar atualizado: ${updated.email}`);
    return updated;
  }

  /**
   * Remover avatar do utilizador
   */
  static async deleteAvatar(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("Utilizador não encontrado", "USER_NOT_FOUND");
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { avatar: null },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        type: true,
      },
    });

    logger.info(`Avatar removido: ${updated.email}`);
    return updated;
  }

  /**
   * Atualizar email do utilizador
   */
  static async updateEmail(
    userId: string,
    newEmail: string,
    currentPassword: string
  ) {
    // Verificar se utilizador existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("Utilizador não encontrado", "USER_NOT_FOUND");
    }

    // Verificar password atual
    const isPasswordValid = await comparePassword(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError("Password incorreta");
    }

    // Verificar se o novo email já está em uso
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail },
    });

    if (existingUser && existingUser.id !== userId) {
      throw new BadRequestError("Email já está em uso", "EMAIL_EXISTS");
    }

    // Atualizar email
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        email: newEmail,
        emailVerified: false, // Requerer nova verificação
      },
      select: {
        id: true,
        email: true,
        name: true,
        type: true,
        emailVerified: true,
      },
    });

    logger.info(`Email atualizado: ${user.email} -> ${newEmail}`);
    return updated;
  }

  /**
   * Alterar password do utilizador
   */
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    // Verificar se utilizador existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("Utilizador não encontrado", "USER_NOT_FOUND");
    }

    // Verificar password atual
    const isPasswordValid = await comparePassword(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError("Password incorreta");
    }

    // Validar nova password
    if (newPassword.length < 8) {
      throw new BadRequestError(
        "A password deve ter no mínimo 8 caracteres",
        "INVALID_PASSWORD"
      );
    }

    // Hash da nova password
    const hashedPassword = await hashPassword(newPassword);

    // Atualizar password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    logger.info(`Password alterada: ${user.email}`);
    return { message: "Password alterada com sucesso" };
  }

  /**
   * Soft delete - Desativar conta do utilizador
   */
  static async softDeleteAccount(userId: string, password: string) {
    // Verificar se utilizador existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("Utilizador não encontrado", "USER_NOT_FOUND");
    }

    // Verificar password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError("Password incorreta");
    }

    // Desativar conta (soft delete)
    await prisma.user.update({
      where: { id: userId },
      data: {
        status: "SUSPENDED",
        // Opcional: adicionar timestamp de quando foi desativado
        updatedAt: new Date(),
      },
    });

    logger.info(`Conta desativada (soft delete): ${user.email}`);
    return { message: "Conta eliminada com sucesso" };
  }
}
