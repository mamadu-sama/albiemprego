# AlbiEmprego - Plataforma Regional de Emprego

> Plataforma de emprego focada na região de Castelo Branco, Portugal, conectando candidatos e empresas locais.

## Índice

- [Visão Geral](#visão-geral)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Começar a Desenvolver](#começar-a-desenvolver)
- [Sistema de Design](#sistema-de-design)
- [Estrutura de Rotas](#estrutura-de-rotas)
- [Papéis de Utilizador](#papéis-de-utilizador)
- [Guia de Componentes](#guia-de-componentes)
- [Contratos de API (Backend)](#contratos-de-api-backend)
- [Convenções de Código](#convenções-de-código)
- [Fluxos de Utilizador](#fluxos-de-utilizador)

---

## Visão Geral

**AlbiEmprego** é uma aplicação web de emprego regional que permite:

- **Candidatos**: Pesquisar vagas, candidatar-se, gerir perfil e acompanhar candidaturas
- **Empresas**: Publicar vagas, gerir candidaturas, comunicar com candidatos
- **Administradores**: Moderar conteúdo, aprovar empresas/vagas, enviar notificações, gerir plataforma

### Características Principais

| Funcionalidade      | Descrição                                               |
| ------------------- | ------------------------------------------------------- |
| 🔐 Autenticação     | Login, Registo, Recuperação de Senha                    |
| 👤 Gestão de Perfil | Perfil completo com experiência, formação, competências |
| 💼 Vagas de Emprego | Publicação, pesquisa, filtros avançados                 |
| 📋 Candidaturas     | Submissão, tracking de estado, histórico                |
| 📧 Comunicação      | Sistema de email integrado entre empresa-candidato      |
| 🔔 Notificações     | Sistema de notificações com múltiplos tipos             |
| 🛠️ Modo Manutenção  | Banner informativo e página de manutenção               |
| 👨‍💼 Painel Admin     | Gestão completa da plataforma                           |

---

## Stack Tecnológico

### Frontend Core

| Tecnologia     | Versão | Uso                     |
| -------------- | ------ | ----------------------- |
| React          | 18.3.x | Framework UI            |
| TypeScript     | 5.x    | Tipagem estática        |
| Vite           | 5.x    | Build tool & Dev server |
| React Router   | 6.x    | Navegação SPA           |
| TanStack Query | 5.x    | Estado servidor & cache |

### UI & Styling

| Tecnologia    | Uso                         |
| ------------- | --------------------------- |
| Tailwind CSS  | Framework CSS utility-first |
| shadcn/ui     | Biblioteca de componentes   |
| Radix UI      | Primitivos de UI acessíveis |
| Lucide React  | Ícones                      |
| Framer Motion | Animações                   |

### Formulários & Validação

| Tecnologia      | Uso                   |
| --------------- | --------------------- |
| React Hook Form | Gestão de formulários |
| Zod             | Validação de schemas  |

### Utilitários

| Tecnologia               | Uso                      |
| ------------------------ | ------------------------ |
| date-fns                 | Manipulação de datas     |
| class-variance-authority | Variantes de componentes |
| clsx / tailwind-merge    | Merge de classes         |

---

## Arquitetura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Componentes shadcn/ui (base)
│   ├── layout/          # Header, Footer
│   ├── home/            # Componentes da homepage
│   └── jobs/            # Componentes de vagas
├── contexts/            # React Contexts (estado global)
├── hooks/               # Custom React Hooks
├── lib/                 # Utilitários (cn, helpers)
├── pages/               # Páginas da aplicação
│   ├── admin/           # Páginas do painel admin
│   ├── auth/            # Páginas de autenticação
│   ├── candidato/       # Páginas do candidato
│   └── empresa/         # Páginas da empresa
├── App.tsx              # Componente raiz & rotas
├── main.tsx             # Entry point
└── index.css            # Design tokens & estilos globais
```

### Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                        App.tsx                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │              MaintenanceProvider                         ││
│  │  ┌─────────────────────────────────────────────────────┐││
│  │  │                 BrowserRouter                        │││
│  │  │  ┌───────────┐  ┌───────────┐  ┌─────────────────┐ │││
│  │  │  │Maintenance│  │  Cookie   │  │     Routes      │ │││
│  │  │  │  Banner   │  │  Consent  │  │  (ver abaixo)   │ │││
│  │  │  └───────────┘  └───────────┘  └─────────────────┘ │││
│  │  └─────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Começar a Desenvolver

### Pré-requisitos

- Node.js 18+ ou Bun
- npm, yarn, pnpm ou bun

### Instalação

```bash
# Clonar repositório
git clone <repo-url>
cd albiemprego

# Instalar dependências
npm install
# ou
bun install

# Iniciar servidor de desenvolvimento
npm run dev
# ou
bun dev
```

### Scripts Disponíveis

| Comando           | Descrição                   |
| ----------------- | --------------------------- |
| `npm run dev`     | Servidor de desenvolvimento |
| `npm run build`   | Build de produção           |
| `npm run preview` | Preview do build            |
| `npm run lint`    | Verificar código            |

### Variáveis de Ambiente

````env
### Variáveis de Ambiente
```env
# Backend API
VITE_API_URL=http://localhost:8080/api/v1
````

**Backend:** Java Spring Boot + PostgreSQL
**Autenticação:** JWT (enviado no header `Authorization: Bearer {token}`)

````

---

## Sistema de Design

### Design Tokens

Os tokens de design estão definidos em `src/index.css` e mapeados em `tailwind.config.ts`.

#### Cores Principais

| Token | Valor HSL | Uso |
|-------|-----------|-----|
| `--primary` | `217 91% 60%` | Azul profissional - ações principais |
| `--secondary` | `160 84% 39%` | Verde sucesso - confirmações |
| `--accent` | `38 92% 50%` | Laranja - destaques, alertas |
| `--destructive` | `0 84% 60%` | Vermelho - erros, eliminar |
| `--muted` | `210 40% 96%` | Fundos secundários |

#### Uso Correto de Cores

```tsx
// ✅ CORRETO - Usar tokens semânticos
<div className="bg-background text-foreground">
  <Button className="bg-primary text-primary-foreground" />
  <Badge className="bg-secondary text-secondary-foreground" />
</div>

// ❌ ERRADO - Cores diretas
<div className="bg-white text-black">
  <Button className="bg-blue-500 text-white" />
</div>
````

#### Sombras Personalizadas

```css
--shadow-sm: 0 1px 2px 0 hsl(222 47% 11% / 0.05);
--shadow-md: 0 4px 6px -1px hsl(222 47% 11% / 0.1);
--shadow-lg: 0 10px 15px -3px hsl(222 47% 11% / 0.1);
--shadow-glow: 0 0 40px hsl(217 91% 60% / 0.2);
```

#### Animações Disponíveis

| Classe             | Efeito             |
| ------------------ | ------------------ |
| `animate-fade-in`  | Fade in suave      |
| `animate-slide-up` | Slide de baixo     |
| `animate-scale-in` | Scale com fade     |
| `animate-float`    | Flutuação contínua |

### Classes Utilitárias Personalizadas

```css
.container-custom   /* Container responsivo */
/* Container responsivo */
/* Container responsivo */
/* Container responsivo */
/* Container responsivo */
/* Container responsivo */
/* Container responsivo */
/* Container responsivo */
.section-padding    /* Padding de secção */
.card-elevated      /* Card com sombra e hover */
.gradient-text      /* Texto com gradiente */
.focus-ring         /* Focus state acessível */
.hover-lift; /* Hover com elevação */
```

---

## Estrutura de Rotas

### Rotas Públicas

| Rota           | Página      | Descrição                  |
| -------------- | ----------- | -------------------------- |
| `/`            | Index       | Homepage                   |
| `/vagas`       | Vagas       | Lista de vagas com filtros |
| `/vagas/:id`   | VagaDetail  | Detalhes de uma vaga       |
| `/sobre`       | Sobre       | Sobre a plataforma         |
| `/contacto`    | Contacto    | Formulário de contacto     |
| `/faq`         | FAQ         | Perguntas frequentes       |
| `/termos`      | Termos      | Termos de uso              |
| `/privacidade` | Privacidade | Política de privacidade    |
| `/cookies`     | Cookies     | Política de cookies        |

### Rotas de Autenticação (`/auth/*`)

| Rota                    | Página         | Descrição                   |
| ----------------------- | -------------- | --------------------------- |
| `/auth/login`           | Login          | Formulário de login         |
| `/auth/register`        | Register       | Registo de utilizador       |
| `/auth/forgot-password` | ForgotPassword | Solicitar reset de senha    |
| `/auth/reset-password`  | ResetPassword  | Redefinir senha (com token) |

### Rotas do Candidato (`/candidato/*`)

| Rota                       | Página       | Descrição                   |
| -------------------------- | ------------ | --------------------------- |
| `/candidato/dashboard`     | Dashboard    | Painel principal            |
| `/candidato/perfil`        | Perfil       | Ver perfil                  |
| `/candidato/perfil/editar` | EditarPerfil | Editar perfil               |
| `/candidato/candidaturas`  | Candidaturas | Histórico de candidaturas   |
| `/candidato/alertas`       | Alertas      | Configurar alertas de vagas |
| `/candidato/conta`         | Conta        | Definições da conta         |

### Rotas da Empresa (`/empresa/*`)

| Rota                              | Página           | Descrição                |
| --------------------------------- | ---------------- | ------------------------ |
| `/empresa/dashboard`              | Dashboard        | Painel principal         |
| `/empresa/vagas`                  | Vagas            | Gerir vagas publicadas   |
| `/empresa/vagas/nova`             | NovaVaga         | Criar nova vaga          |
| `/empresa/vagas/:id/editar`       | EditarVaga       | Editar vaga              |
| `/empresa/vagas/:id/candidaturas` | VagaCandidaturas | Candidaturas de uma vaga |
| `/empresa/candidaturas`           | Candidaturas     | Todas as candidaturas    |
| `/empresa/candidato/:id`          | PerfilCandidato  | Ver perfil de candidato  |
| `/empresa/candidato/:id/email`    | EnviarEmail      | Enviar email a candidato |
| `/empresa/perfil`                 | Perfil           | Perfil da empresa        |
| `/empresa/rascunhos`              | Rascunhos        | Vagas em rascunho        |
| `/empresa/conta`                  | Conta            | Definições da conta      |

### Rotas do Admin (`/admin/*`)

| Rota                          | Página           | Descrição            |
| ----------------------------- | ---------------- | -------------------- |
| `/admin/dashboard`            | Dashboard        | Painel principal     |
| `/admin/utilizadores`         | Utilizadores     | Gerir utilizadores   |
| `/admin/utilizador/:id`       | PerfilUtilizador | Ver/gerir utilizador |
| `/admin/utilizador/:id/email` | EnviarEmailAdmin | Email a utilizador   |
| `/admin/empresas`             | Empresas         | Gerir empresas       |
| `/admin/empresa/:id`          | PerfilEmpresa    | Ver/gerir empresa    |
| `/admin/empresa/:id/email`    | EnviarEmailAdmin | Email a empresa      |
| `/admin/vagas`                | Vagas            | Moderar vagas        |
| `/admin/aprovacoes`           | Aprovacoes       | Fila de aprovação    |
| `/admin/denuncias`            | Denuncias        | Conteúdo reportado   |
| `/admin/notificacoes`         | Notificacoes     | Enviar notificações  |
| `/admin/configuracoes`        | Configuracoes    | Configurações        |
| `/admin/relatorios`           | Relatorios       | Relatórios/Analytics |
| `/admin/conteudo/:pageId`     | EditarConteudo   | Editar páginas CMS   |

---

## Papéis de Utilizador

### Guest (Não Autenticado)

- Visualizar homepage e vagas públicas
- Pesquisar vagas
- Ver detalhes de vagas
- Aceder a páginas estáticas (Sobre, FAQ, etc.)
- Registar-se ou fazer login

### Candidato

- Todas as permissões de Guest
- Candidatar-se a vagas
- Gerir perfil (experiência, formação, competências)
- Upload de CV
- Acompanhar candidaturas
- Receber notificações
- Configurar alertas de vagas

### Empresa

- Todas as permissões de Guest
- Publicar/editar/pausar vagas
- Gerir rascunhos de vagas
- Ver candidaturas recebidas
- Ver perfis de candidatos
- Enviar emails a candidatos
- Atualizar estado de candidaturas
- Receber notificações

### Administrador

- Acesso total à plataforma
- Aprovar/rejeitar empresas
- Aprovar/rejeitar vagas
- Gerir utilizadores (suspender, eliminar)
- Ver/resolver denúncias
- Enviar notificações globais
- Ativar modo de manutenção
- Aceder a relatórios e analytics
- Editar conteúdo de páginas estáticas

---

## Guia de Componentes

Para documentação detalhada de componentes, ver: [docs/COMPONENTS.md](docs/COMPONENTS.md)

### Resumo de Componentes Principais

| Componente         | Localização                         | Descrição              |
| ------------------ | ----------------------------------- | ---------------------- |
| Header             | `components/layout/Header.tsx`      | Navegação principal    |
| Footer             | `components/layout/Footer.tsx`      | Rodapé                 |
| NotificationCenter | `components/NotificationCenter.tsx` | Gestão de notificações |
| MaintenanceBanner  | `components/MaintenanceBanner.tsx`  | Banner de manutenção   |
| JobCard            | `components/jobs/JobCard.tsx`       | Card de vaga           |
| CookieConsent      | `components/CookieConsent.tsx`      | Banner RGPD            |

---

## Contratos de API (Backend)

Para especificação completa dos endpoints de API, ver: [docs/API.md](docs/API.md)

### Resumo de Endpoints

| Módulo        | Endpoints                               | Descrição                      |
| ------------- | --------------------------------------- | ------------------------------ |
| Auth          | POST `/api/auth/*`                      | Login, Registo, Reset Password |
| Users         | GET/PATCH `/api/users/*`                | Perfil, Preferências           |
| Jobs          | CRUD `/api/jobs/*`                      | Vagas de emprego               |
| Applications  | CRUD `/api/applications/*`              | Candidaturas                   |
| Notifications | GET/PATCH/DELETE `/api/notifications/*` | Notificações                   |
| Admin         | `/api/admin/*`                          | Operações administrativas      |

---

## Convenções de Código

Para guia completo de estilo, ver: [docs/STYLE_GUIDE.md](docs/STYLE_GUIDE.md)

### Resumo

- **Componentes**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase com "use" (`useAuth.ts`)
- **Imports**: Usar alias `@/` para paths absolutos
- **Cores**: Sempre usar tokens semânticos do design system
- **Formulários**: React Hook Form + Zod para validação

---

## Fluxos de Utilizador

Para diagramas detalhados, ver: [docs/FLOWS.md](docs/FLOWS.md)

### Fluxos Principais

1. **Registo e Login** - Candidato ou Empresa
2. **Candidatura a Vaga** - Candidato submete candidatura
3. **Publicação de Vaga** - Empresa cria e publica vaga
4. **Gestão de Candidaturas** - Empresa revê e atualiza estados
5. **Moderação** - Admin aprova/rejeita conteúdo

---

## Checklist para Novas Funcionalidades

### Frontend

- [ ] Criar componentes necessários em `/components`
- [ ] Criar página(s) em `/pages`
- [ ] Adicionar rota(s) em `App.tsx`
- [ ] Usar tokens do design system
- [ ] Garantir responsividade (mobile-first)
- [ ] Adicionar loading states e error handling
- [ ] Usar `useToast` para feedback
- [ ] Testar acessibilidade básica

### Backend

- [ ] Verificar contrato em [docs/API.md](docs/API.md)
- [ ] Implementar endpoint
- [ ] Adicionar validação
- [ ] Implementar auth/authz
- [ ] Documentar alterações

---

## Links Úteis

- **shadcn/ui**: [ui.shadcn.com](https://ui.shadcn.com)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **React Router**: [reactrouter.com](https://reactrouter.com)

---

_Última atualização: Dezembro 2025_
_Versão Frontend: 1.0.0_
