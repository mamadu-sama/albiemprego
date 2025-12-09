# 📋 Gestão de Vagas - Empresa

Documentação completa dos endpoints para empresas gerenciarem suas vagas.

## 🎯 Endpoints Disponíveis

### 1. **Listar Minhas Vagas**

```http
GET /api/v1/jobs/my-jobs
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Query Parameters (opcionais):**
- `status`: Filtrar por status específico
  - `DRAFT` - Rascunhos
  - `ACTIVE` - Ativas/Publicadas
  - `PAUSED` - Pausadas
  - `CLOSED` - Fechadas
  - `PENDING` - Aguardando aprovação
  - `REJECTED` - Rejeitadas

**Exemplos:**

```bash
# Listar TODAS as vagas da empresa
GET /api/v1/jobs/my-jobs

# Listar apenas RASCUNHOS
GET /api/v1/jobs/my-jobs?status=DRAFT

# Listar apenas ATIVAS
GET /api/v1/jobs/my-jobs?status=ACTIVE

# Listar apenas PAUSADAS
GET /api/v1/jobs/my-jobs?status=PAUSED

# Listar apenas FECHADAS
GET /api/v1/jobs/my-jobs?status=CLOSED
```

**Resposta (200):**
```json
[
  {
    "id": "uuid",
    "title": "Desenvolvedor Full Stack",
    "description": "...",
    "location": "Castelo Branco",
    "type": "FULL_TIME",
    "workMode": "HIBRIDO",
    "status": "DRAFT",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z",
    "publishedAt": null,
    "viewsCount": 0,
    "company": {
      "id": "uuid",
      "name": "TechCorp",
      "logo": "https://..."
    },
    "_count": {
      "applications": 0
    }
  },
  {
    "id": "uuid",
    "title": "Designer UI/UX",
    "description": "...",
    "location": "Castelo Branco",
    "type": "FULL_TIME",
    "workMode": "REMOTO",
    "status": "ACTIVE",
    "createdAt": "2024-01-10T10:00:00Z",
    "updatedAt": "2024-01-10T10:00:00Z",
    "publishedAt": "2024-01-10T11:00:00Z",
    "viewsCount": 156,
    "company": {
      "id": "uuid",
      "name": "TechCorp",
      "logo": "https://..."
    },
    "_count": {
      "applications": 23
    }
  }
]
```

---

### 2. **Estatísticas das Vagas**

```http
GET /api/v1/jobs/my-jobs/stats
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Resposta (200):**
```json
{
  "total": 15,
  "byStatus": {
    "draft": 3,
    "active": 5,
    "paused": 2,
    "closed": 4,
    "pending": 1,
    "rejected": 0
  },
  "totalApplications": 127,
  "totalViews": 3456
}
```

---

### 3. **Criar Vaga (Rascunho)**

```http
POST /api/v1/jobs
```

**Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Desenvolvedor Backend Node.js",
  "description": "Procuramos um desenvolvedor backend experiente...",
  "requirements": [
    "3+ anos de experiência com Node.js",
    "Conhecimento de PostgreSQL",
    "Experiência com APIs RESTful"
  ],
  "responsibilities": [
    "Desenvolver e manter APIs",
    "Otimizar performance do backend"
  ],
  "benefits": [
    "Seguro de saúde",
    "Horário flexível"
  ],
  "location": "Castelo Branco",
  "type": "FULL_TIME",
  "workMode": "HIBRIDO",
  "sector": "Tecnologia",
  "experienceLevel": "Sénior",
  "salaryMin": 1500,
  "salaryMax": 2500,
  "showSalary": true
}
```

**Resposta (201):**
```json
{
  "id": "uuid",
  "title": "Desenvolvedor Backend Node.js",
  "status": "DRAFT",
  "createdAt": "2024-01-15T10:00:00Z",
  ...
}
```

> ⚠️ **Nota:** Vagas sempre são criadas como `DRAFT` (rascunho)

---

### 4. **Publicar Vaga (DRAFT → ACTIVE)**

```http
PATCH /api/v1/jobs/:id/publish
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Resposta (200):**
```json
{
  "id": "uuid",
  "title": "Desenvolvedor Backend Node.js",
  "status": "ACTIVE",
  "publishedAt": "2024-01-15T10:30:00Z",
  ...
}
```

**Erros possíveis:**
- `400` - Vaga já está publicada
- `403` - Empresa ainda não aprovada
- `404` - Vaga não encontrada

---

### 5. **Pausar Vaga (ACTIVE → PAUSED)**

```http
PATCH /api/v1/jobs/:id/pause
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Resposta (200):**
```json
{
  "id": "uuid",
  "title": "Desenvolvedor Backend Node.js",
  "status": "PAUSED",
  ...
}
```

**Erros possíveis:**
- `400` - Vaga já está pausada
- `400` - Não é possível pausar uma vaga em rascunho
- `404` - Vaga não encontrada

---

### 6. **Reativar Vaga (PAUSED → ACTIVE)**

```http
PATCH /api/v1/jobs/:id/reactivate
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Resposta (200):**
```json
{
  "id": "uuid",
  "title": "Desenvolvedor Backend Node.js",
  "status": "ACTIVE",
  ...
}
```

**Erros possíveis:**
- `400` - Apenas vagas pausadas podem ser reativadas
- `404` - Vaga não encontrada

---

### 7. **Fechar Vaga (qualquer status → CLOSED)**

```http
PATCH /api/v1/jobs/:id/close
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Resposta (200):**
```json
{
  "id": "uuid",
  "title": "Desenvolvedor Backend Node.js",
  "status": "CLOSED",
  ...
}
```

---

### 8. **Atualizar Vaga**

```http
PATCH /api/v1/jobs/:id
```

**Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Body (campos opcionais):**
```json
{
  "title": "Novo título",
  "description": "Nova descrição",
  "requirements": ["Novo requisito"],
  "location": "Nova localização"
}
```

**Resposta (200):**
```json
{
  "id": "uuid",
  "title": "Novo título",
  ...
}
```

> ⚠️ **Nota:** Não é possível editar vagas ATIVAS. Pause primeiro para editar.

**Erros possíveis:**
- `400` - Não é possível editar vaga ativa. Pause primeiro para editar.
- `404` - Vaga não encontrada

---

### 9. **Remover Vaga**

```http
DELETE /api/v1/jobs/:id
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Resposta (200):**
```json
{
  "message": "Vaga removida com sucesso"
}
```

**Erros possíveis:**
- `400` - Não é possível remover vaga com candidaturas. Feche a vaga em vez disso.
- `404` - Vaga não encontrada

---

## 🔄 Fluxo de Estados

```
DRAFT (Rascunho)
  ↓ publish
ACTIVE (Publicada)
  ↓ pause
PAUSED (Pausada)
  ↓ reactivate
ACTIVE (Ativa novamente)
  ↓ close
CLOSED (Fechada)
```

**Regras:**
- ✅ Criar vaga → sempre começa como `DRAFT`
- ✅ Publicar → `DRAFT` → `ACTIVE`
- ✅ Pausar → `ACTIVE` → `PAUSED`
- ✅ Reativar → `PAUSED` → `ACTIVE`
- ✅ Fechar → qualquer status → `CLOSED`
- ❌ Não é possível pausar rascunhos
- ❌ Não é possível editar vagas ativas (pause primeiro)
- ❌ Não é possível remover vagas com candidaturas (feche em vez disso)

---

## 💡 Exemplos de Uso no Frontend

### Listar vagas por abas

```typescript
// Aba "Todas"
const allJobs = await api.get('/api/v1/jobs/my-jobs');

// Aba "Rascunhos"
const drafts = await api.get('/api/v1/jobs/my-jobs?status=DRAFT');

// Aba "Ativas"
const active = await api.get('/api/v1/jobs/my-jobs?status=ACTIVE');

// Aba "Pausadas"
const paused = await api.get('/api/v1/jobs/my-jobs?status=PAUSED');

// Aba "Fechadas"
const closed = await api.get('/api/v1/jobs/my-jobs?status=CLOSED');
```

### Obter estatísticas para dashboard

```typescript
const stats = await api.get('/api/v1/jobs/my-jobs/stats');

console.log(`Total de vagas: ${stats.total}`);
console.log(`Rascunhos: ${stats.byStatus.draft}`);
console.log(`Ativas: ${stats.byStatus.active}`);
console.log(`Total de candidaturas: ${stats.totalApplications}`);
console.log(`Total de visualizações: ${stats.totalViews}`);
```

### Publicar rascunho

```typescript
const jobId = 'uuid-da-vaga';
const published = await api.patch(`/api/v1/jobs/${jobId}/publish`);
```

### Pausar vaga ativa

```typescript
const jobId = 'uuid-da-vaga';
const paused = await api.patch(`/api/v1/jobs/${jobId}/pause`);
```

### Reativar vaga pausada

```typescript
const jobId = 'uuid-da-vaga';
const reactivated = await api.patch(`/api/v1/jobs/${jobId}/reactivate`);
```

---

## 🧪 Testes com cURL

### Listar rascunhos
```bash
curl -X GET "http://localhost:3001/api/v1/jobs/my-jobs?status=DRAFT" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Obter estatísticas
```bash
curl -X GET "http://localhost:3001/api/v1/jobs/my-jobs/stats" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Publicar vaga
```bash
curl -X PATCH "http://localhost:3001/api/v1/jobs/UUID_DA_VAGA/publish" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Pausar vaga
```bash
curl -X PATCH "http://localhost:3001/api/v1/jobs/UUID_DA_VAGA/pause" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Reativar vaga
```bash
curl -X PATCH "http://localhost:3001/api/v1/jobs/UUID_DA_VAGA/reactivate" \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## ✅ Checklist de Implementação Frontend

- [ ] Criar página `/empresa/vagas`
- [ ] Adicionar abas: Todas | Rascunhos | Ativas | Pausadas | Fechadas
- [ ] Implementar filtro por status na listagem
- [ ] Adicionar botão "Publicar" para rascunhos
- [ ] Adicionar botão "Pausar" para vagas ativas
- [ ] Adicionar botão "Reativar" para vagas pausadas
- [ ] Adicionar botão "Fechar" para vagas ativas/pausadas
- [ ] Adicionar botão "Editar" (apenas para DRAFT e PAUSED)
- [ ] Adicionar botão "Remover" (apenas para vagas sem candidaturas)
- [ ] Mostrar estatísticas no dashboard (cards com contadores)
- [ ] Adicionar badges de status nas vagas
- [ ] Implementar confirmações antes de ações críticas

---

**Última atualização:** 09/12/2024

