import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { NotificationCenter } from "@/components/NotificationCenter";
import { MatchScoreBadge } from "@/components/jobs/MatchScoreBadge";
import {
  FileText,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Briefcase,
  User,
  Bell,
  Bookmark,
  Target,
  MapPin,
  Building2,
  Euro,
  Settings,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import {
  getStoredConversations,
  getTotalUnreadCount,
  currentUser,
  formatRelativeTime,
  truncateText,
} from "@/data/mockChat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

const stats = [
  {
    label: "Candidaturas Enviadas",
    value: "12",
    icon: FileText,
    color: "text-blue-500",
  },
  { label: "Em Análise", value: "5", icon: Clock, color: "text-yellow-500" },
  {
    label: "Entrevistas",
    value: "2",
    icon: CheckCircle,
    color: "text-green-500",
  },
  {
    label: "Visualizações do Perfil",
    value: "48",
    icon: Eye,
    color: "text-purple-500",
  },
];

const recentActivity = [
  {
    type: "view",
    message: "TechCorp visualizou o seu perfil",
    time: "Há 2 horas",
  },
  {
    type: "status",
    message: "Candidatura para Developer atualizada para 'Em Análise'",
    time: "Há 5 horas",
  },
  {
    type: "interview",
    message: "Entrevista agendada com InnovateTech",
    time: "Ontem",
  },
  {
    type: "rejection",
    message: "Candidatura para Designer não selecionada",
    time: "Há 2 dias",
  },
];

const recommendedJobs = [
  {
    id: "1",
    title: "Frontend Developer",
    company: "TechCorp",
    location: "Castelo Branco",
    salary: "1.500€ - 2.000€",
    matchScore: 95,
    type: "Permanente",
    workMode: "Híbrido",
  },
  {
    id: "2",
    title: "Full Stack Developer",
    company: "InnovateTech",
    location: "Covilhã",
    salary: "1.800€ - 2.500€",
    matchScore: 88,
    type: "Permanente",
    workMode: "Remoto",
  },
  {
    id: "3",
    title: "React Developer",
    company: "DigitalAgency",
    location: "Fundão",
    salary: "1.400€ - 1.800€",
    matchScore: 82,
    type: "Permanente",
    workMode: "Presencial",
  },
];

export default function CandidatoDashboard() {
  console.log("CandidatoDashboard component rendering");
  const { user } = useAuth();
  const profileCompletion = user?.candidate?.profileCompleteness || 20;
  const navigate = useNavigate();

  const conversations = getStoredConversations().slice(0, 3);
  const unreadCount = getTotalUnreadCount();

  // Get first name from full name
  const firstName = user?.name?.split(" ")[0] || "Candidato";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Bem-vindo de volta, {firstName}!
              </h1>
              <p className="text-muted-foreground">
                Aqui está um resumo da sua atividade recente.
              </p>
            </div>
            <NotificationCenter />
          </div>

          {/* Profile Completion */}
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">
                    Complete o seu perfil
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Perfis completos têm 3x mais hipóteses de serem contactados
                  </p>
                </div>
                <span className="text-2xl font-bold text-primary">
                  {profileCompletion}%
                </span>
              </div>
              <Progress value={profileCompletion} className="h-2" />
              <div className="mt-4 flex gap-2">
                <Button size="sm" asChild>
                  <Link to="/candidato/perfil/editar">Completar Perfil</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {stat.value}
                      </p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            <Link
              to="/vagas"
              className="flex flex-col items-center justify-center gap-2 h-auto py-4 px-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <Briefcase className="h-5 w-5" />
              <span className="text-sm font-medium">Procurar Vagas</span>
            </Link>
            <Link
              to="/candidato/candidaturas"
              className="flex flex-col items-center justify-center gap-2 h-auto py-4 px-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <FileText className="h-5 w-5" />
              <span className="text-sm font-medium">Candidaturas</span>
            </Link>
            <Link
              to="/candidato/vagas-guardadas"
              className="flex flex-col items-center justify-center gap-2 h-auto py-4 px-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <Bookmark className="h-5 w-5" />
              <span className="text-sm font-medium">Vagas Guardadas</span>
            </Link>
            <Link
              to="/candidato/perfil"
              className="flex flex-col items-center justify-center gap-2 h-auto py-4 px-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <User className="h-5 w-5" />
              <span className="text-sm font-medium">Meu Perfil</span>
            </Link>
            <Link
              to="/candidato/mensagens"
              className="flex flex-col items-center justify-center gap-2 h-auto py-4 px-4 border rounded-lg hover:bg-muted transition-colors relative"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="text-sm font-medium">Mensagens</span>
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 text-xs px-1.5"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </Link>
            <Link
              to="/candidato/alertas"
              className="flex flex-col items-center justify-center gap-2 h-auto py-4 px-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <Bell className="h-5 w-5" />
              <span className="text-sm font-medium">Alertas</span>
            </Link>
            <Link
              to="/candidato/conta"
              className="flex flex-col items-center justify-center gap-2 h-auto py-4 px-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span className="text-sm font-medium">Minha Conta</span>
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div
                        className={`mt-1 p-1.5 rounded-full ${
                          activity.type === "view"
                            ? "bg-purple-100 text-purple-600"
                            : activity.type === "status"
                            ? "bg-blue-100 text-blue-600"
                            : activity.type === "interview"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {activity.type === "view" && (
                          <Eye className="h-3 w-3" />
                        )}
                        {activity.type === "status" && (
                          <Clock className="h-3 w-3" />
                        )}
                        {activity.type === "interview" && (
                          <CheckCircle className="h-3 w-3" />
                        )}
                        {activity.type === "rejection" && (
                          <XCircle className="h-3 w-3" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">
                          {activity.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Jobs - Enhanced */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary" />
                  <div>
                    <CardTitle className="text-lg">
                      Vagas Recomendadas para Si
                    </CardTitle>
                    <CardDescription>
                      Baseado no seu perfil e preferências
                    </CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/vagas?goodMatches=true">
                    Ver Todas <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedJobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/vagas/${job.id}`)}
                    >
                      <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h4 className="font-semibold text-foreground truncate">
                            {job.title}
                          </h4>
                          <MatchScoreBadge
                            score={job.matchScore}
                            variant="compact"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {job.company} • {job.location}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {job.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {job.workMode}
                          </Badge>
                          {job.salary && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Euro className="h-3 w-3" />
                              {job.salary}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {recommendedJobs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="mb-2">Nenhuma recomendação disponível</p>
                    <p className="text-sm">
                      Complete o seu perfil para receber recomendações
                      personalizadas
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      asChild
                    >
                      <Link to="/candidato/perfil/editar">
                        Completar Perfil
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Messages Widget */}
          <Card className="mt-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Mensagens</CardTitle>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {unreadCount} nova{unreadCount > 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/candidato/mensagens">
                  Ver Todas <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {conversations.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhuma mensagem ainda</p>
                  <Button variant="outline" size="sm" className="mt-3" asChild>
                    <Link to="/suporte">Contactar Suporte</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {conversations.map((conv) => {
                    const otherParticipant = conv.participants.find(
                      (p) => p.id !== currentUser.id
                    );
                    if (!otherParticipant) return null;
                    const lastMsg = conv.messages[conv.messages.length - 1];
                    return (
                      <Link
                        key={conv.id}
                        to={`/candidato/mensagens/${conv.id}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={otherParticipant.avatar} />
                          <AvatarFallback>
                            {otherParticipant.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm truncate">
                              {otherParticipant.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeTime(conv.lastMessageAt)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {lastMsg?.senderId === currentUser.id && "Você: "}
                            {truncateText(lastMsg?.text || "", 40)}
                          </p>
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                        )}
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
