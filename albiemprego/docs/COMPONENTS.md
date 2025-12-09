# Guia de Componentes - AlbiEmprego

Este documento detalha os componentes reutilizáveis do projeto, suas props e exemplos de uso.

## Índice

- [Layout Components](#layout-components)
- [Componentes Globais](#componentes-globais)
- [Componentes de Chat](#componentes-de-chat)
- [Componentes de Comunidade](#componentes-de-comunidade)
- [Componentes de Jobs](#componentes-de-jobs)
- [Componentes UI (shadcn)](#componentes-ui-shadcn)
- [Contextos](#contextos)
- [Hooks Personalizados](#hooks-personalizados)

---

## Layout Components

### Header

**Localização**: `src/components/layout/Header.tsx`

Componente de navegação principal da aplicação.

```tsx
import { Header } from "@/components/layout/Header";

// Uso básico
<Header />
```

**Responsabilidades**:
- Logo e branding
- Links de navegação principal
- Links de autenticação (Login/Registar)
- Menu mobile responsivo (hamburger)
- Navegação contextual baseada no role do utilizador

**Dependências**:
- `react-router-dom` para navegação
- `lucide-react` para ícones
- Componentes shadcn: Button, Sheet (mobile menu)

---

### Footer

**Localização**: `src/components/layout/Footer.tsx`

Rodapé da aplicação com links institucionais.

```tsx
import { Footer } from "@/components/layout/Footer";

// Uso básico
<Footer />
```

**Responsabilidades**:
- Links para páginas estáticas (Sobre, FAQ, Termos, etc.)
- Informações de contacto
- Links para redes sociais
- Copyright e informação legal

---

## Componentes Globais

### NotificationCenter

**Localização**: `src/components/NotificationCenter.tsx`

Centro de notificações integrado nos dashboards.

```tsx
import { NotificationCenter } from "@/components/NotificationCenter";

// Uso básico
<NotificationCenter />
```

**Tipos de Notificação Suportados**:

```typescript
export type NotificationType = 
  | "info"         // Informação geral (ícone azul)
  | "success"      // Confirmações (ícone verde)
  | "warning"      // Avisos (ícone amarelo)
  | "announcement" // Anúncios (ícone roxo)
  | "promotion"    // Promoções (ícone rosa)
  | "system";      // Sistema (ícone cinza)
```

**Funcionalidades**:
- Listar notificações do utilizador
- Marcar como lida (individual)
- Marcar todas como lidas
- Eliminar notificação
- Eliminar todas as lidas
- Indicador de não lidas

**Estrutura de Notificação**:

```typescript
interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}
```

---

### MaintenanceBanner

**Localização**: `src/components/MaintenanceBanner.tsx`

Banner de aviso de manutenção exibido no topo da página.

```tsx
import { MaintenanceBanner } from "@/components/MaintenanceBanner";

// Uso (geralmente no App.tsx, já integrado)
<MaintenanceBanner />
```

**Características**:
- Aparece quando há notificação de manutenção ativa
- Ocupa largura total da tela
- Fundo amarelo com ícone de alerta
- Botão X para fechar (guarda preferência em localStorage)
- Fecha apenas quando utilizador clica

**Dependências**:
- `MaintenanceContext` para estado global

---

### CookieConsent

**Localização**: `src/components/CookieConsent.tsx`

Banner de consentimento de cookies (RGPD).

```tsx
import { CookieConsent } from "@/components/CookieConsent";

// Uso (já integrado no App.tsx)
<CookieConsent />
```

**Características**:
- Exibido para novos visitantes
- Opções: Aceitar, Rejeitar, Configurar
- Guarda preferência em localStorage
- Link para política de cookies

---

### NavLink

**Localização**: `src/components/NavLink.tsx`

Link de navegação com estado ativo.

```tsx
import { NavLink } from "@/components/NavLink";

<NavLink to="/vagas" activeClassName="text-primary">
  Vagas
</NavLink>
```

**Props**:

| Prop | Tipo | Descrição |
|------|------|-----------|
| `to` | `string` | Caminho de destino |
| `activeClassName` | `string` | Classes quando ativo |
| `className` | `string` | Classes base |
| `children` | `ReactNode` | Conteúdo do link |

---

## Componentes de Chat

### ChatHeader

**Localização**: `src/components/chat/ChatHeader.tsx`

Header da conversa ativa no sistema de mensagens.

```tsx
import { ChatHeader } from "@/components/chat/ChatHeader";

<ChatHeader
  participant={{
    id: "1",
    name: "TechSolutions Lda",
    avatar: "/avatars/techsolutions.png",
    online: true
  }}
  context={{
    type: "application",
    title: "Candidatura: Dev Frontend"
  }}
/>
```

**Props Interface:**

```typescript
interface ChatHeaderProps {
  participant: {
    id: string;
    name: string;
    avatar?: string;
    online?: boolean;
  };
  context?: {
    type: "application" | "job" | "support";
    title: string;
  };
}
```

---

### MessageBubble

**Localização**: `src/components/chat/MessageBubble.tsx`

Balão de mensagem individual.

```tsx
import { MessageBubble } from "@/components/chat/MessageBubble";

<MessageBubble
  message={{
    id: "1",
    content: "Olá, recebi a sua candidatura!",
    sender: { id: "2", name: "Empresa X" },
    sentAt: "2024-01-15T10:30:00Z",
    status: "read"
  }}
  isOwn={false}
/>
```

**Props Interface:**

```typescript
interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    sender: {
      id: string;
      name: string;
      avatar?: string;
    };
    attachments?: Attachment[];
    status: "sending" | "sent" | "delivered" | "read";
    isSystem?: boolean;
    sentAt: string;
  };
  isOwn: boolean;
}
```

**Características:**
- Alinhamento diferente para mensagens próprias vs recebidas
- Indicador de status (enviando, enviado, lido)
- Suporte a anexos (imagens, PDFs)
- Mensagens de sistema com estilo diferenciado
- Timestamp relativo

---

### MessageInput

**Localização**: `src/components/chat/MessageInput.tsx`

Campo de input para enviar mensagens.

```tsx
import { MessageInput } from "@/components/chat/MessageInput";

<MessageInput
  onSend={(content, attachments) => handleSend(content, attachments)}
  disabled={isSending}
/>
```

**Props Interface:**

```typescript
interface MessageInputProps {
  onSend: (content: string, attachments?: File[]) => void;
  disabled?: boolean;
  placeholder?: string;
}
```

**Características:**
- Textarea expansível
- Botão de anexos
- Envio com Enter (Shift+Enter para nova linha)
- Preview de anexos antes de enviar
- Validação de tipos de ficheiro

---

### ConversationItem

**Localização**: `src/components/chat/ConversationItem.tsx`

Item da lista de conversas na sidebar.

```tsx
import { ConversationItem } from "@/components/chat/ConversationItem";

<ConversationItem
  conversation={{
    id: "1",
    participant: { name: "João Silva", avatar: "..." },
    lastMessage: { content: "Obrigado!", sentAt: "..." },
    unreadCount: 2
  }}
  isActive={selectedId === "1"}
  onClick={() => selectConversation("1")}
/>
```

**Props Interface:**

```typescript
interface ConversationItemProps {
  conversation: {
    id: string;
    participant: {
      name: string;
      avatar?: string;
      online?: boolean;
    };
    lastMessage?: {
      content: string;
      sentAt: string;
    };
    unreadCount: number;
    context?: {
      type: string;
      title: string;
    };
  };
  isActive: boolean;
  onClick: () => void;
}
```

---

### TypingIndicator

**Localização**: `src/components/chat/TypingIndicator.tsx`

Indicador de "está a escrever".

```tsx
import { TypingIndicator } from "@/components/chat/TypingIndicator";

<TypingIndicator userName="João" />
```

---

### NewConversationDialog

**Localização**: `src/components/chat/NewConversationDialog.tsx`

Modal para iniciar nova conversa.

```tsx
import { NewConversationDialog } from "@/components/chat/NewConversationDialog";

<NewConversationDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  onConversationCreated={(id) => navigate(`/mensagens/${id}`)}
/>
```

---

### ApplicationContextCard

**Localização**: `src/components/chat/ApplicationContextCard.tsx`

Card de contexto mostrando informação da candidatura relacionada.

```tsx
import { ApplicationContextCard } from "@/components/chat/ApplicationContextCard";

<ApplicationContextCard
  application={{
    jobTitle: "Developer Frontend",
    companyName: "TechCorp",
    status: "in_review",
    appliedAt: "2024-01-10"
  }}
/>
```

---

## Componentes de Comunidade

### DiscussionCard

**Localização**: `src/components/comunidade/DiscussionCard.tsx`

Card de discussão do fórum.

```tsx
import { DiscussionCard } from "@/components/comunidade/DiscussionCard";

<DiscussionCard
  discussion={{
    id: "1",
    title: "Dicas para entrevistas remotas",
    category: "Carreira",
    author: { name: "Ana Silva" },
    repliesCount: 15,
    createdAt: "2024-01-15"
  }}
/>
```

---

### EventCard

**Localização**: `src/components/comunidade/EventCard.tsx`

Card de evento da comunidade.

```tsx
import { EventCard } from "@/components/comunidade/EventCard";

<EventCard
  event={{
    id: "1",
    title: "Workshop CV 2024",
    date: "2024-02-01",
    time: "14:00",
    location: "Online",
    participantsCount: 25,
    maxParticipants: 50
  }}
/>
```

---

### MemberCard

**Localização**: `src/components/comunidade/MemberCard.tsx`

Card de membro da comunidade.

```tsx
import { MemberCard } from "@/components/comunidade/MemberCard";

<MemberCard
  member={{
    id: "1",
    name: "João Costa",
    title: "Designer UX",
    skills: ["Figma", "UX Research"],
    location: "Castelo Branco"
  }}
/>
```

---

### CategoryBadge

**Localização**: `src/components/comunidade/CategoryBadge.tsx`

Badge de categoria para discussões.

```tsx
import { CategoryBadge } from "@/components/comunidade/CategoryBadge";

<CategoryBadge category="Carreira" />
<CategoryBadge category="Tecnologia" />
```

---

### ParticipantsList

**Localização**: `src/components/comunidade/ParticipantsList.tsx`

Lista de participantes de um evento.

```tsx
import { ParticipantsList } from "@/components/comunidade/ParticipantsList";

<ParticipantsList
  participants={[
    { id: "1", name: "Ana", avatar: "..." },
    { id: "2", name: "João", avatar: "..." }
  ]}
  maxVisible={5}
/>
```

---

### ReplyForm

**Localização**: `src/components/comunidade/ReplyForm.tsx`

Formulário para responder a discussões.

```tsx
import { ReplyForm } from "@/components/comunidade/ReplyForm";

<ReplyForm
  discussionId="1"
  onReplySubmitted={() => refetchReplies()}
/>
```

---

## Componentes de Jobs

### JobCard

**Localização**: `src/components/jobs/JobCard.tsx`

Card de exibição de vaga de emprego.

```tsx
import { JobCard } from "@/components/jobs/JobCard";

const job = {
  id: 1,
  title: "Desenvolvedor Frontend",
  company: "TechSolutions Lda",
  location: "Castelo Branco",
  salary: "1500€ - 2000€",
  type: "full-time",
  workMode: "híbrido",
  postedAt: "2024-01-15",
  logo: "/logos/techsolutions.png"
};

<JobCard job={job} />
```

**Props Interface**:

```typescript
interface JobCardProps {
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
    salary?: string;
    type: "full-time" | "part-time" | "temporary" | "internship";
    workMode: "presencial" | "remoto" | "híbrido";
    postedAt: string;
    logo?: string;
  };
}
```

**Características**:
- Logo da empresa (com fallback)
- Título e empresa
- Localização com ícone
- Badges de tipo e modo de trabalho
- Salário (se disponível)
- Data de publicação relativa
- Link para detalhes
- Botão de guardar/favoritar

---

## Componentes UI (shadcn)

Componentes base do shadcn/ui localizados em `src/components/ui/`.

### Uso Correto

```tsx
// Imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
```

### Componentes Disponíveis

| Componente | Uso Principal |
|------------|---------------|
| `Accordion` | Conteúdo expansível (FAQ) |
| `AlertDialog` | Confirmações destrutivas |
| `Avatar` | Imagem de utilizador |
| `Badge` | Tags e estados |
| `Button` | Ações e links |
| `Card` | Containers de conteúdo |
| `Checkbox` | Seleção múltipla |
| `Dialog` | Modais |
| `DropdownMenu` | Menus de ações |
| `Form` | Formulários com validação |
| `Input` | Campos de texto |
| `Label` | Etiquetas de formulário |
| `Popover` | Conteúdo flutuante |
| `Progress` | Barras de progresso |
| `Select` | Dropdowns |
| `Separator` | Divisores visuais |
| `Sheet` | Painéis laterais (mobile) |
| `Skeleton` | Loading placeholders |
| `Switch` | Toggles on/off |
| `Table` | Tabelas de dados |
| `Tabs` | Navegação em tabs |
| `Textarea` | Campos multiline |
| `Toast` | Notificações temporárias |
| `Tooltip` | Dicas de contexto |

### Variantes de Button

```tsx
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Tamanhos
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

---

## Contextos

### MaintenanceContext

**Localização**: `src/contexts/MaintenanceContext.tsx`

Gerencia estado global do modo de manutenção.

```tsx
import { useMaintenance } from "@/contexts/MaintenanceContext";

function MyComponent() {
  const {
    isMaintenanceMode,      // boolean
    setMaintenanceMode,     // (value: boolean) => void
    maintenanceBanner,      // banner ativo ou null
    setMaintenanceBanner,   // definir banner
    dismissBanner,          // fechar banner
    maintenanceMessage,     // mensagem da página de manutenção
    setMaintenanceMessage,  // atualizar mensagem
    estimatedEndTime,       // previsão de retorno
    setEstimatedEndTime,    // atualizar previsão
  } = useMaintenance();

  return (
    <div>
      {isMaintenanceMode && <p>Modo de manutenção ativo!</p>}
    </div>
  );
}
```

**Interface do Banner**:

```typescript
interface MaintenanceBanner {
  id: string;
  title: string;
  message: string;
  sentAt: Date;
}
```

**Persistência**:
- Estado guardado em `localStorage`
- Keys: `maintenanceMode`, `maintenanceBanner`, `maintenanceMessage`, `maintenanceEstimatedTime`

---

## Hooks Personalizados

### useToast

**Localização**: `src/hooks/use-toast.ts`

Hook para mostrar notificações toast.

```tsx
import { useToast, toast } from "@/hooks/use-toast";

function MyComponent() {
  const { toast } = useToast();

  const handleSuccess = () => {
    toast({
      title: "Sucesso!",
      description: "Operação realizada com sucesso.",
    });
  };

  const handleError = () => {
    toast({
      title: "Erro",
      description: "Algo correu mal. Tente novamente.",
      variant: "destructive",
    });
  };

  return (
    <button onClick={handleSuccess}>Mostrar Toast</button>
  );
}
```

**Opções**:

```typescript
interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: ReactNode;
  duration?: number; // ms
}
```

---

### useIsMobile

**Localização**: `src/hooks/use-mobile.tsx`

Hook para detetar viewport mobile.

```tsx
import { useIsMobile } from "@/hooks/use-mobile";

function MyComponent() {
  const isMobile = useIsMobile();

  return (
    <div>
      {isMobile ? (
        <MobileLayout />
      ) : (
        <DesktopLayout />
      )}
    </div>
  );
}
```

**Comportamento**:
- Retorna `true` se largura < 768px
- Atualiza automaticamente com resize
- Debounce para performance

---

### useMessageNotifications

**Localização**: `src/hooks/useMessageNotifications.ts`

Hook para notificações de novas mensagens em tempo real.

```tsx
import { useMessageNotifications } from "@/hooks/useMessageNotifications";

function App() {
  const { unreadCount, checkForNewMessages } = useMessageNotifications({
    pollingInterval: 15000,  // 15 segundos
    enabled: true
  });

  return (
    <div>
      <Badge>{unreadCount}</Badge>
    </div>
  );
}
```

**Opções:**

```typescript
interface UseMessageNotificationsOptions {
  pollingInterval?: number;  // default: 15000 (15s)
  enabled?: boolean;         // default: true
}
```

**Funcionalidades:**
- Polling automático para novas mensagens
- Reproduz som de notificação
- Mostra toast com preview da mensagem
- Browser notification quando app não está em foco
- Não notifica se utilizador está na página de mensagens
- Tracking de app focus/blur

**Retorno:**

```typescript
{
  unreadCount: number;
  checkForNewMessages: () => void;
}
```

---

## Utilitários de Notificação

### messageNotifications

**Localização**: `src/utils/messageNotifications.ts`

Funções utilitárias para notificações de mensagens.

```tsx
import {
  showMessageNotification,
  playNotificationSound,
  requestNotificationPermission,
  showBrowserNotification,
  notifyNewMessage
} from "@/utils/messageNotifications";

// Reproduzir som de notificação
playNotificationSound();

// Mostrar toast de mensagem
showMessageNotification("João Silva", "Olá, tudo bem?", () => {
  navigate("/mensagens/123");
});

// Pedir permissão para browser notifications
const granted = await requestNotificationPermission();

// Mostrar browser notification
showBrowserNotification("João Silva", "Olá, tudo bem?");

// Função combinada (toast + browser notification se app não em foco)
notifyNewMessage("João Silva", "Olá, tudo bem?", isAppFocused);
```

**Funções:**

| Função | Descrição |
|--------|-----------|
| `initAudio()` | Inicializa o contexto de áudio Web |
| `playNotificationSound()` | Reproduz som de beep de notificação |
| `showMessageNotification(sender, preview, onClick?)` | Mostra toast com info da mensagem |
| `requestNotificationPermission()` | Pede permissão para browser notifications |
| `showBrowserNotification(sender, preview)` | Mostra browser notification |
| `notifyNewMessage(sender, preview, isAppFocused)` | Combina toast e browser notification |

---

## Padrões de Componentes

### Estrutura Base de Página

```tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function PageName() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Conteúdo */}
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

### Estrutura de Componente Reutilizável

```tsx
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface MyComponentProps {
  variant?: "default" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
}

export const MyComponent = forwardRef<HTMLDivElement, MyComponentProps>(
  ({ variant = "default", size = "md", className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "base-classes",
          variant === "outline" && "border-2",
          size === "sm" && "text-sm",
          size === "lg" && "text-lg",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MyComponent.displayName = "MyComponent";
```

---

## Próximos Passos

Para adicionar um novo componente:

1. Criar ficheiro em `src/components/` (ou subpasta apropriada)
2. Seguir estrutura de componente acima
3. Exportar do ficheiro
4. Documentar neste guia
5. Adicionar exemplos de uso

---

*Última atualização: Dezembro 2024*
