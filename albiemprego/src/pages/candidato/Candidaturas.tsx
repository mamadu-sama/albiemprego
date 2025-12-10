import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Euro, 
  Clock, 
  Building2,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Loader2,
  Eye,
  Trash2
} from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
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

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  NEW: { label: "Nova", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Clock },
  VIEWED: { label: "Visualizada", color: "bg-purple-100 text-purple-700 border-purple-200", icon: Eye },
  IN_REVIEW: { label: "Em Análise", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock },
  INTERVIEW: { label: "Entrevista", color: "bg-blue-100 text-blue-700 border-blue-200", icon: AlertCircle },
  REJECTED: { label: "Não Selecionado", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
  ACCEPTED: { label: "Aceite", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
};

function CandidaturaCard({ candidatura, onWithdraw }: { candidatura: any; onWithdraw: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[candidatura.status as keyof typeof statusConfig] || statusConfig.NEW;
  const StatusIcon = status.icon;
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);

  const canWithdraw = candidatura.status === "NEW" || candidatura.status === "VIEWED";

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-0">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <Link 
                  to={`/vagas/${candidatura.job.id}`}
                  className="text-xl font-semibold text-foreground hover:text-primary transition-colors"
                >
                  {candidatura.job.title}
                </Link>
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    {candidatura.job.company?.name || "Empresa"}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {candidatura.job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatDistanceToNow(new Date(candidatura.appliedAt), { 
                      addSuffix: true, 
                      locale: ptBR 
                    })}
                  </div>
                </div>
              </div>
              <Badge className={`${status.color} border`}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {status.label}
              </Badge>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="flex-1"
              >
                {expanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2" />
                    Ocultar Timeline
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Ver Timeline
                  </>
                )}
              </Button>
              <Button asChild variant="default" size="sm">
                <Link to={`/vagas/${candidatura.job.id}`}>
                  Ver Vaga
                </Link>
              </Button>
              {canWithdraw && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowWithdrawDialog(true)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Timeline */}
          {expanded && (
            <div className="border-t border-border bg-muted/30 p-6">
              <h4 className="font-semibold text-foreground mb-4">Timeline da Candidatura</h4>
              <div className="space-y-3">
                {(candidatura.timeline as any[]).map((event: any, idx: number) => {
                  const eventStatus = statusConfig[event.status] || statusConfig.NEW;
                  const EventIcon = eventStatus.icon;
                  return (
                    <div key={idx} className="flex gap-3">
                      <div className={`w-8 h-8 rounded-full ${eventStatus.color} flex items-center justify-center flex-shrink-0`}>
                        <EventIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 pt-0.5">
                        <p className="text-sm font-medium text-foreground">{event.note}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(event.date).toLocaleString("pt-PT")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Withdraw Dialog */}
      <AlertDialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Retirar Candidatura?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza que deseja retirar a sua candidatura para <strong>{candidatura.job.title}</strong>?
              Esta ação não pode ser revertida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onWithdraw(candidatura.id);
                setShowWithdrawDialog(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Retirar Candidatura
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function CandidaturasPage() {
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar candidaturas
  const { data: candidaturas = [], isLoading, isError } = useQuery({
    queryKey: ["myApplications"],
    queryFn: () => applicationApi.getMyApplications(),
  });

  // Mutation para retirar candidatura
  const withdrawMutation = useMutation({
    mutationFn: (applicationId: string) => applicationApi.withdrawApplication(applicationId),
    onSuccess: () => {
      toast({
        title: "Candidatura retirada",
        description: "A sua candidatura foi retirada com sucesso",
      });
      queryClient.invalidateQueries({ queryKey: ["myApplications"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Não foi possível retirar a candidatura",
        variant: "destructive",
      });
    },
  });

  // Filtrar candidaturas
  const filteredCandidaturas = candidaturas.filter((c: any) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return c.status === "IN_REVIEW" || c.status === "INTERVIEW" || c.status === "NEW" || c.status === "VIEWED";
    if (activeTab === "accepted") return c.status === "ACCEPTED";
    if (activeTab === "rejected") return c.status === "REJECTED";
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

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <Card className="border-destructive">
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Erro ao carregar candidaturas
                </h3>
                <p className="text-muted-foreground mb-4">
                  Ocorreu um erro ao carregar as suas candidaturas
                </p>
                <Button onClick={() => window.location.reload()}>
                  Tentar Novamente
                </Button>
              </CardContent>
            </Card>
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
              As Minhas Candidaturas
            </h1>
            <p className="text-muted-foreground">
              Acompanhe o estado das suas candidaturas.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">
                Todas ({candidaturas.length})
              </TabsTrigger>
              <TabsTrigger value="active">
                Ativas ({candidaturas.filter((c: any) => ["IN_REVIEW", "INTERVIEW", "NEW", "VIEWED"].includes(c.status)).length})
              </TabsTrigger>
              <TabsTrigger value="accepted">
                Aceites ({candidaturas.filter((c: any) => c.status === "ACCEPTED").length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejeitadas ({candidaturas.filter((c: any) => c.status === "REJECTED").length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4">
            {filteredCandidaturas.length > 0 ? (
              filteredCandidaturas.map((candidatura: any) => (
                <CandidaturaCard 
                  key={candidatura.id} 
                  candidatura={candidatura}
                  onWithdraw={(id) => withdrawMutation.mutate(id)}
                />
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Nenhuma candidatura encontrada
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {activeTab === "all" 
                      ? "Ainda não se candidatou a nenhuma vaga. Explore as oportunidades disponíveis!"
                      : "Não tem candidaturas nesta categoria."}
                  </p>
                  <Button asChild>
                    <Link to="/vagas">Explorar Vagas</Link>
                  </Button>
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
