import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Edit,
  Download,
  Calendar,
  Globe,
  Linkedin,
  Loader2
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { candidateApi } from "@/lib/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const levelLabels = {
  BASIC: "Básico",
  INTERMEDIATE: "Intermédio",
  ADVANCED: "Avançado",
  NATIVE: "Nativo",
};

export default function Perfil() {
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["candidateProfile"],
    queryFn: candidateApi.getProfile,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Erro ao carregar perfil</h2>
            <p className="text-muted-foreground">Tente novamente mais tarde</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
            <div className="flex items-start gap-4">
              {profile.user.avatar ? (
                <img
                  src={profile.user.avatar}
                  alt={profile.user.name}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-12 w-12 text-primary" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-foreground">{profile.user.name}</h1>
                {profile.currentPosition && (
                  <p className="text-lg text-muted-foreground">{profile.currentPosition}</p>
                )}
                {profile.user.location && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {profile.user.location}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/candidato/perfil/editar">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Link>
              </Button>
              {profile.cvUrl && (
                <Button variant="outline" asChild>
                  <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CV
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Contacto */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profile.user.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{profile.user.email}</span>
                    </div>
                  )}
                  {profile.user.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{profile.user.phone}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Competências */}
              {profile.skills && profile.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Competências
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Idiomas */}
              {profile.languages && profile.languages.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Idiomas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {profile.languages.map((lang) => (
                      <div key={lang.id} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{lang.language}</span>
                        <span className="text-sm text-muted-foreground">
                          {levelLabels[lang.level]}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Sobre Mim */}
              {profile.user.bio && (
                <Card>
                  <CardHeader>
                    <CardTitle>Sobre Mim</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{profile.user.bio}</p>
                  </CardContent>
                </Card>
              )}

              {/* Experiência Profissional */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Experiência Profissional
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.experiences && profile.experiences.length > 0 ? (
                    <div className="space-y-6">
                      {profile.experiences.map((exp) => (
                        <div key={exp.id}>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-foreground">{exp.position}</h4>
                              <p className="text-sm text-muted-foreground">{exp.company}</p>
                            </div>
                            {exp.current && (
                              <Badge variant="default" className="bg-green-500">
                                Atual
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDate(exp.startDate)} -{" "}
                              {exp.current ? "Presente" : exp.endDate ? formatDate(exp.endDate) : ""}
                            </span>
                          </div>
                          {exp.description && (
                            <p className="text-sm text-muted-foreground">{exp.description}</p>
                          )}
                          <Separator className="mt-4" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma experiência adicionada</p>
                  )}
                </CardContent>
              </Card>

              {/* Formação Académica */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Formação Académica
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.educations && profile.educations.length > 0 ? (
                    <div className="space-y-6">
                      {profile.educations.map((edu) => (
                        <div key={edu.id}>
                          <h4 className="font-semibold text-foreground">{edu.degree}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{edu.institution}</p>
                          <p className="text-sm text-muted-foreground mb-2">
                            <strong>Área:</strong> {edu.field}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDate(edu.startDate)} -{" "}
                              {edu.current ? "Presente" : edu.endDate ? formatDate(edu.endDate) : ""}
                            </span>
                          </div>
                          <Separator className="mt-4" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma formação adicionada</p>
                  )}
                </CardContent>
              </Card>

              {/* CV */}
              {profile.cvUrl && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Curriculum Vitae
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" asChild>
                      <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Descarregar CV
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
