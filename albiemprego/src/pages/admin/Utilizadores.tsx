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
  CheckCircle2
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const mockUsers = [
  { id: 1, name: "João Silva", email: "joao.silva@email.com", type: "candidato", status: "active", registeredAt: "2024-01-10", applications: 5 },
  { id: 2, name: "Maria Santos", email: "maria.santos@email.com", type: "candidato", status: "active", registeredAt: "2024-01-08", applications: 12 },
  { id: 3, name: "Pedro Costa", email: "pedro.costa@email.com", type: "candidato", status: "suspended", registeredAt: "2024-01-05", applications: 3 },
  { id: 4, name: "Ana Ferreira", email: "ana.ferreira@email.com", type: "candidato", status: "active", registeredAt: "2024-01-03", applications: 8 },
  { id: 5, name: "Carlos Mendes", email: "carlos.mendes@email.com", type: "empresa", status: "active", registeredAt: "2024-01-02", applications: 0 },
  { id: 6, name: "Sofia Oliveira", email: "sofia.oliveira@email.com", type: "candidato", status: "pending", registeredAt: "2024-01-15", applications: 0 },
];

export default function AdminUtilizadores() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [users, setUsers] = useState(mockUsers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<{ type: 'suspend' | 'delete' | 'activate', user: typeof mockUsers[0] } | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || user.type === typeFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

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

  const getTypeBadge = (type: string) => {
    return type === "candidato" 
      ? <Badge variant="outline">Candidato</Badge>
      : <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Empresa</Badge>;
  };

  const handleSuspend = (user: typeof mockUsers[0]) => {
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: 'suspended' } : u));
    toast({
      title: "Utilizador suspenso",
      description: `${user.name} foi suspenso com sucesso.`,
    });
    setDialogOpen(false);
  };

  const handleActivate = (user: typeof mockUsers[0]) => {
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: 'active' } : u));
    toast({
      title: "Utilizador ativado",
      description: `${user.name} foi ativado com sucesso.`,
    });
    setDialogOpen(false);
  };

  const handleDelete = (user: typeof mockUsers[0]) => {
    setUsers(prev => prev.filter(u => u.id !== user.id));
    toast({
      title: "Utilizador eliminado",
      description: `${user.name} foi eliminado permanentemente.`,
      variant: "destructive",
    });
    setDialogOpen(false);
  };

  const openDialog = (type: 'suspend' | 'delete' | 'activate', user: typeof mockUsers[0]) => {
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
                  <p className="text-2xl font-bold">{users.length}</p>
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
                  <p className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</p>
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
                  <p className="text-2xl font-bold">{users.filter(u => u.type === 'candidato').length}</p>
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
                  <p className="text-2xl font-bold">{users.filter(u => u.type === 'empresa').length}</p>
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
                      <TableCell>{user.registeredAt}</TableCell>
                      <TableCell>{user.applications}</TableCell>
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
                            {user.status === "active" ? (
                              <DropdownMenuItem 
                                className="text-orange-600"
                                onClick={() => openDialog('suspend', user)}
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                Suspender
                              </DropdownMenuItem>
                            ) : user.status === "suspended" ? (
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
            </CardContent>
          </Card>
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
