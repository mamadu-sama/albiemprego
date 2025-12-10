import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { jobApi, jobCreditApi, subscriptionApi } from "@/lib/api";
import {
  ArrowLeft,
  Sparkles,
  Home,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Star,
  TrendingUp,
  Eye,
  CreditCard,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const CREDIT_TYPES = {
  FEATURED: {
    label: "Destaque na Listagem",
    icon: Star,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-200",
    description: "Sua vaga aparece com badge de destaque na listagem principal",
  },
  HOMEPAGE: {
    label: "Destaque na Homepage",
    icon: Home,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-200",
    description: "Sua vaga aparece em destaque na página inicial do site",
  },
  URGENT: {
    label: "Badge Urgente",
    icon: Zap,
    color: "text-red-600",
    bgColor: "bg-red-100",
    borderColor: "border-red-200",
    description: "Sua vaga ganha um badge de urgente para atrair mais atenção",
  },
};

export default function GerirDestaquesPage() {
  const { id: jobId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar dados da vaga
  const { data: job, isLoading: isLoadingJob, isError } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => jobApi.getJob(jobId!),
    enabled: !!jobId,
  });

  // Buscar créditos disponíveis
  const { data: subscription, isLoading: isLoadingCredits } = useQuery({
    queryKey: ["currentSubscription"],
    queryFn: () => subscriptionApi.getCurrentSubscription(),
  });

  // Mutation para aplicar crédito
  const applyCreditMutation = useMutation({
    mutationFn: ({ creditType, duration }: { creditType: string; duration: number }) =>
      jobCreditApi.applyCreditToJob(jobId!, creditType, duration),
    onSuccess: () => {
      toast({
        title: "✅ Destaque aplicado!",
        description: "O destaque foi aplicado com sucesso à sua vaga",
      });
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
      queryClient.invalidateQueries({ queryKey: ["currentSubscription"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao aplicar destaque",
        description: error.response?.data?.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Mutation para remover crédito
  const removeCreditMutation = useMutation({
    mutationFn: (usageId: string) => jobCreditApi.removeCreditFromJob(usageId),
    onSuccess: () => {
      toast({
        title: "Destaque removido",
        description: "O destaque foi removido da sua vaga",
      });
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
      queryClient.invalidateQueries({ queryKey: ["currentSubscription"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover destaque",
        description: error.response?.data?.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleApplyCredit = (creditType: string) => {
    // Determinar duração baseada no plano
    const duration = subscription?.plan?.creditDuration === "DAYS_14" ? 14 : 7;
    applyCreditMutation.mutate({ creditType, duration });
  };

  const handleRemoveCredit = (usageId: string) => {
    if (window.confirm("Tem certeza que deseja remover este destaque?")) {
      removeCreditMutation.mutate(usageId);
    }
  };

  // Loading state
  if (isLoadingJob || isLoadingCredits) {
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
  if (isError || !job) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <Card className="border-destructive">
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Vaga não encontrada</h3>
                <p className="text-muted-foreground mb-4">
                  A vaga que procura não existe ou não tem permissão para aceder.
                </p>
                <Button asChild>
                  <Link to="/empresa/vagas">Voltar para Vagas</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Verificar se vaga está ativa
  if (job.status !== "ACTIVE") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <Button asChild variant="ghost" className="mb-6">
              <Link to="/empresa/vagas">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <Card className="border-warning">
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-12 w-12 text-warning mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Vaga não está ativa</h3>
                <p className="text-muted-foreground mb-4">
                  Apenas vagas ativas podem ter destaques aplicados.
                </p>
                <Button asChild>
                  <Link to="/empresa/vagas">Voltar para Vagas</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const activeCredits = job.creditUsages || [];
  const availableCredits = subscription?.credits || {
    featured: 0,
    homepage: 0,
    urgent: 0,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <Button asChild variant="ghost" className="mb-6">
            <Link to="/empresa/vagas">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Vagas
            </Link>
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              Gerir Destaques
            </h1>
            <p className="text-muted-foreground">
              Aplique créditos para destacar a vaga: <strong>{job.title}</strong>
            </p>
          </div>

          {/* Current Credits */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Créditos Disponíveis
              </CardTitle>
              <CardDescription>
                {subscription?.plan ? `Plano: ${subscription.plan.name}` : "Sem plano ativo"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-yellow-600" />
                      <span className="font-semibold">Destaque</span>
                    </div>
                    <p className="text-2xl font-bold">{availableCredits.featured}</p>
                    <p className="text-xs text-muted-foreground">Créditos disponíveis</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Home className="h-5 w-5 text-purple-600" />
                      <span className="font-semibold">Homepage</span>
                    </div>
                    <p className="text-2xl font-bold">{availableCredits.homepage}</p>
                    <p className="text-xs text-muted-foreground">Créditos disponíveis</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-red-600" />
                      <span className="font-semibold">Urgente</span>
                    </div>
                    <p className="text-2xl font-bold">{availableCredits.urgent}</p>
                    <p className="text-xs text-muted-foreground">Créditos disponíveis</p>
                  </CardContent>
                </Card>
              </div>

              {!subscription?.plan && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Não tem um plano ativo. 
                    <Link to="/empresa/planos" className="ml-1 font-medium underline">
                      Ver planos disponíveis
                    </Link>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Active Highlights */}
          {activeCredits.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  Destaques Ativos
                </CardTitle>
                <CardDescription>
                  Destaques atualmente aplicados a esta vaga
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeCredits.map((usage: any) => {
                    const creditType = CREDIT_TYPES[usage.creditType as keyof typeof CREDIT_TYPES];
                    const Icon = creditType.icon;
                    const isExpired = usage.expiresAt && new Date(usage.expiresAt) < new Date();

                    return (
                      <Card key={usage.id} className={isExpired ? "opacity-50" : ""}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full ${creditType.bgColor} ${creditType.borderColor} border flex items-center justify-center`}>
                                <Icon className={`h-5 w-5 ${creditType.color}`} />
                              </div>
                              <div>
                                <p className="font-semibold">{creditType.label}</p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  {usage.expiresAt ? (
                                    <>
                                      <Clock className="h-3 w-3" />
                                      {isExpired ? (
                                        <span className="text-destructive">Expirado</span>
                                      ) : (
                                        <span>
                                          Expira{" "}
                                          {formatDistanceToNow(new Date(usage.expiresAt), {
                                            addSuffix: true,
                                            locale: ptBR,
                                          })}
                                        </span>
                                      )}
                                    </>
                                  ) : (
                                    <span>Sem expiração</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveCredit(usage.id)}
                              disabled={removeCreditMutation.isPending}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Apply Highlights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Aplicar Destaques
              </CardTitle>
              <CardDescription>
                Escolha o tipo de destaque que deseja aplicar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(CREDIT_TYPES).map(([key, type]) => {
                  const Icon = type.icon;
                  const hasCredit = availableCredits[key.toLowerCase() as keyof typeof availableCredits] > 0;
                  const isApplied = activeCredits.some((u: any) => u.creditType === key && (!u.expiresAt || new Date(u.expiresAt) > new Date()));

                  return (
                    <Card key={key} className={`${type.borderColor} border-2`}>
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 rounded-full ${type.bgColor} ${type.borderColor} border flex items-center justify-center mb-4 mx-auto`}>
                          <Icon className={`h-6 w-6 ${type.color}`} />
                        </div>
                        <h3 className="font-semibold text-center mb-2">{type.label}</h3>
                        <p className="text-sm text-muted-foreground text-center mb-4">
                          {type.description}
                        </p>
                        <Button
                          className="w-full"
                          onClick={() => handleApplyCredit(key)}
                          disabled={!hasCredit || isApplied || applyCreditMutation.isPending}
                          variant={isApplied ? "outline" : "default"}
                        >
                          {applyCreditMutation.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              A aplicar...
                            </>
                          ) : isApplied ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Aplicado
                            </>
                          ) : hasCredit ? (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Aplicar
                            </>
                          ) : (
                            "Sem créditos"
                          )}
                        </Button>
                        {!hasCredit && (
                          <p className="text-xs text-muted-foreground text-center mt-2">
                            <Link to="/empresa/planos" className="underline">
                              Comprar mais créditos
                            </Link>
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Alert className="mt-6">
                <Eye className="h-4 w-4" />
                <AlertDescription>
                  <strong>Dica:</strong> Destaques aumentam significativamente a visibilidade da sua vaga. 
                  Vagas destacadas recebem em média 3x mais visualizações e candidaturas.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

