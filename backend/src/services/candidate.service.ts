// Service de gestão de perfil de candidato
import { prisma } from "../config/database";
import { NotFoundError, BadRequestError, ForbiddenError } from "../utils/errors";
import { logger } from "../config/logger";
import { LanguageLevel } from "@prisma/client";

export interface CreateExperienceDTO {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description?: string;
}

export interface UpdateExperienceDTO {
  company?: string;
  position?: string;
  startDate?: Date;
  endDate?: Date;
  current?: boolean;
  description?: string;
}

export interface CreateEducationDTO {
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
}

export interface UpdateEducationDTO {
  institution?: string;
  degree?: string;
  field?: string;
  startDate?: Date;
  endDate?: Date;
  current?: boolean;
}

export interface CreateLanguageDTO {
  language: string;
  level: LanguageLevel;
}

export interface UpdateCandidateProfileDTO {
  skills?: string[];
  experienceYears?: number;
  currentPosition?: string;
}

export class CandidateService {
  /**
   * Verificar se utilizador é candidato
   */
  private static async verifyCandidate(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { candidate: true },
    });

    if (!user) {
      throw new NotFoundError("Utilizador não encontrado", "USER_NOT_FOUND");
    }

    if (user.type !== "CANDIDATO") {
      throw new ForbiddenError("Apenas candidatos podem aceder a este recurso");
    }

    if (!user.candidate) {
      throw new NotFoundError("Perfil de candidato não encontrado", "CANDIDATE_NOT_FOUND");
    }

    return user.candidate;
  }

  /**
   * Obter candidato por userId (método público)
   */
  static async getCandidateByUserId(userId: string) {
    return await this.verifyCandidate(userId);
  }

  /**
   * Obter perfil completo do candidato
   */
  static async getProfile(userId: string) {
    const candidate = await this.verifyCandidate(userId);

    const fullProfile = await prisma.candidate.findUnique({
      where: { id: candidate.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            location: true,
            avatar: true,
            bio: true,
            type: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        experiences: {
          orderBy: { startDate: "desc" },
        },
        educations: {
          orderBy: { startDate: "desc" },
        },
        languages: true,
      },
    });

    return fullProfile;
  }

  /**
   * Atualizar perfil do candidato
   */
  static async updateProfile(userId: string, data: UpdateCandidateProfileDTO) {
    const candidate = await this.verifyCandidate(userId);

    const updated = await prisma.candidate.update({
      where: { id: candidate.id },
      data,
    });

    logger.info(`Perfil de candidato atualizado: ${userId}`);
    return updated;
  }

  /**
   * Upload de CV
   */
  static async updateCV(userId: string, cvUrl: string) {
    const candidate = await this.verifyCandidate(userId);

    const updated = await prisma.candidate.update({
      where: { id: candidate.id },
      data: { cvUrl },
    });

    logger.info(`CV atualizado: ${userId}`);
    return updated;
  }

  // ==========================================
  // EXPERIÊNCIAS
  // ==========================================

  /**
   * Adicionar experiência profissional
   */
  static async createExperience(userId: string, data: CreateExperienceDTO) {
    const candidate = await this.verifyCandidate(userId);

    // Se atual, remover "current" de outras experiências
    if (data.current) {
      await prisma.experience.updateMany({
        where: { candidateId: candidate.id, current: true },
        data: { current: false },
      });
    }

    const experience = await prisma.experience.create({
      data: {
        candidateId: candidate.id,
        company: data.company,
        position: data.position,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        current: data.current,
        description: data.description,
      },
    });

    logger.info(`Experiência adicionada para candidato: ${userId}`);
    return experience;
  }

  /**
   * Atualizar experiência profissional
   */
  static async updateExperience(
    userId: string,
    experienceId: string,
    data: UpdateExperienceDTO
  ) {
    const candidate = await this.verifyCandidate(userId);

    // Verificar se experiência pertence ao candidato
    const experience = await prisma.experience.findUnique({
      where: { id: experienceId },
    });

    if (!experience || experience.candidateId !== candidate.id) {
      throw new NotFoundError("Experiência não encontrada", "EXPERIENCE_NOT_FOUND");
    }

    // Se marcar como atual, remover "current" de outras
    if (data.current) {
      await prisma.experience.updateMany({
        where: { 
          candidateId: candidate.id, 
          current: true,
          id: { not: experienceId },
        },
        data: { current: false },
      });
    }

    const updated = await prisma.experience.update({
      where: { id: experienceId },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
    });

    logger.info(`Experiência atualizada: ${experienceId}`);
    return updated;
  }

  /**
   * Remover experiência profissional
   */
  static async deleteExperience(userId: string, experienceId: string) {
    const candidate = await this.verifyCandidate(userId);

    const experience = await prisma.experience.findUnique({
      where: { id: experienceId },
    });

    if (!experience || experience.candidateId !== candidate.id) {
      throw new NotFoundError("Experiência não encontrada", "EXPERIENCE_NOT_FOUND");
    }

    await prisma.experience.delete({
      where: { id: experienceId },
    });

    logger.info(`Experiência removida: ${experienceId}`);
  }

  // ==========================================
  // EDUCAÇÃO
  // ==========================================

  /**
   * Adicionar educação
   */
  static async createEducation(userId: string, data: CreateEducationDTO) {
    const candidate = await this.verifyCandidate(userId);

    // Se atual, remover "current" de outras educações
    if (data.current) {
      await prisma.education.updateMany({
        where: { candidateId: candidate.id, current: true },
        data: { current: false },
      });
    }

    const education = await prisma.education.create({
      data: {
        candidateId: candidate.id,
        institution: data.institution,
        degree: data.degree,
        field: data.field,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        current: data.current,
      },
    });

    logger.info(`Educação adicionada para candidato: ${userId}`);
    return education;
  }

  /**
   * Atualizar educação
   */
  static async updateEducation(
    userId: string,
    educationId: string,
    data: UpdateEducationDTO
  ) {
    const candidate = await this.verifyCandidate(userId);

    const education = await prisma.education.findUnique({
      where: { id: educationId },
    });

    if (!education || education.candidateId !== candidate.id) {
      throw new NotFoundError("Educação não encontrada", "EDUCATION_NOT_FOUND");
    }

    // Se marcar como atual, remover "current" de outras
    if (data.current) {
      await prisma.education.updateMany({
        where: { 
          candidateId: candidate.id, 
          current: true,
          id: { not: educationId },
        },
        data: { current: false },
      });
    }

    const updated = await prisma.education.update({
      where: { id: educationId },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
    });

    logger.info(`Educação atualizada: ${educationId}`);
    return updated;
  }

  /**
   * Remover educação
   */
  static async deleteEducation(userId: string, educationId: string) {
    const candidate = await this.verifyCandidate(userId);

    const education = await prisma.education.findUnique({
      where: { id: educationId },
    });

    if (!education || education.candidateId !== candidate.id) {
      throw new NotFoundError("Educação não encontrada", "EDUCATION_NOT_FOUND");
    }

    await prisma.education.delete({
      where: { id: educationId },
    });

    logger.info(`Educação removida: ${educationId}`);
  }

  // ==========================================
  // IDIOMAS
  // ==========================================

  /**
   * Adicionar idioma
   */
  static async createLanguage(userId: string, data: CreateLanguageDTO) {
    const candidate = await this.verifyCandidate(userId);

    // Verificar se idioma já existe
    const existing = await prisma.language.findUnique({
      where: {
        candidateId_language: {
          candidateId: candidate.id,
          language: data.language,
        },
      },
    });

    if (existing) {
      throw new BadRequestError("Idioma já adicionado", "LANGUAGE_EXISTS");
    }

    const language = await prisma.language.create({
      data: {
        candidateId: candidate.id,
        ...data,
      },
    });

    logger.info(`Idioma adicionado para candidato: ${userId}`);
    return language;
  }

  /**
   * Atualizar idioma
   */
  static async updateLanguage(
    userId: string,
    languageId: string,
    level: LanguageLevel
  ) {
    const candidate = await this.verifyCandidate(userId);

    const language = await prisma.language.findFirst({
      where: { 
        id: languageId,
        candidateId: candidate.id,
      },
    });

    if (!language) {
      throw new NotFoundError("Idioma não encontrado", "LANGUAGE_NOT_FOUND");
    }

    const updated = await prisma.language.update({
      where: { id: languageId },
      data: { level },
    });

    logger.info(`Idioma atualizado: ${languageId}`);
    return updated;
  }

  /**
   * Remover idioma
   */
  static async deleteLanguage(userId: string, languageId: string) {
    const candidate = await this.verifyCandidate(userId);

    const language = await prisma.language.findFirst({
      where: { 
        id: languageId,
        candidateId: candidate.id,
      },
    });

    if (!language) {
      throw new NotFoundError("Idioma não encontrado", "LANGUAGE_NOT_FOUND");
    }

    await prisma.language.delete({
      where: { id: languageId },
    });

    logger.info(`Idioma removido: ${languageId}`);
  }
}

