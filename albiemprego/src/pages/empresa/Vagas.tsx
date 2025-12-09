import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Search, 
  MoreHorizontal,
  Users,
  Eye,
  Calendar,
  MapPin,
  Edit,
  Pause,
  Play,
  Trash2,
  Loader2,
  AlertCircle,
  XCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobApi, type Job } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Vagas() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Buscar vagas da empresa
  const { data: jobsData, isLoading, isError } = useQuery({
    queryKey: ["companyJobs", user?.company?.id],
    queryFn: () => jobApi.listJobs({ 
      companyId: user?.company?.id,
      status: activeTab === "all" ? undefined : activeTab.toUpperCase() as any,
      limit: 100,
    }),
    enabled: !!user?.company?.id,
  });

  // Mutations
  const pauseJobMutation = useMutation({
    mutationFn: (jobId: string) => jobApi.pauseJob(jobId),
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Vaga pausada!" });
      queryClient.invalidateQueries({ queryKey: ["companyJobs"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Falha ao pausar vaga",
        variant: "destructive",
      });
    },
  });

  const publishJobMutation = useMutation({
    mutationFn: (jobId: string) => jobApi.publishJob(jobId),
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Vaga publicada!" });
      queryClient.invalidateQueries({ queryKey: ["companyJobs"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Falha ao publicar vaga",
        variant: "destructive",
      });
    },
  });

  const closeJobMutation = useMutation({
    mutationFn: (jobId: string) => jobApi.closeJob(jobId),
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Vaga fechada!" });
      queryClient.invalidateQueries({ queryKey: ["companyJobs"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Falha ao fechar vaga",
        variant: "destructive",
      });
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: (jobId: string) => jobApi.deleteJob(jobId),
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Vaga removida!" });
      queryClient.invalidateQueries({ queryKey: ["companyJobs"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Falha ao remover vaga",
        variant: "destructive",
      });
    },
  });

  // Filtrar vagas por busca e tab
  const filteredJobs = jobsData?.jobs.filter((job: Job) => {
    const matchesSearch = !searchQuery || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return matchesSearch && job.status === "ACTIVE";
    if (activeTab === "paused") return matchesSearch && job.status === "PAUSED";
    if (activeTab === "draft") return matchesSearch && job.status === "DRAFT";
    if (activeTab === "closed") return matchesSearch && job.status === "CLOSED";
    
    return matchesSearch;
  }) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-success">Ativa</Badge>;
      case "PAUSED":
        return <Badge variant="secondary">Pausada</Badge>;
      case "DRAFT":
        return <Badge variant="outline">Rascunho</Badge>;
      case "CLOSED":
        return <Badge variant="destructive">Fechada</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-muted-foreground">Erro ao carregar vagas</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Minhas Vagas</h1>
              <p className="text-muted-foreground">
                Gerir as suas ofertas de emprego
              </p>
            </div>
            <Button asChild>
              <Link to="/empresa/nova-vaga">
                <Plus className="h-4 w-4 mr-2" />
                Publicar Nova Vaga
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">{filteredJobs.filter((j: Job) => j.status === "ACTIVE").length}</div>
                <div className="text-sm text-muted-foreground">Vagas Ativas</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">
                  {filteredJobs.reduce((sum: number, j: Job) => sum + (j._count?.applications || 0), 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Candidaturas</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">
                  {filteredJobs.reduce((sum: number, j: Job) => sum + j.viewsCount, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Visualizações</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">{filteredJobs.filter((j: Job) => j.status === "DRAFT").length}</div>
                <div className="text-sm text-muted-foreground">Rascunhos</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Procurar vagas..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="active">Ativas</TabsTrigger>
                <TabsTrigger value="paused">Pausadas</TabsTrigger>
                <TabsTrigger value="draft">Rascunhos</TabsTrigger>
                <TabsTrigger value="closed">Fechadas</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Jobs List */}
          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma vaga encontrada</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery
                      ? "Tente ajustar os filtros de pesquisa"
                      : "Comece por publicar a sua primeira vaga"}
                  </p>
                  {!searchQuery && (
                    <Button asChild>
                      <Link to="/empresa/nova-vaga">
                        <Plus className="h-4 w-4 mr-2" />
                        Publicar Nova Vaga
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredJobs.map((job: Job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{job.title}</h3>
                          {getStatusBadge(job.status)}
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline">{job.type.replace("_", " ")}</Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline">{job.workMode}</Badge>
                          </div>
                          {job.showSalary && job.salaryMin && (
                            <div className="flex items-center gap-1 text-success font-medium">
                              {job.salaryMin}€
                              {job.salaryMax && ` - ${job.salaryMax}€`}
                              /{job.salaryPeriod === "month" ? "mês" : job.salaryPeriod === "year" ? "ano" : "hora"}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{job._count?.applications || 0} candidaturas</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            <span>{job.viewsCount} visualizações</span>
                          </div>
                          {job.publishedAt && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Publicada em {format(new Date(job.publishedAt), "dd/MM/yyyy", { locale: ptBR })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {job.status === "ACTIVE" && (
                            <DropdownMenuItem asChild>
                              <Link to={`/empresa/vagas/${job.id}/candidaturas`}>
                                <Users className="h-4 w-4 mr-2" />
                                Ver Candidaturas
                              </Link>
                            </DropdownMenuItem>
                          )}
                          
                          {(job.status === "DRAFT" || job.status === "PAUSED") && (
                            <DropdownMenuItem asChild>
                              <Link to={`/empresa/vagas/${job.id}/editar`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                          )}

                          {job.status === "DRAFT" && (
                            <DropdownMenuItem onClick={() => publishJobMutation.mutate(job.id)}>
                              <Play className="h-4 w-4 mr-2" />
                              Publicar
                            </DropdownMenuItem>
                          )}

                          {job.status === "ACTIVE" && (
                            <DropdownMenuItem onClick={() => pauseJobMutation.mutate(job.id)}>
                              <Pause className="h-4 w-4 mr-2" />
                              Pausar
                            </DropdownMenuItem>
                          )}

                          {job.status === "PAUSED" && (
                            <DropdownMenuItem onClick={() => publishJobMutation.mutate(job.id)}>
                              <Play className="h-4 w-4 mr-2" />
                              Reativar
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator />

                          {(job.status === "ACTIVE" || job.status === "PAUSED") && (
                            <DropdownMenuItem 
                              onClick={() => closeJobMutation.mutate(job.id)}
                              className="text-yellow-600"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Fechar Vaga
                            </DropdownMenuItem>
                          )}

                          {job.status === "DRAFT" && (job._count?.applications || 0) === 0 && (
                            <DropdownMenuItem 
                              onClick={() => deleteJobMutation.mutate(job.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
