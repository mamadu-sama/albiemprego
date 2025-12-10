import { Request, Response } from "express";
import { PlanRequestService } from "../services/plan-request.service";
import { AppError } from "../utils/errors";

/**
 * Listar todas as solicitações (Admin)
 */
export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const { status, type, page, limit } = req.query;

    const result = await PlanRequestService.getAllRequests(
      status as any,
      type as any,
      page ? parseInt(page as string) : undefined,
      limit ? parseInt(limit as string) : undefined
    );

    res.json({
      success: true,
      ...result,
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
 * Obter detalhes de uma solicitação
 */
export const getRequestById = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;

    const request = await PlanRequestService.getRequestById(requestId);

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.errorCode,
        message: error.message,
      });
    }
    console.error("Error fetching request:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Erro ao carregar solicitação",
    });
  }
};

/**
 * Aprovar solicitação
 */
export const approveRequest = async (req: Request, res: Response) => {
  try {
    const adminId = req.user?.userId;
    const { requestId } = req.params;
    const { adminNotes } = req.body;

    if (!adminId) {
      throw new AppError("Não autorizado", 401, "UNAUTHORIZED");
    }

    const request = await PlanRequestService.approveRequest(
      requestId,
      adminId,
      adminNotes
    );

    res.json({
      success: true,
      message: "Solicitação aprovada com sucesso",
      data: request,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.errorCode,
        message: error.message,
      });
    }
    console.error("Error approving request:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Erro ao aprovar solicitação",
    });
  }
};

/**
 * Rejeitar solicitação
 */
export const rejectRequest = async (req: Request, res: Response) => {
  try {
    const adminId = req.user?.userId;
    const { requestId } = req.params;
    const { adminNotes } = req.body;

    if (!adminId) {
      throw new AppError("Não autorizado", 401, "UNAUTHORIZED");
    }

    const request = await PlanRequestService.rejectRequest(
      requestId,
      adminId,
      adminNotes
    );

    res.json({
      success: true,
      message: "Solicitação rejeitada",
      data: request,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.errorCode,
        message: error.message,
      });
    }
    console.error("Error rejecting request:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Erro ao rejeitar solicitação",
    });
  }
};

/**
 * Estatísticas de solicitações
 */
export const getRequestStats = async (req: Request, res: Response) => {
  try {
    const stats = await PlanRequestService.getRequestStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.errorCode,
        message: error.message,
      });
    }
    console.error("Error fetching stats:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Erro ao carregar estatísticas",
    });
  }
};

