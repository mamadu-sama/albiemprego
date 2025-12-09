// Mock Match Score Calculator
// TODO: Replace with real API calls when backend is ready

export interface CandidateProfile {
  skills: string[];
  location: string;
  experienceYears: number;
}

export interface JobForMatch {
  id: string;
  requiredSkills?: string[];
  location: string;
  experienceLevel?: 'entry' | 'junior' | 'mid' | 'senior';
}

// Nearby cities mapping for Castelo Branco region
const nearbyCities: Record<string, string[]> = {
  'Castelo Branco': ['Covilhã', 'Fundão', 'Idanha-a-Nova', 'Penamacor', 'Vila Velha de Ródão'],
  'Covilhã': ['Castelo Branco', 'Fundão', 'Belmonte'],
  'Fundão': ['Castelo Branco', 'Covilhã', 'Penamacor'],
  'Idanha-a-Nova': ['Castelo Branco', 'Penamacor'],
  'Penamacor': ['Castelo Branco', 'Fundão', 'Idanha-a-Nova'],
  'Vila Velha de Ródão': ['Castelo Branco'],
  'Oleiros': ['Castelo Branco', 'Sertã'],
  'Proença-a-Nova': ['Castelo Branco', 'Sertã'],
  'Sertã': ['Oleiros', 'Proença-a-Nova', 'Vila de Rei'],
  'Vila de Rei': ['Sertã'],
};

function isNearby(location1: string, location2: string): boolean {
  return nearbyCities[location1]?.includes(location2) || 
         nearbyCities[location2]?.includes(location1) || 
         false;
}

export function calculateMockMatchScore(
  job: JobForMatch, 
  candidateProfile: CandidateProfile | null
): number | null {
  if (!candidateProfile) return null;
  
  let score = 50; // Base score
  
  // Skills match (max +30)
  const jobSkills = job.requiredSkills || [];
  const candidateSkills = candidateProfile.skills || [];
  if (jobSkills.length > 0) {
    const matchingSkills = jobSkills.filter(skill => 
      candidateSkills.some(cs => cs.toLowerCase().includes(skill.toLowerCase()) || 
                                 skill.toLowerCase().includes(cs.toLowerCase()))
    );
    const skillsScore = Math.min(30, (matchingSkills.length / Math.max(jobSkills.length, 1)) * 30);
    score += skillsScore;
  } else {
    // No skills required, give average points
    score += 15;
  }
  
  // Location match (max +15)
  if (job.location === candidateProfile.location) {
    score += 15;
  } else if (isNearby(job.location, candidateProfile.location)) {
    score += 10;
  }
  
  // Experience match (max +10)
  const yearsExp = candidateProfile.experienceYears || 0;
  if (!job.experienceLevel) {
    score += 5; // No experience requirement
  } else if (job.experienceLevel === 'entry' && yearsExp <= 2) {
    score += 10;
  } else if (job.experienceLevel === 'junior' && yearsExp >= 1 && yearsExp <= 3) {
    score += 10;
  } else if (job.experienceLevel === 'mid' && yearsExp >= 3 && yearsExp <= 6) {
    score += 10;
  } else if (job.experienceLevel === 'senior' && yearsExp >= 5) {
    score += 10;
  } else {
    score += 3; // Partial match
  }
  
  return Math.min(100, Math.max(0, Math.round(score)));
}

// Generate mock breakdown scores
export function generateMockBreakdown(overallScore: number) {
  // Create variations around the overall score
  const variation = 15;
  const skills = Math.min(100, Math.max(0, overallScore + Math.floor(Math.random() * variation * 2) - variation));
  const experience = Math.min(100, Math.max(0, overallScore + Math.floor(Math.random() * variation * 2) - variation));
  const location = Math.min(100, Math.max(0, overallScore + Math.floor(Math.random() * variation * 2) - variation));
  
  return { skills, experience, location };
}

// Generate a random match score for demo purposes
export function generateRandomMatchScore(jobId: string): number {
  // Use job ID to generate consistent score per job
  const hash = jobId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseScore = 60;
  const variation = 35;
  return baseScore + (hash % variation);
}

// Mock candidate profile for demo
export const mockCandidateProfile: CandidateProfile = {
  skills: ['React', 'TypeScript', 'JavaScript', 'Node.js', 'CSS', 'HTML', 'Git'],
  location: 'Castelo Branco',
  experienceYears: 4,
};
