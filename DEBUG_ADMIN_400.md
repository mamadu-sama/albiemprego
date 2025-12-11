# 🔍 Debug: Erro 400 na API Admin

## Problema Identificado

Erro 400 (Bad Request) pode ocorrer por:

### 1. Validação de `actionUrl`
O validador estava rejeitando strings vazias. **CORRIGIDO:**

```typescript
// Antes (ERRADO)
body("actionUrl")
  .optional()
  .trim()
  .isURL()  // Rejeita string vazia
  
// Depois (CORRETO)
body("actionUrl")
  .optional({ nullable: true, checkFalsy: true })
  .custom((value) => {
    if (!value || value.trim() === "") return true;
    // Validar apenas se não estiver vazio
    try {
      new URL(value);
      return true;
    } catch {
      throw new Error("URL de ação inválida");
    }
  })
```

### 2. Tipo de Notificação (Case Sensitivity)
O frontend enviava tipo em lowercase mas o validator espera UPPERCASE. **CORRIGIDO:**

```typescript
// admin-api.ts agora converte automaticamente
type: data.type.toUpperCase()
```

### 3. Campos Opcionais
Removidos campos vazios do payload antes de enviar. **CORRIGIDO:**

```typescript
// Só adiciona ao payload se tiver valor
if (data.actionUrl && data.actionUrl.trim()) {
  payload.actionUrl = data.actionUrl;
}
```

## ✅ Soluções Aplicadas

1. **Validador atualizado** - `admin-notification.validator.ts`
2. **API client ajustado** - `admin-api.ts`
3. **Frontend atualizado** - `Notificacoes.tsx`

## 🧪 Como Testar

### Teste 1: Notificação Simples (sem actionUrl)
```json
POST /api/v1/admin/notifications
{
  "title": "Teste",
  "message": "Mensagem de teste",
  "type": "INFO",
  "recipients": "all",
  "sendEmail": false
}
```

### Teste 2: Notificação com ActionUrl
```json
POST /api/v1/admin/notifications
{
  "title": "Nova Vaga",
  "message": "Confira as novas oportunidades",
  "type": "ANNOUNCEMENT",
  "recipients": "candidates",
  "sendEmail": true,
  "actionUrl": "https://albiemprego.pt/vagas",
  "actionLabel": "Ver Vagas"
}
```

### Teste 3: Notificação de Manutenção
```json
POST /api/v1/admin/notifications
{
  "title": "Manutenção Programada",
  "message": "O sistema estará em manutenção domingo 02h-04h",
  "type": "MAINTENANCE",
  "recipients": "all"
}
```

## 🔍 Debugging no Frontend

Se ainda houver erro 400, verifique:

1. **Console do navegador** - Ver payload exato enviado
2. **Network tab** - Ver response body com detalhes do erro
3. **Backend logs** - Ver mensagem de validação específica

## 📝 Response de Erro

Se houver erro de validação, o backend retorna:

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Dados inválidos",
  "errors": [
    {
      "msg": "Tipo de notificação inválido",
      "param": "type",
      "location": "body"
    }
  ]
}
```

## ✅ Agora Deve Funcionar

Todas as correções foram aplicadas. O erro 400 deve estar resolvido!

