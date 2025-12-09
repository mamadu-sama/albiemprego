// Service de gestão de vagas
import { prisma } from "../config/database";
import { NotFoundError, ForbiddenError, BadRequestError } from "../utils/errors";
import { logger } from "../config/logger";
import { Prisma, JobStatus } from "@prisma/client";

export interface CreateJobDTO {
  title: string;
  department?: string;
  description: string;
  requirements: string[];
  responsibilities?: string[];
  benefits?: string[];
  skills?: string[];
  location: string;
  address?: string;
  type: string; // "FULL_TIME", "PART_TIME", "TEMPORARY", "INTERNSHIP", "FREELANCE"
  workMode: string; // "PRESENCIAL", "REMOTO", "HIBRIDO"
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: string;
  showSalary?: boolean;
  sector: string;
  experienceLevel?: string;
  applicationDeadline?: string;
}

export interface UpdateJobDTO {
  title?: string;
  department?: string;
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  skills?: string[];
  location?: string;
  address?: string;
  type?: string;
  workMode?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: string;
  showSalary?: boolean;
  sector?: string;
  experienceLevel?: string;
  applicationDeadline?: string;
}

export interface JobFilters {
  search?: string;
  location?: string;
  type?: string;
  workMode?: string;
  experienceLevel?: string;
  sector?: string;
  salaryMin?: number;
  salaryMax?: number;
  companyId?: string;
  status?: JobStatus;
  page?: number;
  limit?: number;
}

export class JobService {
  /**
   * Listar vagas (público) com filtros e paginação
   */
  static async listJobs(filters: JobFilters = {}) {
    const {
      search,
      location,
      type,
      workMode,
      experienceLevel,
      sector,
      salaryMin,
      salaryMax,
      companyId,
      status = "ACTIVE",
      page = 1,
      limit = 20,
    } = filters;

    const where: Prisma.JobWhereInput = {};

    // Filtro de status (público só vê ACTIVE)
    if (status) {
      where.status = status;
    }

    // Search (título, descrição, setor)
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { sector: { contains: search, mode: "insensitive" } },
      ];
    }

    // Filtros específicos
    if (location) where.location = location;
    if (type) where.type = type as any;
    if (workMode) where.workMode = workMode as any;
    if (experienceLevel) where.experienceLevel = experienceLevel;
    if (sector) where.sector = sector;
    if (companyId) where.companyId = companyId;

    // Filtro salarial
    if (salaryMin !== undefined) {
      where.salaryMin = { gte: salaryMin };
    }
    if (salaryMax !== undefined) {
      where.salaryMax = { lte: salaryMax };
    }

    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logo: true,
              sector: true,
            },
          },
          _count: {
            select: {
              applications: true,
            },
          },
        },
        orderBy: {
          publishedAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.job.count({ where }),
    ]);

    logger.info(`Vagas listadas: ${jobs.length} de ${total}`);

    return {
      jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Obter detalhes de uma vaga (público)
   */
  static async getJob(jobId: string, userId?: string) {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        company: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                phone: true,
                location: true,
              },
            },
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!job) {
      throw new NotFoundError("Vaga não encontrada");
    }

    // Incrementar contador de visualizações (apenas se não for dono)
    if (!userId || userId !== job.company.userId) {
      await prisma.job.update({
        where: { id: jobId },
        data: { viewsCount: { increment: 1 } },
      });
    }

    logger.info(`Vaga visualizada: ${job.title} (ID: ${jobId})`);
    return job;
  }

  /**
   * Criar nova vaga (Empresa)
   */
  static async createJob(userId: string, data: CreateJobDTO) {
    // Verificar se é empresa
    const company = await this.verifyCompany(userId);

    // Validações
    if (!data.title || !data.description || !data.location) {
      throw new BadRequestError("Campos obrigatórios faltando");
    }

    if (!data.requirements || data.requirements.length === 0) {
      throw new BadRequestError("Adicione pelo menos um requisito");
    }

    // Criar vaga
    const job = await prisma.job.create({
      data: {
        companyId: company.id,
        title: data.title,
        department: data.department,
        description: data.description,
        requirements: data.requirements,
        responsibilities: data.responsibilities || [],
        benefits: data.benefits || [],
        skills: data.skills || [],
        location: data.location,
        address: data.address,
        type: data.type as any,
        workMode: data.workMode as any,
        salaryMin: data.salaryMin ? new Prisma.Decimal(data.salaryMin) : null,
        salaryMax: data.salaryMax ? new Prisma.Decimal(data.salaryMax) : null,
        salaryCurrency: data.salaryCurrency || "EUR",
        salaryPeriod: data.salaryPeriod || "month",
        showSalary: data.showSalary || false,
        sector: data.sector || company.sector || "Geral",
        experienceLevel: data.experienceLevel,
        applicationDeadline: data.applicationDeadline
          ? new Date(data.applicationDeadline)
          : null,
        status: "DRAFT", // Sempre começa como rascunho
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
      },
    });

    logger.info(`Vaga criada: ${job.title} (ID: ${job.id})`);
    return job;
  }

  /**
   * Atualizar vaga (Empresa)
   */
  static async updateJob(userId: string, jobId: string, data: UpdateJobDTO) {
    const job = await this.verifyJobOwner(userId, jobId);

    // Não permitir edição de vagas já publicadas (ACTIVE)
    // Apenas se ainda estiver em DRAFT ou PAUSED
    if (job.status === "ACTIVE" && job.publishedAt) {
      // Permitir apenas pausar ou fechar, não editar conteúdo
      throw new BadRequestError(
        "Não é possível editar vaga ativa. Pause primeiro para editar."
      );
    }

    const updated = await prisma.job.update({
      where: { id: jobId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.department !== undefined && { department: data.department }),
        ...(data.description && { description: data.description }),
        ...(data.requirements && { requirements: data.requirements }),
        ...(data.responsibilities && { responsibilities: data.responsibilities }),
        ...(data.benefits && { benefits: data.benefits }),
        ...(data.skills && { skills: data.skills }),
        ...(data.location && { location: data.location }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.type && { type: data.type as any }),
        ...(data.workMode && { workMode: data.workMode as any }),
        ...(data.salaryMin !== undefined && {
          salaryMin: data.salaryMin ? new Prisma.Decimal(data.salaryMin) : null,
        }),
        ...(data.salaryMax !== undefined && {
          salaryMax: data.salaryMax ? new Prisma.Decimal(data.salaryMax) : null,
        }),
        ...(data.salaryCurrency && { salaryCurrency: data.salaryCurrency }),
        ...(data.salaryPeriod && { salaryPeriod: data.salaryPeriod }),
        ...(data.showSalary !== undefined && { showSalary: data.showSalary }),
        ...(data.sector && { sector: data.sector }),
        ...(data.experienceLevel !== undefined && {
          experienceLevel: data.experienceLevel,
        }),
        ...(data.applicationDeadline !== undefined && {
          applicationDeadline: data.applicationDeadline
            ? new Date(data.applicationDeadline)
            : null,
        }),
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
      },
    });

    logger.info(`Vaga atualizada: ${updated.title} (ID: ${jobId})`);
    return updated;
  }

  /**
   * Publicar vaga (mudar de DRAFT para PENDING/ACTIVE)
   */
  static async publishJob(userId: string, jobId: string) {
    const job = await this.verifyJobOwner(userId, jobId);

    if (job.status === "ACTIVE") {
      throw new BadRequestError("Vaga já está publicada");
    }

    // Verificar se empresa está aprovada
    const company = await prisma.company.findUnique({
      where: { id: job.companyId },
    });

    if (!company?.approvedAt) {
      throw new ForbiddenError(
        "Empresa ainda não aprovada. Aguarde aprovação para publicar vagas."
      );
    }

    // Publicar vaga (direto para ACTIVE, ou PENDING se precisar aprovação)
    const updated = await prisma.job.update({
      where: { id: jobId },
      data: {
        status: "ACTIVE", // Ou "PENDING" se precisar aprovação de admin
        publishedAt: new Date(),
      },
    });

    logger.info(`Vaga publicada: ${updated.title} (ID: ${jobId})`);
    return updated;
  }

  /**
   * Pausar vaga
   */
  static async pauseJob(userId: string, jobId: string) {
    const job = await this.verifyJobOwner(userId, jobId);

    if (job.status === "PAUSED") {
      throw new BadRequestError("Vaga já está pausada");
    }

    if (job.status === "DRAFT") {
      throw new BadRequestError("Não é possível pausar uma vaga em rascunho");
    }

    const updated = await prisma.job.update({
      where: { id: jobId },
      data: {
        status: "PAUSED",
      },
    });

    logger.info(`Vaga pausada: ${updated.title} (ID: ${jobId})`);
    return updated;
  }

  /**
   * Fechar vaga
   */
  static async closeJob(userId: string, jobId: string) {
    const job = await this.verifyJobOwner(userId, jobId);

    const updated = await prisma.job.update({
      where: { id: jobId },
      data: {
        status: "CLOSED",
      },
    });

    logger.info(`Vaga fechada: ${updated.title} (ID: ${jobId})`);
    return updated;
  }

  /**
   * Remover vaga (soft delete - apenas se não tiver candidaturas)
   */
  static async deleteJob(userId: string, jobId: string) {
    const job = await this.verifyJobOwner(userId, jobId);

    // Verificar se tem candidaturas
    const applicationsCount = await prisma.application.count({
      where: { jobId },
    });

    if (applicationsCount > 0) {
      throw new BadRequestError(
        "Não é possível remover vaga com candidaturas. Feche a vaga em vez disso."
      );
    }

    await prisma.job.delete({
      where: { id: jobId },
    });

    logger.info(`Vaga removida: ${job.title} (ID: ${jobId})`);
    return { message: "Vaga removida com sucesso" };
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
      throw new ForbiddenError("Apenas empresas podem criar vagas");
    }

    return user.company;
  }

  /**
   * Método auxiliar: Verificar se vaga pertence à empresa
   */
  private static async verifyJobOwner(userId: string, jobId: string) {
    const company = await this.verifyCompany(userId);

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundError("Vaga não encontrada");
    }

    if (job.companyId !== company.id) {
      throw new ForbiddenError("Você não tem permissão para editar esta vaga");
    }

    return job;
  }
}

