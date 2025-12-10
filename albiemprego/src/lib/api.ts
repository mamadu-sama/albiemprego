// Cliente API para comunicação com o backend
import axios, { AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1";

// Criar instância do axios
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros e refresh token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Se erro 401 e não é rota de login/refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        // Tentar renovar o token
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);

        // Retentar a requisição original
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Se falhar o refresh, fazer logout
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Tipos de resposta da API
export interface ApiError {
  error: string;
  message: string;
  details?: any;
  timestamp: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  type: "CANDIDATO" | "EMPRESA" | "ADMIN";
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  candidate?: {
    id: string;
    profileCompleteness: number;
    skills?: string[];
    experienceYears?: number;
    currentPosition?: string;
    cvUrl?: string;
    experiences?: Experience[];
    educations?: Education[];
  };
  company?: {
    id: string;
    name: string;
    nif: string;
    website?: string;
    sector?: string;
    employees?: string;
    description?: string;
    logo?: string;
  };
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterResponse extends LoginResponse {
  message: string;
}

// Funções de autenticação
export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  async register(data: {
    email: string;
    password: string;
    name: string;
    type: "candidato" | "empresa";
    companyName?: string;
    nif?: string;
    phone?: string;
  }): Promise<RegisterResponse> {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  async resetPassword(
    token: string,
    password: string
  ): Promise<{ message: string }> {
    const response = await api.post("/auth/reset-password", {
      token,
      password,
    });
    return response.data;
  },

  async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; expiresIn: number }> {
    const response = await api.post("/auth/refresh", { refreshToken });
    return response.data;
  },
};

// Funções de perfil de utilizador
export const userApi = {
  async getProfile(): Promise<User> {
    const response = await api.get("/users/me");
    return response.data;
  },

  async updateProfile(data: {
    name?: string;
    phone?: string;
    location?: string;
    bio?: string;
  }): Promise<User> {
    const response = await api.patch("/users/me", data);
    return response.data;
  },

  async uploadAvatar(file: File): Promise<User> {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await api.post("/users/me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async deleteAvatar(): Promise<User> {
    const response = await api.delete("/users/me/avatar");
    return response.data;
  },

  async updateEmail(data: {
    newEmail: string;
    currentPassword: string;
  }): Promise<User> {
    const response = await api.patch("/users/me/email", data);
    return response.data;
  },

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    const response = await api.patch("/users/me/password", data);
    return response.data;
  },

  async deleteAccount(password: string): Promise<{ message: string }> {
    const response = await api.delete("/users/me", {
      data: { password },
    });
    return response.data;
  },
};

// Tipos para Candidato
export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

export interface Language {
  id: string;
  language: string;
  level: "BASIC" | "INTERMEDIATE" | "ADVANCED" | "NATIVE";
}

export interface CandidateProfile {
  id: string;
  userId: string;
  cvUrl?: string;
  skills: string[];
  experienceYears?: number;
  currentPosition?: string;
  profileCompleteness: number;
  user: User;
  experiences: Experience[];
  educations: Education[];
  languages: Language[];
}

// Funções de perfil de candidato
export const candidateApi = {
  async getProfile(): Promise<CandidateProfile> {
    const response = await api.get("/candidates/me");
    return response.data;
  },

  async getProfileCompleteness(): Promise<{
    percentage: number;
    missingFields: string[];
    completedFields: number;
    totalFields: number;
  }> {
    const response = await api.get("/candidates/me/completeness");
    return response.data;
  },

  async updateProfile(data: {
    skills?: string[];
    experienceYears?: number;
    currentPosition?: string;
  }): Promise<any> {
    const response = await api.patch("/candidates/me", data);
    return response.data;
  },

  async uploadCV(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("cv", file);

    const response = await api.post("/candidates/me/cv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Experiências
  async createExperience(data: Omit<Experience, "id">): Promise<Experience> {
    const response = await api.post("/candidates/me/experiences", data);
    return response.data;
  },

  async updateExperience(
    id: string,
    data: Partial<Omit<Experience, "id">>
  ): Promise<Experience> {
    const response = await api.patch(`/candidates/me/experiences/${id}`, data);
    return response.data;
  },

  async deleteExperience(id: string): Promise<void> {
    await api.delete(`/candidates/me/experiences/${id}`);
  },

  // Educação
  async createEducation(data: Omit<Education, "id">): Promise<Education> {
    const response = await api.post("/candidates/me/education", data);
    return response.data;
  },

  async updateEducation(
    id: string,
    data: Partial<Omit<Education, "id">>
  ): Promise<Education> {
    const response = await api.patch(`/candidates/me/education/${id}`, data);
    return response.data;
  },

  async deleteEducation(id: string): Promise<void> {
    await api.delete(`/candidates/me/education/${id}`);
  },

  // Idiomas
  async createLanguage(data: Omit<Language, "id">): Promise<Language> {
    const response = await api.post("/candidates/me/languages", data);
    return response.data;
  },

  async updateLanguage(
    id: string,
    level: Language["level"]
  ): Promise<Language> {
    const response = await api.patch(`/candidates/me/languages/${id}`, {
      level,
    });
    return response.data;
  },

  async deleteLanguage(id: string): Promise<void> {
    await api.delete(`/candidates/me/languages/${id}`);
  },
};

// Tipos para Empresa
export interface CompanyProfile {
  id: string;
  userId: string;
  name: string;
  nif: string;
  website?: string;
  sector?: string;
  employees?: string;
  description?: string;
  logo?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  jobs?: Array<{
    id: string;
    title: string;
    location: string;
    type: string;
    workMode: string;
    status: string;
    publishedAt?: string;
    createdAt: string;
    _count?: {
      applications: number;
    };
  }>;
}

export const companyApi = {
  async getProfile(): Promise<CompanyProfile> {
    const response = await api.get("/companies/me");
    return response.data;
  },

  async getPublicProfile(companyId: string): Promise<CompanyProfile> {
    const response = await api.get(`/companies/${companyId}`);
    return response.data;
  },

  async updateProfile(data: {
    name?: string;
    website?: string;
    sector?: string;
    employees?: string;
    description?: string;
  }): Promise<CompanyProfile> {
    const response = await api.patch("/companies/me", data);
    return response.data;
  },

  async uploadLogo(file: File): Promise<CompanyProfile> {
    const formData = new FormData();
    formData.append("logo", file);
    const response = await api.post("/companies/me/logo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async deleteLogo(): Promise<CompanyProfile> {
    const response = await api.delete("/companies/me/logo");
    return response.data;
  },
};

// Tipos para Vagas (Jobs)
export interface Job {
  id: string;
  companyId: string;
  title: string;
  department?: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  skills: string[];
  location: string;
  address?: string;
  type: "FULL_TIME" | "PART_TIME" | "TEMPORARY" | "INTERNSHIP" | "FREELANCE";
  workMode: "PRESENCIAL" | "REMOTO" | "HIBRIDO";
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  salaryPeriod: string;
  showSalary: boolean;
  sector: string;
  experienceLevel?: string;
  status: "DRAFT" | "PENDING" | "ACTIVE" | "PAUSED" | "CLOSED" | "REJECTED";
  applicationDeadline?: string;
  viewsCount: number;
  approvedAt?: string;
  publishedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  isFeatured?: boolean;
  isUrgent?: boolean;
  quickApply?: boolean;
  createdAt: string;
  updatedAt: string;
  company?: {
    id: string;
    name: string;
    logo?: string;
    sector?: string;
  };
  _count?: {
    applications: number;
  };
  matchScore?: number; // Score de match (apenas para candidatos autenticados)
}

export interface CreateJobDTO {
  title: string;
  department?: string;
  description: string;
  requirements: string[];
  responsibilities?: string[];
  benefits?: string[];
  skills?: string[];
  location: string;
  address?: string;
  type: string;
  workMode: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: string;
  showSalary?: boolean;
  sector: string;
  experienceLevel?: string;
  applicationDeadline?: string;
}

export interface JobFilters {
  search?: string;
  location?: string;
  type?: string;
  workMode?: string;
  experienceLevel?: string;
  sector?: string;
  salaryMin?: number;
  salaryMax?: number;
  companyId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface JobSearchFilters {
  search?: string;
  location?: string;
  type?: string | string[];
  workMode?: string | string[];
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

export interface JobsResponse {
  jobs: Job[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  matchScores?: Record<string, number>; // jobId -> score (apenas para candidatos)
}

export interface MatchScoreBreakdown {
  skills: number;
  experience: number;
  location: number;
}

export const jobApi = {
  async listJobs(filters?: JobFilters): Promise<JobsResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const response = await api.get(`/jobs?${params.toString()}`);
    return response.data;
  },

  async getJob(jobId: string): Promise<Job> {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  },

  async createJob(data: CreateJobDTO): Promise<Job> {
    const response = await api.post("/jobs", data);
    return response.data;
  },

  async updateJob(jobId: string, data: Partial<CreateJobDTO>): Promise<Job> {
    const response = await api.patch(`/jobs/${jobId}`, data);
    return response.data;
  },

  async deleteJob(jobId: string): Promise<{ message: string }> {
    const response = await api.delete(`/jobs/${jobId}`);
    return response.data;
  },

  async publishJob(jobId: string): Promise<Job> {
    const response = await api.patch(`/jobs/${jobId}/publish`);
    return response.data;
  },

  async pauseJob(jobId: string): Promise<Job> {
    const response = await api.patch(`/jobs/${jobId}/pause`);
    return response.data;
  },

  async closeJob(jobId: string): Promise<Job> {
    const response = await api.patch(`/jobs/${jobId}/close`);
    return response.data;
  },

  async reactivateJob(jobId: string): Promise<Job> {
    const response = await api.patch(`/jobs/${jobId}/reactivate`);
    return response.data;
  },

  async getMyJobs(status?: string): Promise<Job[]> {
    const params = status ? `?status=${status}` : '';
    const response = await api.get(`/jobs/my-jobs${params}`);
    return response.data;
  },

  async getMyJobsStats(): Promise<{
    total: number;
    byStatus: {
      draft: number;
      active: number;
      paused: number;
      closed: number;
      pending: number;
      rejected: number;
    };
    totalApplications: number;
    totalViews: number;
  }> {
    const response = await api.get('/jobs/my-jobs/stats');
    return response.data;
  },

  /**
   * Busca pública avançada de vagas com filtros e Match Score
   * Autenticação opcional - se autenticado como candidato, retorna match scores
   */
  async searchJobs(filters?: JobSearchFilters): Promise<JobsResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Se for array (type ou workMode), adicionar cada valor separadamente
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    const response = await api.get(`/jobs/search?${params.toString()}`);
    return response.data;
  },

  /**
   * Calcula o match score para uma vaga específica
   * Requer autenticação como candidato
   */
  async getMatchScore(
    jobId: string
  ): Promise<{ overall: number; breakdown: MatchScoreBreakdown }> {
    const response = await api.get(`/jobs/${jobId}/match-score`);
    return response.data;
  },

  /**
   * Obter vagas recomendadas para o candidato (baseado no perfil)
   * Requer autenticação como candidato
   */
  async getRecommendedJobs(limit: number = 6): Promise<{ jobs: Job[]; total: number }> {
    const response = await api.get(`/jobs/recommended?limit=${limit}`);
    return response.data;
  },

  async getFeaturedHomepageJobs(limit: number = 6): Promise<Job[]> {
    const response = await api.get(`/jobs/featured/homepage?limit=${limit}`);
    return response.data;
  },

  async getFeaturedJobs(limit: number = 20): Promise<Job[]> {
    const response = await api.get(`/jobs/featured/listing?limit=${limit}`);
    return response.data;
  },

  async getUrgentJobs(limit: number = 10): Promise<Job[]> {
    const response = await api.get(`/jobs/urgent?limit=${limit}`);
    return response.data;
  },
};

// ============================================
// SAVED JOBS API
// ============================================

export interface SavedJob {
  id: string;
  savedAt: string;
  job: Job;
}

export const savedJobsApi = {
  /**
   * Guardar uma vaga
   */
  async saveJob(jobId: string): Promise<{ message: string; savedJob: SavedJob }> {
    const response = await api.post(`/saved-jobs/${jobId}`);
    return response.data;
  },

  /**
   * Remover vaga guardada
   */
  async unsaveJob(jobId: string): Promise<{ message: string }> {
    const response = await api.delete(`/saved-jobs/${jobId}`);
    return response.data;
  },

  /**
   * Obter todas as vagas guardadas
   */
  async getSavedJobs(): Promise<{ savedJobs: SavedJob[]; total: number }> {
    const response = await api.get("/saved-jobs");
    return response.data;
  },

  /**
   * Obter IDs das vagas guardadas (para marcar na listagem)
   */
  async getSavedJobIds(): Promise<{ savedJobIds: string[] }> {
    const response = await api.get("/saved-jobs/ids");
    return response.data;
  },

  /**
   * Verificar se uma vaga está guardada
   */
  async checkIfSaved(jobId: string): Promise<{ isSaved: boolean }> {
    const response = await api.get(`/saved-jobs/${jobId}/check`);
    return response.data;
  },
};

// ============================================
// ADMIN - PLANOS
// ============================================

export const adminPlanApi = {
  async listPlans(includeInactive: boolean = false): Promise<any[]> {
    const response = await api.get(`/admin/plans?includeInactive=${includeInactive}`);
    return response.data;
  },

  async getPlan(id: string): Promise<any> {
    const response = await api.get(`/admin/plans/${id}`);
    return response.data;
  },

  async createPlan(data: any): Promise<any> {
    const response = await api.post("/admin/plans", data);
    return response.data;
  },

  async updatePlan(id: string, data: any): Promise<any> {
    const response = await api.patch(`/admin/plans/${id}`, data);
    return response.data;
  },

  async togglePlan(id: string): Promise<any> {
    const response = await api.patch(`/admin/plans/${id}/toggle`);
    return response.data;
  },

  async deletePlan(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/admin/plans/${id}`);
    return response.data;
  },
};

// ============================================
// ADMIN - PACOTES DE CRÉDITOS
// ============================================

export const adminCreditPackageApi = {
  async listPackages(includeInactive: boolean = false): Promise<any[]> {
    const response = await api.get(`/admin/credit-packages?includeInactive=${includeInactive}`);
    return response.data;
  },

  async getPackage(id: string): Promise<any> {
    const response = await api.get(`/admin/credit-packages/${id}`);
    return response.data;
  },

  async createPackage(data: any): Promise<any> {
    const response = await api.post("/admin/credit-packages", data);
    return response.data;
  },

  async updatePackage(id: string, data: any): Promise<any> {
    const response = await api.patch(`/admin/credit-packages/${id}`, data);
    return response.data;
  },

  async togglePackage(id: string): Promise<any> {
    const response = await api.patch(`/admin/credit-packages/${id}/toggle`);
    return response.data;
  },

  async deletePackage(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/admin/credit-packages/${id}`);
    return response.data;
  },
};

// ============================================
// ADMIN - ATRIBUIÇÕES E STATS
// ============================================

export const adminSubscriptionApi = {
  async assignPlan(companyId: string, planId: string): Promise<any> {
    const response = await api.post(`/admin/companies/${companyId}/assign-plan`, { planId });
    return response.data;
  },

  async addCredits(companyId: string, credits: {
    featured?: number;
    homepage?: number;
    urgent?: number;
    duration: string;
    notes?: string;
  }): Promise<any> {
    const response = await api.post(`/admin/companies/${companyId}/add-credits`, credits);
    return response.data;
  },

  async getStats(): Promise<{
    totalRevenue: number;
    monthlyRevenue: number;
    activeSubscribers: number;
    subscriptionsByPlan: any[];
    creditPackagesSold: number;
    conversionRate: string;
    totalCompanies: number;
    paidSubscribers: number;
  }> {
    const response = await api.get("/admin/subscriptions/stats");
    return response.data;
  },

  async listTransactions(filters?: any): Promise<any[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    const response = await api.get(`/admin/transactions?${params.toString()}`);
    return response.data;
  },
};

// ============================================
// EMPRESA - ASSINATURAS E CRÉDITOS
// ============================================

export const subscriptionApi = {
  async getPlans(): Promise<any[]> {
    const response = await api.get("/subscriptions/plans");
    return response.data;
  },

  async getCreditPackages(): Promise<any[]> {
    const response = await api.get("/subscriptions/credit-packages");
    return response.data;
  },

  async getCurrentSubscription(): Promise<{
    subscription: any;
    plan: any;
    credits: {
      featured: number;
      homepage: number;
      urgent: number;
    };
    unreadNotifications: number;
  }> {
    const response = await api.get("/subscriptions/current");
    return response.data;
  },

  async getTransactions(): Promise<any[]> {
    const response = await api.get("/subscriptions/transactions");
    return response.data;
  },

  async getNotifications(unreadOnly: boolean = false): Promise<any[]> {
    const response = await api.get(`/subscriptions/notifications?unreadOnly=${unreadOnly}`);
    return response.data;
  },

  async markNotificationAsRead(id: string): Promise<any> {
    const response = await api.patch(`/subscriptions/notifications/${id}/read`);
    return response.data;
  },
};

// ============================================
// EMPRESA - CRÉDITOS EM VAGAS
// ============================================

export const jobCreditApi = {
  async applyCredit(jobId: string, creditType: "FEATURED" | "HOMEPAGE" | "URGENT"): Promise<any> {
    const response = await api.post(`/jobs/${jobId}/apply-credit`, { creditType });
    return response.data;
  },
  
  async applyCreditToJob(jobId: string, creditType: string, duration: number): Promise<any> {
    const response = await api.post(`/jobs/${jobId}/apply-credit`, { creditType, duration });
    return response.data;
  },
  
  async removeCreditFromJob(usageId: string): Promise<any> {
    const response = await api.delete(`/jobs/credit-usage/${usageId}`);
    return response.data;
  },

  async getJobAnalytics(jobId: string): Promise<{
    jobId: string;
    hasCredits: boolean;
    usages: any[];
    totals: {
      views: number;
      clicks: number;
      applications: number;
    };
    rates?: {
      clickRate: number;
      applicationRate: number;
      conversionRate: number;
    };
  }> {
    const response = await api.get(`/jobs/${jobId}/analytics`);
    return response.data;
  },
};

// ============================================
// EMPRESA - SOLICITAÇÕES DE PLANOS/CRÉDITOS
// ============================================

export const companyRequestApi = {
  async requestPlan(planId: string, message?: string): Promise<any> {
    const response = await api.post("/company/requests/plan", { planId, message });
    return response.data;
  },

  async requestCredits(packageId: string, message?: string): Promise<any> {
    const response = await api.post("/company/requests/credits", { packageId, message });
    return response.data;
  },

  async getMyRequests(status?: string): Promise<any> {
    const response = await api.get("/company/requests", {
      params: { status },
    });
    return response.data;
  },

  async cancelRequest(requestId: string): Promise<any> {
    const response = await api.delete(`/company/requests/${requestId}`);
    return response.data;
  },
};

// ============================================
// ADMIN - GESTÃO DE SOLICITAÇÕES
// ============================================

export const adminRequestApi = {
  async getAllRequests(filters?: {
    status?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    success: boolean;
    requests: any[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  }> {
    const response = await api.get("/admin/requests", { params: filters });
    return response.data;
  },

  async getRequestById(requestId: string): Promise<any> {
    const response = await api.get(`/admin/requests/${requestId}`);
    return response.data;
  },

  async approveRequest(requestId: string, adminNotes?: string): Promise<any> {
    const response = await api.post(`/admin/requests/${requestId}/approve`, { adminNotes });
    return response.data;
  },

  async rejectRequest(requestId: string, adminNotes?: string): Promise<any> {
    const response = await api.post(`/admin/requests/${requestId}/reject`, { adminNotes });
    return response.data;
  },

  async getRequestStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    byType: any[];
  }> {
    const response = await api.get("/admin/requests/stats");
    return response.data.data;
  },
};

// ============================================
// CANDIDATURA A VAGAS (CANDIDATO)
// ============================================

export interface ApplicationData {
  coverLetter?: string;
  portfolio?: string;
  availability?: string;
  expectedSalary?: number;
}

export const applicationApi = {
  async canApply(jobId: string): Promise<{
    canApply: boolean;
    reasons: string[];
  }> {
    const response = await api.get(`/applications/jobs/${jobId}/can-apply`);
    return response.data;
  },

  async checkApplication(jobId: string): Promise<{
    hasApplied: boolean;
    applicationId?: string;
  }> {
    const response = await api.get(`/applications/jobs/${jobId}/check`);
    return response.data;
  },

  async apply(jobId: string, data: ApplicationData): Promise<any> {
    const response = await api.post(`/applications/jobs/${jobId}/apply`, data);
    return response.data;
  },

  async getMyApplications(status?: string): Promise<any[]> {
    const response = await api.get("/applications/my", {
      params: { status },
    });
    return response.data;
  },

  async getApplicationDetails(applicationId: string): Promise<any> {
    const response = await api.get(`/applications/${applicationId}`);
    return response.data;
  },

  async withdrawApplication(applicationId: string): Promise<any> {
    const response = await api.delete(`/applications/${applicationId}`);
    return response.data;
  },
};

// ============================================
// GESTÃO DE CANDIDATURAS (EMPRESA)
// ============================================

export const companyApplicationApi = {
  async getAll(filters?: { jobId?: string; status?: string }): Promise<any[]> {
    const response = await api.get("/company/applications", {
      params: filters,
    });
    return response.data;
  },

  async getStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
  }> {
    const response = await api.get("/company/applications/stats");
    return response.data;
  },

  async getDetails(applicationId: string): Promise<any> {
    const response = await api.get(`/company/applications/${applicationId}`);
    return response.data;
  },

  async updateStatus(
    applicationId: string,
    status: string,
    note?: string
  ): Promise<any> {
    const response = await api.patch(
      `/company/applications/${applicationId}/status`,
      { status, note }
    );
    return response.data;
  },

  async updateNotes(applicationId: string, internalNotes: string): Promise<any> {
    const response = await api.patch(
      `/company/applications/${applicationId}/notes`,
      { internalNotes }
    );
    return response.data;
  },
};

// Health check
export const healthCheck = async (): Promise<{
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
}> => {
  const response = await axios.get(`${API_URL.replace("/api/v1", "")}/health`);
  return response.data;
};

export default api;
