# Contratos de API - AlbiEmprego

> **Documento para Equipa Backend**
>
> Este documento define os contratos de API esperados pelo frontend.
> Todos os endpoints devem retornar JSON e seguir as estruturas definidas.

## Índice

- [Informações Gerais](#informações-gerais)
- [Autenticação](#autenticação)
- [Utilizadores](#utilizadores)
- [Vagas](#vagas)
- [Candidaturas](#candidaturas)
- [Mensagens / Chat](#mensagens--chat)
- [Notificações](#notificações)
- [Comunidade](#comunidade)
- [Admin](#admin)
- [Manutenção](#manutenção)

---

## Informações Gerais

### Base URL

```
Production: https://api.albiemprego.pt/api/v1
Development: http://localhost:3001/api/v1
```

### Headers Padrão

```http
Content-Type: application/json
Authorization: Bearer <token>
Accept-Language: pt-PT
```

### Formato de Resposta de Erro

```typescript
interface ErrorResponse {
  error: string; // Código do erro
  message: string; // Mensagem legível
  details?: object; // Detalhes adicionais (validação, etc.)
  timestamp: string; // ISO 8601
}
```

### Códigos HTTP Utilizados

| Código | Uso                           |
| ------ | ----------------------------- |
| 200    | Sucesso (GET, PATCH)          |
| 201    | Criado com sucesso (POST)     |
| 204    | Sucesso sem conteúdo (DELETE) |
| 400    | Bad Request (validação)       |
| 401    | Não autenticado               |
| 403    | Não autorizado                |
| 404    | Não encontrado                |
| 409    | Conflito (duplicado)          |
| 422    | Entidade não processável      |
| 500    | Erro interno                  |

### Paginação

```typescript
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Query params padrão
?page=1&limit=10
```

---

## Autenticação

### POST `/auth/login`

Autenticar utilizador.

**Request:**

```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

**Response 200:**

```typescript
interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    type: "candidato" | "empresa" | "admin";
    avatar?: string;
    status: "active" | "pending" | "suspended";
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // segundos
}
```

**Response 401:**

```json
{
  "error": "INVALID_CREDENTIALS",
  "message": "Email ou password incorretos."
}
```

---

### POST `/auth/register`

Registar novo utilizador.

**Request:**

```typescript
interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  type: "candidato" | "empresa";

  // Se empresa
  companyName?: string;
  nif?: string;
  phone?: string;
}
```

**Response 201:**

```typescript
interface RegisterResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  message: string; // "Verifique o seu email"
}
```

**Response 409:**

```json
{
  "error": "EMAIL_EXISTS",
  "message": "Este email já está registado."
}
```

---

### POST `/auth/forgot-password`

Solicitar reset de password.

**Request:**

```typescript
{
  email: string;
}
```

**Response 200:**

```json
{
  "message": "Se o email existir, receberá instruções de recuperação."
}
```

---

### POST `/auth/reset-password`

Redefinir password com token.

**Request:**

```typescript
{
  token: string;
  password: string;
}
```

**Response 200:**

```json
{
  "message": "Password alterada com sucesso."
}
```

**Response 400:**

```json
{
  "error": "INVALID_TOKEN",
  "message": "Token inválido ou expirado."
}
```

---

### POST `/auth/refresh`

Renovar access token.

**Request:**

```typescript
{
  refreshToken: string;
}
```

**Response 200:**

```typescript
{
  accessToken: string;
  expiresIn: number;
}
```

---

### POST `/auth/logout`

Invalidar tokens.

**Response 204:** No content

---

## Utilizadores

### GET `/users/me`

Obter perfil do utilizador autenticado.

**Response 200:**

```typescript
interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  location?: string;
  avatar?: string;
  bio?: string;
  type: "candidato" | "empresa";
  status: "active" | "pending" | "suspended";
  createdAt: string;
  updatedAt: string;

  // Se candidato
  candidate?: {
    skills: string[];
    experience: Experience[];
    education: Education[];
    languages: Language[];
    cvUrl?: string;
    profileCompleteness: number; // 0-100
  };

  // Se empresa
  company?: {
    name: string;
    nif: string;
    website?: string;
    sector?: string;
    employees?: string;
    description?: string;
    logo?: string;
  };
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

interface Language {
  language: string;
  level: "basic" | "intermediate" | "advanced" | "native";
}
```

---

### PATCH `/users/me`

Atualizar perfil.

**Request:** Campos parciais de `UserProfile`

**Response 200:** `UserProfile` atualizado

---

### POST `/users/me/avatar`

Upload de avatar.

**Request:** `multipart/form-data` com campo `avatar`

**Response 200:**

```typescript
{
  avatarUrl: string;
}
```

---

### POST `/users/me/cv`

Upload de CV (candidato).

**Request:** `multipart/form-data` com campo `cv` (PDF)

**Response 200:**

```typescript
{
  cvUrl: string;
}
```

---

### PATCH `/users/me/password`

Alterar password.

**Request:**

```typescript
{
  currentPassword: string;
  newPassword: string;
}
```

**Response 200:**

```json
{
  "message": "Password alterada com sucesso."
}
```

---

### DELETE `/users/me`

Eliminar conta.

**Request:**

```typescript
{
  password: string;
  confirmation: "ELIMINAR"; // string literal para confirmar
}
```

**Response 204:** No content

---

## Vagas

### GET `/jobs`

Listar vagas com filtros.

**Query Parameters:**

```typescript
interface JobsQuery {
  page?: number; // default: 1
  limit?: number; // default: 10
  search?: string; // pesquisa em título/descrição
  location?: string; // ex: "Castelo Branco"
  type?: string; // "full-time,part-time" (CSV)
  workMode?: string; // "presencial,remoto,híbrido" (CSV)
  sector?: string; // categoria
  salaryMin?: number;
  salaryMax?: number;
  companyId?: string; // vagas de empresa específica
  status?: string; // "active" (default para público)
  sortBy?: "recent" | "salary" | "relevance";
  sortOrder?: "asc" | "desc";
}
```

**Response 200:**

```typescript
interface JobsResponse {
  data: Job[];
  pagination: Pagination;
}

interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities?: string[];
  benefits?: string[];

  company: {
    id: string;
    name: string;
    logo?: string;
    location: string;
    sector: string;
  };

  location: string;
  type: "full-time" | "part-time" | "temporary" | "internship" | "freelance";
  workMode: "presencial" | "remoto" | "híbrido";

  salary?: {
    min?: number;
    max?: number;
    currency: string; // "EUR"
    period: "month" | "year" | "hour";
    showOnListing: boolean;
  };

  sector: string;
  experienceLevel?: "entry" | "junior" | "mid" | "senior" | "lead";

  status: "active" | "paused" | "closed" | "draft" | "pending";

  applicationDeadline?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;

  // Apenas para empresa dona
  applicationsCount?: number;
  viewsCount?: number;
}
```

---

### GET `/jobs/:id`

Detalhes de uma vaga.

**Response 200:** `Job` completo

**Response 404:**

```json
{
  "error": "JOB_NOT_FOUND",
  "message": "Vaga não encontrada."
}
```

---

### POST `/jobs` (Empresa)

Criar nova vaga.

**Request:**

```typescript
interface CreateJobRequest {
  title: string;
  description: string;
  requirements: string[];
  responsibilities?: string[];
  benefits?: string[];
  location: string;
  type: string;
  workMode: string;
  salary?: {
    min?: number;
    max?: number;
    currency: string;
    period: string;
    showOnListing: boolean;
  };
  sector: string;
  experienceLevel?: string;
  applicationDeadline?: string;
  status: "active" | "draft"; // "active" vai para aprovação
}
```

**Response 201:** `Job` criado

---

### PATCH `/jobs/:id` (Empresa)

Atualizar vaga.

**Request:** Campos parciais de `Job`

**Response 200:** `Job` atualizado

**Response 403:**

```json
{
  "error": "FORBIDDEN",
  "message": "Não tem permissão para editar esta vaga."
}
```

---

### DELETE `/jobs/:id` (Empresa/Admin)

Eliminar vaga.

**Response 204:** No content

---

### POST `/jobs/:id/duplicate` (Empresa)

Duplicar vaga como rascunho.

**Response 201:** Nova `Job` (rascunho)

---

### PATCH `/jobs/:id/status` (Empresa)

Alterar estado da vaga.

**Request:**

```typescript
{
  status: "active" | "paused" | "closed";
}
```

**Response 200:** `Job` atualizado

---

## Candidaturas

### GET `/applications` (Candidato)

Listar candidaturas do candidato.

**Query Parameters:**

```typescript
{
  status?: "all" | "active" | "rejected" | "accepted";
  page?: number;
  limit?: number;
}
```

**Response 200:**

```typescript
interface ApplicationsResponse {
  data: Application[];
  pagination: Pagination;
}

interface Application {
  id: string;

  job: {
    id: string;
    title: string;
    company: {
      id: string;
      name: string;
      logo?: string;
    };
    location: string;
    type: string;
    workMode: string;
    status: string;
  };

  coverLetter?: string;

  status:
    | "new"
    | "viewed"
    | "in_review"
    | "interview"
    | "rejected"
    | "accepted";

  appliedAt: string;
  updatedAt: string;

  timeline: {
    status: string;
    date: string;
    note?: string;
  }[];
}
```

---

### POST `/jobs/:id/apply` (Candidato)

Candidatar-se a uma vaga.

**Request:**

```typescript
{
  coverLetter?: string;
}
```

**Response 201:**

```typescript
{
  application: Application;
  message: "Candidatura submetida com sucesso.";
}
```

**Response 409:**

```json
{
  "error": "ALREADY_APPLIED",
  "message": "Já se candidatou a esta vaga."
}
```

---

### DELETE `/applications/:id` (Candidato)

Retirar candidatura.

**Response 204:** No content

---

## Mensagens / Chat

Sistema de mensagens em tempo real entre utilizadores.

### CORS Configuration

```typescript
// Headers CORS obrigatórios para WebSocket e polling
Access-Control-Allow-Origin: https://albiemprego.pt
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

### GET `/conversations`

Listar conversas do utilizador autenticado.

**Query Parameters:**

```typescript
{
  search?: string;      // pesquisa por nome ou mensagem
  type?: "all" | "unread";
  page?: number;
  limit?: number;
}
```

**Response 200:**

```typescript
interface ConversationsResponse {
  data: Conversation[];
  pagination: Pagination;
  totalUnread: number;
}

interface Conversation {
  id: string;

  participants: {
    id: string;
    name: string;
    avatar?: string;
    type: "candidato" | "empresa" | "admin";
    online?: boolean;
  }[];

  lastMessage?: {
    id: string;
    content: string;
    senderId: string;
    sentAt: string;
    read: boolean;
  };

  unreadCount: number;

  // Contexto da conversa (opcional)
  context?: {
    type: "application" | "job" | "support";
    id: string;
    title: string;
  };

  createdAt: string;
  updatedAt: string;
}
```

---

### GET `/conversations/:id`

Obter conversa com mensagens.

**Query Parameters:**

```typescript
{
  page?: number;
  limit?: number;   // default: 50
}
```

**Response 200:**

```typescript
interface ConversationDetailResponse {
  conversation: Conversation;
  messages: Message[];
  pagination: Pagination;
}

interface Message {
  id: string;
  conversationId: string;

  sender: {
    id: string;
    name: string;
    avatar?: string;
  };

  content: string;

  attachments?: {
    id: string;
    name: string;
    url: string;
    type: "image" | "pdf" | "document";
    size: number;
  }[];

  status: "sending" | "sent" | "delivered" | "read";

  // Mensagem de sistema (status changes, etc.)
  isSystem?: boolean;
  systemType?: "status_change" | "application_update" | "info";

  sentAt: string;
  readAt?: string;
}
```

---

### POST `/conversations`

Criar nova conversa.

**Request:**

```typescript
{
  participantId: string;      // ID do outro participante
  message: string;            // primeira mensagem
  context?: {
    type: "application" | "job" | "support";
    id: string;
  };
  attachments?: File[];
}
```

**Response 201:**

```typescript
{
  conversation: Conversation;
  message: Message;
}
```

---

### POST `/conversations/:id/messages`

Enviar mensagem numa conversa.

**Request:**

```typescript
{
  content: string;
  attachments?: File[];       // multipart/form-data
}
```

**Response 201:** `Message` criada

---

### PATCH `/conversations/:id/read`

Marcar conversa como lida.

**Response 200:**

```typescript
{
  readCount: number; // mensagens marcadas como lidas
}
```

---

### DELETE `/conversations/:id`

Eliminar/arquivar conversa.

**Response 204:** No content

---

### GET `/conversations/unread-count`

Contar mensagens não lidas total.

**Response 200:**

```typescript
{
  total: number;
  conversations: {
    id: string;
    unread: number;
  }
  [];
}
```

---

### WebSocket `/ws/messages`

Conexão WebSocket para mensagens em tempo real.

**Events (Server → Client):**

```typescript
// Nova mensagem recebida
{
  type: "new_message";
  data: {
    conversationId: string;
    message: Message;
  }
}

// Utilizador a escrever
{
  type: "typing";
  data: {
    conversationId: string;
    userId: string;
    userName: string;
  }
}

// Mensagem lida
{
  type: "message_read";
  data: {
    conversationId: string;
    messageId: string;
    readBy: string;
    readAt: string;
  }
}

// Utilizador online/offline
{
  type: "presence";
  data: {
    userId: string;
    online: boolean;
  }
}
```

**Events (Client → Server):**

```typescript
// Indicar que está a escrever
{
  type: "typing";
  data: {
    conversationId: string;
  }
}

// Marcar mensagem como lida
{
  type: "mark_read";
  data: {
    conversationId: string;
    messageId: string;
  }
}
```

---

### GET `/jobs/:id/applications` (Empresa)

Listar candidaturas de uma vaga.

**Query Parameters:**

```typescript
{
  status?: string;  // CSV de estados
  search?: string;  // nome do candidato
  sortBy?: "date" | "match";
  page?: number;
  limit?: number;
}
```

**Response 200:**

```typescript
interface JobApplicationsResponse {
  data: {
    id: string;

    candidate: {
      id: string;
      name: string;
      email: string;
      phone?: string;
      avatar?: string;
      location?: string;
      skills: string[];
      experienceYears?: number;
      currentPosition?: string;
      cvUrl?: string;
      matchScore?: number; // 0-100, calculado pelo backend
    };

    coverLetter?: string;
    status: string;
    appliedAt: string;
    updatedAt: string;

    notes?: string; // notas internas da empresa
  }[];

  pagination: Pagination;

  stats: {
    total: number;
    new: number;
    inReview: number;
    interview: number;
    accepted: number;
    rejected: number;
  };
}
```

---

### GET `/applications/:id` (Empresa)

Detalhes de uma candidatura.

**Response 200:** Candidatura com perfil completo do candidato

---

### PATCH `/applications/:id/status` (Empresa)

Atualizar estado de candidatura.

**Request:**

```typescript
{
  status: "viewed" | "in_review" | "interview" | "rejected" | "accepted";
  note?: string;         // nota para o timeline
  internalNote?: string; // nota interna (só empresa vê)
}
```

**Response 200:** `Application` atualizada

---

### POST `/applications/:id/email` (Empresa)

Enviar email ao candidato.

**Request:**

```typescript
{
  subject: string;
  body: string;
  templateId?: string;
}
```

**Response 200:**

```json
{
  "message": "Email enviado com sucesso."
}
```

---

## Notificações

### GET `/notifications`

Listar notificações do utilizador.

**Query Parameters:**

```typescript
{
  read?: boolean;
  type?: string;  // CSV de tipos
  page?: number;
  limit?: number;
}
```

**Response 200:**

```typescript
interface NotificationsResponse {
  data: Notification[];
  pagination: Pagination;
  unreadCount: number;
}

interface Notification {
  id: string;
  type:
    | "info"
    | "success"
    | "warning"
    | "announcement"
    | "promotion"
    | "system"
    | "maintenance";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;

  // Opcional: link relacionado
  actionUrl?: string;
  actionLabel?: string;
}
```

---

### GET `/notifications/unread-count`

Contar notificações não lidas.

**Response 200:**

```typescript
{
  count: number;
}
```

---

### PATCH `/notifications/:id/read`

Marcar como lida.

**Response 200:** `Notification` atualizada

---

### POST `/notifications/read-all`

Marcar todas como lidas.

**Response 200:**

```json
{
  "message": "Todas as notificações foram marcadas como lidas.",
  "count": 5
}
```

---

### DELETE `/notifications/:id`

Eliminar notificação.

**Response 204:** No content

---

### DELETE `/notifications/read`

Eliminar todas as lidas.

**Response 204:** No content

---

## Admin

### GET `/admin/users`

Listar utilizadores (paginado).

**Query Parameters:**

```typescript
{
  search?: string;
  type?: "candidato" | "empresa";
  status?: "active" | "pending" | "suspended";
  page?: number;
  limit?: number;
}
```

**Response 200:**

```typescript
interface AdminUsersResponse {
  data: AdminUser[];
  pagination: Pagination;
  stats: {
    total: number;
    active: number;
    pending: number;
    suspended: number;
    candidates: number;
    companies: number;
  };
}

interface AdminUser {
  id: string;
  email: string;
  name: string;
  type: "candidato" | "empresa";
  status: "active" | "pending" | "suspended";
  registeredAt: string;
  lastLoginAt?: string;

  // Métricas
  applicationsCount?: number; // candidato
  jobsCount?: number; // empresa
}
```

---

### GET `/admin/users/:id`

Detalhes de utilizador.

**Response 200:** Perfil completo + atividade

---

### PATCH `/admin/users/:id/status`

Alterar estado de utilizador.

**Request:**

```typescript
{
  status: "active" | "suspended";
  reason?: string;
}
```

**Response 200:** `AdminUser` atualizado

---

### DELETE `/admin/users/:id`

Eliminar utilizador.

**Response 204:** No content

---

### GET `/admin/companies`

Listar empresas.

**Query Parameters:** Similar a `/admin/users`

**Response 200:**

```typescript
interface AdminCompaniesResponse {
  data: AdminCompany[];
  pagination: Pagination;
  stats: {
    total: number;
    active: number;
    pending: number;
    suspended: number;
    totalJobs: number;
  };
}

interface AdminCompany {
  id: string;
  userId: string;
  name: string;
  email: string;
  nif: string;
  location: string;
  sector?: string;
  status: "active" | "pending" | "suspended";
  registeredAt: string;
  jobsCount: number;
  activeJobsCount: number;
}
```

---

### PATCH `/admin/companies/:id/approve`

Aprovar empresa pendente.

**Response 200:**

```json
{
  "message": "Empresa aprovada com sucesso."
}
```

---

### PATCH `/admin/companies/:id/reject`

Rejeitar empresa pendente.

**Request:**

```typescript
{
  reason: string;
}
```

**Response 200:**

```json
{
  "message": "Empresa rejeitada."
}
```

---

### GET `/admin/jobs`

Listar vagas para moderação.

**Query Parameters:**

```typescript
{
  status?: "pending" | "active" | "paused" | "rejected";
  companyId?: string;
  page?: number;
  limit?: number;
}
```

---

### PATCH `/admin/jobs/:id/approve`

Aprovar vaga pendente.

**Response 200:** `Job` aprovado

---

### PATCH `/admin/jobs/:id/reject`

Rejeitar vaga.

**Request:**

```typescript
{
  reason: string;
}
```

---

### POST `/admin/notifications`

Enviar notificação em massa.

**Request:**

```typescript
{
  title: string;
  message: string;
  type: NotificationType;
  recipients: "all" | "candidates" | "companies";
  sendEmail?: boolean;
}
```

**Response 201:**

```typescript
{
  notification: {
    id: string;
    title: string;
    message: string;
    type: string;
    recipients: string;
    sentAt: string;
    recipientsCount: number;
  }
}
```

---

### GET `/admin/notifications/history`

Histórico de notificações enviadas.

**Response 200:**

```typescript
{
  data: SentNotification[];
  pagination: Pagination;
}

interface SentNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  recipients: string;
  sentAt: string;
  recipientsCount: number;
  readCount: number;
}
```

---

### GET `/admin/reports`

Denúncias/reports.

**Response 200:**

```typescript
{
  data: Report[];
  pagination: Pagination;
}

interface Report {
  id: string;
  type: "job" | "user" | "company";
  targetId: string;
  targetName: string;
  reason: string;
  description?: string;
  reportedBy: {
    id: string;
    name: string;
  };
  status: "pending" | "reviewing" | "resolved" | "dismissed";
  createdAt: string;
  reportsCount: number; // quantas denúncias do mesmo alvo
}
```

---

### PATCH `/admin/reports/:id`

Resolver denúncia.

**Request:**

```typescript
{
  status: "resolved" | "dismissed";
  action?: "suspend_user" | "delete_job" | "warn_user" | "none";
  note?: string;
}
```

---

### GET `/admin/stats`

Estatísticas da plataforma.

**Response 200:**

```typescript
{
  users: {
    total: number;
    candidates: number;
    companies: number;
    newThisMonth: number;
    activeThisWeek: number;
  }
  jobs: {
    total: number;
    active: number;
    pending: number;
    newThisMonth: number;
  }
  applications: {
    total: number;
    thisMonth: number;
    averagePerJob: number;
  }
  pendingApprovals: {
    companies: number;
    jobs: number;
  }
  reports: {
    pending: number;
  }
}
```

---

## Manutenção

### GET `/maintenance/status`

Estado atual de manutenção (público).

**Response 200:**

```typescript
{
  enabled: boolean;
  message?: string;
  estimatedEndTime?: string;
}
```

---

### POST `/admin/maintenance` (Admin)

Ativar/desativar modo de manutenção.

**Request:**

```typescript
{
  enabled: boolean;
  message?: string;
  estimatedEndTime?: string;
}
```

**Response 200:**

```typescript
{
  enabled: boolean;
  message: string;
  estimatedEndTime?: string;
  updatedAt: string;
}
```

---

## Templates de Email

### GET `/admin/email-templates`

Listar templates disponíveis.

**Response 200:**

```typescript
{
  templates: {
    id: string;
    name: string;
    subject: string;
    body: string;
    variables: string[]; // ex: ["candidateName", "jobTitle"]
  }[];
}
```

---

## Comunidade

### GET `/community/discussions`

Listar discussões do fórum.

**Query Parameters:**

```typescript
{
  category?: string;
  search?: string;
  sortBy?: "recent" | "popular" | "replies";
  page?: number;
  limit?: number;
}
```

**Response 200:**

```typescript
interface DiscussionsResponse {
  data: Discussion[];
  pagination: Pagination;
  categories: string[];
}

interface Discussion {
  id: string;
  title: string;
  content: string;
  category: string;

  author: {
    id: string;
    name: string;
    avatar?: string;
  };

  repliesCount: number;
  viewsCount: number;
  isPinned: boolean;

  lastReply?: {
    authorName: string;
    createdAt: string;
  };

  createdAt: string;
  updatedAt: string;
}
```

---

### POST `/community/discussions`

Criar nova discussão.

**Request:**

```typescript
{
  title: string;
  content: string;
  category: string;
}
```

**Response 201:** `Discussion` criada

---

### GET `/community/discussions/:id`

Detalhes de discussão com respostas.

**Response 200:**

```typescript
{
  discussion: Discussion;
  replies: Reply[];
  pagination: Pagination;
}

interface Reply {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

---

### POST `/community/discussions/:id/replies`

Responder a discussão.

**Request:**

```typescript
{
  content: string;
}
```

**Response 201:** `Reply` criada

---

### GET `/community/events`

Listar eventos.

**Query Parameters:**

```typescript
{
  upcoming?: boolean;
  category?: string;
  page?: number;
  limit?: number;
}
```

**Response 200:**

```typescript
interface EventsResponse {
  data: Event[];
  pagination: Pagination;
}

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;

  date: string;
  time: string;
  location: string;
  isOnline: boolean;
  meetingUrl?: string;

  organizer: {
    id: string;
    name: string;
    avatar?: string;
  };

  participantsCount: number;
  maxParticipants?: number;
  isRegistered: boolean;

  createdAt: string;
}
```

---

### POST `/community/events/:id/register`

Inscrever-se num evento.

**Response 200:**

```typescript
{
  message: "Inscrição confirmada.";
  event: Event;
}
```

---

### DELETE `/community/events/:id/register`

Cancelar inscrição.

**Response 204:** No content

---

### GET `/community/members`

Listar membros da comunidade.

**Query Parameters:**

```typescript
{
  search?: string;
  skills?: string;      // CSV
  location?: string;
  page?: number;
  limit?: number;
}
```

**Response 200:**

```typescript
interface MembersResponse {
  data: Member[];
  pagination: Pagination;
}

interface Member {
  id: string;
  name: string;
  avatar?: string;
  title?: string;
  location?: string;
  skills: string[];
  joinedAt: string;
}
```

---

### GET `/community/members/:id`

Perfil público de membro.

**Response 200:**

```typescript
interface MemberProfile {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  title?: string;
  location?: string;
  skills: string[];

  activity: {
    discussionsCount: number;
    repliesCount: number;
    eventsAttended: number;
  };

  recentActivity: {
    type: "discussion" | "reply" | "event";
    title: string;
    date: string;
  }[];

  joinedAt: string;
}
```

---

## Notas para Implementação

### Autenticação

- JWT com access token (15min) e refresh token (7 dias)
- Roles armazenados em tabela separada (não no token)
- Rate limiting: 100 req/min por IP, 1000 req/min por user

### Validação

- Validar todos os inputs no servidor
- Sanitizar HTML em campos de texto longo
- Limites: título 100 chars, descrição 5000 chars

### Segurança

- HTTPS obrigatório em produção
- Passwords: bcrypt com cost 12
- Tokens sensíveis nunca em logs
- Verificar ownership em operações de edição/eliminação

### CORS Configuration

```typescript
// Configuração CORS para produção
const corsOptions = {
  origin: [
    "https://albiemprego.pt",
    "https://www.albiemprego.pt",
    "https://app.albiemprego.pt",
  ],
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept-Language",
    "X-Requested-With",
  ],
  credentials: true,
  maxAge: 86400, // 24 horas preflight cache
};

// Configuração CORS para desenvolvimento
const devCorsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ],
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
```

### WebSocket / Real-time

- WebSocket para mensagens em tempo real
- Fallback para polling (15s interval) se WebSocket indisponível
- Reconexão automática com backoff exponencial
- Heartbeat a cada 30s para manter conexão

### Performance

- Pagination obrigatória em listagens
- Cache de 5min para vagas públicas
- Índices em campos de pesquisa
- Compressão gzip/brotli para respostas > 1KB

### Notificações Push (Browser)

```typescript
// Estrutura para browser notifications
interface PushNotification {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string; // para agrupar/substituir
  data?: {
    url?: string; // URL para abrir ao clicar
    conversationId?: string;
    type?: string;
  };
}

// Endpoint para registar subscription
POST / push / subscribe;
{
  subscription: PushSubscription;
  userAgent: string;
}

// Endpoint para remover subscription
DELETE / push / unsubscribe;
{
  endpoint: string;
}
```

---

_Última atualização: Dezembro 2024_
_Versão API: 1.0.0_
