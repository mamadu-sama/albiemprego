import { PrismaClient, ApplicationStatus } from "@prisma/client";
import { AppError } from "../utils/errors";

const prisma = new PrismaClient();

interface ValidationResult {
  canApply: boolean;
  reasons: string[];
}

interface CreateApplicationData {
  candidateId: string;
  jobId: string;
  coverLetter?: string;
  portfolio?: string;
  availability?: string;
  expectedSalary?: number;
}

export class ApplicationService {
  /**
   * Validar se candidato pode candidatar-se à vaga
   */
  static async validateCanApply(
    candidateId: string,
    jobId: string
  ): Promise<ValidationResult> {
    const reasons: string[] = [];

    // Verificar se candidato existe e tem perfil completo
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            status: true,
          },
        },
      },
    });

    if (!candidate) {
      reasons.push("Perfil de candidato não encontrado");
      return { canApply: false, reasons };
    }

    // Verificar se usuário está ativo
    if (candidate.user.status !== "ACTIVE") {
      reasons.push("Conta não está ativa");
    }

    // Verificar se tem CV
    if (!candidate.cvUrl) {
      reasons.push("CV não carregado no perfil");
    }

    // Verificar completude do perfil (mínimo 70%)
    if (candidate.profileCompleteness < 70) {
      reasons.push(
        `Perfil incompleto (${candidate.profileCompleteness}%). Mínimo: 70%`
      );
    }

    // Verificar se vaga existe e está ativa
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: {
        id: true,
        title: true,
        status: true,
        applicationDeadline: true,
      },
    });

    if (!job) {
      reasons.push("Vaga não encontrada");
      return { canApply: false, reasons };
    }

    if (job.status !== "ACTIVE") {
      reasons.push("Vaga não está ativa");
    }

    // Verificar prazo de candidatura
    if (job.applicationDeadline) {
      const now = new Date();
      const deadline = new Date(job.applicationDeadline);
      if (now > deadline) {
        reasons.push("Prazo de candidatura expirado");
      }
    }

    // Verificar se já existe candidatura
    const existingApplication = await prisma.application.findUnique({
      where: {
        jobId_candidateId: {
          jobId,
          candidateId,
        },
      },
    });

    if (existingApplication) {
      reasons.push("Já se candidatou a esta vaga");
    }

    return {
      canApply: reasons.length === 0,
      reasons,
    };
  }

  /**
   * Verificar se candidato já se candidatou
   */
  static async checkExistingApplication(
    candidateId: string,
    jobId: string
  ): Promise<{ hasApplied: boolean; applicationId?: string }> {
    const application = await prisma.application.findUnique({
      where: {
        jobId_candidateId: {
          jobId,
          candidateId,
        },
      },
      select: {
        id: true,
      },
    });

    return {
      hasApplied: !!application,
      applicationId: application?.id,
    };
  }

  /**
   * Criar candidatura
   */
  static async createApplication(data: CreateApplicationData) {
    const { candidateId, jobId, coverLetter, portfolio, availability, expectedSalary } = data;

    // Validar novamente antes de criar
    const validation = await this.validateCanApply(candidateId, jobId);
    if (!validation.canApply) {
      throw new AppError(
        `Não pode candidatar-se: ${validation.reasons.join(", ")}`,
        400,
        "CANNOT_APPLY"
      );
    }

    // Obter dados da vaga para verificar quickApply
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: {
        title: true,
        quickApply: true,
        companyId: true,
        company: {
          select: {
            userId: true,
            name: true,
          },
        },
      },
    });

    if (!job) {
      throw new AppError("Vaga não encontrada", 404, "JOB_NOT_FOUND");
    }

    // Se não é quickApply, carta é obrigatória
    if (!job.quickApply && !coverLetter) {
      throw new AppError(
        "Carta de apresentação é obrigatória para esta vaga",
        400,
        "COVER_LETTER_REQUIRED"
      );
    }

    // Timeline inicial
    const initialTimeline = [
      {
        status: "NEW",
        date: new Date().toISOString(),
        note: "Candidatura submetida",
      },
    ];

    // Criar candidatura
    const application = await prisma.application.create({
      data: {
        candidateId,
        jobId,
        coverLetter: coverLetter || null,
        status: ApplicationStatus.NEW,
        timeline: initialTimeline,
        notes: JSON.stringify({
          portfolio,
          availability,
          expectedSalary,
        }),
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: {
              select: {
                name: true,
              },
            },
          },
        },
        candidate: {
          select: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Criar notificação para a empresa
    await prisma.notification.create({
      data: {
        userId: job.company.userId,
        type: "INFO",
        title: "Nova candidatura recebida",
        message: `${application.candidate.user.name} candidatou-se à vaga "${job.title}"`,
        actionUrl: `/empresa/vagas/${jobId}/candidaturas`,
        actionLabel: "Ver candidatura",
      },
    });

    return application;
  }

  /**
   * Obter candidaturas do candidato
   */
  static async getCandidateApplications(
    candidateId: string,
    status?: ApplicationStatus
  ) {
    const where: any = { candidateId };

    if (status) {
      where.status = status;
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            location: true,
            type: true,
            workMode: true,
            company: {
              select: {
                name: true,
                logo: true,
              },
            },
            publishedAt: true,
          },
        },
      },
      orderBy: {
        appliedAt: "desc",
      },
    });

    return applications;
  }

  /**
   * Obter detalhes de uma candidatura
   */
  static async getApplicationDetails(applicationId: string, candidateId: string) {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: {
          include: {
            company: {
              select: {
                name: true,
                logo: true,
                website: true,
              },
            },
          },
        },
      },
    });

    if (!application) {
      throw new AppError("Candidatura não encontrada", 404, "APPLICATION_NOT_FOUND");
    }

    // Verificar se pertence ao candidato
    if (application.candidateId !== candidateId) {
      throw new AppError(
        "Não tem permissão para ver esta candidatura",
        403,
        "FORBIDDEN"
      );
    }

    return application;
  }

  /**
   * Retirar candidatura (apenas se NEW ou VIEWED)
   */
  static async withdrawApplication(applicationId: string, candidateId: string) {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      select: {
        id: true,
        candidateId: true,
        status: true,
        job: {
          select: {
            title: true,
            company: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });

    if (!application) {
      throw new AppError("Candidatura não encontrada", 404, "APPLICATION_NOT_FOUND");
    }

    if (application.candidateId !== candidateId) {
      throw new AppError("Não tem permissão", 403, "FORBIDDEN");
    }

    // Apenas pode retirar se ainda não foi para revisão
    if (!["NEW", "VIEWED"].includes(application.status)) {
      throw new AppError(
        "Não pode retirar candidatura nesta fase",
        400,
        "CANNOT_WITHDRAW"
      );
    }

    // Eliminar candidatura
    await prisma.application.delete({
      where: { id: applicationId },
    });

    // Notificar empresa (opcional)
    await prisma.notification.create({
      data: {
        userId: application.job.company.userId,
        type: "INFO",
        title: "Candidatura retirada",
        message: `Um candidato retirou a candidatura de "${application.job.title}"`,
      },
    });

    return { success: true };
  }
}

