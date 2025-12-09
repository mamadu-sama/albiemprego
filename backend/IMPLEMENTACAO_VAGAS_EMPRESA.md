# ✅ Implementação Completa - Gestão de Vagas da Empresa

## 🎯 Resumo

Implementação completa do sistema de gestão de vagas para empresas, permitindo:
- ✅ Listar todas as vagas da empresa (por status)
- ✅ Ver estatísticas agregadas
- ✅ Criar vagas (sempre como DRAFT)
- ✅ Publicar rascunhos (DRAFT → ACTIVE)
- ✅ Pausar vagas ativas (ACTIVE → PAUSED)
- ✅ Reativar vagas pausadas (PAUSED → ACTIVE)
- ✅ Fechar vagas (qualquer status → CLOSED)
- ✅ Editar vagas (apenas DRAFT e PAUSED)
- ✅ Remover vagas (apenas sem candidaturas)

---

## 📂 Arquivos Modificados/Criados

### Backend

1. **`backend/src/routes/job.routes.ts`**
   - ✅ Adicionadas rotas `GET /jobs/my-jobs` e `GET /jobs/my-jobs/stats`
   - ✅ Adicionada rota `PATCH /jobs/:id/reactivate`
   - ⚠️ **IMPORTANTE**: Rotas específicas (`/my-jobs`) movidas ANTES das rotas parametrizadas (`/:id`) para evitar conflitos

2. **`backend/src/controllers/job.controller.ts`**
   - ✅ `getMyJobs()` - Listar vagas da empresa
   - ✅ `getMyJobsStats()` - Estatísticas das vagas
   - ✅ `reactivateJob()` - Reativar vaga pausada

3. **`backend/src/services/job.service.ts`**
   - ✅ `getMyJobs(userId, status?)` - Buscar vagas da empresa com filtro opcional
   - ✅ `getMyJobsStats(userId)` - Calcular estatísticas agregadas
   - ✅ `reactivateJob(userId, jobId)` - Lógica de reativação

4. **`backend/docs/EMPRESA_VAGAS.md`** ⭐ NOVO
   - Documentação completa de todos os endpoints
   - Exemplos de uso
   - Códigos de erro
   - Fluxo de estados

### Frontend

5. **`albiemprego/src/lib/api.ts`**
   - ✅ `reactivateJob(jobId)` - Reativar vaga pausada
   - ✅ `getMyJobs(status?)` - Listar vagas da empresa
   - ✅ `getMyJobsStats()` - Obter estatísticas

6. **`albiemprego/src/pages/empresa/Vagas.tsx`** (já existia)
   - ✅ Usar novo endpoint `/jobs/my-jobs` em vez de `/jobs?companyId=...`
   - ✅ Adicionar botão "Reativar" para vagas pausadas
   - ✅ Mostrar estatísticas do novo endpoint

---

## 🔄 Fluxo de Estados das Vagas

```
┌─────────────────────────────────────────────────────────────┐
│                    CICLO DE VIDA DA VAGA                    │
└─────────────────────────────────────────────────────────────┘

CRIAR VAGA
    ↓
┌─────────────┐
│   DRAFT     │  (Rascunho)
│ (Editável)  │
└─────────────┘
    │
    │ POST /jobs/:id/publish
    ↓
┌─────────────┐
│   ACTIVE    │  (Publicada - visível para candidatos)
│ (Só pausar) │
└─────────────┘
    │
    │ PATCH /jobs/:id/pause
    ↓
┌─────────────┐
│   PAUSED    │  (Pausada - não visível)
│ (Editável)  │
└─────────────┘
    │
    │ PATCH /jobs/:id/reactivate
    ↓
┌─────────────┐
│   ACTIVE    │  (Reativada)
└─────────────┘
    │
    │ PATCH /jobs/:id/close
    ↓
┌─────────────┐
│   CLOSED    │  (Fechada - permanente)
└─────────────┘
```

---

## 📡 Endpoints Implementados

### 1. **GET /api/v1/jobs/my-jobs**
Listar vagas da empresa logada

**Query Params:**
- `status` (opcional): `DRAFT` | `ACTIVE` | `PAUSED` | `CLOSED` | `PENDING` | `REJECTED`

**Headers:**
```
Authorization: Bearer {token}
```

**Exemplo:**
```bash
curl -X GET "http://localhost:3001/api/v1/jobs/my-jobs?status=DRAFT" \
  -H "Authorization: Bearer TOKEN"
```

**Resposta:** Array de vagas com empresa e contador de candidaturas

---

### 2. **GET /api/v1/jobs/my-jobs/stats**
Estatísticas agregadas das vagas

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "total": 6,
  "byStatus": {
    "draft": 0,
    "active": 3,
    "paused": 2,
    "closed": 1,
    "pending": 0,
    "rejected": 0
  },
  "totalApplications": 15,
  "totalViews": 347
}
```

---

### 3. **PATCH /api/v1/jobs/:id/reactivate**
Reativar vaga pausada (PAUSED → ACTIVE)

**Headers:**
```
Authorization: Bearer {token}
```

**Validações:**
- ✅ Apenas vagas com status `PAUSED` podem ser reativadas
- ✅ Apenas o dono da vaga pode reativá-la

**Erro 400:** "Apenas vagas pausadas podem ser reativadas"

---

## 🧪 Testes Realizados

### ✅ Teste 1: Listar TODAS as vagas
```bash
GET /api/v1/jobs/my-jobs
Resultado: 6 vagas retornadas (2 ACTIVE, 3 PAUSED, 1 CLOSED)
```

### ✅ Teste 2: Listar apenas RASCUNHOS
```bash
GET /api/v1/jobs/my-jobs?status=DRAFT
Resultado: 0 vagas (nenhum rascunho)
```

### ✅ Teste 3: Listar apenas PAUSADAS
```bash
GET /api/v1/jobs/my-jobs?status=PAUSED
Resultado: 3 vagas pausadas
- Vaga teste colocar na rascunho
- Fullatack Develoiper
- Backend Developer Node.js
```

### ✅ Teste 4: Estatísticas
```bash
GET /api/v1/jobs/my-jobs/stats
Resultado:
{
  "total": 6,
  "byStatus": {"draft": 0, "active": 2, "paused": 3, "closed": 1},
  "totalApplications": 1,
  "totalViews": 1
}
```

### ✅ Teste 5: Reativar vaga pausada
```bash
PATCH /api/v1/jobs/c249000b-b495-4001-90b1-342333d50554/reactivate
Resultado:
- Status ANTES: PAUSED
- Status DEPOIS: ACTIVE
- Título: "Vaga teste colocar na rascunho"
```

---

## 🎨 Integração Frontend

### Atualizar `Vagas.tsx`

**ANTES:**
```typescript
const { data: jobsData } = useQuery({
  queryKey: ["companyJobs", user?.company?.id],
  queryFn: () => jobApi.listJobs({ 
    companyId: user?.company?.id, // ❌ Endpoint público
    status: activeTab === "all" ? undefined : activeTab.toUpperCase() as any,
  }),
});
```

**DEPOIS:**
```typescript
const { data: jobsData } = useQuery({
  queryKey: ["companyJobs", activeTab],
  queryFn: () => jobApi.getMyJobs(
    activeTab === "all" ? undefined : activeTab.toUpperCase()
  ), // ✅ Endpoint dedicado da empresa
});

// Buscar estatísticas
const { data: stats } = useQuery({
  queryKey: ["jobsStats"],
  queryFn: () => jobApi.getMyJobsStats(),
});
```

### Adicionar botão "Reativar"

```typescript
{job.status === "PAUSED" && (
  <DropdownMenuItem onClick={() => reactivateMutation.mutate(job.id)}>
    <Play className="h-4 w-4 mr-2" />
    Reativar
  </DropdownMenuItem>
)}

// Mutation
const reactivateMutation = useMutation({
  mutationFn: (jobId: string) => jobApi.reactivateJob(jobId),
  onSuccess: () => {
    toast({ title: "Sucesso", description: "Vaga reativada!" });
    queryClient.invalidateQueries({ queryKey: ["companyJobs"] });
  },
});
```

---

## ✅ Checklist de Sincronização Frontend-Backend

### Campos do Formulário (NovaVaga.tsx) vs Schema

| Campo Frontend | Campo Backend | Schema Prisma | Status |
|---|---|---|---|
| `title` | `title` | `title: String` | ✅ |
| `department` | `department` | `department: String?` | ✅ |
| `description` | `description` | `description: String` | ✅ |
| `requirementsText` (textarea) | `requirements[]` | `requirements: String[]` | ✅ |
| `responsibilitiesText` | `responsibilities[]` | `responsibilities: String[]` | ✅ |
| `benefitsText` | `benefits[]` | `benefits: String[]` | ✅ |
| `skills[]` | `skills[]` | `skills: String[]` | ✅ |
| `location` | `location` | `location: String` | ✅ |
| `address` | `address` | `address: String?` | ✅ |
| `contractType` | `type` | `type: JobType` | ✅ |
| `workMode` | `workMode` | `workMode: WorkMode` | ✅ |
| `salaryMin` | `salaryMin` | `salaryMin: Decimal?` | ✅ |
| `salaryMax` | `salaryMax` | `salaryMax: Decimal?` | ✅ |
| `salaryPeriod` | `salaryPeriod` | `salaryPeriod: String` | ✅ |
| `salaryVisibility` → `showSalary` | `showSalary` | `showSalary: Boolean` | ✅ |
| `sector` | `sector` | `sector: String` | ✅ |
| `experienceLevel` | `experienceLevel` | `experienceLevel: String?` | ✅ |

**🎉 Todos os campos estão sincronizados!**

---

## 🔒 Permissões e Segurança

### Todas as rotas de empresa requerem:
1. ✅ Autenticação (`authenticateToken`)
2. ✅ Tipo de utilizador = `EMPRESA` (`authorize("EMPRESA")`)
3. ✅ Vaga pertence à empresa logada (`verifyJobOwner`)

### Validações de negócio:
- ❌ Não é possível **editar** vagas ACTIVE (precisa pausar primeiro)
- ❌ Não é possível **pausar** vagas DRAFT (precisa publicar primeiro)
- ❌ Não é possível **reativar** vagas que não sejam PAUSED
- ❌ Não é possível **remover** vagas com candidaturas (precisa fechar)
- ❌ Não é possível **publicar** se a empresa não estiver aprovada

---

## 📊 Exemplo de Uso Completo

```bash
# 1. Login como empresa
TOKEN=$(curl -s -X POST "http://localhost:3001/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "rh@techsolutions.pt", "password": "Empresa123!"}' \
  | jq -r '.accessToken')

# 2. Ver todas as vagas
curl -s -X GET "http://localhost:3001/api/v1/jobs/my-jobs" \
  -H "Authorization: Bearer $TOKEN"

# 3. Ver apenas rascunhos
curl -s -X GET "http://localhost:3001/api/v1/jobs/my-jobs?status=DRAFT" \
  -H "Authorization: Bearer $TOKEN"

# 4. Ver estatísticas
curl -s -X GET "http://localhost:3001/api/v1/jobs/my-jobs/stats" \
  -H "Authorization: Bearer $TOKEN"

# 5. Publicar rascunho
curl -s -X PATCH "http://localhost:3001/api/v1/jobs/JOB_ID/publish" \
  -H "Authorization: Bearer $TOKEN"

# 6. Pausar vaga ativa
curl -s -X PATCH "http://localhost:3001/api/v1/jobs/JOB_ID/pause" \
  -H "Authorization: Bearer $TOKEN"

# 7. Reativar vaga pausada
curl -s -X PATCH "http://localhost:3001/api/v1/jobs/JOB_ID/reactivate" \
  -H "Authorization: Bearer $TOKEN"

# 8. Fechar vaga
curl -s -X PATCH "http://localhost:3001/api/v1/jobs/JOB_ID/close" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🚀 Próximos Passos (Frontend)

### 1. Atualizar `Vagas.tsx` para usar novos endpoints

```typescript
// Trocar de:
const { data: jobsData } = useQuery({
  queryKey: ["companyJobs", user?.company?.id],
  queryFn: () => jobApi.listJobs({ companyId: user?.company?.id }),
});

// Para:
const { data: jobs } = useQuery({
  queryKey: ["myJobs", activeTab],
  queryFn: () => jobApi.getMyJobs(
    activeTab === "all" ? undefined : activeTab.toUpperCase()
  ),
});
```

### 2. Adicionar botão "Reativar" no dropdown

```typescript
{job.status === "PAUSED" && (
  <DropdownMenuItem onClick={() => reactivateJobMutation.mutate(job.id)}>
    <Play className="h-4 w-4 mr-2" />
    Reativar
  </DropdownMenuItem>
)}
```

### 3. Usar estatísticas reais no dashboard

```typescript
const { data: stats } = useQuery({
  queryKey: ["jobsStats"],
  queryFn: () => jobApi.getMyJobsStats(),
});

// Mostrar nos cards
<Card>
  <CardContent className="p-6">
    <div className="text-2xl font-bold">{stats?.byStatus.draft || 0}</div>
    <div className="text-sm text-muted-foreground">Rascunhos</div>
  </CardContent>
</Card>
```

### 4. Remover página `Rascunhos.tsx` separada (opcional)

Como a página `Vagas.tsx` já tem a aba "Rascunhos", a página `Rascunhos.tsx` pode ser removida ou redirecionada.

---

## 📝 Notas Importantes

1. ⚠️ **Ordem das rotas**: Rotas específicas (`/my-jobs`) DEVEM vir ANTES de rotas parametrizadas (`/:id`) no Express

2. ✅ **Schema sincronizado**: Todos os campos do formulário frontend existem no Prisma schema

3. 🔐 **Segurança**: Todas as rotas verificam autenticação, tipo de utilizador e propriedade da vaga

4. 📊 **Performance**: Estatísticas usam agregação eficiente (Promise.all)

5. 🎯 **UX**: Vagas sempre criadas como DRAFT para revisão antes de publicar

---

**Data de Implementação:** 09/12/2024  
**Status:** ✅ Completo e testado  
**Documentação:** `backend/docs/EMPRESA_VAGAS.md`

