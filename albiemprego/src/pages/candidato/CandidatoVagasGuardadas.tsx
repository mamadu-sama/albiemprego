import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bookmark,
  MapPin,
  Euro,
  Building2,
  X,
  ExternalLink,
  Loader2,
  AlertCircle,
  BookmarkX,
  Calendar,
  ChevronDown,
  FileText,
} from "lucide-react";
import { savedJobsApi } from "@/lib/api";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const contractTypeMap: Record<string, string> = {
  "FULL_TIME": "Tempo Integral",
  "PART_TIME": "Meio Período",
  "TEMPORARY": "Temporário",
  "INTERNSHIP": "Estágio",
  "FREELANCE": "Freelance"
};

const workModeMap: Record<string, string> = {
  "PRESENCIAL": "Presencial",
  "REMOTO": "Remoto",
  "HIBRIDO": "Híbrido"
};

export default function CandidatoVagasGuardadas() {
  const [jobToRemove, setJobToRemove] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState("todas");
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  // Buscar vagas guardadas
  const { data, isLoading, isError } = useQuery({
    queryKey: ["savedJobs"],
    queryFn: () => savedJobsApi.getSavedJobs(),
  });

  // Mutation para remover vaga guardada
  const unsaveJobMutation = useMutation({
    mutationFn: (jobId: string) => savedJobsApi.unsaveJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedJobs"] });
      queryClient.invalidateQueries({ queryKey: ["savedJobIds"] });
      toast.success("Vaga removida dos guardados.");
      setJobToRemove(null);
    },
    onError: () => {
      toast.error("Erro ao remover vaga. Tente novamente.");
    },
  });

  const savedJobs = data?.savedJobs || [];

  // Categorizar vagas por período
  const categorizedJobs = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      recentes: savedJobs.filter(sj => new Date(sj.savedAt) >= sevenDaysAgo),
      ultimos30dias: savedJobs.filter(sj => {
        const savedDate = new Date(sj.savedAt);
        return savedDate < sevenDaysAgo && savedDate >= thirtyDaysAgo;
      }),
      antigas: savedJobs.filter(sj => new Date(sj.savedAt) < thirtyDaysAgo),
    };
  }, [savedJobs]);

  const toggleExpanded = (jobId: string) => {
    setExpandedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">As Minhas Vagas Guardadas</h1>
          <p className="text-muted-foreground">
            Organize e acompanhe as vagas do seu interesse.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <p>Erro ao carregar vagas guardadas. Tente novamente mais tarde.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !isError && savedJobs.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BookmarkX className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma vaga guardada</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Quando encontrar vagas do seu interesse, clique no ícone de marcador para guardá-las aqui.
                </p>
                <Button asChild>
                  <Link to="/vagas">
                    Explorar Vagas
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs com Vagas Guardadas */}
        {!isLoading && !isError && savedJobs.length > 0 && (
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="todas">
                Todas ({savedJobs.length})
              </TabsTrigger>
              <TabsTrigger value="recentes">
                Recentes ({categorizedJobs.recentes.length})
              </TabsTrigger>
              <TabsTrigger value="ultimos30dias">
                Últimos 30 Dias ({categorizedJobs.ultimos30dias.length})
              </TabsTrigger>
              <TabsTrigger value="antigas">
                Antigas ({categorizedJobs.antigas.length})
              </TabsTrigger>
            </TabsList>

            {/* Tab: Todas */}
            <TabsContent value="todas" className="space-y-4">
              {savedJobs.map((savedJob) => (
                <SavedJobCard
                  key={savedJob.id}
                  savedJob={savedJob}
                  isExpanded={expandedJobs.has(savedJob.job.id)}
                  onToggleExpand={() => toggleExpanded(savedJob.job.id)}
                  onRemove={() => setJobToRemove(savedJob.job.id)}
                />
              ))}
            </TabsContent>

            {/* Tab: Recentes */}
            <TabsContent value="recentes" className="space-y-4">
              {categorizedJobs.recentes.length === 0 ? (
                <EmptyTabState message="Nenhuma vaga guardada recentemente." />
              ) : (
                categorizedJobs.recentes.map((savedJob) => (
                  <SavedJobCard
                    key={savedJob.id}
                    savedJob={savedJob}
                    isExpanded={expandedJobs.has(savedJob.job.id)}
                    onToggleExpand={() => toggleExpanded(savedJob.job.id)}
                    onRemove={() => setJobToRemove(savedJob.job.id)}
                  />
                ))
              )}
            </TabsContent>

            {/* Tab: Últimos 30 Dias */}
            <TabsContent value="ultimos30dias" className="space-y-4">
              {categorizedJobs.ultimos30dias.length === 0 ? (
                <EmptyTabState message="Nenhuma vaga guardada nos últimos 30 dias." />
              ) : (
                categorizedJobs.ultimos30dias.map((savedJob) => (
                  <SavedJobCard
                    key={savedJob.id}
                    savedJob={savedJob}
                    isExpanded={expandedJobs.has(savedJob.job.id)}
                    onToggleExpand={() => toggleExpanded(savedJob.job.id)}
                    onRemove={() => setJobToRemove(savedJob.job.id)}
                  />
                ))
              )}
            </TabsContent>

            {/* Tab: Antigas */}
            <TabsContent value="antigas" className="space-y-4">
              {categorizedJobs.antigas.length === 0 ? (
                <EmptyTabState message="Nenhuma vaga antiga guardada." />
              ) : (
                categorizedJobs.antigas.map((savedJob) => (
                  <SavedJobCard
                    key={savedJob.id}
                    savedJob={savedJob}
                    isExpanded={expandedJobs.has(savedJob.job.id)}
                    onToggleExpand={() => toggleExpanded(savedJob.job.id)}
                    onRemove={() => setJobToRemove(savedJob.job.id)}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>

      <Footer />

      {/* Remove Confirmation Dialog */}
      <AlertDialog open={!!jobToRemove} onOpenChange={() => setJobToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover vaga guardada?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover esta vaga dos seus guardados? Pode voltar a guardá-la a qualquer momento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => jobToRemove && unsaveJobMutation.mutate(jobToRemove)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Componente para card de vaga guardada
interface SavedJobCardProps {
  savedJob: any;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onRemove: () => void;
}

function SavedJobCard({ savedJob, isExpanded, onToggleExpand, onRemove }: SavedJobCardProps) {
  const job = savedJob.job;
  const salaryText = job.showSalary && job.salaryMin && job.salaryMax
    ? `${job.salaryMin}€ - ${job.salaryMax}€`
    : null;

  const savedDate = format(new Date(savedJob.savedAt), "dd/MM/yyyy", { locale: ptBR });

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="h-6 w-6 text-primary" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header com título e badge */}
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{job.title}</h3>
                <p className="text-sm text-muted-foreground">{job.company?.name || "Empresa"}</p>
              </div>
              
              {/* Badge - Guardada */}
              <Badge variant="outline" className="flex-shrink-0 bg-blue-50 text-blue-700 border-blue-200">
                <Bookmark className="h-3 w-3 mr-1 fill-current" />
                Guardada
              </Badge>
            </div>

            {/* Meta informações */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {job.location}
              </span>
              {salaryText && (
                <span className="flex items-center gap-1">
                  <Euro className="h-3.5 w-3.5" />
                  {salaryText}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Guardada: {savedDate}
              </span>
            </div>

            {/* Botões de ação */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/vagas/${job.id}`}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver Vaga
                </Link>
              </Button>
              
              <Collapsible open={isExpanded} onOpenChange={onToggleExpand}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronDown className={`h-4 w-4 mr-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    Ver Detalhes
                  </Button>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="mt-4 pt-4 border-t space-y-3">
                  {/* Descrição */}
                  {job.description && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Descrição:</h4>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {job.description}
                      </p>
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      {contractTypeMap[job.type] || job.type}
                    </Badge>
                    <Badge variant="outline">
                      {workModeMap[job.workMode] || job.workMode}
                    </Badge>
                    {job.sector && (
                      <Badge variant="outline">{job.sector}</Badge>
                    )}
                    {job.experienceLevel && (
                      <Badge variant="outline">{job.experienceLevel}</Badge>
                    )}
                  </div>

                  {/* Botão remover */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={onRemove}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remover dos Guardados
                  </Button>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente para estado vazio de tabs
function EmptyTabState({ message }: { message: string }) {
  return (
    <Card>
      <CardContent className="py-12">
        <div className="flex flex-col items-center justify-center text-center">
          <BookmarkX className="h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}

