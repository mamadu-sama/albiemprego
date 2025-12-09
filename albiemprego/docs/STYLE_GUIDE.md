# Guia de Estilos - AlbiEmprego

Este documento define as convenções de código, padrões de desenvolvimento e boas práticas para o projeto.

## Índice

- [Nomenclatura](#nomenclatura)
- [Estrutura de Ficheiros](#estrutura-de-ficheiros)
- [Componentes React](#componentes-react)
- [TypeScript](#typescript)
- [CSS & Tailwind](#css--tailwind)
- [Formulários](#formulários)
- [Estado & Data Fetching](#estado--data-fetching)
- [Tratamento de Erros](#tratamento-de-erros)
- [Acessibilidade](#acessibilidade)
- [Performance](#performance)
- [Git & Commits](#git--commits)

---

## Nomenclatura

### Ficheiros e Pastas

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Componentes React | PascalCase | `UserProfile.tsx` |
| Páginas | PascalCase | `Dashboard.tsx` |
| Hooks | camelCase com "use" | `useAuth.ts` |
| Contextos | PascalCase com "Context" | `AuthContext.tsx` |
| Utilitários | camelCase | `formatDate.ts` |
| Constantes | SCREAMING_SNAKE_CASE em ficheiro | `API_BASE_URL` |
| Pastas | kebab-case ou camelCase | `user-profile/` ou `userProfile/` |

### Variáveis e Funções

```typescript
// ✅ Correto
const userName = "João";
const isLoggedIn = true;
const getUserById = (id: string) => {};
const handleSubmit = () => {};

// ❌ Evitar
const user_name = "João";
const logged_in = true;
const get_user = () => {};
```

### Componentes

```typescript
// ✅ Correto
function UserProfile() {}
const JobCard = () => {};

// ❌ Evitar
function userProfile() {}
const job_card = () => {};
```

### Types e Interfaces

```typescript
// ✅ Correto - PascalCase, interface para objetos
interface UserProfile {
  id: string;
  name: string;
}

type UserRole = "admin" | "user" | "guest";

// Props sempre com sufixo Props
interface ButtonProps {
  variant: "primary" | "secondary";
}
```

---

## Estrutura de Ficheiros

### Estrutura de Componente

```
ComponentName/
├── ComponentName.tsx      # Componente principal
├── ComponentName.test.tsx # Testes (se aplicável)
├── index.ts               # Re-export
└── types.ts               # Types específicos (se complexo)
```

Ou ficheiro simples:
```
ComponentName.tsx
```

### Ordem de Imports

```typescript
// 1. React e bibliotecas externas
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 2. Componentes UI (shadcn)
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// 3. Componentes locais
import { Header } from "@/components/layout/Header";

// 4. Hooks
import { useAuth } from "@/hooks/useAuth";

// 5. Utilitários e tipos
import { cn } from "@/lib/utils";
import type { User } from "@/types";

// 6. Assets
import logo from "@/assets/logo.svg";
```

---

## Componentes React

### Estrutura Padrão

```tsx
// 1. Imports
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

// 2. Types
interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

// 3. Component
export function MyComponent({ title, onAction }: MyComponentProps) {
  // 3.1 Hooks (sempre primeiro)
  const [state, setState] = useState("");
  
  // 3.2 Derived state / computations
  const isValid = state.length > 0;
  
  // 3.3 Effects
  useEffect(() => {
    // side effects
  }, []);
  
  // 3.4 Event handlers
  const handleClick = () => {
    onAction?.();
  };
  
  // 3.5 Render helpers (se necessário)
  const renderList = () => {
    return items.map(item => <li key={item.id}>{item.name}</li>);
  };
  
  // 3.6 Early returns
  if (!data) {
    return <LoadingSkeleton />;
  }
  
  // 3.7 Main render
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={handleClick}>Action</Button>
    </div>
  );
}

// 4. Default export (se necessário)
export default MyComponent;
```

### Padrão de Página

```tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function PageName() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Conteúdo da página */}
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

### Componente com forwardRef

```tsx
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div>
        <input
          ref={ref}
          className={cn(
            "base-classes",
            error && "border-destructive",
            className
          )}
          {...props}
        />
        {error && <span className="text-destructive text-sm">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
```

---

## TypeScript

### Tipos vs Interfaces

```typescript
// Interface para objetos e classes
interface User {
  id: string;
  name: string;
  email: string;
}

// Type para unions, primitivos, e tipos complexos
type UserRole = "admin" | "user" | "guest";
type UserId = string;
type Nullable<T> = T | null;
```

### Props Typing

```typescript
// ✅ Correto
interface ButtonProps {
  variant: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  onClick?: () => void;
}

// Extending HTML props
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
```

### Evitar `any`

```typescript
// ❌ Evitar
const handleData = (data: any) => {};

// ✅ Correto
const handleData = (data: unknown) => {
  if (typeof data === "string") {
    // ...
  }
};

// Ou com tipo específico
const handleData = (data: UserData) => {};
```

### Generics

```typescript
// Componente genérico
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map(renderItem)}</ul>;
}

// Hook genérico
function useLocalStorage<T>(key: string, initialValue: T) {
  // ...
}
```

---

## CSS & Tailwind

### Uso de Tokens

```tsx
// ✅ Correto - Usar tokens semânticos
<div className="bg-background text-foreground border-border">
  <Button className="bg-primary text-primary-foreground" />
  <span className="text-muted-foreground" />
</div>

// ❌ Errado - Cores diretas
<div className="bg-white text-black border-gray-200">
  <Button className="bg-blue-500 text-white" />
</div>
```

### Classes Ordenadas

```tsx
// Ordem recomendada:
// 1. Layout (display, position, flex/grid)
// 2. Sizing (width, height, padding, margin)
// 3. Typography (font, text)
// 4. Visual (background, border, shadow)
// 5. Interactive (hover, focus, transition)

<div className="flex items-center gap-4 p-4 text-sm bg-card border rounded-lg hover:shadow-md transition-shadow">
```

### Responsividade

```tsx
// Mobile-first
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>

// Texto responsivo
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Título
</h1>
```

### Utility cn()

```tsx
import { cn } from "@/lib/utils";

// Merge condicional de classes
<button
  className={cn(
    "base-classes",
    isActive && "bg-primary text-primary-foreground",
    isDisabled && "opacity-50 cursor-not-allowed",
    className
  )}
/>
```

---

## Formulários

### React Hook Form + Zod

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// 1. Schema de validação
const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

// 2. Componente
function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    // submit logic
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("email")}
        type="email"
        placeholder="Email"
      />
      {errors.email && (
        <span className="text-destructive text-sm">
          {errors.email.message}
        </span>
      )}
      
      <Input
        {...register("password")}
        type="password"
        placeholder="Password"
      />
      {errors.password && (
        <span className="text-destructive text-sm">
          {errors.password.message}
        </span>
      )}
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "A entrar..." : "Entrar"}
      </Button>
    </form>
  );
}
```

---

## Estado & Data Fetching

### TanStack Query

```tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Query
function useJobs(filters: JobFilters) {
  return useQuery({
    queryKey: ["jobs", filters],
    queryFn: () => fetchJobs(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Mutation
function useApplyToJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ApplyData) => applyToJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast({ title: "Candidatura submetida!" });
    },
    onError: (error) => {
      toast({ 
        title: "Erro", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });
}

// Uso
function JobDetail({ jobId }: { jobId: string }) {
  const { data: job, isLoading, error } = useJob(jobId);
  const applyMutation = useApplyToJob();

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <h1>{job.title}</h1>
      <Button 
        onClick={() => applyMutation.mutate({ jobId })}
        disabled={applyMutation.isPending}
      >
        Candidatar
      </Button>
    </div>
  );
}
```

---

## Tratamento de Erros

### Toast para Feedback

```tsx
import { useToast } from "@/hooks/use-toast";

function MyComponent() {
  const { toast } = useToast();

  const handleAction = async () => {
    try {
      await someAction();
      toast({
        title: "Sucesso!",
        description: "Ação realizada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Algo correu mal.",
        variant: "destructive",
      });
    }
  };
}
```

### Error Boundaries

```tsx
// Para erros de renderização
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="p-4 text-center">
      <h2>Algo correu mal</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={resetErrorBoundary}>Tentar novamente</Button>
    </div>
  );
}

// Uso
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <MyComponent />
</ErrorBoundary>
```

---

## Acessibilidade

### Checklist Básica

- [ ] Semântica HTML correta (`header`, `main`, `nav`, `section`, etc.)
- [ ] Hierarquia de headings (`h1` único, `h2`, `h3`...)
- [ ] Labels associados a inputs
- [ ] Alt text em imagens
- [ ] Focus visible em elementos interativos
- [ ] Contraste de cores adequado (4.5:1 mínimo)
- [ ] Navegação por teclado funcional

### Exemplos

```tsx
// ✅ Correto
<button aria-label="Fechar menu">
  <XIcon />
</button>

<img src={logo} alt="Logo AlbiEmprego" />

<label htmlFor="email">Email</label>
<input id="email" type="email" />

// ❌ Evitar
<div onClick={handleClick}>Clique aqui</div>
<img src={logo} />
<input type="email" placeholder="Email" /> {/* sem label */}
```

---

## Performance

### Otimizações

```tsx
// useMemo para cálculos pesados
const filteredItems = useMemo(
  () => items.filter(item => item.name.includes(search)),
  [items, search]
);

// useCallback para handlers passados como props
const handleClick = useCallback(() => {
  // ...
}, [dependency]);

// Lazy loading de páginas
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));

// Virtualização para listas longas
import { useVirtualizer } from "@tanstack/react-virtual";
```

### Imagens

```tsx
// Lazy loading
<img 
  src={image} 
  alt="Descrição" 
  loading="lazy"
  decoding="async"
/>

// Tamanhos responsivos
<img
  srcSet="small.jpg 480w, medium.jpg 800w, large.jpg 1200w"
  sizes="(max-width: 600px) 480px, 800px"
  src="medium.jpg"
  alt="Descrição"
/>
```

---

## Git & Commits

### Formato de Commits

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[footer opcional]
```

### Tipos

| Tipo | Uso |
|------|-----|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Documentação |
| `style` | Formatação (sem mudança de código) |
| `refactor` | Refatoração |
| `test` | Testes |
| `chore` | Manutenção |

### Exemplos

```
feat(auth): adicionar página de recuperação de password

fix(jobs): corrigir filtro de localização

docs(readme): atualizar instruções de instalação

refactor(components): extrair JobCard para componente separado
```

### Branches

```
main              # Produção
develop           # Desenvolvimento
feature/nome      # Nova funcionalidade
fix/descricao     # Correção
hotfix/urgente    # Correção urgente em produção
```

---

## Checklist de Code Review

### Antes de submeter PR

- [ ] Código compila sem erros
- [ ] Sem warnings de TypeScript
- [ ] Sem console.log de debug
- [ ] Imports organizados
- [ ] Componentes seguem padrões
- [ ] Tokens de design usados
- [ ] Responsivo verificado
- [ ] Acessibilidade básica ok
- [ ] Commit messages claras

---

*Última atualização: Dezembro 2024*
