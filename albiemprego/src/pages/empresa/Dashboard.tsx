import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { NotificationCenter } from "@/components/NotificationCenter";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Briefcase, 
  Users, 
  Eye, 
  TrendingUp,
  Plus,
  FileText,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Settings,
  CreditCard,
  Sparkles,
  Home,
  AlertTriangle,
  MessageSquare,
  ArrowRight
} from "lucide-react";
import { getStoredConversations, getTotalUnreadCount, currentUser, formatRelativeTime, truncateText } from "@/data/mockChat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const stats = [
  { label: "Vagas Ativas", value: "8", icon: Briefcase, color: "text-blue-500", change: "+2 este mês" },
  { label: "Total Candidaturas", value: "156", icon: Users, color: "text-green-500", change: "+23 esta semana" },
  { label: "Novas Hoje", value: "12", icon: FileText, color: "text-yellow-500", change: "vs. 8 ontem" },
  { label: "Visualizações", value: "1.2k", icon: Eye, color: "text-purple-500", change: "+15% este mês" },
];

const activeJobs = [
  { id: "1", title: "Frontend Developer", candidates: 24, newToday: 3, status: "active", daysLeft: 15 },
  { id: "2", title: "Backend Developer", candidates: 18, newToday: 2, status: "active", daysLeft: 22 },
  { id: "3", title: "UX Designer", candidates: 12, newToday: 1, status: "active", daysLeft: 8 },
  { id: "4", title: "Project Manager", candidates: 31, newToday: 5, status: "active", daysLeft: 30 },
  { id: "5", title: "DevOps Engineer", candidates: 9, newToday: 0, status: "paused", daysLeft: 0 },
];

const recentCandidates = [
  { id: "1", name: "Maria Silva", job: "Frontend Developer", time: "Há 2 horas", status: "new" },
  { id: "2", name: "João Santos", job: "Backend Developer", time: "Há 3 horas", status: "new" },
  { id: "3", name: "Ana Costa", job: "UX Designer", time: "Há 5 horas", status: "reviewed" },
  { id: "4", name: "Pedro Oliveira", job: "Project Manager", time: "Ontem", status: "interview" },
  { id: "5", name: "Sofia Ferreira", job: "Frontend Developer", time: "Ontem", status: "rejected" },
];

export default function EmpresaDashboard() {
  const { user } = useAuth();
  const { currentSubscription } = useSubscription();
  const credits = currentSubscription?.credits || { featured: 0, urgent: 0, homepage: 0 };

  const conversations = getStoredConversations().slice(0, 3);
  const unreadCount = getTotalUnreadCount();

  console.log("EmpresaDashboard component rendering");
  
  // Nome da empresa ou fallback
  const companyName = user?.company?.name || user?.name || "Empresa";
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {companyName}
              </h1>
              <p className="text-muted-foreground">
                Gerencie as suas vagas e candidaturas.
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <NotificationCenter />
              <Button asChild>
                <Link to="/empresa/vagas/nova">
                  <Plus className="h-4 w-4 mr-2" />
                  <span>Publicar Nova Vaga</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    <span className="text-xs text-muted-foreground">{stat.change}</span>
                  </div>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Credits Card */}
          <Card className="mb-8 border-primary/30 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Plano Atual</p>
                  <p className="text-xl font-bold text-foreground">{currentSubscription?.planName || 'Básico'}</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="text-center px-4 py-2 bg-background rounded-lg">
                    <div className="flex items-center gap-1 justify-center">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-2xl font-bold text-primary">{credits.featured}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Destaques</p>
                  </div>
                  <div className="text-center px-4 py-2 bg-background rounded-lg">
                    <div className="flex items-center gap-1 justify-center">
                      <Home className="h-4 w-4 text-accent" />
                      <span className="text-2xl font-bold text-accent">{credits.homepage}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Homepage</p>
                  </div>
                  <div className="text-center px-4 py-2 bg-background rounded-lg">
                    <div className="flex items-center gap-1 justify-center">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <span className="text-2xl font-bold text-destructive">{credits.urgent}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Urgente</p>
                  </div>
                </div>
                <Button asChild>
                  <Link to="/empresa/planos">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Gerir Plano
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-8">
            <Link to="/empresa/vagas" className="flex flex-col items-center justify-center gap-2 h-auto py-4 px-4 border rounded-lg hover:bg-muted transition-colors">
              <Briefcase className="h-5 w-5" />
              <span className="text-sm font-medium">Gerir Vagas</span>
            </Link>
            <Link to="/empresa/vagas/nova" className="flex flex-col items-center justify-center gap-2 h-auto py-4 px-4 border rounded-lg hover:bg-muted transition-colors">
              <Plus className="h-5 w-5" />
              <span className="text-sm font-medium">Nova Vaga</span>
            </Link>
            <Link to="/empresa/perfil" className="flex flex-col items-center justify-center gap-2 h-auto py-4 px-4 border rounded-lg hover:bg-muted transition-colors">
              <Building2 className="h-5 w-5" />
              <span className="text-sm font-medium">Perfil Empresa</span>
            </Link>
            <Link to="/empresa/candidaturas" className="flex flex-col items-center justify-center gap-2 h-auto py-4 px-4 border rounded-lg hover:bg-muted transition-colors">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">Candidaturas</span>
            </Link>
            <Link to="/empresa/mensagens" className="flex flex-col items-center justify-center gap-2 h-auto py-4 px-4 border rounded-lg hover:bg-muted transition-colors relative">
              <MessageSquare className="h-5 w-5" />
              <span className="text-sm font-medium">Mensagens</span>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 text-xs px-1.5">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Link>
            <Link to="/empresa/planos" className="flex flex-col items-center justify-center gap-2 h-auto py-4 px-4 border rounded-lg hover:bg-muted transition-colors border-primary/30 bg-primary/5">
              <CreditCard className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Planos</span>
            </Link>
            <Link to="/empresa/conta" className="flex flex-col items-center justify-center gap-2 h-auto py-4 px-4 border rounded-lg hover:bg-muted transition-colors">
              <Settings className="h-5 w-5" />
              <span className="text-sm font-medium">Minha Conta</span>
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Active Jobs Table */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Vagas Ativas</CardTitle>
                  <CardDescription>Visão geral das suas vagas publicadas</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/empresa/vagas">Ver Todas</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vaga</TableHead>
                      <TableHead className="text-center">Candidatos</TableHead>
                      <TableHead className="text-center">Novos</TableHead>
                      <TableHead className="text-center">Estado</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{job.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {job.status === 'active' ? `${job.daysLeft} dias restantes` : 'Pausada'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{job.candidates}</TableCell>
                        <TableCell className="text-center">
                          {job.newToday > 0 && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              +{job.newToday}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                            {job.status === 'active' ? 'Ativa' : 'Pausada'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/empresa/vagas/${job.id}/candidaturas`}>
                                  Ver Candidaturas
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/empresa/vagas/${job.id}/editar`}>
                                  Editar Vaga
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/empresa/vagas/${job.id}/destacar`}>
                                  <Sparkles className="h-4 w-4 mr-2" />
                                  Destacar Vaga
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                {job.status === 'active' ? 'Pausar' : 'Ativar'}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Recent Candidates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Candidaturas Recentes</CardTitle>
                <CardDescription>Últimos candidatos às suas vagas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentCandidates.map((candidate) => (
                    <div key={candidate.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{candidate.name}</p>
                        <p className="text-xs text-muted-foreground">{candidate.job}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge 
                          variant="outline" 
                          className={
                            candidate.status === 'new' ? 'border-blue-500 text-blue-500' :
                            candidate.status === 'reviewed' ? 'border-yellow-500 text-yellow-500' :
                            candidate.status === 'interview' ? 'border-green-500 text-green-500' :
                            'border-red-500 text-red-500'
                          }
                        >
                          {candidate.status === 'new' && 'Novo'}
                          {candidate.status === 'reviewed' && 'Analisado'}
                          {candidate.status === 'interview' && 'Entrevista'}
                          {candidate.status === 'rejected' && 'Rejeitado'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{candidate.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Messages Widget */}
          <Card className="mt-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Mensagens Recentes</CardTitle>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {unreadCount} nova{unreadCount > 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/empresa/mensagens">
                  Ver Todas <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {conversations.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhuma mensagem ainda</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-4">
                  {conversations.map(conv => {
                    const otherParticipant = conv.participants.find(p => p.id !== currentUser.id);
                    if (!otherParticipant) return null;
                    const lastMsg = conv.messages[conv.messages.length - 1];
                      return (
                      <Link 
                        key={conv.id} 
                        to={`/empresa/mensagens/${conv.id}`}
                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={otherParticipant.avatar} />
                          <AvatarFallback>{otherParticipant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate">{otherParticipant.name}</span>
                            {conv.unreadCount > 0 && (
                              <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {truncateText(lastMsg?.text || '', 30)}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
