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
  Building2,
  Globe,
  Users,
  Ban,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Send,
  FileText
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockCompany = {
  id: 1,
  name: "TechSolutions Lda",
  email: "contact@techsolutions.pt",
  phone: "+351 272 123 456",
  location: "Castelo Branco",
  nif: "509123456",
  website: "https://techsolutions.pt",
  status: "active",
  registeredAt: "2024-01-10",
  lastLogin: "2024-01-20 14:30",
  logo: "",
  description: "Empresa de tecnologia especializada em desenvolvimento de software e consultoria digital. Oferecemos soluções inovadoras para empresas de todos os tamanhos.",
  employees: "10-50",
  sector: "Tecnologia",
  jobs: [
    { id: 1, title: "Desenvolvedor Frontend", status: "active", applications: 12, createdAt: "2024-01-15" },
    { id: 2, title: "Desenvolvedor Backend", status: "active", applications: 8, createdAt: "2024-01-12" },
    { id: 3, title: "Designer UX/UI", status: "paused", applications: 5, createdAt: "2024-01-10" },
  ],
  totalApplications: 25,
};

export default function AdminPerfilEmpresa() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Ativa</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspensa</Badge>;
      case "pending":
        return <Badge variant="secondary">Pendente</Badge>;
      case "paused":
        return <Badge variant="outline">Pausada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleApprove = () => {
    toast({
      title: "Empresa aprovada",
      description: `${mockCompany.name} foi aprovada com sucesso.`,
    });
  };

  const handleSuspend = () => {
    toast({
      title: "Empresa suspensa",
      description: `${mockCompany.name} foi suspensa com sucesso.`,
    });
  };

  const handleActivate = () => {
    toast({
      title: "Empresa ativada",
      description: `${mockCompany.name} foi ativada com sucesso.`,
    });
  };

  const handleDelete = () => {
    toast({
      title: "Empresa eliminada",
      description: `${mockCompany.name} foi eliminada permanentemente.`,
      variant: "destructive",
    });
    navigate("/admin/empresas");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link to="/admin/empresas" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Voltar à lista de empresas
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="lg:col-span-1">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={mockCompany.logo} alt={mockCompany.name} />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {mockCompany.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{mockCompany.name}</h2>
                  <p className="text-muted-foreground mb-2">NIF: {mockCompany.nif}</p>
                  <div className="flex gap-2 mb-4">
                    {getStatusBadge(mockCompany.status)}
                    <Badge variant="outline">{mockCompany.sector}</Badge>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="w-full space-y-3 text-left">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{mockCompany.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{mockCompany.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{mockCompany.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a href={mockCompany.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                        {mockCompany.website}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{mockCompany.employees} funcionários</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Registo: {mockCompany.registeredAt}</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="w-full space-y-2">
                    <Button 
                      className="w-full" 
                      variant="outline"
                      asChild
                    >
                      <Link to={`/admin/empresa/${id}/email`}>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Email
                      </Link>
                    </Button>

                    {mockCompany.status === "pending" && (
                      <Button className="w-full" variant="default" onClick={handleApprove}>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Aprovar Empresa
                      </Button>
                    )}

                    {mockCompany.status === "active" ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="w-full" variant="outline">
                            <Ban className="h-4 w-4 mr-2" />
                            Suspender
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Suspender empresa?</AlertDialogTitle>
                            <AlertDialogDescription>
                              A empresa {mockCompany.name} será suspensa e todas as suas vagas serão desativadas.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleSuspend}>Suspender</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : mockCompany.status !== "pending" && (
                      <Button className="w-full" variant="outline" onClick={handleActivate}>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Ativar
                      </Button>
                    )}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="w-full" variant="destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar Empresa
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Eliminar empresa?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação é irreversível. Todos os dados da empresa e suas vagas serão eliminados permanentemente.
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
                    <p className="text-2xl font-bold text-primary">{mockCompany.jobs.length}</p>
                    <p className="text-sm text-muted-foreground">Vagas</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{mockCompany.jobs.filter(j => j.status === 'active').length}</p>
                    <p className="text-sm text-muted-foreground">Vagas Ativas</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{mockCompany.totalApplications}</p>
                    <p className="text-sm text-muted-foreground">Candidaturas</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{mockCompany.employees}</p>
                    <p className="text-sm text-muted-foreground">Funcionários</p>
                  </CardContent>
                </Card>
              </div>

              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Sobre a Empresa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{mockCompany.description}</p>
                </CardContent>
              </Card>

              {/* Jobs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Vagas Publicadas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vaga</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Candidaturas</TableHead>
                        <TableHead>Criada em</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockCompany.jobs.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium">{job.title}</TableCell>
                          <TableCell>{getStatusBadge(job.status)}</TableCell>
                          <TableCell>{job.applications}</TableCell>
                          <TableCell>{job.createdAt}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
                      <span className="text-muted-foreground">{mockCompany.lastLogin}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Data de registo</span>
                      <span className="text-muted-foreground">{mockCompany.registeredAt}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Total de vagas</span>
                      <span className="text-muted-foreground">{mockCompany.jobs.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Total de candidaturas recebidas</span>
                      <span className="text-muted-foreground">{mockCompany.totalApplications}</span>
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
