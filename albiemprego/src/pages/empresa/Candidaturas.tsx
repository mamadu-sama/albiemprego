import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { 
  Search, 
  MoreHorizontal,
  Calendar,
  Briefcase,
  Eye,
  Mail,
  Phone,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Filter
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const candidaturas = [
  {
    id: "1",
    candidato: {
      nome: "João Silva",
      email: "joao.silva@email.com",
      telefone: "+351 912 345 678",
      foto: null,
    },
    vaga: {
      id: "1",
      titulo: "Frontend Developer",
    },
    status: "pending",
    dataAplicacao: "2024-01-15",
    favorito: true,
    notas: "Experiência relevante em React",
  },
  {
    id: "2",
    candidato: {
      nome: "Maria Santos",
      email: "maria.santos@email.com",
      telefone: "+351 923 456 789",
      foto: null,
    },
    vaga: {
      id: "1",
      titulo: "Frontend Developer",
    },
    status: "reviewing",
    dataAplicacao: "2024-01-14",
    favorito: false,
    notas: "",
  },
  {
    id: "3",
    candidato: {
      nome: "Pedro Costa",
      email: "pedro.costa@email.com",
      telefone: "+351 934 567 890",
      foto: null,
    },
    vaga: {
      id: "2",
      titulo: "Backend Developer",
    },
    status: "interview",
    dataAplicacao: "2024-01-12",
    favorito: true,
    notas: "Agendada entrevista para dia 20",
  },
  {
    id: "4",
    candidato: {
      nome: "Ana Ferreira",
      email: "ana.ferreira@email.com",
      telefone: "+351 945 678 901",
      foto: null,
    },
    vaga: {
      id: "3",
      titulo: "UX Designer",
    },
    status: "accepted",
    dataAplicacao: "2024-01-10",
    favorito: false,
    notas: "Contratada - início dia 1 Fev",
  },
  {
    id: "5",
    candidato: {
      nome: "Rui Oliveira",
      email: "rui.oliveira@email.com",
      telefone: "+351 956 789 012",
      foto: null,
    },
    vaga: {
      id: "1",
      titulo: "Frontend Developer",
    },
    status: "rejected",
    dataAplicacao: "2024-01-08",
    favorito: false,
    notas: "Perfil não adequado",
  },
];

const vagas = [
  { id: "all", titulo: "Todas as Vagas" },
  { id: "1", titulo: "Frontend Developer" },
  { id: "2", titulo: "Backend Developer" },
  { id: "3", titulo: "UX Designer" },
];

const statusConfig = {
  pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  reviewing: { label: "Em Análise", color: "bg-blue-100 text-blue-700", icon: Eye },
  interview: { label: "Entrevista", color: "bg-purple-100 text-purple-700", icon: Calendar },
  accepted: { label: "Aceite", color: "bg-green-100 text-green-700", icon: CheckCircle },
  rejected: { label: "Rejeitada", color: "bg-red-100 text-red-700", icon: XCircle },
};

export default function EmpresaCandidaturas() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVaga, setSelectedVaga] = useState("all");
  const [candidaturasList, setCandidaturasList] = useState(candidaturas);

  const filteredCandidaturas = candidaturasList.filter(c => {
    const matchesSearch = c.candidato.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.vaga.titulo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || c.status === activeTab;
    const matchesVaga = selectedVaga === "all" || c.vaga.id === selectedVaga;
    return matchesSearch && matchesTab && matchesVaga;
  });

  const toggleFavorito = (id: string) => {
    setCandidaturasList(prev => prev.map(c => 
      c.id === id ? { ...c, favorito: !c.favorito } : c
    ));
  };

  const updateStatus = (id: string, newStatus: string) => {
    setCandidaturasList(prev => prev.map(c => 
      c.id === id ? { ...c, status: newStatus } : c
    ));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Todas as Candidaturas
            </h1>
            <p className="text-muted-foreground">
              Gerencie todas as candidaturas recebidas.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar candidatos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedVaga} onValueChange={setSelectedVaga}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por vaga" />
              </SelectTrigger>
              <SelectContent>
                {vagas.map(v => (
                  <SelectItem key={v.id} value={v.id}>{v.titulo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="flex-wrap">
              <TabsTrigger value="all">Todas ({candidaturasList.length})</TabsTrigger>
              <TabsTrigger value="pending">Pendentes ({candidaturasList.filter(c => c.status === "pending").length})</TabsTrigger>
              <TabsTrigger value="reviewing">Em Análise ({candidaturasList.filter(c => c.status === "reviewing").length})</TabsTrigger>
              <TabsTrigger value="interview">Entrevista ({candidaturasList.filter(c => c.status === "interview").length})</TabsTrigger>
              <TabsTrigger value="accepted">Aceites ({candidaturasList.filter(c => c.status === "accepted").length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejeitadas ({candidaturasList.filter(c => c.status === "rejected").length})</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Candidaturas List */}
          <div className="space-y-4">
            {filteredCandidaturas.length > 0 ? (
              filteredCandidaturas.map((candidatura) => {
                const status = statusConfig[candidatura.status as keyof typeof statusConfig];
                const StatusIcon = status.icon;
                return (
                  <Card key={candidatura.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Candidate Info */}
                        <div className="flex items-center gap-4 flex-1">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>
                              {candidatura.candidato.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground">{candidatura.candidato.nome}</h3>
                              <button 
                                onClick={() => toggleFavorito(candidatura.id)}
                                className={candidatura.favorito ? "text-yellow-500" : "text-muted-foreground hover:text-yellow-500"}
                              >
                                <Star className={`h-4 w-4 ${candidatura.favorito ? "fill-current" : ""}`} />
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Briefcase className="h-3 w-3" />
                                {candidatura.vaga.titulo}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(candidatura.dataAplicacao).toLocaleDateString('pt-PT')}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-4">
                          <Badge className={`${status.color} flex items-center gap-1`}>
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                          </Badge>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/candidato/${candidatura.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Perfil
                              </Link>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link to={`/empresa/candidato/${candidatura.id}`}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Ver CV
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link to={`/empresa/candidato/${candidatura.id}/email`}>
                                    <Mail className="h-4 w-4 mr-2" />
                                    Enviar Email
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Phone className="h-4 w-4 mr-2" />
                                  Ligar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => updateStatus(candidatura.id, "reviewing")}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Marcar Em Análise
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateStatus(candidatura.id, "interview")}>
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Agendar Entrevista
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateStatus(candidatura.id, "accepted")} className="text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Aceitar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateStatus(candidatura.id, "rejected")} className="text-destructive">
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Rejeitar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      {candidatura.notas && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Notas:</span> {candidatura.notas}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Nenhuma candidatura encontrada
                  </h3>
                  <p className="text-muted-foreground">
                    Não encontrámos candidaturas com esses critérios.
                  </p>
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