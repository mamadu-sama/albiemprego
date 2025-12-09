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
  Send
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

const mockUser = {
  id: 1,
  name: "João Silva",
  email: "joao.silva@email.com",
  phone: "+351 912 345 678",
  location: "Castelo Branco",
  type: "candidato",
  status: "active",
  registeredAt: "2024-01-10",
  lastLogin: "2024-01-20 14:30",
  avatar: "",
  bio: "Profissional de TI com 5 anos de experiência em desenvolvimento web. Especializado em React e Node.js.",
  applications: 5,
  skills: ["JavaScript", "React", "Node.js", "TypeScript", "HTML/CSS"],
  experience: [
    {
      company: "Tech Company",
      position: "Desenvolvedor Frontend",
      period: "2020 - Presente",
      description: "Desenvolvimento de aplicações web modernas com React"
    },
    {
      company: "Startup XYZ",
      position: "Desenvolvedor Junior",
      period: "2018 - 2020",
      description: "Manutenção e desenvolvimento de features para plataforma SaaS"
    }
  ],
  education: [
    {
      institution: "Instituto Politécnico de Castelo Branco",
      degree: "Licenciatura em Engenharia Informática",
      year: "2018"
    }
  ]
};

export default function AdminPerfilUtilizador() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Ativo</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspenso</Badge>;
      case "pending":
        return <Badge variant="secondary">Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleSuspend = () => {
    toast({
      title: "Utilizador suspenso",
      description: `${mockUser.name} foi suspenso com sucesso.`,
    });
  };

  const handleActivate = () => {
    toast({
      title: "Utilizador ativado",
      description: `${mockUser.name} foi ativado com sucesso.`,
    });
  };

  const handleDelete = () => {
    toast({
      title: "Utilizador eliminado",
      description: `${mockUser.name} foi eliminado permanentemente.`,
      variant: "destructive",
    });
    navigate("/admin/utilizadores");
  };

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
                    <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {mockUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{mockUser.name}</h2>
                  <p className="text-muted-foreground mb-2">ID: {id}</p>
                  <div className="flex gap-2 mb-4">
                    {getStatusBadge(mockUser.status)}
                    <Badge variant="outline">
                      {mockUser.type === "candidato" ? "Candidato" : "Empresa"}
                    </Badge>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="w-full space-y-3 text-left">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{mockUser.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{mockUser.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{mockUser.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Registo: {mockUser.registeredAt}</span>
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

                    {mockUser.status === "active" ? (
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
                              O utilizador {mockUser.name} será suspenso e não poderá aceder à plataforma.
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{mockUser.applications}</p>
                    <p className="text-sm text-muted-foreground">Candidaturas</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{mockUser.skills.length}</p>
                    <p className="text-sm text-muted-foreground">Competências</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{mockUser.experience.length}</p>
                    <p className="text-sm text-muted-foreground">Experiências</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{mockUser.education.length}</p>
                    <p className="text-sm text-muted-foreground">Formações</p>
                  </CardContent>
                </Card>
              </div>

              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Sobre
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{mockUser.bio}</p>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Competências</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {mockUser.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Experience */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Experiência Profissional
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockUser.experience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      <h4 className="font-semibold">{exp.position}</h4>
                      <p className="text-sm text-muted-foreground">{exp.company}</p>
                      <p className="text-sm text-muted-foreground">{exp.period}</p>
                      <p className="text-sm mt-1">{exp.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Formação
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockUser.education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      <h4 className="font-semibold">{edu.degree}</h4>
                      <p className="text-sm text-muted-foreground">{edu.institution}</p>
                      <p className="text-sm text-muted-foreground">{edu.year}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

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
                    <div className="flex items-center justify-between text-sm">
                      <span>Último login</span>
                      <span className="text-muted-foreground">{mockUser.lastLogin}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Data de registo</span>
                      <span className="text-muted-foreground">{mockUser.registeredAt}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Total de candidaturas</span>
                      <span className="text-muted-foreground">{mockUser.applications}</span>
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
