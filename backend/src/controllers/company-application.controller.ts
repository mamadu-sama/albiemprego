import { Request, Response } from "express";
import { PrismaClient, ApplicationStatus } from "@prisma/client";
import { AppError } from "../utils/errors";

const prisma = new PrismaClient();

/**
 * Obter todas as candidaturas das vagas da empresa
 */
export const getCompanyApplications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { jobId, status } = req.query;

    if (!userId) {
      throw new AppError("Não autenticado", 401, "UNAUTHORIZED");
    }

    // Obter company a partir do userId
    const company = await prisma.company.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!company) {
      throw new AppError(
        "Empresa não encontrada",
        404,
        "COMPANY_NOT_FOUND"
      );
    }

    // Filtros
    const where: any = {
      job: {
        companyId: company.id,
      },
    };

    if (jobId && typeof jobId === "string") {
      where.jobId = jobId;
    }

    if (status && typeof status === "string") {
      where.status = status as ApplicationStatus;
    }

    // Buscar candidaturas
    const applications = await prisma.application.findMany({
      where,
      include: {
        candidate: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                phone: true,
                avatar: true,
                location: true,
              },
            },
            experiences: {
              orderBy: {
                startDate: "desc",
              },
              take: 3,
            },
            educations: {
              orderBy: {
                startDate: "desc",
              },
              take: 2,
            },
            languages: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
            location: true,
            type: true,
          },
        },
      },
      orderBy: {
        appliedAt: "desc",
      },
    });

    // Parse notes se existir
    const applicationsWithParsedNotes = applications.map((app) => {
      let parsedNotes = null;
      if (app.notes) {
        try {
          parsedNotes = JSON.parse(app.notes);
        } catch (e) {
          parsedNotes = { notes: app.notes };
        }
      }

      return {
        ...app,
        additionalData: parsedNotes,
        notes: app.notes, // Manter original também
      };
    });

    res.json(applicationsWithParsedNotes);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.errorCode,
        message: error.message,
      });
    }
    console.error("Error fetching company applications:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Erro ao carregar candidaturas",
    });
  }
};

/**
 * Obter detalhes de uma candidatura específica
 */
export const getApplicationDetails = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Não autenticado", 401, "UNAUTHORIZED");
    }

    // Obter company
    const company = await prisma.company.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!company) {
      throw new AppError("Empresa não encontrada", 404, "COMPANY_NOT_FOUND");
    }

    // Buscar candidatura
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        candidate: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                phone: true,
                avatar: true,
                location: true,
                bio: true,
              },
            },
            experiences: {
              orderBy: {
                startDate: "desc",
              },
            },
            educations: {
              orderBy: {
                startDate: "desc",
              },
            },
            languages: true,
          },
        },
        job: true,
      },
    });

    if (!application) {
      throw new AppError(
        "Candidatura não encontrada",
        404,
        "APPLICATION_NOT_FOUND"
      );
    }

    // Verificar se a vaga pertence à empresa
    if (application.job.companyId !== company.id) {
      throw new AppError(
        "Não tem permissão para ver esta candidatura",
        403,
        "FORBIDDEN"
      );
    }

    // Marcar como visualizada se ainda não foi
    if (application.status === "NEW") {
      await prisma.application.update({
        where: { id: applicationId },
        data: {
          status: "VIEWED",
          timeline: [
            ...(application.timeline as any[]),
            {
              status: "VIEWED",
              date: new Date().toISOString(),
              note: "Visualizada pela empresa",
            },
          ],
        },
      });
    }

    // Parse notes
    let additionalData = null;
    if (application.notes) {
      try {
        additionalData = JSON.parse(application.notes);
      } catch (e) {
        additionalData = { notes: application.notes };
      }
    }

    res.json({
      ...application,
      additionalData,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.errorCode,
        message: error.message,
      });
    }
    console.error("Error fetching application details:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Erro ao carregar detalhes da candidatura",
    });
  }
};

/**
 * Alterar status de uma candidatura
 */
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    const { status, note } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Não autenticado", 401, "UNAUTHORIZED");
    }

    // Obter company
    const company = await prisma.company.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!company) {
      throw new AppError("Empresa não encontrada", 404, "COMPANY_NOT_FOUND");
    }

    // Buscar candidatura
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: {
          select: {
            companyId: true,
            title: true,
          },
        },
        candidate: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!application) {
      throw new AppError(
        "Candidatura não encontrada",
        404,
        "APPLICATION_NOT_FOUND"
      );
    }

    // Verificar permissão
    if (application.job.companyId !== company.id) {
      throw new AppError("Não tem permissão", 403, "FORBIDDEN");
    }

    // Validar status
    const validStatuses = ["NEW", "VIEWED", "IN_REVIEW", "INTERVIEW", "REJECTED", "ACCEPTED"];
    if (!validStatuses.includes(status)) {
      throw new AppError("Status inválido", 400, "INVALID_STATUS");
    }

    // Atualizar timeline
    const timeline = application.timeline as any[];
    const statusMessages: Record<string, string> = {
      NEW: "Candidatura recebida",
      VIEWED: "Visualizada pela empresa",
      IN_REVIEW: "Em análise",
      INTERVIEW: "Convidado para entrevista",
      REJECTED: "Candidatura não selecionada",
      ACCEPTED: "Candidatura aceite",
    };

    timeline.push({
      status,
      date: new Date().toISOString(),
      note: note || statusMessages[status],
    });

    // Atualizar
    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: status as ApplicationStatus,
        timeline,
        updatedAt: new Date(),
      },
    });

    // Criar notificação para candidato
    const notificationMessages: Record<string, string> = {
      VIEWED: `A empresa visualizou a sua candidatura para "${application.job.title}"`,
      IN_REVIEW: `A sua candidatura para "${application.job.title}" está em análise`,
      INTERVIEW: `Foi convidado para entrevista - "${application.job.title}"`,
      REJECTED: `Informação sobre a sua candidatura para "${application.job.title}"`,
      ACCEPTED: `Boa notícia sobre a sua candidatura para "${application.job.title}"`,
    };

    if (notificationMessages[status]) {
      await prisma.notification.create({
        data: {
          userId: application.candidate.user.id,
          type: status === "ACCEPTED" ? "SUCCESS" : status === "REJECTED" ? "WARNING" : "INFO",
          title: "Atualização de Candidatura",
          message: notificationMessages[status],
          actionUrl: `/candidato/candidaturas`,
        },
      });
    }

    res.json({
      success: true,
      message: "Status atualizado com sucesso",
      data: updated,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.errorCode,
        message: error.message,
      });
    }
    console.error("Error updating application status:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Erro ao atualizar status",
    });
  }
};

/**
 * Adicionar/atualizar notas internas da empresa
 */
export const updateApplicationNotes = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    const { internalNotes } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Não autenticado", 401, "UNAUTHORIZED");
    }

    // Obter company
    const company = await prisma.company.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!company) {
      throw new AppError("Empresa não encontrada", 404, "COMPANY_NOT_FOUND");
    }

    // Buscar candidatura
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: {
          select: {
            companyId: true,
          },
        },
      },
    });

    if (!application) {
      throw new AppError(
        "Candidatura não encontrada",
        404,
        "APPLICATION_NOT_FOUND"
      );
    }

    // Verificar permissão
    if (application.job.companyId !== company.id) {
      throw new AppError("Não tem permissão", 403, "FORBIDDEN");
    }

    // Atualizar notas (campo notes é para dados do candidato, vamos usar um campo diferente)
    // Vamos adicionar as notas internas no campo notes junto com os dados existentes
    let existingData = {};
    if (application.notes) {
      try {
        existingData = JSON.parse(application.notes);
      } catch (e) {
        existingData = {};
      }
    }

    const updatedData = {
      ...existingData,
      companyNotes: internalNotes,
    };

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: {
        notes: JSON.stringify(updatedData),
      },
    });

    res.json({
      success: true,
      message: "Notas atualizadas com sucesso",
      data: updated,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.errorCode,
        message: error.message,
      });
    }
    console.error("Error updating application notes:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Erro ao atualizar notas",
    });
  }
};

/**
 * Estatísticas de candidaturas da empresa
 */
export const getApplicationStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Não autenticado", 401, "UNAUTHORIZED");
    }

    // Obter company
    const company = await prisma.company.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!company) {
      throw new AppError("Empresa não encontrada", 404, "COMPANY_NOT_FOUND");
    }

    // Contar por status
    const [total, newCount, viewedCount, inReviewCount, interviewCount, rejectedCount, acceptedCount] =
      await Promise.all([
        prisma.application.count({
          where: {
            job: { companyId: company.id },
          },
        }),
        prisma.application.count({
          where: {
            job: { companyId: company.id },
            status: "NEW",
          },
        }),
        prisma.application.count({
          where: {
            job: { companyId: company.id },
            status: "VIEWED",
          },
        }),
        prisma.application.count({
          where: {
            job: { companyId: company.id },
            status: "IN_REVIEW",
          },
        }),
        prisma.application.count({
          where: {
            job: { companyId: company.id },
            status: "INTERVIEW",
          },
        }),
        prisma.application.count({
          where: {
            job: { companyId: company.id },
            status: "REJECTED",
          },
        }),
        prisma.application.count({
          where: {
            job: { companyId: company.id },
            status: "ACCEPTED",
          },
        }),
      ]);

    res.json({
      total,
      byStatus: {
        NEW: newCount,
        VIEWED: viewedCount,
        IN_REVIEW: inReviewCount,
        INTERVIEW: interviewCount,
        REJECTED: rejectedCount,
        ACCEPTED: acceptedCount,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.errorCode,
        message: error.message,
      });
    }
    console.error("Error fetching application stats:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Erro ao carregar estatísticas",
    });
  }
};

