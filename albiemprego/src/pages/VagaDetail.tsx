import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { JobCard, Job } from "@/components/jobs/JobCard";
import { MatchScoreCard, IncompleteProfileAlert } from "@/components/jobs/MatchScoreCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import {
  MapPin,
  Clock,
  Building2,
  Euro,
  Bookmark,
  Share2,
  ChevronRight,
  Briefcase,
  GraduationCap,
  Users,
  Globe,
  Calendar,
  Eye,
  Send,
  CheckCircle2,
  FileText,
  Copy,
  Linkedin,
  Facebook,
  Twitter,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { jobApi } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function VagaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  const isAuthenticated = !!user;
  const userType = user?.type === "CANDIDATO" ? "candidato" : user?.type === "EMPRESA" ? "empresa" : null;
  const profileCompleteness = user?.candidate?.profileCompleteness || 0;

  // Buscar dados da vaga
  const { data: jobData, isLoading, isError } = useQuery({
    queryKey: ["job", id],
    queryFn: () => jobApi.getJob(id!),
    enabled: !!id,
  });

  // Buscar vagas similares
  const { data: similarJobsData } = useQuery({
    queryKey: ["similarJobs", jobData?.location, jobData?.sector],
    queryFn: () => jobApi.searchJobs({
      location: jobData?.location,
      sector: jobData?.sector,
      limit: 3,
    }),
    enabled: !!jobData,
  });

  // Buscar match score (apenas para candidatos autenticados)
  const { data: matchScoreData } = useQuery({
    queryKey: ["matchScore", id],
    queryFn: () => jobApi.getMatchScore(id!),
    enabled: !!id && isAuthenticated && userType === "candidato",
    retry: false, // Não retry se falhar (pode não ter candidato profile completo)
  });

  const matchScore = matchScoreData?.overall || null;
  const matchBreakdown = matchScoreData?.breakdown || null;

  const handleApply = () => {
    setIsApplied(true);
    setShowApplyModal(false);
    toast({
      title: "Candidatura enviada!",
      description: "A sua candidatura foi enviada com sucesso. Boa sorte!",
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copiado!",
      description: "O link da vaga foi copiado para a área de transferência.",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          <div className="container-custom py-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">A carregar detalhes da vaga...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (isError || !jobData) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          <div className="container-custom py-8">
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

  // Mapear tipos para display
  const contractTypeMap: Record<string, string> = {
    "FULL_TIME": "Permanente",
    "PART_TIME": "Part-time",
    "TEMPORARY": "Temporário",
    "INTERNSHIP": "Estágio",
    "FREELANCE": "Freelance"
  };

  const workModeMap: Record<string, string> = {
    "PRESENCIAL": "Presencial",
    "REMOTO": "Remoto",
    "HIBRIDO": "Híbrido"
  };

  const postedDate = jobData.publishedAt 
    ? formatDistanceToNow(new Date(jobData.publishedAt), { addSuffix: true, locale: ptBR })
    : "Recente";

  const salaryText = jobData.showSalary && jobData.salaryMin && jobData.salaryMax
    ? `${jobData.salaryMin}€ - ${jobData.salaryMax}€/${jobData.salaryPeriod === 'month' ? 'mês' : 'ano'}`
    : null;

  const similarJobs: Job[] = similarJobsData?.jobs.slice(0, 3).map(job => ({
    id: job.id,
    title: job.title,
    company: job.company?.name || "Empresa",
    location: job.location,
    contractType: contractTypeMap[job.type] || job.type,
    workMode: workModeMap[job.workMode] || job.workMode,
    salary: job.showSalary && job.salaryMin && job.salaryMax
      ? `${job.salaryMin}€ - ${job.salaryMax}€/${job.salaryPeriod === 'month' ? 'mês' : 'ano'}`
      : undefined,
    postedAt: job.publishedAt 
      ? formatDistanceToNow(new Date(job.publishedAt), { addSuffix: true, locale: ptBR })
      : "Recente",
  })) || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-card border-b border-border">
          <div className="container-custom py-4">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary">Início</Link>
              <ChevronRight className="h-4 w-4" />
              <Link to="/vagas" className="hover:text-primary">Vagas</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground truncate max-w-[200px]">{jobData.title}</span>
            </nav>
          </div>
        </div>

        <div className="container-custom py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Match Score Card - Only for authenticated candidates */}
              {isAuthenticated && userType === 'candidato' && matchScore && matchBreakdown && (
                <>
                  {profileCompleteness < 70 && (
                    <IncompleteProfileAlert profileCompleteness={profileCompleteness} />
                  )}
                  <MatchScoreCard score={matchScore} breakdown={matchBreakdown} />
                </>
              )}

              {/* Header */}
              <div className="bg-card rounded-xl border border-border p-6 md:p-8">
                <div className="flex gap-4 md:gap-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                    {jobData.company?.logo ? (
                      <img src={jobData.company.logo} alt={jobData.company.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <Building2 className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                      {jobData.title}
                    </h1>
                    <p className="text-lg text-muted-foreground mb-4">
                      {jobData.company?.name || "Empresa"}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {jobData.location}
                      </span>
                      {salaryText && (
                        <span className="flex items-center gap-1">
                          <Euro className="h-4 w-4" />
                          {salaryText}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {postedDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {jobData.viewsCount} visualizações
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge>{contractTypeMap[jobData.type] || jobData.type}</Badge>
                      <Badge variant="secondary">{workModeMap[jobData.workMode] || jobData.workMode}</Badge>
                      {jobData.experienceLevel && (
                        <Badge variant="outline">{jobData.experienceLevel}</Badge>
                      )}
                      {jobData.isFeatured && (
                        <Badge className="bg-primary">Em Destaque</Badge>
                      )}
                      {jobData.isUrgent && (
                        <Badge variant="destructive">Urgente</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-card rounded-xl border border-border p-6 md:p-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">Sobre a Função</h2>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {jobData.description}
                </p>
              </div>

              {/* Responsibilities */}
              <div className="bg-card rounded-xl border border-border p-6 md:p-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">Responsabilidades</h2>
                <ul className="space-y-3">
                  {jobData.responsibilities.map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              {jobData.requirements && jobData.requirements.length > 0 && (
                <div className="bg-card rounded-xl border border-border p-6 md:p-8">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Requisitos</h2>
                  <ul className="space-y-3">
                    {jobData.requirements.map((item, i) => (
                      <li key={i} className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills */}
              {jobData.skills && jobData.skills.length > 0 && (
                <div className="bg-card rounded-xl border border-border p-6 md:p-8">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Competências</h2>
                  <div className="flex flex-wrap gap-2">
                    {jobData.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-sm py-1 px-3">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {jobData.benefits && jobData.benefits.length > 0 && (
                <div className="bg-card rounded-xl border border-border p-6 md:p-8">
                  <h2 className="text-xl font-semibold text-foreground mb-4">O Que Oferecemos</h2>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {jobData.benefits.map((item, i) => (
                      <li key={i} className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Company Info */}
              <div className="bg-card rounded-xl border border-border p-6 md:p-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">Sobre a Empresa</h2>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    {jobData.company?.logo ? (
                      <img src={jobData.company.logo} alt={jobData.company.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Building2 className="w-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{jobData.company?.name || "Empresa"}</h3>
                    {jobData.sector && (
                      <p className="text-sm text-muted-foreground">{jobData.sector}</p>
                    )}
                  </div>
                </div>
                <Link to={`/vagas?companyId=${jobData.companyId}`}>
                  <Button variant="outline" className="w-full">
                    Ver Todas as Vagas desta Empresa
                  </Button>
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Card */}
              <Card className="sticky top-24 border-border shadow-lg">
                <CardContent className="p-6">
                  {isApplied ? (
                    <div className="text-center py-4">
                      <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="h-8 w-8 text-success" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">Candidatura Enviada</h3>
                      <p className="text-sm text-muted-foreground">
                        Enviada há poucos segundos
                      </p>
                    </div>
                  ) : (
                    <>
                      <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
                        <DialogTrigger asChild>
                          <Button size="lg" className="w-full mb-3">
                            <Send className="h-4 w-4 mr-2" />
                            Candidatar-me
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Candidatar-me a {jobData.title}</DialogTitle>
                            <DialogDescription>
                              {jobData.company} • {jobData.location}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-foreground">Nome</label>
                                <Input placeholder="O seu nome" className="mt-1" />
                              </div>
                              <div>
                                <label className="text-sm font-medium text-foreground">Apelido</label>
                                <Input placeholder="O seu apelido" className="mt-1" />
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground">Email</label>
                              <Input type="email" placeholder="email@exemplo.com" className="mt-1" />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground">Telefone</label>
                              <Input type="tel" placeholder="+351 912 345 678" className="mt-1" />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground">CV (PDF)</label>
                              <Input type="file" accept=".pdf" className="mt-1" />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground">Carta de Apresentação (opcional)</label>
                              <Textarea placeholder="Escreva uma breve apresentação..." className="mt-1" rows={4} />
                            </div>
                            <div className="flex items-start gap-2">
                              <Checkbox id="terms" />
                              <label htmlFor="terms" className="text-sm text-muted-foreground">
                                Aceito os termos de utilização e a política de privacidade
                              </label>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setShowApplyModal(false)} className="flex-1">
                              Cancelar
                            </Button>
                            <Button onClick={handleApply} className="flex-1">
                              Enviar Candidatura
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsSaved(!isSaved)}
                    >
                      <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
                      {isSaved ? "Guardada" : "Guardar"}
                    </Button>
                    <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1">
                          <Share2 className="h-4 w-4 mr-2" />
                          Partilhar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Partilhar Vaga</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <Button variant="outline" className="w-full justify-start" onClick={handleCopyLink}>
                            <Copy className="h-4 w-4 mr-3" />
                            Copiar Link
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Linkedin className="h-4 w-4 mr-3" />
                            LinkedIn
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Facebook className="h-4 w-4 mr-3" />
                            Facebook
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Twitter className="h-4 w-4 mr-3" />
                            Twitter
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <Separator className="my-6" />

                  {/* Quick Info */}
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Prazo de candidatura</span>
                      <span className="font-medium">{jobData.deadline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Candidatos</span>
                      <span className="font-medium">{jobData.applicants} candidatos</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Experiência</span>
                      <span className="font-medium">{jobData.experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Formação</span>
                      <span className="font-medium text-right max-w-[150px]">{jobData.education}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Company Card */}
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
                      {jobData.company?.logo ? (
                        <img 
                          src={jobData.company.logo} 
                          alt={jobData.company.name} 
                          className="w-full h-full object-cover rounded-xl" 
                        />
                      ) : (
                        <Building2 className="w-7 h-7 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{jobData.company?.name || "Empresa"}</h3>
                      {jobData.sector && (
                        <p className="text-sm text-muted-foreground">{jobData.sector}</p>
                      )}
                    </div>
                  </div>
                  <Link to={`/vagas?companyId=${jobData.companyId}`}>
                    <Button variant="outline" className="w-full">
                      Ver Todas as Vagas desta Empresa
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Similar Jobs */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Vagas Semelhantes</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {similarJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
