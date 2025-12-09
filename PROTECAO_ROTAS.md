# Sistema de Proteção de Rotas - AlbiEmprego

## 📋 Visão Geral

Implementação de sistema completo de proteção de rotas no frontend para garantir que:
- ✅ Utilizadores não autenticados não acedem a dashboards
- ✅ Candidatos não acedem a páginas de empresas
- ✅ Empresas não acedem a páginas de candidatos
- ✅ Apenas admins acedem ao painel administrativo
- ✅ Utilizadores autenticados não acedem a páginas de login/registo
- ✅ Utilizadores suspensos são bloqueados
- ✅ Utilizadores pendentes são redirecionados

## 🔐 Componentes de Proteção

### 1. `ProtectedRoute`

Componente para proteger rotas que requerem autenticação e/ou tipo específico de utilizador.

**Localização:** `src/components/auth/ProtectedRoute.tsx`

**Props:**
```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredType?: "CANDIDATO" | "EMPRESA" | "ADMIN";
  redirectTo?: string;
}
```

**Uso:**
```tsx
// Rota que requer apenas autenticação
<Route 
  path="/suporte" 
  element={
    <ProtectedRoute>
      <Suporte />
    </ProtectedRoute>
  } 
/>

// Rota que requer ser CANDIDATO
<Route 
  path="/candidato/dashboard" 
  element={
    <ProtectedRoute requiredType="CANDIDATO">
      <CandidatoDashboard />
    </ProtectedRoute>
  } 
/>
```

**Comportamento:**
1. **Carregando:** Mostra spinner enquanto verifica autenticação
2. **Não autenticado:** Redireciona para `/auth/login` com state da rota original
3. **Pendente de aprovação:** Redireciona para `/auth/pending-approval`
4. **Suspenso:** Mostra tela de conta suspensa com link para suporte
5. **Tipo errado:** Redireciona para o dashboard apropriado do utilizador
6. **Tudo OK:** Renderiza o componente

### 2. `GuestRoute`

Componente para rotas que devem ser acessíveis apenas por utilizadores NÃO autenticados (login, register, etc).

**Uso:**
```tsx
<Route 
  path="/auth/login" 
  element={
    <GuestRoute>
      <Login />
    </GuestRoute>
  } 
/>
```

**Comportamento:**
1. **Carregando:** Mostra spinner
2. **Autenticado:** Redireciona para dashboard apropriado:
   - CANDIDATO → `/candidato/dashboard`
   - EMPRESA → `/empresa/dashboard`
   - ADMIN → `/admin/dashboard`
3. **Não autenticado:** Renderiza o componente

## 🛣️ Rotas Protegidas

### Rotas Públicas (sem proteção)
```
/ - Homepage
/vagas - Listagem de vagas
/vagas/:id - Detalhes de vaga
/sobre - Sobre nós
/contacto - Contacto
/termos - Termos e Condições
/privacidade - Política de Privacidade
/cookies - Política de Cookies
/faq - FAQ
/estatisticas-salarios - Estatísticas de Salários
/comunidade - Comunidade (index)
/comunidade/discussoes - Discussões
/comunidade/discussoes/:id - Detalhe de discussão
/comunidade/eventos - Eventos
/comunidade/eventos/:id - Detalhe de evento
/comunidade/membros - Membros
/comunidade/membros/:id - Perfil de membro
```

### Rotas para Convidados (GuestRoute)
```
/auth/login - Login
/auth/register - Registo
/auth/forgot-password - Recuperar password
/auth/reset-password - Redefinir password
```

### Rotas de Candidatos (CANDIDATO)
```
/candidato/dashboard - Dashboard do candidato
/candidato/candidaturas - Minhas candidaturas
/candidato/perfil - Meu perfil público
/candidato/perfil/editar - Editar perfil
/candidato/alertas - Alertas de vagas
/candidato/conta - Configurações de conta
/candidato/mensagens - Mensagens
/candidato/mensagens/:id - Conversa específica
```

### Rotas de Empresas (EMPRESA)
```
/empresa/dashboard - Dashboard da empresa
/empresa/vagas - Gerir vagas
/empresa/vagas/nova - Criar nova vaga
/empresa/vagas/:id/editar - Editar vaga
/empresa/vagas/:id/candidaturas - Candidaturas de uma vaga
/empresa/candidaturas - Todas as candidaturas
/empresa/candidato/:id - Ver perfil de candidato
/empresa/candidato/:id/email - Enviar email a candidato
/empresa/perfil - Perfil da empresa
/empresa/perfil/editar - Editar perfil da empresa
/empresa/rascunhos - Vagas em rascunho
/empresa/conta - Configurações de conta
/empresa/planos - Gerir planos e subscrição
/empresa/vagas/:id/destacar - Destacar vaga
/empresa/mensagens - Mensagens
/empresa/mensagens/:id - Conversa específica
```

### Rotas de Admin (ADMIN)
```
/admin/dashboard - Dashboard administrativo
/admin/utilizadores - Gerir utilizadores
/admin/empresas - Gerir empresas
/admin/vagas - Gerir vagas
/admin/denuncias - Gerir denúncias
/admin/aprovacoes - Aprovar empresas e vagas
/admin/configuracoes - Configurações do sistema
/admin/relatorios - Relatórios e estatísticas
/admin/notificacoes - Enviar notificações
/admin/conteudo/:pageId - Editar conteúdo
/admin/utilizador/:id - Ver utilizador
/admin/utilizador/:id/email - Enviar email a utilizador
/admin/empresa/:id - Ver empresa
/admin/empresa/:id/email - Enviar email a empresa
/admin/planos - Gerir planos de subscrição
/admin/mensagens - Sistema de mensagens
/admin/mensagens/:id - Conversa específica
```

### Rotas que Requerem Autenticação (qualquer tipo)
```
/suporte - Suporte
/comunidade/discussoes/nova - Criar nova discussão
```

## 🔄 Fluxo de Redirecionamento

### Utilizador Não Autenticado
```
Tenta aceder: /candidato/dashboard
        ↓
ProtectedRoute verifica: !user
        ↓
Redireciona: /auth/login (com state da rota original)
        ↓
Após login bem-sucedido: volta para /candidato/dashboard
```

### Utilizador com Tipo Errado
```
Empresa tenta aceder: /candidato/dashboard
        ↓
ProtectedRoute verifica: user.type !== "CANDIDATO"
        ↓
Redireciona: /empresa/dashboard
        ↓
Mostra mensagem: "Não tem permissão para aceder a esta página"
```

### Utilizador Autenticado em Página de Guest
```
Candidato tenta aceder: /auth/login
        ↓
GuestRoute verifica: user existe
        ↓
Redireciona: /candidato/dashboard
```

### Utilizador Pendente
```
Empresa nova tenta aceder: /empresa/dashboard
        ↓
ProtectedRoute verifica: user.status === "PENDING"
        ↓
Redireciona: /auth/pending-approval
```

### Utilizador Suspenso
```
Utilizador tenta aceder: qualquer rota protegida
        ↓
ProtectedRoute verifica: user.status === "SUSPENDED"
        ↓
Mostra: Tela de conta suspensa
        ↓
Opção: Contactar Suporte
```

## 🎨 Estados de UI

### Loading State
```tsx
<div className="min-h-screen flex items-center justify-center">
  <Loader2 className="animate-spin" />
  <p>A verificar autenticação...</p>
</div>
```

### Suspended State
```tsx
<div className="min-h-screen flex items-center justify-center">
  <h1>Conta Suspensa</h1>
  <p>A sua conta foi suspensa...</p>
  <Button>Contactar Suporte</Button>
</div>
```

## 🔒 Segurança Adicional

### Backend
Mesmo com proteção no frontend, **TODAS as rotas da API devem estar protegidas no backend** com:
- Middleware `authenticateToken` - verifica JWT
- Middleware `authorize(tipo)` - verifica tipo de utilizador

Exemplo:
```typescript
// Backend - src/routes/job.routes.ts
router.use(authenticateToken);
router.use(authorize("EMPRESA"));
router.post("/", createJobValidation, JobController.create);
```

### Frontend vs Backend
- **Frontend:** UX - evita que utilizador veja UI que não deve
- **Backend:** Segurança real - impede acesso aos dados

**Nunca confiar apenas na proteção do frontend!**

## 📝 Como Adicionar Nova Rota Protegida

### 1. Rota que requer autenticação simples
```tsx
<Route 
  path="/nova-funcionalidade" 
  element={
    <ProtectedRoute>
      <NovaFuncionalidade />
    </ProtectedRoute>
  } 
/>
```

### 2. Rota específica para candidatos
```tsx
<Route 
  path="/candidato/nova-funcionalidade" 
  element={
    <ProtectedRoute requiredType="CANDIDATO">
      <NovaFuncionalidade />
    </ProtectedRoute>
  } 
/>
```

### 3. Rota específica para empresas
```tsx
<Route 
  path="/empresa/nova-funcionalidade" 
  element={
    <ProtectedRoute requiredType="EMPRESA">
      <NovaFuncionalidade />
    </ProtectedRoute>
  } 
/>
```

### 4. Rota específica para admins
```tsx
<Route 
  path="/admin/nova-funcionalidade" 
  element={
    <ProtectedRoute requiredType="ADMIN">
      <NovaFuncionalidade />
    </ProtectedRoute>
  } 
/>
```

### 5. Rota apenas para não autenticados
```tsx
<Route 
  path="/auth/nova-pagina" 
  element={
    <GuestRoute>
      <NovaPagina />
    </GuestRoute>
  } 
/>
```

## 🧪 Como Testar

### Teste 1: Acesso Não Autenticado
```
1. Logout
2. Tentar aceder /candidato/dashboard
3. ✅ Deve redirecionar para /auth/login
```

### Teste 2: Acesso com Tipo Errado
```
1. Login como CANDIDATO
2. Tentar aceder /empresa/dashboard
3. ✅ Deve redirecionar para /candidato/dashboard com mensagem de erro
```

### Teste 3: Login Redirecionando
```
1. Logout
2. Tentar aceder /candidato/candidaturas
3. Redireciona para /auth/login
4. Fazer login como CANDIDATO
5. ✅ Deve voltar para /candidato/candidaturas
```

### Teste 4: Utilizador Autenticado em Login
```
1. Login como CANDIDATO
2. Tentar aceder /auth/login
3. ✅ Deve redirecionar para /candidato/dashboard
```

### Teste 5: Utilizador Pendente
```
1. Login com empresa PENDING
2. Tentar aceder /empresa/dashboard
3. ✅ Deve redirecionar para /auth/pending-approval
```

### Teste 6: Utilizador Suspenso
```
1. Login com conta SUSPENDED
2. Tentar aceder qualquer rota protegida
3. ✅ Deve mostrar tela de conta suspensa
```

## 🐛 Troubleshooting

### Problema: Loop infinito de redirecionamento
**Solução:** Verificar se o estado `isLoading` está sendo gerido corretamente no `AuthContext`.

### Problema: Redireciona mas não mostra mensagem de erro
**Solução:** Verificar se o componente de destino está lendo o `location.state.error`.

### Problema: Loading infinito
**Solução:** Verificar se `useAuth` está retornando `isLoading: false` após carregar.

### Problema: Consegue aceder mas não carrega dados
**Solução:** Verificar proteção no backend - a proteção do frontend é apenas UI!

## 🔄 Próximos Passos

1. ✅ Proteção de rotas implementada
2. ⏳ Testar todos os cenários
3. ⏳ Adicionar analytics de tentativas de acesso não autorizado
4. ⏳ Implementar breadcrumbs com proteção
5. ⏳ Adicionar rate limiting no frontend para tentativas de acesso

## 📚 Referências

- `src/components/auth/ProtectedRoute.tsx` - Componentes de proteção
- `src/App.tsx` - Rotas protegidas
- `src/contexts/AuthContext.tsx` - Contexto de autenticação
- `backend/src/middlewares/auth.middleware.ts` - Proteção backend

---

**Nota:** Esta implementação fornece proteção no frontend para melhorar a UX, mas a segurança real está no backend. Nunca confiar apenas na proteção do frontend!

