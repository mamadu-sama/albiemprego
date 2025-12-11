// API Admin - Funções para gestão administrativa
import { api } from "./api";

// ==========================================
// GESTÃO DE UTILIZADORES
// ==========================================

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  type: string;
  status: string;
  createdAt: string;
  lastLoginAt?: string;
  applicationCount?: number;
  jobCount?: number;
}

export const adminUserApi = {
  // Listar utilizadores
  list: async (params?: {
    type?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get("/admin/users", { params });
    return response.data;
  },

  // Obter detalhes de utilizador
  getDetails: async (id: string) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  // Atualizar status
  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/admin/users/${id}/status`, { status });
    return response.data;
  },

  // Eliminar utilizador
  delete: async (id: string) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Enviar email
  sendEmail: async (id: string, subject: string, message: string) => {
    const response = await api.post(`/admin/users/${id}/email`, {
      subject,
      message,
    });
    return response.data;
  },

  // Estatísticas
  getStats: async () => {
    const response = await api.get("/admin/users/stats");
    return response.data;
  },
};

// ==========================================
// GESTÃO DE EMPRESAS
// ==========================================

export const adminCompanyApi = {
  // Listar empresas
  list: async (params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get("/admin/companies", { params });
    return response.data;
  },

  // Obter detalhes de empresa
  getDetails: async (id: string) => {
    const response = await api.get(`/admin/companies/${id}`);
    return response.data;
  },

  // Atualizar status
  updateStatus: async (
    id: string,
    status: string,
    rejectionReason?: string
  ) => {
    const response = await api.patch(`/admin/companies/${id}/status`, {
      status,
      rejectionReason,
    });
    return response.data;
  },

  // Eliminar empresa
  delete: async (id: string) => {
    const response = await api.delete(`/admin/companies/${id}`);
    return response.data;
  },

  // Enviar email
  sendEmail: async (id: string, subject: string, message: string) => {
    const response = await api.post(`/admin/companies/${id}/email`, {
      subject,
      message,
    });
    return response.data;
  },

  // Estatísticas
  getStats: async () => {
    const response = await api.get("/admin/companies/stats");
    return response.data;
  },
};

// ==========================================
// GESTÃO DE VAGAS
// ==========================================

export const adminJobApi = {
  // Listar vagas
  list: async (params?: {
    status?: string;
    search?: string;
    hasReports?: boolean;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get("/admin/jobs", { params });
    return response.data;
  },

  // Obter detalhes de vaga
  getDetails: async (id: string) => {
    const response = await api.get(`/admin/jobs/${id}`);
    return response.data;
  },

  // Atualizar status
  updateStatus: async (
    id: string,
    status: string,
    rejectionReason?: string
  ) => {
    const response = await api.patch(`/admin/jobs/${id}/status`, {
      status,
      rejectionReason,
    });
    return response.data;
  },

  // Eliminar vaga
  delete: async (id: string) => {
    const response = await api.delete(`/admin/jobs/${id}`);
    return response.data;
  },

  // Reportar vaga (incrementar denúncias)
  report: async (id: string) => {
    const response = await api.post(`/admin/jobs/${id}/report`);
    return response.data;
  },

  // Limpar denúncias
  clearReports: async (id: string) => {
    const response = await api.patch(`/admin/jobs/${id}/clear-reports`);
    return response.data;
  },

  // Estatísticas
  getStats: async () => {
    const response = await api.get("/admin/jobs/stats");
    return response.data;
  },
};

// ==========================================
// MODO DE MANUTENÇÃO
// ==========================================

export interface MaintenanceMode {
  id: string;
  enabled: boolean;
  message: string | null;
  estimatedEndTime: string | null;
  updatedAt: string;
}

export const adminMaintenanceApi = {
  // Obter estado
  getStatus: async () => {
    const response = await api.get("/admin/maintenance");
    return response.data as MaintenanceMode;
  },

  // Atualizar modo de manutenção
  update: async (data: {
    enabled?: boolean;
    message?: string;
    estimatedEndTime?: string | null;
  }) => {
    const response = await api.put("/admin/maintenance", data);
    return response.data;
  },
};

// Endpoint público (sem auth)
export const maintenanceApi = {
  getStatus: async () => {
    const response = await api.get("/maintenance/status");
    return response.data;
  },
};

// ==========================================
// GESTÃO DE NOTIFICAÇÕES
// ==========================================

export const adminNotificationApi = {
  // Enviar notificação global
  send: async (data: {
    title: string;
    message: string;
    type: string;
    recipients: string;
    sendEmail?: boolean;
    actionUrl?: string;
    actionLabel?: string;
  }) => {
    const response = await api.post("/admin/notifications", data);
    return response.data;
  },

  // Histórico de notificações
  getHistory: async (params?: { type?: string; page?: number; limit?: number }) => {
    const response = await api.get("/admin/notifications/history", { params });
    return response.data;
  },

  // Eliminar notificação
  delete: async (id: string) => {
    const response = await api.delete(`/admin/notifications/${id}`);
    return response.data;
  },

  // Eliminar em lote
  deleteBulk: async (params: {
    title?: string;
    message?: string;
    type?: string;
    createdBefore?: string;
  }) => {
    const response = await api.delete("/admin/notifications/bulk", {
      data: params,
    });
    return response.data;
  },

  // Estatísticas
  getStats: async () => {
    const response = await api.get("/admin/notifications/stats");
    return response.data;
  },
};

