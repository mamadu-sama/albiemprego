import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Search, 
  MoreHorizontal, 
  Eye, 
  Ban, 
  Trash2,
  CheckCircle2,
  Building2,
  Briefcase,
  Mail,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { adminCompanyApi } from "@/lib/admin-api";

export default function AdminEmpresas() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, totalJobs: 0 });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<{ type: 'suspend' | 'delete' | 'activate' | 'approve', company: any } | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCompanies();
  }, [page, statusFilter, searchTerm]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await adminCompanyApi.list({
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: searchTerm || undefined,
        page,
        limit: 20,
      });
      setCompanies(data.companies);
      setTotalPages(data.pagination.totalPages);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar empresas",
        description: error.response?.data?.message || "Ocorreu um erro",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await adminCompanyApi.getStats();
      setStats(data);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusUpper = status.toUpperCase();
    switch (statusUpper) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Ativa</Badge>;
      case "SUSPENDED":
        return <Badge variant="destructive">Suspensa</Badge>;
      case "PENDING":
        return <Badge variant="secondary">Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleApprove = async (company: any) => {
    try {
      await adminCompanyApi.updateStatus(company.id, "ACTIVE");
      toast({
        title: "Empresa aprovada",
        description: `${company.name} foi aprovada com sucesso.`,
      });
      setDialogOpen(false);
      fetchCompanies();
      fetchStats();
    } catch (error: any) {
      toast({
        title: "Erro ao aprovar empresa",
        description: error.response?.data?.message || "Ocorreu um erro",
        variant: "destructive",
      });
    }
  };

  const handleSuspend = async (company: any) => {
    try {
      await adminCompanyApi.updateStatus(company.id, "SUSPENDED");
      toast({
        title: "Empresa suspensa",
        description: `${company.name} foi suspensa com sucesso.`,
      });
      setDialogOpen(false);
      fetchCompanies();
      fetchStats();
    } catch (error: any) {
      toast({
        title: "Erro ao suspender empresa",
        description: error.response?.data?.message || "Ocorreu um erro",
        variant: "destructive",
      });
    }
  };

  const handleActivate = async (company: any) => {
    try {
      await adminCompanyApi.updateStatus(company.id, "ACTIVE");
      toast({
        title: "Empresa ativada",
        description: `${company.name} foi ativada com sucesso.`,
      });
      setDialogOpen(false);
      fetchCompanies();
      fetchStats();
    } catch (error: any) {
      toast({
        title: "Erro ao ativar empresa",
        description: error.response?.data?.message || "Ocorreu um erro",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (company: any) => {
    try {
      await adminCompanyApi.delete(company.id);
      toast({
        title: "Empresa eliminada",
        description: `${company.name} foi eliminada permanentemente.`,
        variant: "destructive",
      });
      setDialogOpen(false);
      fetchCompanies();
      fetchStats();
    } catch (error: any) {
      toast({
        title: "Erro ao eliminar empresa",
        description: error.response?.data?.message || "Ocorreu um erro",
        variant: "destructive",
      });
    }
  };

  const openDialog = (type: 'suspend' | 'delete' | 'activate' | 'approve', company: any) => {
    setDialogAction({ type, company });
    setDialogOpen(true);
  };

  const handleDialogConfirm = () => {
    if (!dialogAction) return;
    
    switch (dialogAction.type) {
      case 'approve':
        handleApprove(dialogAction.company);
        break;
      case 'suspend':
        handleSuspend(dialogAction.company);
        break;
      case 'activate':
        handleActivate(dialogAction.company);
        break;
      case 'delete':
        handleDelete(dialogAction.company);
        break;
    }
  };

  const getDialogContent = () => {
    if (!dialogAction) return { title: '', description: '' };
    
    switch (dialogAction.type) {
      case 'approve':
        return {
          title: 'Aprovar empresa?',
          description: `A empresa ${dialogAction.company.name} será aprovada e poderá publicar vagas na plataforma.`
        };
      case 'suspend':
        return {
          title: 'Suspender empresa?',
          description: `A empresa ${dialogAction.company.name} será suspensa e todas as suas vagas serão desativadas.`
        };
      case 'activate':
        return {
          title: 'Ativar empresa?',
          description: `A empresa ${dialogAction.company.name} será ativada e poderá aceder à plataforma.`
        };
      case 'delete':
        return {
          title: 'Eliminar empresa?',
          description: `Esta ação é irreversível. Todos os dados da empresa ${dialogAction.company.name} e suas vagas serão eliminados permanentemente.`
        };
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Dashboard
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Gestão de Empresas
              </h1>
              <p className="text-muted-foreground">
                {stats.total} empresas encontradas
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2 rounded-full bg-green-100">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.active}</p>
                  <p className="text-sm text-muted-foreground">Ativas</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2 rounded-full bg-orange-100">
                  <Building2 className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2 rounded-full bg-blue-100">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalJobs}</p>
                  <p className="text-sm text-muted-foreground">Vagas Ativas</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Estados</SelectItem>
                    <SelectItem value="ACTIVE">Ativas</SelectItem>
                    <SelectItem value="PENDING">Pendentes</SelectItem>
                    <SelectItem value="SUSPENDED">Suspensas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : companies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Building2 className="h-12 w-12 mb-4" />
                  <p>Nenhuma empresa encontrada</p>
                </div>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>NIF</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Vagas</TableHead>
                    <TableHead>Registo</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{company.name}</p>
                          <p className="text-sm text-muted-foreground">{company.user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{company.nif}</TableCell>
                      <TableCell>{company.user.location || "-"}</TableCell>
                      <TableCell>{getStatusBadge(company.user.status)}</TableCell>
                      <TableCell>{company._count?.jobs || 0}</TableCell>
                      <TableCell>{new Date(company.user.createdAt).toLocaleDateString('pt-PT')}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/empresa/${company.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Detalhes
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/empresa/${company.id}/email`}>
                                <Mail className="h-4 w-4 mr-2" />
                                Enviar Email
                              </Link>
                            </DropdownMenuItem>
                            {company.user.status.toUpperCase() === "PENDING" && (
                              <DropdownMenuItem 
                                onClick={() => openDialog('approve', company)} 
                                className="text-green-600"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Aprovar
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {company.user.status.toUpperCase() === "ACTIVE" ? (
                              <DropdownMenuItem 
                                className="text-orange-600"
                                onClick={() => openDialog('suspend', company)}
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                Suspender
                              </DropdownMenuItem>
                            ) : company.user.status.toUpperCase() === "SUSPENDED" ? (
                              <DropdownMenuItem 
                                className="text-green-600"
                                onClick={() => openDialog('activate', company)}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Ativar
                              </DropdownMenuItem>
                            ) : null}
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => openDialog('delete', company)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              )}
            </CardContent>
          </Card>

          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Próxima
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{getDialogContent().title}</AlertDialogTitle>
            <AlertDialogDescription>
              {getDialogContent().description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDialogConfirm}
              className={dialogAction?.type === 'delete' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
            >
              {dialogAction?.type === 'approve' ? 'Aprovar' : dialogAction?.type === 'suspend' ? 'Suspender' : dialogAction?.type === 'activate' ? 'Ativar' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
