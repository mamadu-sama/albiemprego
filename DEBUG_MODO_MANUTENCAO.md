# 🔍 DEBUG: Modo de Manutenção

## 🎯 Problemas Reportados

1. ✅ **Mensagem de sucesso aparece**
2. ❌ **Switch permanece desativado visualmente**
3. ❌ **Janela anónima não redireciona para página de manutenção**

## 📊 Logs de Debug Adicionados

### Console Admin (ao ativar):
```
Enviando payload de manutenção: { enabled: true, message: "...", estimatedEndTime: "..." }
Resposta do backend: { ... }
Estado atualizado - isMaintenanceMode: true
🔄 Verificando status de manutenção: { enabled: true, ... }
```

### Console Janela Anónima:
```
🔍 App - Modo de manutenção: true
👤 App - Utilizador: null (ou candidato/empresa)
🔒 App - É admin: false
🚧 Redirecionando para página de manutenção
```

## 🧪 Teste Passo a Passo

### 1. Verificar Backend
```bash
# Terminal do backend deve estar rodando
cd /home/mamadusama/albiemprego-project/backend
npm run dev
```

### 2. Testar Endpoint Diretamente
```bash
# Num novo terminal ou Postman:
curl http://localhost:3001/api/v1/maintenance/status
```

**Resposta esperada ANTES de ativar:**
```json
{
  "enabled": false,
  "message": null,
  "estimatedEndTime": null
}
```

**Resposta esperada DEPOIS de ativar:**
```json
{
  "enabled": true,
  "message": "Estamos a realizar melhorias na plataforma...",
  "estimatedEndTime": "hoje as 18h"
}
```

### 3. Verificar Base de Dados
```bash
cd /home/mamadusama/albiemprego-project/backend
npx prisma studio
```

- Abre tabela `maintenance_mode`
- Verifica campo `enabled` = `true`
- Verifica `message` e `estimatedEndTime`

### 4. Verificar localStorage (Admin)

**Console do navegador (página admin):**
```javascript
localStorage.getItem('maintenanceMode')  // Deve retornar "true"
localStorage.getItem('maintenanceMessage')  // Mensagem definida
localStorage.getItem('maintenanceEstimatedTime')  // Tempo definido
```

### 5. Verificar localStorage (Janela Anónima)

**Console do navegador (janela anónima):**
```javascript
localStorage.getItem('maintenanceMode')  // Pode estar "false" inicialmente
// Aguarda 10 segundos e verifica novamente
localStorage.getItem('maintenanceMode')  // Deve mudar para "true"
```

## 🔧 Possíveis Causas

### Causa 1: Backend não salvou no banco
**Verificar:**
1. Logs do backend no terminal
2. Prisma Studio → tabela `maintenance_mode`

**Solução:**
```bash
# Verificar conexão com BD
cd backend
npm run prisma:studio
```

### Causa 2: Frontend não está buscando do backend
**Verificar:**
1. Network tab → procurar request para `/api/v1/maintenance/status`
2. Console → verificar se há erro 401, 404, etc

**Solução:**
- Se 404: Verificar se backend está rodando
- Se 401: Endpoint público não precisa auth, verificar rota

### Causa 3: Context não está atualizando
**Verificar:**
1. Console deve mostrar `🔄 Verificando status de manutenção`
2. Verificar se intervalo de 10s está rodando

**Solução:**
- Recarregar página
- Limpar localStorage e recarregar

### Causa 4: Switch não reflete estado
**Verificar:**
1. Console deve mostrar `Estado atualizado - isMaintenanceMode: true`
2. React DevTools → MaintenanceContext → `isMaintenanceMode`

**Solução:**
- O `syncMaintenanceMode()` é chamado após 1s
- Verificar se `isMaintenanceMode` muda para `true`

## 🚀 Comandos de Debug Rápido

### No Console do Navegador (Admin):

```javascript
// Ver estado atual do contexto
console.log("MaintenanceMode:", localStorage.getItem('maintenanceMode'));

// Forçar busca do backend
fetch('http://localhost:3001/api/v1/maintenance/status')
  .then(r => r.json())
  .then(data => console.log('Backend status:', data));

// Forçar atualização do localStorage
localStorage.setItem('maintenanceMode', 'true');
location.reload();
```

### No Console do Navegador (Janela Anónima):

```javascript
// Ver estado
console.log("MaintenanceMode:", localStorage.getItem('maintenanceMode'));

// Buscar do backend
fetch('http://localhost:3001/api/v1/maintenance/status')
  .then(r => r.json())
  .then(data => console.log('Backend status:', data));

// Ver utilizador
console.log("User:", localStorage.getItem('user'));
```

## 📝 Checklist de Verificação

### Backend:
- [ ] Backend está rodando (`npm run dev`)
- [ ] Endpoint responde: `curl http://localhost:3001/api/v1/maintenance/status`
- [ ] Base de dados tem registo na tabela `maintenance_mode`
- [ ] Campo `enabled` está `true` no banco

### Frontend Admin:
- [ ] Console mostra "Enviando payload de manutenção"
- [ ] Console mostra "Resposta do backend"
- [ ] Console mostra "Estado atualizado - isMaintenanceMode: true"
- [ ] localStorage tem `maintenanceMode` = `"true"`
- [ ] Switch muda visualmente após ~1-2 segundos

### Frontend Utilizador:
- [ ] Console mostra "🔄 Verificando status de manutenção"
- [ ] Console mostra `enabled: true` na resposta
- [ ] Console mostra "🔍 App - Modo de manutenção: true"
- [ ] Console mostra "🚧 Redirecionando para página de manutenção"
- [ ] Página de manutenção é exibida

## 🆘 Se Nada Funcionar

### Reset Completo:

```bash
# 1. Parar backend (Ctrl+C)

# 2. Limpar banco
cd backend
npx prisma migrate reset

# 3. Recriar tudo
npx prisma migrate dev
npx prisma generate

# 4. Reiniciar backend
npm run dev

# 5. Frontend: Limpar localStorage
# Console do navegador:
localStorage.clear();
location.reload();
```

### Teste Manual do Fluxo:

1. **Admin ativa modo:**
   ```bash
   curl -X PUT http://localhost:3001/api/v1/admin/maintenance \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer SEU_TOKEN_ADMIN" \
     -d '{"enabled": true, "message": "Teste"}'
   ```

2. **Verificar público:**
   ```bash
   curl http://localhost:3001/api/v1/maintenance/status
   ```

3. **Abrir janela anónima:**
   - `http://localhost:5173`
   - Deve ver página de manutenção

## 💡 Dicas

1. **Tempo de sincronização:** O frontend verifica a cada 10 segundos. Aguarda até 10s após ativar.

2. **Cache do navegador:** Shift+F5 para hard reload.

3. **Múltiplas janelas:** Se já tinha janelas abertas antes de ativar, recarrega-as.

4. **Token admin:** O token JWT pode expirar. Faz login novamente se necessário.

5. **CORS:** Se houver erro CORS, verifica configuração em `backend/src/app.ts`.

## 🎯 Resultado Esperado

### ✅ Quando Ativar (Admin):
1. Toast: "Modo de manutenção ativado"
2. Switch muda para verde/ativado após 1-2s
3. Banco de dados: `enabled = true`

### ✅ Quando Utilizador Aceder:
1. Qualquer rota → Redireciona para `/manutencao`
2. Página mostra mensagem personalizada
3. Admin continua navegando normalmente

### ✅ Quando Desativar:
1. Toast: "Modo de manutenção desativado"
2. Switch volta para cinza/desativado
3. Utilizadores voltam a ter acesso normal

