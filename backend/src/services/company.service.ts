// Service de gestão de empresas
import { prisma } from "../config/database";
import { NotFoundError, ForbiddenError } from "../utils/errors";
import { logger } from "../config/logger";
import { UploadService } from "./upload.service";

export interface UpdateCompanyProfileDTO {
  name?: string;
  website?: string;
  sector?: string;
  employees?: string;
  description?: string;
}

export class CompanyService {
  /**
   * Obter perfil público da empresa por ID
   */
  static async getPublicProfile(companyId: string) {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            location: true,
            createdAt: true,
          },
        },
        jobs: {
          where: {
            status: "ACTIVE",
          },
          select: {
            id: true,
            title: true,
            location: true,
            type: true,
            workMode: true,
            publishedAt: true,
          },
          orderBy: {
            publishedAt: "desc",
          },
          take: 10, // Mostrar últimas 10 vagas
        },
      },
    });

    if (!company) {
      throw new NotFoundError("Empresa não encontrada");
    }

    // Verificar se a empresa está aprovada
    if (!company.approvedAt) {
      throw new ForbiddenError("Empresa ainda não aprovada");
    }

    logger.info(`Perfil público obtido: ${company.name}`);
    return company;
  }

  /**
   * Obter perfil completo da empresa (autenticada)
   */
  static async getProfile(userId: string) {
    const company = await this.verifyCompany(userId);

    const fullProfile = await prisma.company.findUnique({
      where: { id: company.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            location: true,
            bio: true,
            avatar: true,
            type: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        jobs: {
          select: {
            id: true,
            title: true,
            location: true,
            type: true,
            workMode: true,
            status: true,
            publishedAt: true,
            createdAt: true,
            _count: {
              select: {
                applications: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    logger.info(`Perfil da empresa obtido: ${company.name}`);
    return fullProfile;
  }

  /**
   * Atualizar perfil da empresa
   */
  static async updateProfile(userId: string, data: UpdateCompanyProfileDTO) {
    const company = await this.verifyCompany(userId);

    const updated = await prisma.company.update({
      where: { id: company.id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.website && { website: data.website }),
        ...(data.sector && { sector: data.sector }),
        ...(data.employees && { employees: data.employees }),
        ...(data.description && { description: data.description }),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            location: true,
            bio: true,
            type: true,
            status: true,
          },
        },
      },
    });

    logger.info(`Perfil da empresa atualizado: ${updated.name}`);
    return updated;
  }

  /**
   * Upload de logo da empresa
   */
  static async uploadLogo(userId: string, file: Express.Multer.File) {
    const company = await this.verifyCompany(userId);

    // Upload para S3
    const logoUrl = await UploadService.uploadLogo(file);

    // Deletar logo antigo se existir
    if (company.logo && company.logo.includes("amazonaws.com")) {
      try {
        await UploadService.deleteFile(company.logo);
      } catch (error) {
        logger.warn("Erro ao deletar logo antigo do S3:", error);
      }
    }

    // Atualizar no banco
    const updated = await prisma.company.update({
      where: { id: company.id },
      data: { logo: logoUrl },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            type: true,
          },
        },
      },
    });

    logger.info(`Logo atualizado: ${company.name}`);
    return updated;
  }

  /**
   * Remover logo da empresa
   */
  static async deleteLogo(userId: string) {
    const company = await this.verifyCompany(userId);

    // Deletar do S3 se existir
    if (company.logo && company.logo.includes("amazonaws.com")) {
      try {
        await UploadService.deleteFile(company.logo);
      } catch (error) {
        logger.warn("Erro ao deletar logo do S3:", error);
      }
    }

    // Remover do banco
    const updated = await prisma.company.update({
      where: { id: company.id },
      data: { logo: null },
      select: {
        id: true,
        name: true,
        logo: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            type: true,
          },
        },
      },
    });

    logger.info(`Logo removido: ${company.name}`);
    return updated;
  }

  /**
   * Método auxiliar: Verificar se utilizador é empresa
   */
  private static async verifyCompany(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });

    if (!user || user.type !== "EMPRESA" || !user.company) {
      throw new NotFoundError("Empresa não encontrada");
    }

    return user.company;
  }
}

