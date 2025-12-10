import { Request, Response } from "express";
import { PlanRequestService } from "../services/plan-request.service";
import { AppError } from "../utils/errors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Solicitar plano de subscrição
 */
export const requestPlan = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    // Obter companyId a partir do userId
    const company = await prisma.company.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!company) {
      throw new AppError("Empresa não encontrada", 404, "COMPANY_NOT_FOUND");
    }

    const { planId, message } = req.body;

    const request = await PlanRequestService.requestPlan(
      company.id,
      planId,
      message
    );

    res.status(201).json({
      success: true,
      message: "Solicitação enviada com sucesso",
      data: request,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.errorCode,
        message: error.message,
      });
    }
    console.error("Error requesting plan:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Erro ao enviar solicitação",
    });
  }
};

/**
 * Solicitar créditos
 */
export const requestCredits = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    // Obter companyId a partir do userId
    const company = await prisma.company.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!company) {
      throw new AppError("Empresa não encontrada", 404, "COMPANY_NOT_FOUND");
    }

    const { packageId, message } = req.body;

    const request = await PlanRequestService.requestCredits(
      company.id,
      packageId,
      message
    );

    res.status(201).json({
      success: true,
      message: "Solicitação enviada com sucesso",
      data: request,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.errorCode,
        message: error.message,
      });
    }
    console.error("Error requesting credits:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Erro ao enviar solicitação",
    });
  }
};

/**
 * Listar minhas solicitações
 */
export const getMyRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    // Obter companyId a partir do userId
    const company = await prisma.company.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!company) {
      throw new AppError("Empresa não encontrada", 404, "COMPANY_NOT_FOUND");
    }

    const { status } = req.query;

    const requests = await PlanRequestService.getCompanyRequests(
      company.id,
      status as any
    );

    res.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.errorCode,
        message: error.message,
      });
    }
    console.error("Error fetching requests:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Erro ao carregar solicitações",
    });
  }
};

/**
 * Cancelar solicitação
 */
export const cancelRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { requestId } = req.params;

    // Obter companyId a partir do userId
    const company = await prisma.company.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!company) {
      throw new AppError("Empresa não encontrada", 404, "COMPANY_NOT_FOUND");
    }

    const request = await PlanRequestService.cancelRequest(
      requestId,
      company.id
    );

    res.json({
      success: true,
      message: "Solicitação cancelada",
      data: request,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.errorCode,
        message: error.message,
      });
    }
    console.error("Error canceling request:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Erro ao cancelar solicitação",
    });
  }
};

