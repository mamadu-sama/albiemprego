// Tipos para busca de vagas e Match Score
import { JobType, WorkMode } from "@prisma/client";

/**
 * Filtros para busca de vagas
 */
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

/**
 * Resultado de uma vaga na busca
 */
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
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  isFeatured: boolean;
  isUrgent: boolean;
  quickApply: boolean;
  publishedAt: Date | null;
  viewsCount: number;
  company: {
    id: string;
    name: string;
    logo: string | null;
  };
  _count: {
    applications: number;
  };
  matchScore?: number; // Apenas para candidatos autenticados
}

/**
 * Resposta da busca de vagas
 */
export interface JobSearchResponse {
  jobs: JobSearchResult[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  matchScores?: Record<string, number>; // jobId -> score (apenas para candidatos)
}

/**
 * Resultado do cálculo de Match Score
 */
export interface MatchScoreResult {
  overall: number;
  breakdown: {
    skills: number;
    experience: number;
    location: number;
  };
}

/**
 * Breakdown detalhado do Match Score
 */
export interface MatchScoreBreakdown {
  skills: number;
  experience: number;
  location: number;
}

