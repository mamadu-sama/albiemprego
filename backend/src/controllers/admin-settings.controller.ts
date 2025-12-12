import { Request, Response } from "express";
import { validationResult } from "express-validator";
import prisma from "../config/database";
import { AppError } from "../middlewares/errorHandler";

/**
 * Obter configurações da plataforma
 * GET /api/v1/admin/settings
 */
export const getSettings = async (req: Request, res: Response) => {
  try {
    // Buscar configurações (sempre há apenas 1 registo - singleton)
    let settings = await prisma.platformSettings.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    // Se não existir, criar com valores padrão
    if (!settings) {
      settings = await prisma.platformSettings.create({
        data: {},
      });
    }

    return res.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw new AppError(
      "Erro ao buscar configurações",
      500,
      "SETTINGS_FETCH_ERROR"
    );
  }
};

/**
 * Atualizar configurações da plataforma
 * PUT /api/v1/admin/settings
 */
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Dados inválidos",
        errors: errors.array(),
      });
    }

    const {
      siteName,
      siteDescription,
      contactEmail,
      supportEmail,
      requireCompanyApproval,
      requireJobApproval,
      allowGuestApplications,
      enableNotifications,
      enableEmailAlerts,
      maxJobsPerCompany,
      maxApplicationsPerCandidate,
      jobExpirationDays,
    } = req.body;

    // Buscar configuração existente
    let settings = await prisma.platformSettings.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    // Preparar dados para atualização
    const updateData: any = {};

    if (siteName !== undefined) updateData.siteName = siteName;
    if (siteDescription !== undefined)
      updateData.siteDescription = siteDescription;
    if (contactEmail !== undefined) updateData.contactEmail = contactEmail;
    if (supportEmail !== undefined) updateData.supportEmail = supportEmail;
    if (requireCompanyApproval !== undefined)
      updateData.requireCompanyApproval = requireCompanyApproval;
    if (requireJobApproval !== undefined)
      updateData.requireJobApproval = requireJobApproval;
    if (allowGuestApplications !== undefined)
      updateData.allowGuestApplications = allowGuestApplications;
    if (enableNotifications !== undefined)
      updateData.enableNotifications = enableNotifications;
    if (enableEmailAlerts !== undefined)
      updateData.enableEmailAlerts = enableEmailAlerts;
    if (maxJobsPerCompany !== undefined)
      updateData.maxJobsPerCompany = maxJobsPerCompany;
    if (maxApplicationsPerCandidate !== undefined)
      updateData.maxApplicationsPerCandidate = maxApplicationsPerCandidate;
    if (jobExpirationDays !== undefined)
      updateData.jobExpirationDays = jobExpirationDays;

    if (settings) {
      // Atualizar existente
      settings = await prisma.platformSettings.update({
        where: { id: settings.id },
        data: updateData,
      });
    } else {
      // Criar novo com dados fornecidos
      settings = await prisma.platformSettings.create({
        data: updateData,
      });
    }

    return res.json({
      message: "Configurações atualizadas com sucesso",
      settings,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    throw new AppError(
      "Erro ao atualizar configurações",
      500,
      "SETTINGS_UPDATE_ERROR"
    );
  }
};

/**
 * Obter configurações públicas (sem autenticação)
 * GET /api/v1/settings/public
 */
export const getPublicSettings = async (req: Request, res: Response) => {
  try {
    const settings = await prisma.platformSettings.findFirst({
      orderBy: { updatedAt: "desc" },
      select: {
        siteName: true,
        siteDescription: true,
        allowGuestApplications: true,
      },
    });

    // Se não existir, retornar valores padrão
    if (!settings) {
      return res.json({
        siteName: "AlbiEmprego",
        siteDescription: "Plataforma de emprego para a região de Castelo Branco",
        allowGuestApplications: false,
      });
    }

    return res.json(settings);
  } catch (error) {
    console.error("Error fetching public settings:", error);
    throw new AppError(
      "Erro ao buscar configurações públicas",
      500,
      "PUBLIC_SETTINGS_FETCH_ERROR"
    );
  }
};

