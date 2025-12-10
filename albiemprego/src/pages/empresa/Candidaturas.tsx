import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companyApplicationApi, jobApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
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
  Filter,
  Loader2,
  AlertCircle,
  MapPin,
  Users
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  NEW: { label: "Pendente", color: "bg-gray-100 text-gray-700 border-gray-200", icon: Clock },
  VIEWED: { label: "Visualizada", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Eye },
  IN_REVIEW: { label: "Em Análise", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock },
  INTERVIEW: { label: "Entrevista", color: "bg-purple-100 text-purple-700 border-purple-200", icon: Users },
  ACCEPTED: { label: "Aceite", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
  REJECTED: { label: "Rejeitada", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
};

function CandidatoDetailsModal({ 
  application, 
  open, 
  onOpenChange, 
  onUpdateStatus 
}: { 
  application: any; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (status: string) => void;
}) {
  if (!application) return null;

  const candidate = application.candidate;
  const user = candidate.user;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Candidatura</DialogTitle>
          <DialogDescription>
            {application.job.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Candidato Info */}
          <div className="flex items-start gap-4 pb-4 border-b">
            <Avatar className="h-16 w-16">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={user.name} />
              ) : (
                <AvatarFallback className="text-lg">
                  {user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <div className="space-y-1 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${user.email}`} className="hover:text-primary">{user.email}</a>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${user.phone}`} className="hover:text-primary">{user.phone}</a>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{user.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status e Ações */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Alterar Status:</label>
              <Select 
                defaultValue={application.status} 
                onValueChange={onUpdateStatus}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIEWED">Visualizada</SelectItem>
                  <SelectItem value="IN_REVIEW">Em Análise</SelectItem>
                  <SelectItem value="INTERVIEW">Convidar para Entrevista</SelectItem>
                  <SelectItem value="ACCEPTED">Aceitar</SelectItem>
                  <SelectItem value="REJECTED">Rejeitar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {candidate.cvUrl && (
              <Button asChild variant="outline" className="mt-6">
                <a href={candidate.cvUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4 mr-2" />
                  Ver CV
                </a>
              </Button>
            )}
          </div>

          {/* Carta de Apresentação */}
          {application.coverLetter && (
            <div>
              <h4 className="font-semibold mb-2">Carta de Apresentação</h4>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm whitespace-pre-wrap">{application.coverLetter}</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Dados Adicionais */}
          {application.additionalData && Object.keys(application.additionalData).length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Informações Adicionais</h4>
              <Card>
                <CardContent className="p-4 space-y-2 text-sm">
                  {application.additionalData.portfolio && (
                    <div>
                      <span className="font-medium">Portfólio: </span>
                      <a 
                        href={application.additionalData.portfolio} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {application.additionalData.portfolio}
                      </a>
                    </div>
                  )}
                  {application.additionalData.availability && (
                    <div>
                      <span className="font-medium">Disponibilidade: </span>
                      {application.additionalData.availability}
                    </div>
                  )}
                  {application.additionalData.expectedSalary && (
                    <div>
                      <span className="font-medium">Pretensão Salarial: </span>
                      {application.additionalData.expectedSalary}€/mês
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Skills */}
          {candidate.skills && candidate.skills.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Competências</h4>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill: string, idx: number) => (
                  <Badge key={idx} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Experiências */}
          {candidate.experiences && candidate.experiences.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Experiência Profissional</h4>
              <div className="space-y-3">
                {candidate.experiences.map((exp: any) => (
                  <Card key={exp.id}>
                    <CardContent className="p-4">
                      <h5 className="font-medium">{exp.position}</h5>
                      <p className="text-sm text-muted-foreground">{exp.company}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(exp.startDate).toLocaleDateString("pt-PT")} - {" "}
                        {exp.current ? "Presente" : new Date(exp.endDate).toLocaleDateString("pt-PT")}
                      </p>
                      {exp.description && (
                        <p className="text-sm mt-2">{exp.description}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Educações */}
          {candidate.educations && candidate.educations.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Formação Académica</h4>
              <div className="space-y-3">
                {candidate.educations.map((edu: any) => (
                  <Card key={edu.id}>
                    <CardContent className="p-4">
                      <h5 className="font-medium">{edu.degree} em {edu.field}</h5>
                      <p className="text-sm text-muted-foreground">{edu.institution}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(edu.startDate).toLocaleDateString("pt-PT")} - {" "}
                        {edu.current ? "Presente" : new Date(edu.endDate).toLocaleDateString("pt-PT")}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Idiomas */}
          {candidate.languages && candidate.languages.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Idiomas</h4>
              <div className="flex flex-wrap gap-2">
                {candidate.languages.map((lang: any) => (
                  <Badge key={lang.id} variant="outline">
                    {lang.language} - {lang.level}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h4 className="font-semibold mb-2">Timeline</h4>
            <div className="space-y-2">
              {(application.timeline as any[]).map((event: any, idx: number) => {
                const eventStatus = statusConfig[event.status] || statusConfig.NEW;
                const EventIcon = eventStatus.icon;
                return (
                  <div key={idx} className="flex gap-3 text-sm">
                    <div className={`w-8 h-8 rounded-full ${eventStatus.color} border flex items-center justify-center flex-shrink-0`}>
                      <EventIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="font-medium">{event.note}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleString("pt-PT")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function CandidaturasPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedJob, setSelectedJob] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar vagas da empresa
  const { data: jobs = [] } = useQuery({
    queryKey: ["companyJobs"],
    queryFn: () => jobApi.getCompanyJobs(),
  });

  // Buscar candidaturas
  const { data: applications = [], isLoading, isError } = useQuery({
    queryKey: ["companyApplications", selectedJob],
    queryFn: () => companyApplicationApi.getAll({ 
      jobId: selectedJob !== "all" ? selectedJob : undefined 
    }),
  });

  // Buscar estatísticas
  const { data: stats } = useQuery({
    queryKey: ["applicationStats"],
    queryFn: () => companyApplicationApi.getStats(),
  });

  // Mutation para atualizar status
  const updateStatusMutation = useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: string; status: string }) =>
      companyApplicationApi.updateStatus(applicationId, status),
    onSuccess: () => {
      toast({
        title: "Status atualizado",
        description: "O status da candidatura foi atualizado com sucesso",
      });
      queryClient.invalidateQueries({ queryKey: ["companyApplications"] });
      queryClient.invalidateQueries({ queryKey: ["applicationStats"] });
      setShowDetails(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Não foi possível atualizar o status",
        variant: "destructive",
      });
    },
  });

  // Filtrar candidaturas
  const filteredCandidaturas = applications
    .filter((app: any) => {
      // Filtro por status
      if (activeTab !== "all" && app.status !== activeTab.toUpperCase()) {
        return false;
      }

      // Filtro por busca (nome do candidato)
      if (searchTerm && !app.candidate.user.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      return true;
    });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Candidaturas
            </h1>
            <p className="text-muted-foreground">
              Gira as candidaturas às tuas vagas.
            </p>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Novas</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.byStatus.NEW}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Em Análise</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.byStatus.IN_REVIEW}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Entrevista</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.byStatus.INTERVIEW}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Aceites</p>
                  <p className="text-2xl font-bold text-green-600">{stats.byStatus.ACCEPTED}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Rejeitadas</p>
                  <p className="text-2xl font-bold text-red-600">{stats.byStatus.REJECTED}</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar candidato..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedJob} onValueChange={setSelectedJob}>
              <SelectTrigger className="lg:w-64">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por vaga" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as vagas</SelectItem>
                {jobs.map((job: any) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="all">Todas ({applications.length})</TabsTrigger>
              <TabsTrigger value="new">Novas ({applications.filter((c: any) => c.status === "NEW").length})</TabsTrigger>
              <TabsTrigger value="viewed">Visualizadas ({applications.filter((c: any) => c.status === "VIEWED").length})</TabsTrigger>
              <TabsTrigger value="in_review">Em Análise ({applications.filter((c: any) => c.status === "IN_REVIEW").length})</TabsTrigger>
              <TabsTrigger value="interview">Entrevista ({applications.filter((c: any) => c.status === "INTERVIEW").length})</TabsTrigger>
              <TabsTrigger value="accepted">Aceites ({applications.filter((c: any) => c.status === "ACCEPTED").length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejeitadas ({applications.filter((c: any) => c.status === "REJECTED").length})</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Candidaturas List */}
          <div className="space-y-4">
            {filteredCandidaturas.length > 0 ? (
              filteredCandidaturas.map((application: any) => {
                const status = statusConfig[application.status] || statusConfig.NEW;
                const StatusIcon = status.icon;
                return (
                  <Card key={application.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Candidate Info */}
                        <div className="flex items-center gap-4 flex-1">
                          <Avatar className="h-12 w-12">
                            {application.candidate.user.avatar ? (
                              <AvatarImage src={application.candidate.user.avatar} />
                            ) : (
                              <AvatarFallback>
                                {application.candidate.user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{application.candidate.user.name}</h3>
                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Briefcase className="h-3 w-3" />
                                {application.job.title}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDistanceToNow(new Date(application.appliedAt), { 
                                  addSuffix: true,
                                  locale: ptBR
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-3">
                          <Badge className={`${status.color} border`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Badge>

                          {/* Actions */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedApplication(application);
                                setShowDetails(true);
                              }}>
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Detalhes
                              </DropdownMenuItem>
                              {application.candidate.cvUrl && (
                                <DropdownMenuItem asChild>
                                  <a href={application.candidate.cvUrl} target="_blank" rel="noopener noreferrer">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Ver CV
                                  </a>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => updateStatusMutation.mutate({ 
                                  applicationId: application.id, 
                                  status: "IN_REVIEW" 
                                })}
                                disabled={application.status === "IN_REVIEW"}
                              >
                                <Clock className="h-4 w-4 mr-2" />
                                Colocar em Análise
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => updateStatusMutation.mutate({ 
                                  applicationId: application.id, 
                                  status: "INTERVIEW" 
                                })}
                                disabled={application.status === "INTERVIEW"}
                              >
                                <Users className="h-4 w-4 mr-2" />
                                Convidar para Entrevista
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => updateStatusMutation.mutate({ 
                                  applicationId: application.id, 
                                  status: "ACCEPTED" 
                                })}
                                disabled={application.status === "ACCEPTED"}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Aceitar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => updateStatusMutation.mutate({ 
                                  applicationId: application.id, 
                                  status: "REJECTED" 
                                })}
                                disabled={application.status === "REJECTED"}
                                className="text-destructive"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Rejeitar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Nenhuma candidatura encontrada
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {activeTab === "all" 
                      ? "Ainda não recebeu candidaturas."
                      : `Não há candidaturas com o status "${statusConfig[activeTab.toUpperCase()]?.label || activeTab}".`}
                  </p>
                  {applications.length === 0 && (
                    <Button asChild>
                      <Link to="/empresa/vagas">Ver Minhas Vagas</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Details Modal */}
      <CandidatoDetailsModal
        application={selectedApplication}
        open={showDetails}
        onOpenChange={setShowDetails}
        onUpdateStatus={(status) => {
          if (selectedApplication) {
            updateStatusMutation.mutate({ 
              applicationId: selectedApplication.id, 
              status 
            });
          }
        }}
      />

      <Footer />
    </div>
  );
}
