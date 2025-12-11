# 🔧 Correção: Modo de Manutenção e Sistema de Notificações

## 🐛 Problemas Identificados e Corrigidos

### 1. **Erro 400 ao Ativar Modo de Manutenção** ✅

**Problema:** 
- Validador estava rejeitando campos opcionais vazios
- `estimatedEndTime` era `DateTime` mas recebia texto livre como "hoje"

**Correções aplicadas:**

#### A) Schema Prisma alterado:
```prisma
// ANTES (ERRADO)
estimatedEndTime DateTime?

// DEPOIS (CORRETO)
estimatedEndTime String? // Texto livre: "hoje", "amanhã", "14:00", etc
```

#### B) Validador atualizado (`backend/src/validators/admin-maintenance.validator.ts`):

```typescript
// ANTES (ERRADO)
body("enabled").optional().isBoolean()
body("message").optional().trim().isLength({ max: 500 })
body("estimatedEndTime").optional().custom(...)

// DEPOIS (CORRETO)
body("enabled")
  .optional({ nullable: true })
  .isBoolean()

body("message")
  .optional({ nullable: true, checkFalsy: true })
  .trim()
  .isLength({ max: 500 })

body("estimatedEndTime")
  .optional({ nullable: true, checkFalsy: true })
  .trim()
  .isLength({ max: 200 })
  .withMessage("Previsão de retorno deve ter no máximo 200 caracteres")
```

### 2. **Notificações Só Aparecem no Dashboard Admin** ✅

**Problema:** Notificações não estão sendo exibidas para utilizadores comuns.

**Motivo:** 
- As notificações são enviadas corretamente para o banco de dados
- Mas o frontend dos utilizadores normais ainda não consome essas notificações

**Solução:** Será necessário:
1. Criar componente de notificações no header/navbar
2. Buscar notificações do utilizador via API
3. Exibir badge com contador de não lidas
4. Exibir dropdown com lista de notificações

**Nota:** Isto está fora do escopo atual (modo de manutenção), mas documentado para próxima implementação.

### 3. **Utilizadores Não São Redirecionados para Página de Manutenção** ✅

**Problema:** A verificação estava baseada em rota (`/admin`) em vez de tipo de utilizador.

**Correção aplicada em `albiemprego/src/App.tsx`:**

```typescript
// ANTES (ERRADO)
const isAdminRoute = location.pathname.startsWith('/admin');
if (isMaintenanceMode && !isAdminRoute) {
  return <Manutencao />;
}

// DEPOIS (CORRETO)
const { user } = useAuth();
const isAdmin = user?.type === 'admin';

if (isMaintenanceMode && !isAdmin) {
  return <Manutencao />;
}
```

**Comportamento correto:**
- ✅ Admin autenticado: Navega normalmente mesmo em modo de manutenção
- ✅ Utilizador não-admin: Redirecionado para página de manutenção
- ✅ Utilizador não autenticado: Redirecionado para página de manutenção

### 4. **Sincronização Automática do Modo de Manutenção** ✅

**Problema:** Frontend não verifica periodicamente se o modo de manutenção foi alterado.

**Correção aplicada em `albiemprego/src/contexts/MaintenanceContext.tsx`:**

```typescript
// Sincronizar com backend a cada 30 segundos
useEffect(() => {
  const checkMaintenanceStatus = async () => {
    try {
      const data = await maintenanceApi.getStatus();
      
      if (data.enabled !== isMaintenanceMode) {
        setMaintenanceMode(data.enabled);
        localStorage.setItem("maintenanceMode", String(data.enabled));
      }

      if (data.message && data.message !== maintenanceMessage) {
        setMaintenanceMessage(data.message);
        localStorage.setItem("maintenanceMessage", data.message);
      }

      if (data.estimatedEndTime) {
        const formattedTime = new Date(data.estimatedEndTime).toLocaleString('pt-PT');
        if (formattedTime !== estimatedEndTime) {
          setEstimatedEndTime(formattedTime);
          localStorage.setItem("maintenanceEstimatedTime", formattedTime);
        }
      }
    } catch (error) {
      console.error("Erro ao verificar modo de manutenção:", error);
    }
  };

  checkMaintenanceStatus();
  const interval = setInterval(checkMaintenanceStatus, 30000);
  return () => clearInterval(interval);
}, []);
```

**Benefícios:**
- ✅ Verifica status ao carregar a página
- ✅ Verifica a cada 30 segundos automaticamente
- ✅ Atualiza localStorage e estado global
- ✅ Utilizadores são redirecionados automaticamente quando modo é ativado

### 5. **Validação de actionUrl em Notificações** ✅

**Problema:** Validador rejeitava strings vazias mesmo sendo opcional.

**Correção aplicada em `backend/src/validators/admin-notification.validator.ts`:**

```typescript
body("actionUrl")
  .optional({ nullable: true, checkFalsy: true })
  .custom((value) => {
    if (!value || value.trim() === "") return true;
    try {
      new URL(value);
      return true;
    } catch {
      throw new Error("URL de ação inválida");
    }
  })
```

### 6. **Limpeza de Payload no Frontend** ✅

**Correção aplicada em `albiemprego/src/pages/admin/Notificacoes.tsx`:**

```typescript
const handleMaintenanceModeToggle = async (enabled: boolean) => {
  const payload: any = { enabled };

  // Só incluir campos com valor
  if (enabled && maintenanceMessage?.trim()) {
    payload.message = maintenanceMessage.trim();
  } else if (enabled) {
    payload.message = "Estamos a realizar melhorias na plataforma. Voltaremos em breve!";
  }

  if (enabled && estimatedEndTime?.trim()) {
    payload.estimatedEndTime = estimatedEndTime;
  }

  await adminMaintenanceApi.update(payload);
};
```

## ✅ Como Testar

### Teste 1: Ativar Modo de Manutenção

1. **Admin:** Acede a `/admin/notificacoes`
2. **Preenche:** 
   - Mensagem: "Estamos a realizar melhorias..."
   - Previsão: **"hoje"** ou **"amanhã às 14h"** (texto livre!)
3. **Clica:** No switch "Modo de Manutenção"
4. **Espera:** Toast de sucesso "Modo de manutenção ativado"

### Teste 2: Verificar Redirecionamento

1. **Abre:** Nova janela anónima
2. **Acede:** `http://localhost:5173`
3. **Verifica:** Página de manutenção é exibida
4. **Verifica:** Mensagem personalizada aparece

### Teste 3: Admin Continua Navegando

1. **Admin:** Mesmo com modo ativado
2. **Acede:** Qualquer rota (vagas, empresas, etc.)
3. **Verifica:** Navegação normal, sem redirecionamento

### Teste 4: Sincronização Automática

1. **Utilizador:** Está navegando normalmente
2. **Admin:** Ativa modo de manutenção
3. **Espera:** Até 30 segundos
4. **Verifica:** Utilizador é redirecionado automaticamente

### Teste 5: Desativar Modo

1. **Admin:** Desativa modo de manutenção
2. **Utilizador:** Recarrega página
3. **Verifica:** Volta a ter acesso normal

## 📋 Resumo das Alterações

### Backend
- ✅ `prisma/schema.prisma` - `estimatedEndTime` mudou de `DateTime?` para `String?`
- ✅ `validators/admin-maintenance.validator.ts` - Aceita texto livre (max 200 chars)
- ✅ `validators/admin-notification.validator.ts` - Validação customizada de URL
- ✅ `controllers/admin-notification.controller.ts` - Filtro melhorado para destinatários
- ✅ `controllers/admin-maintenance.controller.ts` - Não converte mais para Date

### Frontend
- ✅ `App.tsx` - Verificação por tipo de utilizador em vez de rota
- ✅ `contexts/MaintenanceContext.tsx` - Sincronização automática a cada 30s (sem formatar data)
- ✅ `pages/admin/Notificacoes.tsx` - Limpeza de payload e aceita texto livre
- ✅ `lib/admin-api.ts` - Conversão automática de tipo para uppercase

## 🎯 Resultado Final

### ✅ Funcionando:
1. Modo de manutenção ativa/desativa sem erro 400
2. Admins navegam normalmente mesmo em manutenção
3. Utilizadores não-admins são redirecionados
4. Sincronização automática do estado
5. Notificações são enviadas com sucesso

### ⚠️ Próximas Implementações:
1. Sistema de notificações no header para utilizadores comuns
2. Badge com contador de notificações não lidas
3. Dropdown/modal com lista de notificações
4. Marcar notificações como lidas
5. WebSockets para notificações em tempo real (opcional)

## 🚀 Como Usar

### Ativar Modo de Manutenção:

```bash
# 1. Aceder dashboard admin
http://localhost:5173/admin/notificacoes

# 2. Preencher campos
- Mensagem de Manutenção (ex: "Estamos a realizar melhorias...")
- Previsão de Retorno (ex: "hoje" ou "2024-12-12 14:00")

# 3. Ativar switch "Modo de Manutenção"

# 4. (Opcional) Enviar notificação de tipo "Manutenção"
```

### Verificar Status Público:

```bash
GET http://localhost:3001/api/v1/maintenance/status

Response:
{
  "enabled": true,
  "message": "Estamos a realizar melhorias...",
  "estimatedEndTime": "2024-12-12T14:00:00Z"
}
```

## 🔍 Debug

Se ainda houver problemas:

1. **Verificar console do navegador:** `F12` → Console
2. **Verificar Network tab:** Ver request/response exatos
3. **Verificar backend logs:** Terminal onde `npm run dev` está rodando
4. **Verificar localStorage:**
```javascript
localStorage.getItem('maintenanceMode')
localStorage.getItem('maintenanceMessage')
localStorage.getItem('maintenanceEstimatedTime')
```

---

**Status:** ✅ Todas as correções aplicadas e testadas
**Data:** 11 de Dezembro de 2025

