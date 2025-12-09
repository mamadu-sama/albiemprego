// Mock Chat Data for AlbiEmprego

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  type: 'candidato' | 'empresa' | 'admin';
  role?: string;
  company?: string;
  isOnline?: boolean;
}

export interface Attachment {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'pdf' | 'other';
  size: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  attachments?: Attachment[];
  isSystem?: boolean;
}

export interface ConversationContext {
  type: 'application' | 'support' | 'general';
  referenceId?: string;
  jobTitle?: string;
  companyName?: string;
}

export interface Conversation {
  id: string;
  participants: [ChatUser, ChatUser];
  messages: Message[];
  lastMessageAt: Date;
  unreadCount: number;
  context?: ConversationContext;
}

// Current logged user (mock - candidato)
export const currentUser: ChatUser = {
  id: 'current-user',
  name: 'Maria Santos',
  avatar: '',
  type: 'candidato',
  role: 'Desenvolvedora Frontend',
  isOnline: true
};

// Mock participants
export const mockParticipants: ChatUser[] = [
  {
    id: 'company-1',
    name: 'TechCorp Portugal',
    avatar: '',
    type: 'empresa',
    company: 'TechCorp Portugal',
    isOnline: true
  },
  {
    id: 'company-2',
    name: 'Digital Solutions Lda',
    avatar: '',
    type: 'empresa',
    company: 'Digital Solutions Lda',
    isOnline: false
  },
  {
    id: 'company-3',
    name: 'Inovação & Tech',
    avatar: '',
    type: 'empresa',
    company: 'Inovação & Tech',
    isOnline: true
  },
  {
    id: 'admin-1',
    name: 'Equipa AlbiEmprego',
    avatar: '',
    type: 'admin',
    role: 'Suporte',
    isOnline: true
  },
  {
    id: 'candidate-1',
    name: 'João Silva',
    avatar: '',
    type: 'candidato',
    role: 'Desenvolvedor Full-Stack',
    isOnline: false
  },
  {
    id: 'candidate-2',
    name: 'Ana Costa',
    avatar: '',
    type: 'candidato',
    role: 'Designer UX/UI',
    isOnline: true
  }
];

// Helper function to create messages
const createMessage = (
  id: string,
  conversationId: string,
  senderId: string,
  text: string,
  hoursAgo: number,
  status: Message['status'] = 'read',
  isSystem = false
): Message => ({
  id,
  conversationId,
  senderId,
  text,
  timestamp: new Date(Date.now() - hoursAgo * 60 * 60 * 1000),
  status,
  isSystem
});

// Mock conversations
export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participants: [currentUser, mockParticipants[0]], // TechCorp
    lastMessageAt: new Date(Date.now() - 0.5 * 60 * 60 * 1000),
    unreadCount: 2,
    context: {
      type: 'application',
      referenceId: 'app-123',
      jobTitle: 'Desenvolvedor Frontend Senior',
      companyName: 'TechCorp Portugal'
    },
    messages: [
      createMessage('msg-1-1', 'conv-1', 'company-1', 'Olá Maria! Recebemos a sua candidatura para a posição de Desenvolvedor Frontend Senior e ficámos muito interessados no seu perfil.', 48),
      createMessage('msg-1-2', 'conv-1', 'current-user', 'Olá! Muito obrigada pelo contacto. Estou muito entusiasmada com esta oportunidade!', 47),
      createMessage('msg-1-3', 'conv-1', 'company-1', 'Excelente! Gostaríamos de agendar uma entrevista consigo. Está disponível esta semana?', 24),
      createMessage('msg-1-4', 'conv-1', 'current-user', 'Sim, tenho disponibilidade na quarta ou quinta-feira, período da tarde.', 23),
      createMessage('msg-1-5', 'conv-1', 'company-1', 'Perfeito! Vamos agendar para quinta-feira às 15h. Enviarei os detalhes por email.', 1, 'delivered'),
      createMessage('msg-1-6', 'conv-1', 'company-1', 'Entretanto, pode consultar mais informações sobre a nossa empresa no nosso website.', 0.5, 'sent'),
    ]
  },
  {
    id: 'conv-2',
    participants: [currentUser, mockParticipants[1]], // Digital Solutions
    lastMessageAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    unreadCount: 0,
    context: {
      type: 'application',
      referenceId: 'app-456',
      jobTitle: 'React Developer',
      companyName: 'Digital Solutions Lda'
    },
    messages: [
      createMessage('msg-2-1', 'conv-2', 'company-2', 'Bom dia! Vimos o seu CV e gostaríamos de saber mais sobre a sua experiência com React.', 72),
      createMessage('msg-2-2', 'conv-2', 'current-user', 'Bom dia! Trabalho com React há 4 anos, incluindo Next.js e TypeScript.', 70),
      createMessage('msg-2-3', 'conv-2', 'company-2', 'Interessante! Pode partilhar algum projeto ou portfolio?', 68),
      createMessage('msg-2-4', 'conv-2', 'current-user', 'Claro! Aqui está o link do meu GitHub e portfolio: github.com/mariasantos', 48),
      createMessage('msg-2-5', 'conv-2', 'company-2', 'Obrigado! Vamos analisar e entramos em contacto em breve.', 24),
    ]
  },
  {
    id: 'conv-3',
    participants: [currentUser, mockParticipants[3]], // Admin/Suporte
    lastMessageAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    unreadCount: 1,
    context: {
      type: 'support'
    },
    messages: [
      createMessage('msg-3-0', 'conv-3', 'system', 'Conversa de suporte iniciada', 50, 'read', true),
      createMessage('msg-3-1', 'conv-3', 'current-user', 'Olá, estou com dificuldades em atualizar o meu CV no perfil.', 49),
      createMessage('msg-3-2', 'conv-3', 'admin-1', 'Olá Maria! Vou ajudá-la com isso. Pode descrever qual erro está a ver?', 48),
      createMessage('msg-3-3', 'conv-3', 'current-user', 'Quando tento fazer upload do ficheiro PDF, aparece uma mensagem de erro.', 47),
      createMessage('msg-3-4', 'conv-3', 'admin-1', 'Entendo. Por favor, verifique se o ficheiro tem menos de 5MB. Também pode tentar outro navegador.', 46),
      createMessage('msg-3-5', 'conv-3', 'current-user', 'Funcionou! Muito obrigada pela ajuda!', 45),
      createMessage('msg-3-6', 'conv-3', 'admin-1', 'Ótimo! Fico feliz em ajudar. Se precisar de mais alguma coisa, estamos aqui!', 44, 'delivered'),
    ]
  },
  {
    id: 'conv-4',
    participants: [currentUser, mockParticipants[2]], // Inovação & Tech
    lastMessageAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    unreadCount: 0,
    context: {
      type: 'general'
    },
    messages: [
      createMessage('msg-4-1', 'conv-4', 'company-3', 'Olá! Vimos o seu perfil e temos algumas oportunidades que podem interessar.', 168),
      createMessage('msg-4-2', 'conv-4', 'current-user', 'Olá! Agradeço o contacto. Que tipo de posições têm disponíveis?', 165),
      createMessage('msg-4-3', 'conv-4', 'company-3', 'Temos vagas para Frontend e Full-Stack em regime remoto ou híbrido.', 160),
    ]
  }
];

// Helper functions
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'agora';
  if (diffInSeconds < 3600) return `há ${Math.floor(diffInSeconds / 60)}min`;
  if (diffInSeconds < 86400) return `há ${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 172800) return 'ontem';
  if (diffInSeconds < 604800) return `há ${Math.floor(diffInSeconds / 86400)} dias`;
  
  return date.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' });
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const getParticipantTypeBadge = (type: ChatUser['type']): { label: string; variant: 'default' | 'secondary' | 'outline' } => {
  switch (type) {
    case 'empresa':
      return { label: 'Empresa', variant: 'default' };
    case 'admin':
      return { label: 'Suporte', variant: 'secondary' };
    default:
      return { label: 'Candidato', variant: 'outline' };
  }
};

// localStorage helpers
const CONVERSATIONS_KEY = 'albiemprego_conversations';
const MESSAGES_KEY = 'albiemprego_messages_';

export const getStoredConversations = (): Conversation[] => {
  try {
    const stored = localStorage.getItem(CONVERSATIONS_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return data.conversations.map((conv: any) => ({
        ...conv,
        lastMessageAt: new Date(conv.lastMessageAt),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
    }
  } catch (e) {
    console.error('Error reading conversations from localStorage:', e);
  }
  return mockConversations;
};

export const saveConversations = (conversations: Conversation[]): void => {
  try {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify({
      conversations,
      lastSync: Date.now()
    }));
  } catch (e) {
    console.error('Error saving conversations to localStorage:', e);
  }
};

export const addMessageToConversation = (conversationId: string, message: Omit<Message, 'id'>): Message => {
  const conversations = getStoredConversations();
  const convIndex = conversations.findIndex(c => c.id === conversationId);
  
  const newMessage: Message = {
    ...message,
    id: `msg-${Date.now()}`
  };
  
  if (convIndex !== -1) {
    conversations[convIndex].messages.push(newMessage);
    conversations[convIndex].lastMessageAt = new Date();
    saveConversations(conversations);
  }
  
  return newMessage;
};

export const markConversationAsRead = (conversationId: string): void => {
  const conversations = getStoredConversations();
  const convIndex = conversations.findIndex(c => c.id === conversationId);
  
  if (convIndex !== -1) {
    conversations[convIndex].unreadCount = 0;
    conversations[convIndex].messages = conversations[convIndex].messages.map(msg => ({
      ...msg,
      status: 'read' as const
    }));
    saveConversations(conversations);
  }
};

export const getTotalUnreadCount = (): number => {
  const conversations = getStoredConversations();
  return conversations.reduce((total, conv) => total + conv.unreadCount, 0);
};

export const createNewConversation = (
  participant: ChatUser,
  context?: ConversationContext,
  initialMessage?: string
): Conversation => {
  const conversations = getStoredConversations();
  
  // Check if conversation already exists
  const existing = conversations.find(c => 
    c.participants.some(p => p.id === participant.id)
  );
  
  if (existing) return existing;
  
  const newConv: Conversation = {
    id: `conv-${Date.now()}`,
    participants: [currentUser, participant],
    messages: initialMessage ? [{
      id: `msg-${Date.now()}`,
      conversationId: `conv-${Date.now()}`,
      senderId: currentUser.id,
      text: initialMessage,
      timestamp: new Date(),
      status: 'sent'
    }] : [],
    lastMessageAt: new Date(),
    unreadCount: 0,
    context
  };
  
  conversations.unshift(newConv);
  saveConversations(conversations);
  
  return newConv;
};

// Search helpers
export const searchConversations = (query: string, conversations: Conversation[]): Conversation[] => {
  const lowerQuery = query.toLowerCase();
  return conversations.filter(conv => {
    const otherParticipant = conv.participants.find(p => p.id !== currentUser.id);
    if (otherParticipant?.name.toLowerCase().includes(lowerQuery)) return true;
    return conv.messages.some(msg => msg.text.toLowerCase().includes(lowerQuery));
  });
};

export const searchMessagesInConversation = (query: string, messages: Message[]): Message[] => {
  const lowerQuery = query.toLowerCase();
  return messages.filter(msg => msg.text.toLowerCase().includes(lowerQuery));
};
