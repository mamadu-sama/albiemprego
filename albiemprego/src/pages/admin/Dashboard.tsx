import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Users, 
  Building2, 
  Briefcase, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  Ban,
  Settings,
  BarChart3,
  Shield,
  Bell,
  CreditCard,
  MessageSquare,
  ClipboardCheck
} from "lucide-react";
import { getTotalUnreadCount } from "@/data/mockChat";

const stats = [
  { label: "Total Utilizadores", value: "2,456", change: "+12%", icon: Users, color: "text-blue-500" },
  { label: "Empresas Ativas", value: "189", change: "+8%", icon: Building2, color: "text-green-500" },
  { label: "Vagas Publicadas", value: "342", change: "+23%", icon: Briefcase, color: "text-purple-500" },
  { label: "Candidaturas", value: "5,891", change: "+18%", icon: FileText, color: "text-orange-500" },
];

const recentActivities = [
  { type: "new_company", message: "Nova empresa registada: TechSolutions Lda", time: "Há 5 minutos", icon: Building2 },
  { type: "new_job", message: "Nova vaga publicada: Frontend Developer", time: "Há 15 minutos", icon: Briefcase },
  { type: "report", message: "Denúncia recebida: Vaga suspeita ID #234", time: "Há 30 minutos", icon: AlertTriangle },
  { type: "new_user", message: "Novo candidato registado: João Silva", time: "Há 1 hora", icon: Users },
  { type: "approval", message: "Empresa aprovada: Castelo Digital", time: "Há 2 horas", icon: CheckCircle2 },
];

const pendingApprovals = [
  { id: 1, name: "InnovaTech Lda", type: "Empresa", date: "2024-01-15", status: "pending" },
  { id: 2, name: "Vaga: Marketing Manager", type: "Vaga", date: "2024-01-15", status: "pending" },
  { id: 3, name: "Digital Solutions SA", type: "Empresa", date: "2024-01-14", status: "pending" },
];

const reportedItems = [
  { id: 1, item: "Vaga #234 - Trabalho Fácil", reason: "Possível fraude", reports: 5, date: "2024-01-15" },
  { id: 2, item: "Empresa: FastMoney", reason: "Conteúdo enganoso", reports: 3, date: "2024-01-14" },
];

export default function AdminDashboard() {
  const unreadCount = getTotalUnreadCount();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-6 w-6 text-primary" />
                <Badge variant="secondary">Administrador</Badge>
              </div>
              <h1 className="text-3xl font-bold text-foreground">
                Painel de Administração
              </h1>
              <p className="text-muted-foreground">
                Gerir utilizadores, empresas e conteúdo da plataforma
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/admin/configuracoes">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </Link>
              </Button>
              <Button asChild>
                <Link to="/admin/relatorios">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Relatórios
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3" />
                        {stat.change} este mês
                      </p>
                    </div>
                    <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Quick Actions & Recent Activity */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-4">
                    <Link 
                      to="/admin/utilizadores" 
                      className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                      <Users className="h-8 w-8 text-primary" />
                      <span className="text-sm font-medium">Utilizadores</span>
                    </Link>
                    <Link 
                      to="/admin/empresas" 
                      className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                      <Building2 className="h-8 w-8 text-primary" />
                      <span className="text-sm font-medium">Empresas</span>
                    </Link>
                    <Link 
                      to="/admin/vagas" 
                      className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                      <Briefcase className="h-8 w-8 text-primary" />
                      <span className="text-sm font-medium">Vagas</span>
                    </Link>
                    <Link 
                      to="/admin/denuncias" 
                      className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                      <AlertTriangle className="h-8 w-8 text-destructive" />
                      <span className="text-sm font-medium">Denúncias</span>
                      <Badge variant="destructive" className="text-xs">3</Badge>
                    </Link>
                    <Link 
                      to="/admin/planos" 
                      className="flex flex-col items-center gap-2 p-4 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors"
                    >
                      <CreditCard className="h-8 w-8 text-primary" />
                      <span className="text-sm font-medium">Planos</span>
                    </Link>
                    <Link 
                      to="/admin/solicitacoes" 
                      className="flex flex-col items-center gap-2 p-4 rounded-lg border border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/10 transition-colors relative"
                    >
                      <ClipboardCheck className="h-8 w-8 text-orange-500" />
                      <span className="text-sm font-medium">Solicitações</span>
                      <Badge variant="secondary" className="absolute -top-1 -right-1 text-xs px-1.5 bg-orange-500 text-white">
                        Novo
                      </Badge>
                    </Link>
                    <Link 
                      to="/admin/notificacoes" 
                      className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                      <Bell className="h-8 w-8 text-primary" />
                      <span className="text-sm font-medium">Notificações</span>
                    </Link>
                    <Link 
                      to="/admin/mensagens" 
                      className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:bg-muted transition-colors relative"
                    >
                      <MessageSquare className="h-8 w-8 text-primary" />
                      <span className="text-sm font-medium">Mensagens</span>
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="absolute -top-1 -right-1 text-xs px-1.5">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                      )}
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                  <CardDescription>Últimas ações na plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                        <div className={`p-2 rounded-full bg-muted ${
                          activity.type === 'report' ? 'text-destructive' : 'text-primary'
                        }`}>
                          <activity.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pending Approvals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Aprovações Pendentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingApprovals.map((item) => (
                      <div key={item.id} className="flex items-center justify-between pb-4 border-b border-border last:border-0 last:pb-0">
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.type} • {item.date}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50">
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Ban className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link to="/admin/aprovacoes">Ver Todas</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Reported Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    Itens Denunciados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportedItems.map((item) => (
                      <div key={item.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                        <p className="text-sm font-medium text-foreground">{item.item}</p>
                        <p className="text-xs text-muted-foreground">{item.reason}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="destructive" className="text-xs">
                            {item.reports} denúncias
                          </Badge>
                          <Button size="sm" variant="outline" className="h-7 text-xs" asChild>
                            <Link to={`/admin/denuncias`}>Analisar</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link to="/admin/denuncias">Ver Todas</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Platform Health */}
              <Card>
                <CardHeader>
                  <CardTitle>Estado da Plataforma</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Servidor</span>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Base de Dados</span>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Operacional</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Emails</span>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Ativo</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Última Backup</span>
                    <span className="text-sm text-foreground">Há 2 horas</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}