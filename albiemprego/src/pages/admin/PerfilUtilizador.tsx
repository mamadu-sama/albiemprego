import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Link, useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Briefcase,
  GraduationCap,
  FileText,
  Ban,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Send,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { adminUserApi } from "@/lib/admin-api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminPerfilUtilizador() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const data = await adminUserApi.getDetails(id!);
      setUser(data);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar utilizador",
        description: error.response?.data?.message || "Ocorreu um erro",
        variant: "destructive",
      });
      navigate("/admin/utilizadores");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Ativo</Badge>;
      case "SUSPENDED":
        return <Badge variant="destructive">Suspenso</Badge>;
      case "PENDING":
        return <Badge variant="secondary">Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleSuspend = async () => {
    try {
      await adminUserApi.updateStatus(id!, "SUSPENDED");
      toast({
        title: "Utilizador suspenso",
        description: `${user.name} foi suspenso com sucesso.`,
      });
      fetchUser();
    } catch (error: any) {
      toast({
        title: "Erro ao suspender",
        description: error.response?.data?.message || "Ocorreu um erro",
        variant: "destructive",
      });
    }
  };

  const handleActivate = async () => {
    try {
      await adminUserApi.updateStatus(id!, "ACTIVE");
      toast({
        title: "Utilizador ativado",
        description: `${user.name} foi ativado com sucesso.`,
      });
      fetchUser();
    } catch (error: any) {
      toast({
        title: "Erro ao ativar",
        description: error.response?.data?.message || "Ocorreu um erro",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await adminUserApi.delete(id!);
      toast({
        title: "Utilizador eliminado",
        description: `${user.name} foi eliminado permanentemente.`,
        variant: "destructive",
      });
      navigate("/admin/utilizadores");
    } catch (error: any) {
      toast({
        title: "Erro ao eliminar",
        description: error.response?.data?.message || "Ocorreu um erro",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-PT');
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link to="/admin/utilizadores" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Voltar à lista de utilizadores
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="lg:col-span-1">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {user.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-muted-foreground mb-2">ID: {id}</p>
                  <div className="flex gap-2 mb-4">
                    {getStatusBadge(user.status)}
                    <Badge variant="outline">
                      {user.type === "CANDIDATO" ? "Candidato" : user.type === "EMPRESA" ? "Empresa" : "Admin"}
                    </Badge>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="w-full space-y-3 text-left">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{user.phone}</span>
                      </div>
                    )}
                    {user.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{user.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Registo: {formatDate(user.createdAt)}</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="w-full space-y-2">
                    <Button 
                      className="w-full" 
                      variant="outline"
                      asChild
                    >
                      <Link to={`/admin/utilizador/${id}/email`}>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Email
                      </Link>
                    </Button>

                    {user.status === "ACTIVE" ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="w-full" variant="outline">
                            <Ban className="h-4 w-4 mr-2" />
                            Suspender
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Suspender utilizador?</AlertDialogTitle>
                            <AlertDialogDescription>
                              O utilizador {user.name} será suspenso e não poderá aceder à plataforma.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleSuspend}>Suspender</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <Button className="w-full" variant="outline" onClick={handleActivate}>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Ativar
                      </Button>
                    )}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="w-full" variant="destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar Conta
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Eliminar utilizador?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação é irreversível. Todos os dados do utilizador serão eliminados permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats */}
              {user.candidate && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-primary">{user.applicationsCount || 0}</p>
                      <p className="text-sm text-muted-foreground">Candidaturas</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-primary">{user.candidate.skills?.length || 0}</p>
                      <p className="text-sm text-muted-foreground">Competências</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-primary">{user.candidate.experiences?.length || 0}</p>
                      <p className="text-sm text-muted-foreground">Experiências</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-primary">{user.candidate.educations?.length || 0}</p>
                      <p className="text-sm text-muted-foreground">Formações</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* About */}
              {user.bio && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Sobre
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{user.bio}</p>
                  </CardContent>
                </Card>
              )}

              {/* Skills */}
              {user.candidate?.skills && user.candidate.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Competências</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {user.candidate.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Experience */}
              {user.candidate?.experiences && user.candidate.experiences.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Experiência Profissional
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {user.candidate.experiences.map((exp: any, index: number) => (
                      <div key={index} className="border-l-2 border-primary pl-4">
                        <h4 className="font-semibold">{exp.position}</h4>
                        <p className="text-sm text-muted-foreground">{exp.company}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(exp.startDate)} - {exp.current ? "Presente" : formatDate(exp.endDate)}
                        </p>
                        {exp.description && <p className="text-sm mt-1">{exp.description}</p>}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Education */}
              {user.candidate?.educations && user.candidate.educations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Formação
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {user.candidate.educations.map((edu: any, index: number) => (
                      <div key={index} className="border-l-2 border-primary pl-4">
                        <h4 className="font-semibold">{edu.degree}</h4>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        <p className="text-sm text-muted-foreground">{edu.field}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(edu.startDate)} - {edu.current ? "Presente" : formatDate(edu.endDate)}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Activity Log */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Registo de Atividade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {user.lastLoginAt && (
                      <div className="flex items-center justify-between text-sm">
                        <span>Último login</span>
                        <span className="text-muted-foreground">{formatDateTime(user.lastLoginAt)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span>Data de registo</span>
                      <span className="text-muted-foreground">{formatDate(user.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Total de candidaturas</span>
                      <span className="text-muted-foreground">{user.applicationsCount || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Estado</span>
                      <span className="text-muted-foreground">{getStatusBadge(user.status)}</span>
                    </div>
                  </div>
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
