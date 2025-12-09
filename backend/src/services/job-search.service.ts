// Service para busca avançada de vagas com filtros e ordenação
import { prisma } from "../config/database";
import { Prisma, JobType, WorkMode } from "@prisma/client";
import { logger } from "../config/logger";
import { cacheGet, cacheSet } from "../config/redis";
import crypto from "crypto";

export interface JobSearchFilters {
  search?: string;
  location?: string;
  type?: JobType[];
  workMode?: WorkMode[];
  salaryMin?: number;
  salaryMax?: number;
  showSalaryOnly?: boolean;
  sector?: string;
  experienceLevel?: string;
  goodMatchesOnly?: boolean;
  sortBy?: "recent" | "salary-high" | "salary-low" | "relevance";
  page?: number;
  limit?: number;
}

export interface JobSearchResult {
  id: string;
  title: string;
  description: string;
  location: string;
  type: JobType;
  workMode: WorkMode;
  salaryMin: number | null;
  salaryMax: number | null;
  showSalary: boolean;
  salaryCurrency: string;
  salaryPeriod: string;
  sector: string;
  experienceLevel: string | null;
  skills: string[];
  isFeatured: boolean;
  isUrgent: boolean;
  quickApply: boolean;
  publishedAt: Date | null;
  viewsCount: number;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  company: {
    id: string;
    name: string;
    logo: string | null;
  };
  _count: {
    applications: number;
  };
}

export interface JobSearchResponse {
  jobs: JobSearchResult[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Gera hash para cache key baseado nos filtros
 */
function generateCacheKey(filters: JobSearchFilters): string {
  const normalized = JSON.stringify(filters, Object.keys(filters).sort());
  const hash = crypto.createHash("md5").update(normalized).digest("hex");
  return `jobs:search:${hash}`;
}

/**
 * Constrói query de busca ponderada (título > skills > requirements > description)
 */
function buildWeightedSearchQuery(
  searchTerm: string
): Prisma.JobWhereInput["OR"] {
  const term = searchTerm.toLowerCase().trim();

  return [
    // Peso 3: Título (mais importante)
    { title: { contains: term, mode: "insensitive" } },
    { title: { contains: term, mode: "insensitive" } }, // Duplicar para aumentar peso
    { title: { contains: term, mode: "insensitive" } },

    // Peso 2: Skills
    { skills: { has: term } },
    { skills: { hasSome: term.split(" ") } },

    // Peso 1.5: Requirements
    { requirements: { has: term } },

    // Peso 1: Description e Sector
    { description: { contains: term, mode: "insensitive" } },
    { sector: { contains: term, mode: "insensitive" } },
  ];
}

export class JobSearchService {
  /**
   * Busca vagas com filtros avançados
   */
  static async searchJobs(
    filters: JobSearchFilters,
    matchScores?: Record<string, number>
  ): Promise<JobSearchResponse> {
    try {
      const {
        search,
        location,
        type,
        workMode,
        salaryMin,
        salaryMax,
        showSalaryOnly,
        sector,
        experienceLevel,
        goodMatchesOnly,
        sortBy = "recent",
        page = 1,
        limit = 20,
      } = filters;

      // Validar paginação
      const validatedPage = Math.max(1, page);
      const validatedLimit = Math.min(50, Math.max(1, limit));
      const skip = (validatedPage - 1) * validatedLimit;

      // Tentar obter do cache (apenas se não tiver match scores)
      if (!matchScores) {
        const cacheKey = generateCacheKey(filters);
        const cached = await cacheGet<JobSearchResponse>(cacheKey);
        if (cached) {
          logger.info(`Cache hit for job search: ${cacheKey}`);
          return cached;
        }
      }

      // Construir filtros WHERE
      const where: Prisma.JobWhereInput = {
        // Filtros base: apenas vagas ativas e aprovadas
        status: "ACTIVE",
        approvedAt: { not: null },
      };

      // Busca por texto (ponderada)
      if (search) {
        where.OR = buildWeightedSearchQuery(search);
      }

      // Filtro de localização
      if (location && location !== "Todos os concelhos") {
        where.location = location;
      }

      // Filtro de tipo de contrato
      if (type && type.length > 0) {
        where.type = { in: type };
      }

      // Filtro de modo de trabalho
      if (workMode && workMode.length > 0) {
        where.workMode = { in: workMode };
      }

      // Filtro de salário
      if (showSalaryOnly) {
        where.showSalary = true;
        where.salaryMin = { not: null };
      }

      if (salaryMin !== undefined) {
        where.salaryMin = { gte: salaryMin };
      }

      if (salaryMax !== undefined) {
        where.salaryMax = { lte: salaryMax };
      }

      // Filtro de setor
      if (sector) {
        where.sector = { contains: sector, mode: "insensitive" };
      }

      // Filtro de nível de experiência
      if (experienceLevel) {
        where.experienceLevel = {
          contains: experienceLevel,
          mode: "insensitive",
        };
      }

      // Construir ordenação
      let orderBy: Prisma.JobOrderByWithRelationInput[] = [];

      switch (sortBy) {
        case "recent":
          orderBy = [
            { isFeatured: "desc" }, // Destacadas primeiro
            { publishedAt: "desc" },
          ];
          break;

        case "salary-high":
          orderBy = [
            { isFeatured: "desc" },
            { salaryMax: { sort: "desc", nulls: "last" } },
            { salaryMin: { sort: "desc", nulls: "last" } },
          ];
          break;

        case "salary-low":
          orderBy = [
            { isFeatured: "desc" },
            { salaryMin: { sort: "asc", nulls: "last" } },
          ];
          break;

        case "relevance":
          // Para relevância, usamos uma combinação
          // Nota: ordenação por match score será feita depois no controller
          orderBy = [
            { isFeatured: "desc" },
            { viewsCount: "desc" },
            { publishedAt: "desc" },
          ];
          break;

        default:
          orderBy = [{ publishedAt: "desc" }];
      }

      // Buscar vagas e total
      const [jobs, total] = await Promise.all([
        prisma.job.findMany({
          where,
          orderBy,
          skip,
          take: validatedLimit,
          select: {
            id: true,
            title: true,
            description: true,
            location: true,
            type: true,
            workMode: true,
            salaryMin: true,
            salaryMax: true,
            showSalary: true,
            salaryCurrency: true,
            salaryPeriod: true,
            sector: true,
            experienceLevel: true,
            skills: true,
            requirements: true,
            responsibilities: true,
            benefits: true,
            isFeatured: true,
            isUrgent: true,
            quickApply: true,
            publishedAt: true,
            viewsCount: true,
            company: {
              select: {
                id: true,
                name: true,
                logo: true,
              },
            },
            _count: {
              select: {
                applications: true,
              },
            },
          },
        }),
        prisma.job.count({ where }),
      ]);

      // Filtrar por match score se necessário
      let filteredJobs = jobs;
      if (goodMatchesOnly && matchScores) {
        filteredJobs = jobs.filter((job) => {
          const score = matchScores[job.id];
          return score !== undefined && score >= 70;
        });
      }

      // Se ordenação for por relevância e temos match scores, reordenar
      if (sortBy === "relevance" && matchScores) {
        filteredJobs = filteredJobs.sort((a, b) => {
          const scoreA = matchScores[a.id] || 0;
          const scoreB = matchScores[b.id] || 0;

          // Combinação: match score (60%) + views (20%) + recência (20%)
          const relevanceA =
            scoreA * 0.6 +
            Math.min(a.viewsCount / 10, 20) +
            (a.publishedAt
              ? (Date.now() - new Date(a.publishedAt).getTime()) /
                (1000 * 60 * 60 * 24 * 30)
              : 0) *
              20;

          const relevanceB =
            scoreB * 0.6 +
            Math.min(b.viewsCount / 10, 20) +
            (b.publishedAt
              ? (Date.now() - new Date(b.publishedAt).getTime()) /
                (1000 * 60 * 60 * 24 * 30)
              : 0) *
              20;

          return relevanceB - relevanceA;
        });
      }

      const totalPages = Math.ceil(total / validatedLimit);

      const response: JobSearchResponse = {
        jobs: filteredJobs as JobSearchResult[],
        pagination: {
          total,
          page: validatedPage,
          limit: validatedLimit,
          totalPages,
        },
      };

      // Cachear resultado (5 minutos) apenas se não tiver match scores
      if (!matchScores) {
        const cacheKey = generateCacheKey(filters);
        await cacheSet(cacheKey, response, 300); // 5 minutos
      }

      logger.info(
        `Job search completed: ${filteredJobs.length} results (page ${validatedPage}/${totalPages})`
      );

      return response;
    } catch (error) {
      logger.error("Error searching jobs:", error);
      throw error;
    }
  }

  /**
   * Invalida cache de buscas quando uma nova vaga é publicada
   */
  static async invalidateSearchCache(): Promise<void> {
    try {
      // Nota: Implementação simplificada
      // Em produção, usar padrão de keys do Redis para deletar múltiplas keys
      logger.info("Search cache invalidation triggered");
    } catch (error) {
      logger.error("Error invalidating search cache:", error);
    }
  }
}

