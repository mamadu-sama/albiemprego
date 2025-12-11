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
  Mail,
  UserCheck,
  Users,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { adminUserApi, AdminUser } from "@/lib/admin-api";

export default function AdminUtilizadores() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, candidates: 0, companies: 0 });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<{ type: 'suspend' | 'delete' | 'activate', user: AdminUser } | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Carregar utilizadores
  useEffect(() => {
    fetchUsers();
  }, [page, typeFilter, statusFilter, searchTerm]);

  // Carregar estatísticas
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminUserApi.list({
        type: typeFilter !== "all" ? typeFilter : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: searchTerm || undefined,
        page,
        limit: 20,
      });
      setUsers(data.users);
      setTotalPages(data.pagination.totalPages);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar utilizadores",
        description: error.response?.data?.message || "Ocorreu um erro",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await adminUserApi.getStats();
      setStats({
        total: data.total,
        active: data.active,
        candidates: data.byType.candidates,
        companies: data.byType.companies,
      });
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  const filteredUsers = users;

  const getStatusBadge = (status: string) => {
    const statusUpper = status.toUpperCase();
    switch (statusUpper) {
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

  const getTypeBadge = (type: string) => {
    const typeUpper = type.toUpperCase();
    return typeUpper === "CANDIDATO" 
      ? <Badge variant="outline">Candidato</Badge>
      : <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Empresa</Badge>;
  };

  const handleSuspend = async (user: AdminUser) => {
    try {
      await adminUserApi.updateStatus(user.id, "SUSPENDED");
      toast({
        title: "Utilizador suspenso",
        description: `${user.name} foi suspenso com sucesso.`,
      });
      setDialogOpen(false);
      fetchUsers();
      fetchStats();
    } catch (error: any) {
      toast({
        title: "Erro ao suspender utilizador",
        description: error.response?.data?.message || "Ocorreu um erro",
        variant: "destructive",
      });
    }
  };

  const handleActivate = async (user: AdminUser) => {
    try {
      await adminUserApi.updateStatus(user.id, "ACTIVE");
      toast({
        title: "Utilizador ativado",
        description: `${user.name} foi ativado com sucesso.`,
      });
      setDialogOpen(false);
      fetchUsers();
      fetchStats();
    } catch (error: any) {
      toast({
        title: "Erro ao ativar utilizador",
        description: error.response?.data?.message || "Ocorreu um erro",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (user: AdminUser) => {
    try {
      await adminUserApi.delete(user.id);
      toast({
        title: "Utilizador eliminado",
        description: `${user.name} foi eliminado permanentemente.`,
        variant: "destructive",
      });
      setDialogOpen(false);
      fetchUsers();
      fetchStats();
    } catch (error: any) {
      toast({
        title: "Erro ao eliminar utilizador",
        description: error.response?.data?.message || "Ocorreu um erro",
        variant: "destructive",
      });
    }
  };

  const openDialog = (type: 'suspend' | 'delete' | 'activate', user: AdminUser) => {
    setDialogAction({ type, user });
    setDialogOpen(true);
  };

  const handleDialogConfirm = () => {
    if (!dialogAction) return;
    
    switch (dialogAction.type) {
      case 'suspend':
        handleSuspend(dialogAction.user);
        break;
      case 'activate':
        handleActivate(dialogAction.user);
        break;
      case 'delete':
        handleDelete(dialogAction.user);
        break;
    }
  };

  const getDialogContent = () => {
    if (!dialogAction) return { title: '', description: '' };
    
    switch (dialogAction.type) {
      case 'suspend':
        return {
          title: 'Suspender utilizador?',
          description: `O utilizador ${dialogAction.user.name} será suspenso e não poderá aceder à plataforma.`
        };
      case 'activate':
        return {
          title: 'Ativar utilizador?',
          description: `O utilizador ${dialogAction.user.name} será ativado e poderá aceder à plataforma.`
        };
      case 'delete':
        return {
          title: 'Eliminar utilizador?',
          description: `Esta ação é irreversível. Todos os dados do utilizador ${dialogAction.user.name} serão eliminados permanentemente.`
        };
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Dashboard
          </Link>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Gestão de Utilizadores
              </h1>
              <p className="text-muted-foreground">
                {filteredUsers.length} utilizadores encontrados
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
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
                  <UserCheck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.active}</p>
                  <p className="text-sm text-muted-foreground">Ativos</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2 rounded-full bg-orange-100">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.candidates}</p>
                  <p className="text-sm text-muted-foreground">Candidatos</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2 rounded-full bg-blue-100">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.companies}</p>
                  <p className="text-sm text-muted-foreground">Empresas</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
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
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    <SelectItem value="candidato">Candidatos</SelectItem>
                    <SelectItem value="empresa">Empresas</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Estados</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="suspended">Suspensos</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mb-4" />
                  <p>Nenhum utilizador encontrado</p>
                </div>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilizador</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Registo</TableHead>
                    <TableHead>Candidaturas</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(user.type)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString('pt-PT')}</TableCell>
                      <TableCell>{user.applicationCount || 0}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/utilizador/${user.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Perfil
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/utilizador/${user.id}/email`}>
                                <Mail className="h-4 w-4 mr-2" />
                                Enviar Email
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status.toUpperCase() === "ACTIVE" ? (
                              <DropdownMenuItem 
                                className="text-orange-600"
                                onClick={() => openDialog('suspend', user)}
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                Suspender
                              </DropdownMenuItem>
                            ) : user.status.toUpperCase() === "SUSPENDED" ? (
                              <DropdownMenuItem 
                                className="text-green-600"
                                onClick={() => openDialog('activate', user)}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Ativar
                              </DropdownMenuItem>
                            ) : null}
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => openDialog('delete', user)}
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
          
          {/* Paginação */}
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

      {/* Confirmation Dialog */}
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
              {dialogAction?.type === 'suspend' ? 'Suspender' : dialogAction?.type === 'activate' ? 'Ativar' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
