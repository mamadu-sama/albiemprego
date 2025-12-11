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
  FileText,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { adminCompanyApi } from "@/lib/admin-api";
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

export default function AdminPerfilEmpresa() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [company, setCompany] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCompany();
    }
  }, [id]);

  const fetchCompany = async () => {
    try {
      setIsLoading(true);
      const data = await adminCompanyApi.getDetails(id!);
      setCompany(data);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar empresa",
        description: error.response?.data?.message || "Ocorreu um erro",
        variant: "destructive",
      });
      navigate("/admin/empresas");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case "ACTIVE":
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Ativa</Badge>;
      case "SUSPENDED":
        return <Badge variant="destructive">Suspensa</Badge>;
      case "PENDING":
        return <Badge variant="secondary">Pendente</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejeitada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getJobStatusBadge = (status: string) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Ativa</Badge>;
      case "PAUSED":
        return <Badge variant="outline">Pausada</Badge>;
      case "CLOSED":
        return <Badge variant="secondary">Fechada</Badge>;
      case "DRAFT":
        return <Badge variant="secondary">Rascunho</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleApprove = async () => {
    try {
      await adminCompanyApi.updateStatus(id!, "APPROVED");
      toast({
        title: "Empresa aprovada",
        description: `${company.name} foi aprovada com sucesso.`,
      });
      fetchCompany();
    } catch (error: any) {
      toast({
        title: "Erro ao aprovar",
        description: error.response?.data?.message || "Ocorreu um erro",
        variant: "destructive",
      });
    }
  };

  const handleSuspend = async () => {
    try {
      await adminCompanyApi.updateStatus(id!, "SUSPENDED");
      toast({
        title: "Empresa suspensa",
        description: `${company.name} foi suspensa com sucesso.`,
      });
      fetchCompany();
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
      await adminCompanyApi.updateStatus(id!, "APPROVED");
      toast({
        title: "Empresa ativada",
        description: `${company.name} foi ativada com sucesso.`,
      });
      fetchCompany();
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
      await adminCompanyApi.delete(id!);
      toast({
        title: "Empresa eliminada",
        description: `${company.name} foi eliminada permanentemente.`,
        variant: "destructive",
      });
      navigate("/admin/empresas");
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

  if (!company) {
    return null;
  }

  const companyStatus = company.user?.status || company.status;

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
                    <AvatarImage src={company.logo} alt={company.name} />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {company.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{company.name}</h2>
                  <p className="text-muted-foreground mb-2">NIF: {company.nif}</p>
                  <div className="flex gap-2 mb-4">
                    {getStatusBadge(companyStatus)}
                    {company.sector && <Badge variant="outline">{company.sector}</Badge>}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="w-full space-y-3 text-left">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{company.user?.email}</span>
                    </div>
                    {company.user?.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{company.user.phone}</span>
                      </div>
                    )}
                    {company.user?.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{company.user.location}</span>
                      </div>
                    )}
                    {company.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                          {company.website}
                        </a>
                      </div>
                    )}
                    {company.employees && (
                      <div className="flex items-center gap-3">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{company.employees} funcionários</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Registo: {formatDate(company.createdAt)}</span>
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

                    {companyStatus === "PENDING" && (
                      <Button className="w-full" variant="default" onClick={handleApprove}>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Aprovar Empresa
                      </Button>
                    )}

                    {companyStatus === "ACTIVE" || companyStatus === "APPROVED" ? (
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
                              A empresa {company.name} será suspensa e todas as suas vagas serão desativadas.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleSuspend}>Suspender</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : companyStatus !== "PENDING" && (
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
                    <p className="text-2xl font-bold text-primary">{company.jobsCount || 0}</p>
                    <p className="text-sm text-muted-foreground">Vagas</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{company.activeJobsCount || 0}</p>
                    <p className="text-sm text-muted-foreground">Vagas Ativas</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{company.totalApplications || 0}</p>
                    <p className="text-sm text-muted-foreground">Candidaturas</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{company.employees || "-"}</p>
                    <p className="text-sm text-muted-foreground">Funcionários</p>
                  </CardContent>
                </Card>
              </div>

              {/* About */}
              {company.description && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Sobre a Empresa
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{company.description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Jobs */}
              {company.jobs && company.jobs.length > 0 && (
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
                        {company.jobs.map((job: any) => (
                          <TableRow key={job.id}>
                            <TableCell className="font-medium">{job.title}</TableCell>
                            <TableCell>{getJobStatusBadge(job.status)}</TableCell>
                            <TableCell>{job.applicationsCount || 0}</TableCell>
                            <TableCell>{formatDate(job.createdAt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
                    {company.user?.lastLoginAt && (
                      <div className="flex items-center justify-between text-sm">
                        <span>Último login</span>
                        <span className="text-muted-foreground">{formatDateTime(company.user.lastLoginAt)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span>Data de registo</span>
                      <span className="text-muted-foreground">{formatDate(company.createdAt)}</span>
                    </div>
                    {company.approvedAt && (
                      <div className="flex items-center justify-between text-sm">
                        <span>Data de aprovação</span>
                        <span className="text-muted-foreground">{formatDate(company.approvedAt)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span>Total de vagas</span>
                      <span className="text-muted-foreground">{company.jobsCount || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Total de candidaturas recebidas</span>
                      <span className="text-muted-foreground">{company.totalApplications || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Estado</span>
                      <span className="text-muted-foreground">{getStatusBadge(companyStatus)}</span>
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
