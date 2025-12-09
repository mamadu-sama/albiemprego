import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { 
  Building2, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Users, 
  Edit,
  Loader2,
  AlertCircle,
  Briefcase
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { companyApi } from "@/lib/api";

export default function EmpresaPerfil() {
  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ["companyProfile"],
    queryFn: companyApi.getProfile,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">A carregar perfil...</p>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-destructive">
        <AlertCircle className="h-12 w-12" />
        <p className="mt-2">Erro ao carregar o perfil da empresa.</p>
        <Link to="/empresa/perfil/editar">
          <Button className="mt-4">Editar Perfil</Button>
        </Link>
      </div>
    );
  }

  const user = profile.user;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
            <div className="flex items-start gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.logo || "/placeholder-company.jpg"} />
                <AvatarFallback>
                  <Building2 className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{profile.name}</h1>
                <p className="text-lg text-muted-foreground">
                  {profile.sector || "Sector não definido"}
                </p>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {user.location || "Localização não informada"}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/empresa/perfil/editar">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Coluna Principal */}
            <div className="lg:col-span-2 space-y-8">
              {/* Sobre a Empresa */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Sobre a Empresa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {profile.description || user.bio || "Nenhuma descrição disponível."}
                  </p>
                </CardContent>
              </Card>

              {/* Vagas Ativas */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Vagas Ativas ({profile.jobs?.length || 0})
                    </CardTitle>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/empresa/vagas">Ver Todas</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.jobs && profile.jobs.length > 0 ? (
                    profile.jobs.slice(0, 5).map((job) => (
                      <div key={job.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">{job.title}</h4>
                            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {job.location}
                            </div>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="secondary">{job.type}</Badge>
                              <Badge variant="outline">{job.workMode}</Badge>
                              <Badge 
                                variant={
                                  job.status === "ACTIVE" ? "default" : 
                                  job.status === "DRAFT" ? "secondary" : 
                                  "outline"
                                }
                              >
                                {job.status}
                              </Badge>
                            </div>
                          </div>
                          {job._count?.applications !== undefined && (
                            <div className="text-right">
                              <p className="text-sm font-semibold">
                                {job._count.applications}
                              </p>
                              <p className="text-xs text-muted-foreground">candidaturas</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nenhuma vaga publicada ainda.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Coluna Lateral */}
            <div className="lg:col-span-1 space-y-8">
              {/* Informações */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>NIF: {profile.nif}</span>
                  </div>
                  {profile.sector && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      <span>{profile.sector}</span>
                    </div>
                  )}
                  {profile.employees && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{profile.employees}</span>
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      <a 
                        href={profile.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {profile.website}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contacto */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Contacto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Status de Aprovação */}
              {!profile.approvedAt && (
                <Card className="border-yellow-500">
                  <CardHeader>
                    <CardTitle className="text-yellow-600">
                      Aguardando Aprovação
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      O seu perfil está em análise pela equipa do AlbiEmprego.
                      Será notificado assim que for aprovado.
                    </p>
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
