# 🔗 Guia de Integração Frontend-Backend AlbiEmprego

## ✅ Integração Concluída

### 1. Camada de API (`src/lib/api.ts`)
- ✅ Cliente Axios configurado
- ✅ Interceptors para token JWT
- ✅ Refresh token automático
- ✅ Tratamento de erros
- ✅ Funções de autenticação (`authApi`)

### 2. Contexto de Autenticação (`src/contexts/AuthContext.tsx`)
- ✅ `AuthProvider` criado
- ✅ Hook `useAuth()` disponível
- ✅ Funções: `login`, `register`, `logout`, `forgotPassword`, `resetPassword`
- ✅ Integrado com toasts
- ✅ Redirecionamento automático por tipo de utilizador

### 3. App.tsx
- ✅ `AuthProvider` adicionado ao root
- ✅ Hierarquia correta de providers

### 4. Página de Login
- ✅ Integrada com `useAuth()`
- ✅ Chama API real do backend
- ✅ Tratamento de erros automático

## 📝 Como Usar nos Componentes

### Login
```tsx
import { useAuth } from "@/contexts/AuthContext";

function LoginComponent() {
  const { login, isLoading } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Redirect automático
    } catch (error) {
      // Erro já tratado com toast
    }
  };
}
```

### Register
```tsx
import { useAuth } from "@/contexts/AuthContext";

function RegisterComponent() {
  const { register, isLoading } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({
        email,
        password,
        name,
        type: "candidato", // ou "empresa"
        // Para empresas:
        companyName: "...",
        nif: "...",
        phone: "..."
      });
      // Redirect automático
    } catch (error) {
      // Erro já tratado com toast
    }
  };
}
```

### Verificar Autenticação
```tsx
import { useAuth } from "@/contexts/AuthContext";

function ProtectedComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }
  
  return (
    <div>
      <p>Olá, {user.name}!</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```

### Fazer Requisições Autenticadas
```tsx
import api from "@/lib/api";

// O token é adicionado automaticamente
const response = await api.get("/users/me");
const response = await api.post("/jobs", jobData);
```

## 🔐 Dados Armazenados no LocalStorage

- `accessToken` - JWT token (15 min)
- `refreshToken` - Refresh token (7 dias)
- `user` - Dados do utilizador (JSON)

## 🚀 Testar Integração

### 1. Iniciar Backend
```bash
cd backend
npm run dev
```

### 2. Iniciar Frontend
```bash
cd albiemprego
npm run dev
```

### 3. Credenciais de Teste
- **Candidato**: `joao.silva@example.com` / `Candidato123!`
- **Empresa**: `rh@techsolutions.pt` / `Empresa123!`
- **Admin**: `admin@albiemprego.pt` / `Admin123!`

### 4. Testar Login
1. Aceder a `http://localhost:5173/auth/login`
2. Inserir credenciais
3. Verificar redirect para dashboard
4. Verificar token no localStorage
5. Verificar logs no backend

## 🔄 Próximos Passos

### Páginas a Integrar
- [ ] Register (atualizar handleCandidateRegister e handleCompanyRegister)
- [ ] ForgotPassword
- [ ] ResetPassword
- [ ] Candidato Dashboard (buscar dados reais)
- [ ] Empresa Dashboard (buscar dados reais)
- [ ] Perfil (GET /users/me)
- [ ] Editar Perfil (PATCH /users/me)

### Componentes a Criar
- [ ] ProtectedRoute component
- [ ] RoleBasedRoute component (por tipo de utilizador)
- [ ] useUser hook (para buscar dados do utilizador)

## 📡 Endpoints Disponíveis

### Autenticação
- `POST /api/v1/auth/register` - Registar
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/refresh` - Renovar token
- `POST /api/v1/auth/forgot-password` - Solicitar reset
- `POST /api/v1/auth/reset-password` - Reset password

### Health
- `GET /health` - Verificar estado do servidor

## 🐛 Troubleshooting

### Erro CORS
- Verificar se backend está rodando
- Verificar CORS no backend (`src/config/cors.ts`)
- Verificar `VITE_API_URL` no `.env`

### Token Expirado
- O refresh é automático
- Se falhar, faz logout automático

### Erro 401
- Verificar se token está no localStorage
- Verificar se backend está rodando
- Verificar logs do backend

## 📚 Documentação

- Backend API: `/backend/README.md`
- Contratos API: `/albiemprego/docs/API.md`
- Fluxos: `/albiemprego/docs/FLOWS.md`

