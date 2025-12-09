// Mock data for community features

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  discussionCount: number;
}

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  company?: string;
  isVerified?: boolean;
  type: 'candidato' | 'empresa';
}

export interface Discussion {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: Author;
  category: Category;
  createdAt: Date;
  updatedAt: Date;
  replies: number;
  views: number;
  isPinned: boolean;
  lastReplyAt?: Date;
  lastReplyBy?: Author;
}

export interface Reply {
  id: string;
  content: string;
  author: Author;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  date: Date;
  endDate?: Date;
  type: 'online' | 'presencial' | 'hibrido';
  location?: string;
  link?: string;
  organizer: Author;
  participants: Author[];
  maxParticipants: number;
  image?: string;
  tags: string[];
  isPast: boolean;
}

export interface Member {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  company?: string;
  location: string;
  type: 'candidato' | 'empresa';
  bio?: string;
  sectors: string[];
  skills: string[];
  joinedAt: Date;
  postsCount: number;
  repliesCount: number;
  eventsAttended: number;
  isVerified?: boolean;
  links?: {
    linkedin?: string;
    portfolio?: string;
    website?: string;
  };
}

// Categories
export const categories: Category[] = [
  { id: '1', name: 'Tecnologia', slug: 'tecnologia', icon: '🖥️', color: 'bg-blue-500', discussionCount: 87 },
  { id: '2', name: 'Desenvolvimento de Carreira', slug: 'carreira', icon: '💼', color: 'bg-green-500', discussionCount: 65 },
  { id: '3', name: 'Vida Empresarial', slug: 'empresarial', icon: '🏢', color: 'bg-purple-500', discussionCount: 43 },
  { id: '4', name: 'Educação', slug: 'educacao', icon: '🎓', color: 'bg-orange-500', discussionCount: 38 },
  { id: '5', name: 'Indústria & Construção', slug: 'industria', icon: '🏗️', color: 'bg-slate-500', discussionCount: 29 },
  { id: '6', name: 'Saúde', slug: 'saude', icon: '🏥', color: 'bg-red-500', discussionCount: 34 },
  { id: '7', name: 'Networking', slug: 'networking', icon: '🌍', color: 'bg-pink-500', discussionCount: 22 },
  { id: '8', name: 'Geral', slug: 'geral', icon: '💬', color: 'bg-gray-500', discussionCount: 24 },
];

// Mock Authors
const mockAuthors: Author[] = [
  { id: '1', name: 'João Silva', avatar: undefined, role: 'Desenvolvedor Full-Stack', company: 'TechSolutions', isVerified: true, type: 'candidato' },
  { id: '2', name: 'Maria Santos', avatar: undefined, role: 'Designer UX/UI', company: 'CreativeAgency', type: 'candidato' },
  { id: '3', name: 'Pedro Costa', avatar: undefined, role: 'Gestor de Projeto', company: 'InnovateTech', isVerified: true, type: 'candidato' },
  { id: '4', name: 'Ana Rodrigues', avatar: undefined, role: 'Enfermeira', company: 'Hospital Amato Lusitano', type: 'candidato' },
  { id: '5', name: 'TechSolutions', avatar: undefined, role: 'Empresa de Tecnologia', isVerified: true, type: 'empresa' },
  { id: '6', name: 'Carlos Mendes', avatar: undefined, role: 'Professor', company: 'IPCB', type: 'candidato' },
  { id: '7', name: 'Sofia Ferreira', avatar: undefined, role: 'Marketing Digital', company: 'DigitalFirst', type: 'candidato' },
  { id: '8', name: 'Rui Oliveira', avatar: undefined, role: 'Técnico de Turismo', type: 'candidato' },
];

// Mock Discussions
export const discussions: Discussion[] = [
  {
    id: '1',
    title: 'Melhores práticas para trabalho remoto em 2024',
    content: 'Gostaria de saber quais são as melhores práticas para trabalho remoto que vocês têm implementado nas vossas empresas. Tenho tido alguma dificuldade em manter a produtividade e a comunicação com a equipa.\n\nAlguém tem dicas ou ferramentas que recomendem?',
    excerpt: 'Gostaria de saber quais são as melhores práticas para trabalho remoto que vocês têm implementado nas vossas empresas...',
    author: mockAuthors[0],
    category: categories[0],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    replies: 12,
    views: 234,
    isPinned: true,
    lastReplyAt: new Date(Date.now() - 30 * 60 * 1000),
    lastReplyBy: mockAuthors[2],
  },
  {
    id: '2',
    title: 'Como preparar-se para entrevistas técnicas?',
    content: 'Estou à procura de emprego na área de desenvolvimento e tenho algumas entrevistas marcadas. Quais são as vossas dicas para preparar entrevistas técnicas? Que tipo de perguntas costumam fazer?',
    excerpt: 'Estou à procura de emprego na área de desenvolvimento e tenho algumas entrevistas marcadas...',
    author: mockAuthors[1],
    category: categories[1],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    replies: 8,
    views: 156,
    isPinned: false,
    lastReplyAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    lastReplyBy: mockAuthors[0],
  },
  {
    id: '3',
    title: 'Oportunidades de networking em Castelo Branco',
    content: 'Sou novo na região e gostaria de conhecer outros profissionais da área de tecnologia. Existe algum grupo ou meetup regular em Castelo Branco?',
    excerpt: 'Sou novo na região e gostaria de conhecer outros profissionais da área de tecnologia...',
    author: mockAuthors[7],
    category: categories[6],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    replies: 15,
    views: 289,
    isPinned: true,
    lastReplyAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    lastReplyBy: mockAuthors[4],
  },
  {
    id: '4',
    title: 'Dicas para melhorar o currículo',
    content: 'Estou a reformular o meu currículo e gostaria de saber quais são as melhores práticas atuais. O que as empresas valorizam mais num CV?',
    excerpt: 'Estou a reformular o meu currículo e gostaria de saber quais são as melhores práticas atuais...',
    author: mockAuthors[3],
    category: categories[1],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    replies: 21,
    views: 456,
    isPinned: false,
    lastReplyAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    lastReplyBy: mockAuthors[6],
  },
  {
    id: '5',
    title: 'Formação contínua na área da saúde',
    content: 'Quais são as melhores oportunidades de formação contínua para profissionais de saúde na região? Congressos, workshops, certificações?',
    excerpt: 'Quais são as melhores oportunidades de formação contínua para profissionais de saúde na região?',
    author: mockAuthors[3],
    category: categories[5],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    replies: 7,
    views: 123,
    isPinned: false,
  },
  {
    id: '6',
    title: 'Empreendedorismo na Beira Interior',
    content: 'Estou a pensar em criar a minha própria empresa na região. Alguém tem experiência com os apoios disponíveis para startups? Incubadoras, financiamento?',
    excerpt: 'Estou a pensar em criar a minha própria empresa na região. Alguém tem experiência com os apoios...',
    author: mockAuthors[2],
    category: categories[2],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    replies: 19,
    views: 378,
    isPinned: false,
  },
  {
    id: '7',
    title: 'Ferramentas de IA para produtividade',
    content: 'Quais ferramentas de inteligência artificial vocês têm usado no trabalho? ChatGPT, Copilot, outras? Quais são as vossas experiências?',
    excerpt: 'Quais ferramentas de inteligência artificial vocês têm usado no trabalho? ChatGPT, Copilot...',
    author: mockAuthors[0],
    category: categories[0],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    replies: 34,
    views: 567,
    isPinned: false,
  },
  {
    id: '8',
    title: 'Certificações mais valorizadas em IT',
    content: 'Para quem trabalha em tecnologia, quais certificações vocês consideram mais valiosas para progressão de carreira? AWS, Azure, Google Cloud?',
    excerpt: 'Para quem trabalha em tecnologia, quais certificações vocês consideram mais valiosas...',
    author: mockAuthors[6],
    category: categories[0],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    replies: 11,
    views: 234,
    isPinned: false,
  },
];

// Mock Replies
export const mockReplies: Reply[] = [
  {
    id: '1',
    content: 'Excelente pergunta! Na minha empresa usamos Slack para comunicação e Notion para documentação. Tem funcionado muito bem.',
    author: mockAuthors[2],
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: '2',
    content: 'Recomendo também o uso de standups diários, mesmo que sejam assíncronos. Ajuda muito a manter toda a gente alinhada.',
    author: mockAuthors[1],
    createdAt: new Date(Date.now() - 45 * 60 * 1000),
  },
  {
    id: '3',
    content: 'Para mim, ter um espaço de trabalho dedicado em casa foi fundamental. Mesmo que seja pequeno, ajuda a separar o trabalho da vida pessoal.',
    author: mockAuthors[6],
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
];

// Mock Events
export const events: Event[] = [
  {
    id: '1',
    title: 'Meetup Tech Castelo Branco',
    description: 'Encontro mensal de profissionais de tecnologia da região para networking e partilha de conhecimento.',
    fullDescription: 'O Meetup Tech Castelo Branco é um encontro mensal onde profissionais de tecnologia da região se reúnem para partilhar conhecimento, fazer networking e discutir as últimas tendências do setor.\n\nNesta edição, teremos palestras sobre Inteligência Artificial e o seu impacto no mercado de trabalho regional.',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    type: 'presencial',
    location: 'Cowork Castelo Branco, Av. da Liberdade 123',
    organizer: mockAuthors[4],
    participants: [mockAuthors[0], mockAuthors[1], mockAuthors[2], mockAuthors[6]],
    maxParticipants: 30,
    tags: ['Tecnologia', 'Networking', 'Meetup'],
    isPast: false,
  },
  {
    id: '2',
    title: 'Workshop: Preparação para Entrevistas',
    description: 'Workshop prático sobre como preparar-se para entrevistas de emprego, desde a pesquisa à empresa até às perguntas difíceis.',
    fullDescription: 'Neste workshop intensivo, vamos abordar todas as fases de preparação para entrevistas de emprego:\n\n- Pesquisa sobre a empresa\n- Preparação do elevator pitch\n- Respostas às perguntas mais comuns\n- Linguagem corporal\n- Negociação salarial',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    type: 'online',
    link: 'https://zoom.us/j/123456789',
    organizer: mockAuthors[2],
    participants: [mockAuthors[1], mockAuthors[3], mockAuthors[7]],
    maxParticipants: 50,
    tags: ['Carreira', 'Workshop', 'Entrevistas'],
    isPast: false,
  },
  {
    id: '3',
    title: 'Feira de Emprego Beira Interior 2024',
    description: 'A maior feira de emprego da região com mais de 30 empresas a recrutar.',
    fullDescription: 'A Feira de Emprego Beira Interior é o maior evento de recrutamento da região, reunindo mais de 30 empresas de diversos setores.\n\nOs visitantes poderão entregar currículos, participar em entrevistas rápidas e conhecer as oportunidades de emprego disponíveis.',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    type: 'presencial',
    location: 'Centro de Congressos de Castelo Branco',
    organizer: mockAuthors[4],
    participants: mockAuthors.slice(0, 6),
    maxParticipants: 500,
    tags: ['Emprego', 'Feira', 'Recrutamento'],
    isPast: false,
  },
  {
    id: '4',
    title: 'Webinar: IA no Mercado de Trabalho',
    description: 'Como a inteligência artificial está a transformar o mercado de trabalho e como se preparar.',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    type: 'online',
    link: 'https://zoom.us/j/987654321',
    organizer: mockAuthors[0],
    participants: [mockAuthors[1], mockAuthors[2], mockAuthors[6], mockAuthors[7]],
    maxParticipants: 100,
    tags: ['IA', 'Webinar', 'Tecnologia'],
    isPast: false,
  },
  {
    id: '5',
    title: 'Café & Networking - Profissionais de Saúde',
    description: 'Encontro informal para profissionais de saúde da região.',
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    type: 'presencial',
    location: 'Café Central, Castelo Branco',
    organizer: mockAuthors[3],
    participants: [mockAuthors[3]],
    maxParticipants: 20,
    tags: ['Saúde', 'Networking'],
    isPast: false,
  },
  {
    id: '6',
    title: 'Hackathon Regional 2024',
    description: '48 horas de desenvolvimento de soluções tecnológicas para problemas regionais.',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    type: 'hibrido',
    location: 'IPCB - Castelo Branco',
    organizer: mockAuthors[5],
    participants: mockAuthors,
    maxParticipants: 60,
    tags: ['Hackathon', 'Tecnologia', 'Inovação'],
    isPast: true,
  },
];

// Mock Members
export const members: Member[] = [
  {
    id: '1',
    name: 'João Silva',
    role: 'Desenvolvedor Full-Stack',
    company: 'TechSolutions',
    location: 'Castelo Branco',
    type: 'candidato',
    bio: 'Desenvolvedor apaixonado por tecnologia e inovação. Trabalho com React, Node.js e Python.',
    sectors: ['Tecnologia', 'Startups'],
    skills: ['React', 'Node.js', 'Python', 'TypeScript'],
    joinedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    postsCount: 23,
    repliesCount: 87,
    eventsAttended: 12,
    isVerified: true,
    links: { linkedin: 'https://linkedin.com/in/joaosilva' },
  },
  {
    id: '2',
    name: 'Maria Santos',
    role: 'Designer UX/UI',
    company: 'CreativeAgency',
    location: 'Covilhã',
    type: 'candidato',
    bio: 'Designer focada em criar experiências digitais incríveis.',
    sectors: ['Design', 'Tecnologia'],
    skills: ['Figma', 'Adobe XD', 'UI Design', 'User Research'],
    joinedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    postsCount: 15,
    repliesCount: 45,
    eventsAttended: 8,
    links: { portfolio: 'https://mariasantos.design' },
  },
  {
    id: '3',
    name: 'Pedro Costa',
    role: 'Gestor de Projeto',
    company: 'InnovateTech',
    location: 'Castelo Branco',
    type: 'candidato',
    bio: 'Project Manager com experiência em metodologias ágeis.',
    sectors: ['Gestão', 'Tecnologia'],
    skills: ['Scrum', 'Agile', 'Jira', 'Liderança'],
    joinedAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000),
    postsCount: 34,
    repliesCount: 112,
    eventsAttended: 15,
    isVerified: true,
  },
  {
    id: '4',
    name: 'Ana Rodrigues',
    role: 'Enfermeira',
    company: 'Hospital Amato Lusitano',
    location: 'Castelo Branco',
    type: 'candidato',
    bio: 'Enfermeira com 10 anos de experiência em cuidados intensivos.',
    sectors: ['Saúde'],
    skills: ['Cuidados Intensivos', 'Emergência', 'Formação'],
    joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    postsCount: 8,
    repliesCount: 23,
    eventsAttended: 4,
  },
  {
    id: '5',
    name: 'TechSolutions',
    role: 'Empresa de Tecnologia',
    location: 'Castelo Branco',
    type: 'empresa',
    bio: 'Empresa especializada em soluções tecnológicas para empresas da região.',
    sectors: ['Tecnologia', 'Consultoria'],
    skills: ['Desenvolvimento Web', 'Mobile', 'Cloud'],
    joinedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    postsCount: 12,
    repliesCount: 34,
    eventsAttended: 20,
    isVerified: true,
    links: { website: 'https://techsolutions.pt' },
  },
  {
    id: '6',
    name: 'Carlos Mendes',
    role: 'Professor',
    company: 'IPCB',
    location: 'Castelo Branco',
    type: 'candidato',
    bio: 'Professor de Engenharia Informática com foco em IA.',
    sectors: ['Educação', 'Tecnologia'],
    skills: ['Machine Learning', 'Python', 'Ensino'],
    joinedAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000),
    postsCount: 19,
    repliesCount: 67,
    eventsAttended: 10,
    isVerified: true,
  },
  {
    id: '7',
    name: 'Sofia Ferreira',
    role: 'Marketing Digital',
    company: 'DigitalFirst',
    location: 'Fundão',
    type: 'candidato',
    bio: 'Especialista em marketing digital e growth hacking.',
    sectors: ['Marketing', 'Tecnologia'],
    skills: ['SEO', 'Google Ads', 'Social Media', 'Analytics'],
    joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    postsCount: 7,
    repliesCount: 28,
    eventsAttended: 5,
  },
  {
    id: '8',
    name: 'Rui Oliveira',
    role: 'Técnico de Turismo',
    location: 'Idanha-a-Nova',
    type: 'candidato',
    bio: 'Apaixonado por turismo sustentável e desenvolvimento regional.',
    sectors: ['Turismo', 'Sustentabilidade'],
    skills: ['Guia Turístico', 'Línguas', 'Eventos'],
    joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    postsCount: 3,
    repliesCount: 12,
    eventsAttended: 2,
  },
];

// Helper functions
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMins < 1) return 'agora mesmo';
  if (diffMins < 60) return `há ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
  if (diffHours < 24) return `há ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
  if (diffDays === 1) return 'ontem';
  if (diffDays < 7) return `há ${diffDays} dias`;
  if (diffWeeks < 4) return `há ${diffWeeks} ${diffWeeks === 1 ? 'semana' : 'semanas'}`;
  if (diffMonths < 12) return `há ${diffMonths} ${diffMonths === 1 ? 'mês' : 'meses'}`;
  
  return date.toLocaleDateString('pt-PT');
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function formatEventDate(date: Date): { day: string; month: string; time: string } {
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleDateString('pt-PT', { month: 'short' }).replace('.', '');
  const time = date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
  
  return { day, month: month.toUpperCase(), time };
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find(cat => cat.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(cat => cat.slug === slug);
}

export function getMemberById(id: string): Member | undefined {
  return members.find(member => member.id === id);
}

export function getDiscussionById(id: string): Discussion | undefined {
  return discussions.find(discussion => discussion.id === id);
}

export function getEventById(id: string): Event | undefined {
  return events.find(event => event.id === id);
}
