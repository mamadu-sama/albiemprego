import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { 
  AlertTriangle, 
  Search, 
  Eye, 
  CheckCircle2, 
  Ban, 
  Trash2,
  Building2,
  Briefcase,
  User,
  MessageSquare,
  Flag,
  Clock
} from "lucide-react";

interface Report {
  id: number;
  itemType: "vaga" | "empresa" | "utilizador" | "comentario";
  itemName: string;
  itemId: number;
  reason: string;
  description: string;
  reportedBy: string;
  reportCount: number;
  date: string;
  status: "pending" | "reviewing" | "resolved" | "dismissed";
}

const mockReports: Report[] = [
  { 
    id: 1, 
    itemType: "vaga", 
    itemName: "Trabalho Fácil - Ganhe 5000€/mês", 
    itemId: 234,
    reason: "Possível fraude", 
    description: "Esta vaga promete ganhos irrealistas e pede dados bancários.",
    reportedBy: "João Silva",
    reportCount: 5, 
    date: "2024-01-15",
    status: "pending"
  },
  { 
    id: 2, 
    itemType: "empresa", 
    itemName: "FastMoney Lda", 
    itemId: 45,
    reason: "Conteúdo enganoso", 
    description: "Empresa parece ser esquema de pirâmide.",
    reportedBy: "Maria Santos",
    reportCount: 3, 
    date: "2024-01-14",
    status: "reviewing"
  },
  { 
    id: 3, 
    itemType: "utilizador", 
    itemName: "user_spam_123", 
    itemId: 789,
    reason: "Spam", 
    description: "Utilizador envia mensagens em massa a empresas.",
    reportedBy: "TechCorp SA",
    reportCount: 8, 
    date: "2024-01-13",
    status: "pending"
  },
  { 
    id: 4, 
    itemType: "vaga", 
    itemName: "Operador de Telemarketing", 
    itemId: 156,
    reason: "Discriminação", 
    description: "Anúncio discrimina candidatos por idade.",
    reportedBy: "Ana Ferreira",
    reportCount: 2, 
    date: "2024-01-12",
    status: "resolved"
  },
  { 
    id: 5, 
    itemType: "comentario", 
    itemName: "Comentário em Vaga #89", 
    itemId: 321,
    reason: "Linguagem ofensiva", 
    description: "Comentário contém insultos e linguagem imprópria.",
    reportedBy: "Pedro Costa",
    reportCount: 1, 
    date: "2024-01-11",
    status: "dismissed"
  },
];

const getItemIcon = (type: Report["itemType"]) => {
  switch (type) {
    case "vaga": return Briefcase;
    case "empresa": return Building2;
    case "utilizador": return User;
    case "comentario": return MessageSquare;
  }
};

const getStatusBadge = (status: Report["status"]) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
    case "reviewing":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Em Análise</Badge>;
    case "resolved":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Resolvido</Badge>;
    case "dismissed":
      return <Badge variant="outline" className="bg-muted text-muted-foreground">Rejeitado</Badge>;
  }
};

export default function AdminDenuncias() {
  const { toast } = useToast();
  const [reports, setReports] = useState(mockReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || report.itemType === typeFilter;
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleResolve = (id: number) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: "resolved" as const } : r));
    toast({
      title: "Denúncia resolvida",
      description: "O item foi removido e o denunciante foi notificado.",
    });
  };

  const handleDismiss = (id: number) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: "dismissed" as const } : r));
    toast({
      title: "Denúncia rejeitada",
      description: "A denúncia foi marcada como inválida.",
    });
  };

  const handleStartReview = (id: number) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: "reviewing" as const } : r));
    toast({
      title: "Análise iniciada",
      description: "A denúncia está agora em análise.",
    });
  };

  const pendingCount = reports.filter(r => r.status === "pending").length;
  const reviewingCount = reports.filter(r => r.status === "reviewing").length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                Gestão de Denúncias
              </h1>
              <p className="text-muted-foreground">
                Analisar e resolver denúncias de conteúdo
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="destructive" className="text-sm px-3 py-1">
                {pendingCount} Pendentes
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1 bg-blue-50 text-blue-700">
                {reviewingCount} Em Análise
              </Badge>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar denúncias..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    <SelectItem value="vaga">Vagas</SelectItem>
                    <SelectItem value="empresa">Empresas</SelectItem>
                    <SelectItem value="utilizador">Utilizadores</SelectItem>
                    <SelectItem value="comentario">Comentários</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Estados</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="reviewing">Em Análise</SelectItem>
                    <SelectItem value="resolved">Resolvido</SelectItem>
                    <SelectItem value="dismissed">Rejeitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.map((report) => {
              const ItemIcon = getItemIcon(report.itemType);
              return (
                <Card key={report.id} className={report.status === "pending" ? "border-destructive/50" : ""}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      {/* Item Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`p-3 rounded-full ${
                          report.status === "pending" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
                        }`}>
                          <ItemIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-foreground">{report.itemName}</h3>
                            {getStatusBadge(report.status)}
                            <Badge variant="destructive" className="text-xs">
                              <Flag className="h-3 w-3 mr-1" />
                              {report.reportCount} denúncia{report.reportCount !== 1 ? "s" : ""}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            <strong>Motivo:</strong> {report.reason}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {report.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              Reportado por: {report.reportedBy}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {report.date}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 lg:flex-col">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex-1 lg:flex-none"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Item
                        </Button>
                        {report.status === "pending" && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="flex-1 lg:flex-none text-blue-600 hover:text-blue-700"
                            onClick={() => handleStartReview(report.id)}
                          >
                            <Search className="h-4 w-4 mr-2" />
                            Analisar
                          </Button>
                        )}
                        {(report.status === "pending" || report.status === "reviewing") && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex-1 lg:flex-none text-green-600 hover:text-green-700"
                              onClick={() => handleDismiss(report.id)}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Rejeitar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              className="flex-1 lg:flex-none"
                              onClick={() => handleResolve(report.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remover
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filteredReports.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground">Nenhuma denúncia encontrada</h3>
                  <p className="text-muted-foreground">Não existem denúncias que correspondam aos filtros selecionados.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
