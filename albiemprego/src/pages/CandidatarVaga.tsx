import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ProfilePreview } from "@/components/candidatura/ProfilePreview";
import { QuickApplyModal } from "@/components/candidatura/QuickApplyModal";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { jobApi, applicationApi, ApplicationData } from "@/lib/api";
import {
  ArrowLeft,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Zap,
  MapPin,
  Building2,
  Briefcase,
  Euro,
  Clock,
} from "lucide-react";

export default function CandidatarVaga() {
  const { jobId } = useParams<{ jobId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [coverLetter, setCoverLetter] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [availability, setAvailability] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [showQuickApplyModal, setShowQuickApplyModal] = useState(false);

  // Verificar se é candidato
  useEffect(() => {
    if (user && user.type !== "CANDIDATO") {
      toast({
        title: "Acesso negado",
        description: "Apenas candidatos podem candidatar-se a vagas",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [user, navigate, toast]);

  // Buscar dados da vaga
  const { data: jobData, isLoading: isLoadingJob, isError: isErrorJob } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => jobApi.getJob(jobId!),
    enabled: !!jobId,
  });

  // Verificar se pode candidatar-se
  const { data: canApplyData, isLoading: isCheckingEligibility } = useQuery({
    queryKey: ["canApply", jobId],
    queryFn: () => applicationApi.canApply(jobId!),
    enabled: !!jobId && !!user,
    retry: false,
  });

  // Mutation para enviar candidatura
  const applyMutation = useMutation({
    mutationFn: (data: ApplicationData) => applicationApi.apply(jobId!, data),
    onSuccess: () => {
      toast({
        title: "✅ Candidatura enviada!",
        description: "A sua candidatura foi enviada com sucesso. Boa sorte!",
      });
      // Redirecionar para candidaturas
      setTimeout(() => {
        navigate("/candidato/candidaturas");
      }, 1500);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao enviar candidatura",
        description: error.response?.data?.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleQuickApply = () => {
    // Candidatura rápida - sem dados adicionais
    applyMutation.mutate({});
  };

  const handleCompleteApply = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar carta de apresentação (obrigatória se não quick apply)
    if (!jobData?.quickApply && (!coverLetter || coverLetter.length < 50)) {
      toast({
        title: "Carta de apresentação obrigatória",
        description: "Por favor escreva pelo menos 50 caracteres",
        variant: "destructive",
      });
      return;
    }

    // Validar portfolio URL se fornecido
    if (portfolio && !portfolio.startsWith("http")) {
      toast({
        title: "URL inválido",
        description: "O link do portfólio deve começar com http:// ou https://",
        variant: "destructive",
      });
      return;
    }

    // Enviar candidatura
    applyMutation.mutate({
      coverLetter: coverLetter || undefined,
      portfolio: portfolio || undefined,
      availability: availability || undefined,
      expectedSalary: expectedSalary ? parseFloat(expectedSalary) : undefined,
    });
  };

  // Loading state
  if (isLoadingJob || isCheckingEligibility) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">A carregar...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (isErrorJob || !jobData) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-center max-w-md">
                <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
                <p className="text-foreground font-medium mb-2">Vaga não encontrada</p>
                <p className="text-sm text-muted-foreground mb-4">
                  A vaga que procura não existe ou foi removida.
                </p>
                <Button asChild>
                  <Link to="/vagas">Ver todas as vagas</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Verificar elegibilidade
  if (canApplyData && !canApplyData.canApply) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <Button asChild variant="ghost" className="mb-6">
                <Link to={`/vagas/${jobId}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar à vaga
                </Link>
              </Button>

              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-6 w-6" />
                    Não pode candidatar-se
                  </CardTitle>
                  <CardDescription>
                    Existem alguns requisitos que precisa cumprir primeiro
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {canApplyData.reasons.map((reason, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex gap-3">
                    <Button asChild variant="outline" className="flex-1">
                      <Link to={`/vagas/${jobId}`}>
                        Voltar
                      </Link>
                    </Button>
                    <Button asChild className="flex-1">
                      <Link to="/candidato/perfil/editar">
                        Completar Perfil
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Success state (após envio)
  if (applyMutation.isSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <Card className="border-success">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-10 w-10 text-success" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Candidatura Enviada!
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    A sua candidatura para <strong>{jobData.title}</strong> foi enviada com sucesso.
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    A empresa irá analisar o seu perfil e entrará em contacto caso haja interesse.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button asChild variant="outline">
                      <Link to="/vagas">
                        Ver mais vagas
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link to="/candidato/candidaturas">
                        Ver minhas candidaturas
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Main form
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <Button asChild variant="ghost" className="mb-6">
              <Link to={`/vagas/${jobId}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar à vaga
              </Link>
            </Button>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Candidatar-me
              </h1>
              <p className="text-muted-foreground">
                Complete as informações abaixo para se candidatar
              </p>
            </div>

            {/* Job Summary */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2">{jobData.title}</h2>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {jobData.company?.name || jobData.company}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {jobData.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        <Badge variant="outline">{jobData.type.replace("_", " ")}</Badge>
                      </div>
                      {jobData.showSalary && jobData.salaryMin && (
                        <div className="flex items-center gap-1 text-success font-medium">
                          <Euro className="h-4 w-4" />
                          {jobData.salaryMin}€ - {jobData.salaryMax}€
                        </div>
                      )}
                    </div>
                  </div>
                  {jobData.quickApply && (
                    <Badge className="bg-gradient-to-r from-primary to-purple-500 text-white">
                      <Zap className="h-3 w-3 mr-1" />
                      Quick Apply
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Left - Form */}
              <div className="md:col-span-2">
                <form onSubmit={handleCompleteApply} className="space-y-6">
                  {jobData.quickApply ? (
                    /* Quick Apply Option */
                    <Card className="border-primary/30 bg-primary/5">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="h-5 w-5 text-primary" />
                          Candidatura Rápida Disponível
                        </CardTitle>
                        <CardDescription>
                          Esta vaga permite candidatura rápida usando os dados do seu perfil
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          type="button"
                          size="lg"
                          className="w-full"
                          onClick={() => setShowQuickApplyModal(true)}
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Candidatura Rápida (1 clique)
                        </Button>
                        <p className="text-xs text-center text-muted-foreground mt-3">
                          Ou preencha o formulário abaixo para uma candidatura personalizada
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    /* Carta obrigatória */
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Esta vaga requer uma carta de apresentação personalizada
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Carta de Apresentação */}
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Carta de Apresentação
                        {!jobData.quickApply && <span className="text-destructive ml-1">*</span>}
                      </CardTitle>
                      <CardDescription>
                        {jobData.quickApply 
                          ? "Opcional - Destaque-se com uma mensagem personalizada" 
                          : "Obrigatória - Explique por que é o candidato ideal (mínimo 50 caracteres)"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Caro(a) recrutador(a),&#10;&#10;Venho por este meio manifestar o meu interesse na vaga de..."
                        rows={8}
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        className="resize-none"
                        maxLength={2000}
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        {coverLetter.length}/2000 caracteres
                        {!jobData.quickApply && coverLetter.length < 50 && (
                          <span className="text-destructive ml-2">
                            (mínimo 50)
                          </span>
                        )}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Dados Adicionais */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Informações Adicionais (Opcional)</CardTitle>
                      <CardDescription>
                        Dados extras que podem ajudar na sua candidatura
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Link de Portfólio / LinkedIn
                        </label>
                        <Input
                          type="url"
                          placeholder="https://linkedin.com/in/seu-perfil"
                          value={portfolio}
                          onChange={(e) => setPortfolio(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Partilhe o seu trabalho ou perfil profissional
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Disponibilidade para Início
                        </label>
                        <Input
                          placeholder="Ex: Imediata, 1 mês de aviso prévio, Janeiro de 2025"
                          value={availability}
                          onChange={(e) => setAvailability(e.target.value)}
                          maxLength={200}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Pretensão Salarial (€/mês)
                        </label>
                        <Input
                          type="number"
                          placeholder="Ex: 1500"
                          value={expectedSalary}
                          onChange={(e) => setExpectedSalary(e.target.value)}
                          min="0"
                          step="50"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Valor mensal bruto em Euros
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Submit Button */}
                  <Card>
                    <CardContent className="p-6">
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={applyMutation.isPending}
                      >
                        {applyMutation.isPending ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            A enviar candidatura...
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5 mr-2" />
                            Enviar Candidatura
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </form>
              </div>

              {/* Right - Profile Preview */}
              <div className="md:col-span-1">
                <div className="sticky top-24">
                  {user && <ProfilePreview user={user} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Quick Apply Modal */}
      {jobData.quickApply && user && (
        <QuickApplyModal
          open={showQuickApplyModal}
          onOpenChange={setShowQuickApplyModal}
          jobTitle={jobData.title}
          companyName={jobData.company?.name || jobData.company}
          user={user}
          onConfirm={handleQuickApply}
          isLoading={applyMutation.isPending}
        />
      )}

      <Footer />
    </div>
  );
}

