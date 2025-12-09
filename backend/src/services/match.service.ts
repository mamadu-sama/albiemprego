// Service para cálculo de Match Score entre candidato e vaga
import { prisma } from "../config/database";
import { logger } from "../config/logger";

export interface MatchScoreResult {
  overall: number;
  breakdown: {
    skills: number;
    experience: number;
    location: number;
  };
}

// Mapa de cidades próximas na região de Castelo Branco
const NEARBY_CITIES: Record<string, string[]> = {
  "Castelo Branco": [
    "Covilhã",
    "Fundão",
    "Idanha-a-Nova",
    "Penamacor",
    "Vila Velha de Ródão",
  ],
  "Covilhã": ["Castelo Branco", "Fundão", "Belmonte"],
  "Fundão": ["Castelo Branco", "Covilhã", "Penamacor"],
  "Idanha-a-Nova": ["Castelo Branco", "Penamacor"],
  "Penamacor": ["Castelo Branco", "Fundão", "Idanha-a-Nova"],
  "Vila Velha de Ródão": ["Castelo Branco"],
  "Oleiros": ["Castelo Branco", "Sertã"],
  "Proença-a-Nova": ["Castelo Branco", "Sertã"],
  "Sertã": ["Oleiros", "Proença-a-Nova", "Vila de Rei"],
  "Vila de Rei": ["Sertã"],
  "Belmonte": ["Covilhã"],
};

/**
 * Verifica se duas cidades são próximas
 */
function isNearbyLocation(location1: string, location2: string): boolean {
  if (location1 === location2) return false; // Mesma cidade não é "próxima"

  return (
    NEARBY_CITIES[location1]?.includes(location2) ||
    NEARBY_CITIES[location2]?.includes(location1) ||
    false
  );
}

/**
 * Calcula o match de skills entre candidato e vaga
 */
function calculateSkillsMatch(
  candidateSkills: string[],
  jobSkills: string[]
): number {
  if (!jobSkills || jobSkills.length === 0) {
    // Se a vaga não tem skills específicas, retorna score neutro
    return 50;
  }

  if (!candidateSkills || candidateSkills.length === 0) {
    // Candidato sem skills, score baixo
    return 20;
  }

  // Normalizar strings para comparação (lowercase, trim)
  const normalizedCandidateSkills = candidateSkills.map((s) =>
    s.toLowerCase().trim()
  );
  const normalizedJobSkills = jobSkills.map((s) => s.toLowerCase().trim());

  // Contar skills que fazem match (incluindo matches parciais)
  let matchCount = 0;
  for (const jobSkill of normalizedJobSkills) {
    const hasMatch = normalizedCandidateSkills.some(
      (candidateSkill) =>
        candidateSkill.includes(jobSkill) || jobSkill.includes(candidateSkill)
    );
    if (hasMatch) matchCount++;
  }

  // Calcular percentagem de match
  const matchPercentage = (matchCount / normalizedJobSkills.length) * 100;

  // Score de 0 a 100
  return Math.round(matchPercentage);
}

/**
 * Calcula o match de experiência entre candidato e vaga
 */
function calculateExperienceMatch(
  candidateYearsOfExperience: number,
  jobExperienceLevel?: string
): number {
  if (!jobExperienceLevel) {
    // Sem requisito de experiência, score neutro
    return 70;
  }

  const yearsExp = candidateYearsOfExperience || 0;
  const levelLower = jobExperienceLevel.toLowerCase();

  // Mapear níveis de experiência para anos esperados
  if (levelLower.includes("entry") || levelLower.includes("sem experiência")) {
    // Entry level: 0-2 anos
    if (yearsExp <= 2) return 100;
    if (yearsExp <= 3) return 80;
    return 60; // Overqualified mas ainda aceitável
  } else if (levelLower.includes("junior")) {
    // Junior: 1-3 anos
    if (yearsExp >= 1 && yearsExp <= 3) return 100;
    if (yearsExp === 0) return 60; // Pode compensar com outras skills
    if (yearsExp <= 5) return 85;
    return 70;
  } else if (
    levelLower.includes("mid") ||
    levelLower.includes("pleno") ||
    levelLower.includes("médio")
  ) {
    // Mid level: 3-6 anos
    if (yearsExp >= 3 && yearsExp <= 6) return 100;
    if (yearsExp >= 2 && yearsExp <= 7) return 85;
    if (yearsExp > 7) return 75; // Overqualified
    return 50;
  } else if (
    levelLower.includes("senior") ||
    levelLower.includes("sénior")
  ) {
    // Senior: 5+ anos
    if (yearsExp >= 5) return 100;
    if (yearsExp >= 4) return 70;
    if (yearsExp >= 3) return 50;
    return 30;
  }

  // Nível não reconhecido, score neutro
  return 60;
}

/**
 * Calcula o match de localização entre candidato e vaga
 */
function calculateLocationMatch(
  candidateLocation: string,
  jobLocation: string
): number {
  if (!candidateLocation || !jobLocation) {
    // Sem informação de localização, score neutro
    return 50;
  }

  const candidateLoc = candidateLocation.trim();
  const jobLoc = jobLocation.trim();

  // Mesma cidade
  if (candidateLoc === jobLoc) {
    return 100;
  }

  // Cidade próxima
  if (isNearbyLocation(candidateLoc, jobLoc)) {
    return 75;
  }

  // Cidades diferentes e distantes
  return 30;
}

/**
 * Calcula o Match Score geral entre um candidato e uma vaga
 *
 * @param jobId - ID da vaga
 * @param userId - ID do utilizador (candidato)
 * @returns Match score de 0 a 100 com breakdown detalhado
 */
export class MatchService {
  static async calculateMatchScore(
    jobId: string,
    userId: string
  ): Promise<MatchScoreResult | null> {
    try {
      // Buscar dados da vaga
      const job = await prisma.job.findUnique({
        where: { id: jobId },
        select: {
          skills: true,
          location: true,
          experienceLevel: true,
        },
      });

      if (!job) {
        logger.warn(`Job not found for match calculation: ${jobId}`);
        return null;
      }

      // Buscar dados do candidato
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          candidate: {
            select: {
              skills: true,
              experienceYears: true,
            },
          },
        },
      });

      if (!user || !user.candidate) {
        logger.warn(`Candidate not found for match calculation: ${userId}`);
        return null;
      }

      const candidate = user.candidate;

      // Calcular match individual de cada critério
      const skillsScore = calculateSkillsMatch(
        candidate.skills || [],
        job.skills || []
      );

      const experienceScore = calculateExperienceMatch(
        candidate.experienceYears || 0,
        job.experienceLevel || undefined
      );

      const locationScore = calculateLocationMatch(
        user.location || "",
        job.location
      );

      // Calcular score geral ponderado
      // Skills: 40%, Experience: 30%, Location: 30%
      const overallScore = Math.round(
        skillsScore * 0.4 + experienceScore * 0.3 + locationScore * 0.3
      );

      logger.info(
        `Match calculated for job ${jobId} and user ${userId}: ${overallScore}%`
      );

      return {
        overall: overallScore,
        breakdown: {
          skills: skillsScore,
          experience: experienceScore,
          location: locationScore,
        },
      };
    } catch (error) {
      logger.error("Error calculating match score:", error);
      return null;
    }
  }

  /**
   * Calcula match scores para múltiplas vagas de uma vez
   *
   * @param jobIds - Array de IDs de vagas
   * @param userId - ID do utilizador (candidato)
   * @returns Mapa de jobId -> MatchScoreResult
   */
  static async calculateBulkMatchScores(
    jobIds: string[],
    userId: string
  ): Promise<Record<string, MatchScoreResult>> {
    try {
      const results: Record<string, MatchScoreResult> = {};

      // Buscar dados do candidato uma única vez
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          candidate: {
            select: {
              skills: true,
              experienceYears: true,
            },
          },
        },
      });

      if (!user || !user.candidate) {
        logger.warn(
          `Candidate not found for bulk match calculation: ${userId}`
        );
        return {};
      }

      const candidate = user.candidate;

      // Buscar todas as vagas de uma vez
      const jobs = await prisma.job.findMany({
        where: { id: { in: jobIds } },
        select: {
          id: true,
          skills: true,
          location: true,
          experienceLevel: true,
        },
      });

      // Calcular match para cada vaga
      for (const job of jobs) {
        const skillsScore = calculateSkillsMatch(
          candidate.skills || [],
          job.skills || []
        );

        const experienceScore = calculateExperienceMatch(
          candidate.experienceYears || 0,
          job.experienceLevel || undefined
        );

        const locationScore = calculateLocationMatch(
          user.location || "",
          job.location
        );

        const overallScore = Math.round(
          skillsScore * 0.4 + experienceScore * 0.3 + locationScore * 0.3
        );

        results[job.id] = {
          overall: overallScore,
          breakdown: {
            skills: skillsScore,
            experience: experienceScore,
            location: locationScore,
          },
        };
      }

      logger.info(
        `Bulk match calculated for ${jobs.length} jobs and user ${userId}`
      );

      return results;
    } catch (error) {
      logger.error("Error calculating bulk match scores:", error);
      return {};
    }
  }
}

