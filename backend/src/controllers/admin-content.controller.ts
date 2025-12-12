import { Request, Response } from "express";
import { validationResult } from "express-validator";
import prisma from "../config/database";
import { AppError } from "../middlewares/errorHandler";

/**
 * Listar todas as páginas de conteúdo
 * GET /api/v1/admin/content
 */
export const getAllContent = async (req: Request, res: Response) => {
  try {
    const pages = await prisma.contentPage.findMany({
      orderBy: { slug: "asc" },
    });

    return res.json(pages);
  } catch (error) {
    console.error("Error fetching content pages:", error);
    throw new AppError(
      "Erro ao buscar páginas de conteúdo",
      500,
      "CONTENT_FETCH_ERROR"
    );
  }
};

/**
 * Obter página de conteúdo específica
 * GET /api/v1/admin/content/:slug
 */
export const getContentBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const page = await prisma.contentPage.findUnique({
      where: { slug },
    });

    if (!page) {
      throw new AppError("Página não encontrada", 404, "CONTENT_NOT_FOUND");
    }

    return res.json(page);
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("Error fetching content page:", error);
    throw new AppError(
      "Erro ao buscar página de conteúdo",
      500,
      "CONTENT_FETCH_ERROR"
    );
  }
};

/**
 * Atualizar página de conteúdo
 * PUT /api/v1/admin/content/:slug
 */
export const updateContent = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Dados inválidos",
        errors: errors.array(),
      });
    }

    const { slug } = req.params;
    const { title, content } = req.body;

    // Verificar se página existe
    const existingPage = await prisma.contentPage.findUnique({
      where: { slug },
    });

    let page;

    if (existingPage) {
      // Atualizar página existente
      page = await prisma.contentPage.update({
        where: { slug },
        data: {
          title,
          content,
        },
      });
    } else {
      // Criar nova página
      page = await prisma.contentPage.create({
        data: {
          slug,
          title,
          content,
        },
      });
    }

    return res.json({
      message: "Página atualizada com sucesso",
      page,
    });
  } catch (error) {
    console.error("Error updating content page:", error);
    throw new AppError(
      "Erro ao atualizar página de conteúdo",
      500,
      "CONTENT_UPDATE_ERROR"
    );
  }
};

/**
 * Obter página de conteúdo pública (sem autenticação)
 * GET /api/v1/content/:slug
 */
export const getPublicContent = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const page = await prisma.contentPage.findUnique({
      where: { slug },
    });

    if (!page) {
      throw new AppError("Página não encontrada", 404, "CONTENT_NOT_FOUND");
    }

    return res.json(page);
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("Error fetching public content:", error);
    throw new AppError(
      "Erro ao buscar página de conteúdo",
      500,
      "CONTENT_FETCH_ERROR"
    );
  }
};

