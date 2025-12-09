import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  FileText,
  Download,
  Star,
  Clock,
  Building2,
  ExternalLink,
  Linkedin,
  Globe,
} from "lucide-react";

// Mock candidate data
const candidatoData = {
  id: "1",
  nome: "João Silva",
  email: "joao.silva@email.com",
  telefone: "+351 912 345 678",
  localizacao: "Castelo Branco, Portugal",
  sobre: "Desenvolvedor Frontend apaixonado por criar interfaces de utilizador intuitivas e responsivas. Com mais de 5 anos de experiência em React, TypeScript e tecnologias web modernas. Focado em entregar código limpo, testável e de alta qualidade.",
  linkedin: "https://linkedin.com/in/joaosilva",
  portfolio: "https://joaosilva.dev",
  disponibilidade: "Imediata",
  salarioEsperado: "35.000€ - 45.000€",
  tipoContrato: ["Full-time", "Remoto"],
  competencias: [
    "React", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS",
    "Node.js", "Git", "REST APIs", "GraphQL", "Jest", "Figma"
  ],
  experiencia: [
    {
      id: "1",
      cargo: "Frontend Developer",
      empresa: "TechCorp Portugal",
      periodo: "Jan 2022 - Presente",
      descricao: "Desenvolvimento de aplicações web usando React e TypeScript. Liderança de equipa de 3 desenvolvedores. Implementação de testes automatizados."
    },
    {
      id: "2",
      cargo: "Junior Developer",
      empresa: "StartupXYZ",
      periodo: "Mar 2019 - Dez 2021",
      descricao: "Desenvolvimento frontend e manutenção de plataforma e-commerce. Colaboração com equipa de design para implementar interfaces responsivas."
    },
  ],
  formacao: [
    {
      id: "1",
      curso: "Licenciatura em Engenharia Informática",
      instituicao: "Instituto Politécnico de Castelo Branco",
      periodo: "2015 - 2019",
    },
    {
      id: "2",
      curso: "Certificação React Advanced",
      instituicao: "Udemy",
      periodo: "2021",
    },
  ],
  candidatura: {
    vaga: "Frontend Developer",
    dataAplicacao: "2024-01-15",
    status: "Em Análise",
    cartaApresentacao: "Estou muito entusiasmado com esta oportunidade na vossa empresa. A minha experiência em React e TypeScript, combinada com a minha paixão por criar interfaces de utilizador excepcionais, fazem de mim um candidato ideal para esta posição. Estou ansioso por contribuir para o sucesso da equipa.",
  },
  cvUrl: "/cv-joao-silva.pdf",
};

export default function PerfilCandidato() {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link
            to="/empresa/candidaturas"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar às candidaturas
          </Link>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Avatar className="h-24 w-24 mx-auto mb-4">
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {candidatoData.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <h1 className="text-xl font-bold text-foreground">{candidatoData.nome}</h1>
                    <p className="text-muted-foreground">Frontend Developer</p>
                    
                    <div className="flex justify-center gap-2 mt-4">
                      <Button size="sm" asChild>
                        <Link to={`/empresa/candidato/${id}/email`}>
                          <Mail className="h-4 w-4 mr-2" />
                          Enviar Email
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline">
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{candidatoData.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{candidatoData.telefone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{candidatoData.localizacao}</span>
                    </div>
                    {candidatoData.linkedin && (
                      <div className="flex items-center gap-3 text-sm">
                        <Linkedin className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={candidatoData.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          LinkedIn <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                    {candidatoData.portfolio && (
                      <div className="flex items-center gap-3 text-sm">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={candidatoData.portfolio} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          Portfolio <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* CV Download */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Curriculum Vitae
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Descarregar CV
                  </Button>
                </CardContent>
              </Card>

              {/* Availability */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Disponibilidade
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Disponibilidade:</span>
                    <Badge variant="secondary">{candidatoData.disponibilidade}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Salário esperado:</span>
                    <span className="font-medium">{candidatoData.salarioEsperado}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {candidatoData.tipoContrato.map((tipo) => (
                      <Badge key={tipo} variant="outline">{tipo}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Application Info */}
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Candidatura: {candidatoData.candidatura.vaga}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Aplicou em: {new Date(candidatoData.candidatura.dataAplicacao).toLocaleDateString('pt-PT')}</span>
                    </div>
                    <Badge>{candidatoData.candidatura.status}</Badge>
                  </div>
                  {candidatoData.candidatura.cartaApresentacao && (
                    <div>
                      <h4 className="font-medium mb-2">Carta de Apresentação:</h4>
                      <p className="text-muted-foreground text-sm">
                        {candidatoData.candidatura.cartaApresentacao}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sobre</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{candidatoData.sobre}</p>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Competências</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {candidatoData.competencias.map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Experience */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Experiência Profissional
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {candidatoData.experiencia.map((exp, index) => (
                    <div key={exp.id}>
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <Building2 className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{exp.cargo}</h4>
                          <p className="text-sm text-primary">{exp.empresa}</p>
                          <p className="text-xs text-muted-foreground mb-2">{exp.periodo}</p>
                          <p className="text-sm text-muted-foreground">{exp.descricao}</p>
                        </div>
                      </div>
                      {index < candidatoData.experiencia.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Formação Académica
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {candidatoData.formacao.map((edu, index) => (
                    <div key={edu.id}>
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <GraduationCap className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{edu.curso}</h4>
                          <p className="text-sm text-primary">{edu.instituicao}</p>
                          <p className="text-xs text-muted-foreground">{edu.periodo}</p>
                        </div>
                      </div>
                      {index < candidatoData.formacao.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
