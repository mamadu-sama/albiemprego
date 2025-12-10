// Service de gestão de pacotes de créditos
import { prisma } from "../config/database";
import { NotFoundError, BadRequestError } from "../utils/errors";
import { logger } from "../config/logger";
import { CreditDuration } from "@prisma/client";

export interface CreatePackageDTO {
  name: string;
  description: string;
  price: number;
  featuredCredits: number;
  homepageCredits: number;
  urgentCredits: number;
  creditDuration?: CreditDuration;
  displayOrder?: number;
}

export interface UpdatePackageDTO {
  name?: string;
  description?: string;
  price?: number;
  featuredCredits?: number;
  homepageCredits?: number;
  urgentCredits?: number;
  creditDuration?: CreditDuration;
  displayOrder?: number;
}

export class CreditPackageService {
  /**
   * Listar todos os pacotes
   */
  static async listPackages(includeInactive: boolean = false) {
    const where = includeInactive ? {} : { isActive: true };

    const packages = await prisma.creditPackage.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });

    logger.info(`Listed ${packages.length} credit packages`);
    return packages;
  }

  /**
   * Obter pacote específico
   */
  static async getPackage(id: string) {
    const pkg = await prisma.creditPackage.findUnique({
      where: { id },
    });

    if (!pkg) {
      throw new NotFoundError('Pacote não encontrado', 'PACKAGE_NOT_FOUND');
    }

    return pkg;
  }

  /**
   * Criar novo pacote (Admin)
   */
  static async createPackage(data: CreatePackageDTO) {
    const pkg = await prisma.creditPackage.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        featuredCredits: data.featuredCredits,
        homepageCredits: data.homepageCredits,
        urgentCredits: data.urgentCredits,
        creditDuration: data.creditDuration || CreditDuration.DAYS_7,
        displayOrder: data.displayOrder || 0,
      },
    });

    logger.info(`Created credit package: ${pkg.name} (ID: ${pkg.id})`);
    return pkg;
  }

  /**
   * Atualizar pacote (Admin)
   */
  static async updatePackage(id: string, data: UpdatePackageDTO) {
    await this.getPackage(id); // Verificar se existe

    const updated = await prisma.creditPackage.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.featuredCredits !== undefined && { featuredCredits: data.featuredCredits }),
        ...(data.homepageCredits !== undefined && { homepageCredits: data.homepageCredits }),
        ...(data.urgentCredits !== undefined && { urgentCredits: data.urgentCredits }),
        ...(data.creditDuration && { creditDuration: data.creditDuration }),
        ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
      },
    });

    logger.info(`Updated credit package: ${updated.name} (ID: ${id})`);
    return updated;
  }

  /**
   * Ativar/Desativar pacote (Admin)
   */
  static async togglePackageActive(id: string) {
    const pkg = await this.getPackage(id);

    const updated = await prisma.creditPackage.update({
      where: { id },
      data: { isActive: !pkg.isActive },
    });

    logger.info(`Toggled package ${updated.name} to ${updated.isActive ? 'active' : 'inactive'}`);
    return updated;
  }

  /**
   * Deletar pacote (Admin)
   */
  static async deletePackage(id: string) {
    const pkg = await this.getPackage(id);

    // Verificar se tem transações
    const transactions = await prisma.transaction.count({
      where: { packageId: id },
    });

    if (transactions > 0) {
      throw new BadRequestError(
        'Não é possível deletar pacote com transações registadas',
        'PACKAGE_HAS_TRANSACTIONS'
      );
    }

    await prisma.creditPackage.delete({
      where: { id },
    });

    logger.info(`Deleted credit package: ${pkg.name} (ID: ${id})`);
    return { message: 'Pacote deletado com sucesso' };
  }
}

