import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { JobCard, Job } from "@/components/jobs/JobCard";
import { MatchScoreCard, IncompleteProfileAlert } from "@/components/jobs/MatchScoreCard";
import { generateRandomMatchScore, generateMockBreakdown } from "@/utils/mockMatchScore";
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
} from "lucide-react";

// Mock job data
const jobData = {
  id: "1",
  title: "Engenheiro de Software Full Stack",
  company: "TechCast Solutions",
  companyLogo: "",
  location: "Castelo Branco",
  contractType: "Permanente",
  workMode: "Híbrido",
  salary: "35.000€ - 45.000€/ano",
  postedAt: "Há 2 dias",
  deadline: "30 de Janeiro, 2025",
  views: 234,
  applicants: 18,
  seniority: "Pleno",
  experience: "3-5 anos",
  education: "Licenciatura em Eng. Informática ou similar",
  description: `
    Estamos à procura de um Engenheiro de Software Full Stack talentoso e motivado para se juntar à nossa equipa de desenvolvimento em Castelo Branco.

    Somos uma empresa tecnológica em crescimento, focada em soluções inovadoras para o setor financeiro. Oferecemos um ambiente de trabalho dinâmico, projetos desafiantes e excelentes oportunidades de crescimento profissional.
  `,
  responsibilities: [
    "Desenvolver e manter aplicações web utilizando React, Node.js e TypeScript",
    "Colaborar com a equipa de design para implementar interfaces modernas e responsivas",
    "Participar em code reviews e contribuir para a melhoria contínua dos processos",
    "Integrar APIs e serviços de terceiros",
    "Garantir a qualidade do código através de testes automatizados",
    "Participar no planeamento e estimação de sprints",
  ],
  requirements: {
    mustHave: [
      "Experiência mínima de 3 anos em desenvolvimento Full Stack",
      "Conhecimentos sólidos de React, Node.js e TypeScript",
      "Experiência com bases de dados SQL e NoSQL",
      "Familiaridade com metodologias ágeis (Scrum/Kanban)",
      "Fluência em Português e bom nível de Inglês",
    ],
    niceToHave: [
      "Experiência com AWS ou Google Cloud",
      "Conhecimentos de Docker e Kubernetes",
      "Experiência com GraphQL",
      "Contribuições para projetos open-source",
    ],
  },
  benefits: [
    "Salário competitivo (35k-45k€/ano)",
    "Modelo de trabalho híbrido (3 dias escritório, 2 dias remoto)",
    "Seguro de saúde extensível ao agregado familiar",
    "Orçamento anual para formação e certificações",
    "MacBook Pro ou equipamento à escolha",
    "Horário flexível",
    "Fruta fresca e snacks no escritório",
    "Team buildings e eventos sociais",
  ],
  skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "MongoDB", "AWS", "Git", "REST APIs"],
  companyInfo: {
    name: "TechCast Solutions",
    industry: "Tecnologia / FinTech",
    size: "50-200 colaboradores",
    founded: "2018",
    website: "www.techcast.pt",
    description: "A TechCast Solutions é uma empresa portuguesa de tecnologia especializada em soluções de software para o setor financeiro. Com sede em Castelo Branco, temos uma equipa jovem e dinâmica focada na inovação e qualidade.",
  },
};

const similarJobs: Job[] = [
  { id: "2", title: "Frontend Developer", company: "Digital Beira", location: "Castelo Branco", contractType: "Permanente", workMode: "Remoto", salary: "28.000€ - 35.000€/ano", postedAt: "Há 3 dias" },
  { id: "3", title: "Backend Developer Node.js", company: "StartupCB", location: "Castelo Branco", contractType: "Permanente", workMode: "Híbrido", postedAt: "Há 1 semana" },
  { id: "4", title: "DevOps Engineer", company: "CloudTech", location: "Covilhã", contractType: "Permanente", workMode: "Remoto", salary: "40.000€ - 50.000€/ano", postedAt: "Há 5 dias" },
];

export default function VagaDetailPage() {
  const { id } = useParams();
  const [isSaved, setIsSaved] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  // Mock authentication state - replace with real auth when available
  const isAuthenticated = true;
  const userType: 'candidato' | 'empresa' | null = 'candidato';
  const profileCompleteness = 75; // Mock value

  // Calculate match score and breakdown
  const matchScore = useMemo(() => {
    if (!isAuthenticated || userType !== 'candidato') return null;
    return generateRandomMatchScore(jobData.id);
  }, [isAuthenticated, userType]);

  const matchBreakdown = useMemo(() => {
    if (!matchScore) return null;
    return generateMockBreakdown(matchScore);
  }, [matchScore]);

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
                    <Building2 className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                      {jobData.title}
                    </h1>
                    <p className="text-lg text-muted-foreground mb-4">
                      {jobData.company}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {jobData.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Euro className="h-4 w-4" />
                        {jobData.salary}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {jobData.postedAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {jobData.views} visualizações
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge>{jobData.contractType}</Badge>
                      <Badge variant="secondary">{jobData.workMode}</Badge>
                      <Badge variant="outline">{jobData.seniority}</Badge>
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
              <div className="bg-card rounded-xl border border-border p-6 md:p-8">
                <h2 className="text-xl font-semibold text-foreground mb-6">Requisitos</h2>
                
                <div className="mb-6">
                  <h3 className="font-medium text-foreground mb-3">Obrigatórios</h3>
                  <ul className="space-y-3">
                    {jobData.requirements.mustHave.map((item, i) => (
                      <li key={i} className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-foreground mb-3">Valorizados</h3>
                  <ul className="space-y-3">
                    {jobData.requirements.niceToHave.map((item, i) => (
                      <li key={i} className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Skills */}
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

              {/* Benefits */}
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

              {/* Company Info */}
              <div className="bg-card rounded-xl border border-border p-6 md:p-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">Sobre a Empresa</h2>
                <p className="text-muted-foreground mb-6">{jobData.companyInfo.description}</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Setor</p>
                      <p className="font-medium">{jobData.companyInfo.industry}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Dimensão</p>
                      <p className="font-medium">{jobData.companyInfo.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Fundada em</p>
                      <p className="font-medium">{jobData.companyInfo.founded}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Website</p>
                      <a href={`https://${jobData.companyInfo.website}`} className="font-medium text-primary hover:underline">
                        {jobData.companyInfo.website}
                      </a>
                    </div>
                  </div>
                </div>
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
                      <Building2 className="w-7 h-7 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{jobData.company}</h3>
                      <p className="text-sm text-muted-foreground">{jobData.companyInfo.industry}</p>
                    </div>
                  </div>
                  <Link to={`/empresas/${jobData.company}`}>
                    <Button variant="outline" className="w-full">
                      Ver Todas as Vagas
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
