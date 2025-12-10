import { Request, Response } from "express";
import { ApplicationService } from "../services/application.service";
import { AppError } from "../utils/errors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Verificar se candidato pode candidatar-se à vaga
 */
export const canApply = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Não autenticado", 401, "UNAUTHORIZED");
    }

    // Obter candidateId a partir do userId
    const candidate = await prisma.candidate.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!candidate) {
      return res.json({
        canApply: false,
        reasons: ["Perfil de candidato não encontrado"],
      });
    }

    const validation = await ApplicationService.validateCanApply(
      candidate.id,
      jobId
    );

    res.json(validation);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.errorCode,
        message: error.message,
      });
    }
    console.error("Error checking can apply:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Erro ao verificar elegibilidade",
    });
  }
};

/**
 * Verificar se já se candidatou
 */
export const checkApplication = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Não autenticado", 401, "UNAUTHORIZED");
    }

    // Obter candidateId
    const candidate = await prisma.candidate.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!candidate) {
      return res.json({ hasApplied: false });
    }

    const result = await ApplicationService.checkExistingApplication(
      candidate.id,
      jobId
    );

    res.json(result);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.errorCode,
        message: error.message,
      });
    }
    console.error("Error checking application:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Erro ao verificar candidatura",
    });
  }
};

/**
 * Criar candidatura
 */
export const applyToJob = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const userId = req.user?.userId;
    const { coverLetter, portfolio, availability, expectedSalary } = req.body;

    if (!userId) {
      throw new AppError("Não autenticado", 401, "UNAUTHORIZED");
    }

    // Obter candidateId
    const candidate = await prisma.candidate.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!candidate) {
      throw new AppError(
        "Perfil de candidato não encontrado",
        404,
        "CANDIDATE_NOT_FOUND"
      );
    }

    const application = await ApplicationService.createApplication({
      candidateId: candidate.id,
      jobId,
      coverLetter,
      portfolio,
      availability,
      expectedSalary: expectedSalary ? parseFloat(expectedSalary) : undefined,
    });

    res.status(201).json({
      success: true,
      message: "Candidatura enviada com sucesso!",
      data: application,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.errorCode,
        message: error.message,
      });
    }
    console.error("Error applying to job:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Erro ao enviar candidatura",
    });
  }
};

/**
 * Obter candidaturas do candidato
 */
export const getMyApplications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { status } = req.query;

    if (!userId) {
      throw new AppError("Não autenticado", 401, "UNAUTHORIZED");
    }

    // Obter candidateId
    const candidate = await prisma.candidate.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!candidate) {
      return res.json([]);
    }

    const applications = await ApplicationService.getCandidateApplications(
      candidate.id,
      status as any
    );

    res.json(applications);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.errorCode,
        message: error.message,
      });
    }
    console.error("Error fetching applications:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Erro ao carregar candidaturas",
    });
  }
};

/**
 * Obter detalhes de uma candidatura
 */
export const getApplicationDetails = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Não autenticado", 401, "UNAUTHORIZED");
    }

    // Obter candidateId
    const candidate = await prisma.candidate.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!candidate) {
      throw new AppError(
        "Perfil de candidato não encontrado",
        404,
        "CANDIDATE_NOT_FOUND"
      );
    }

    const application = await ApplicationService.getApplicationDetails(
      applicationId,
      candidate.id
    );

    res.json(application);
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
 * Retirar candidatura
 */
export const withdrawApplication = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Não autenticado", 401, "UNAUTHORIZED");
    }

    // Obter candidateId
    const candidate = await prisma.candidate.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!candidate) {
      throw new AppError(
        "Perfil de candidato não encontrado",
        404,
        "CANDIDATE_NOT_FOUND"
      );
    }

    await ApplicationService.withdrawApplication(applicationId, candidate.id);

    res.json({
      success: true,
      message: "Candidatura retirada com sucesso",
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.errorCode,
        message: error.message,
      });
    }
    console.error("Error withdrawing application:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Erro ao retirar candidatura",
    });
  }
};

