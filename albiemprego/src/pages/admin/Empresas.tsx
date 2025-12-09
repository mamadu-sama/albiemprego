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
  Mail
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const mockCompanies = [
  { id: 1, name: "TechSolutions Lda", email: "contact@techsolutions.pt", nif: "509123456", status: "active", registeredAt: "2024-01-10", jobs: 5, location: "Castelo Branco" },
  { id: 2, name: "Castelo Digital", email: "info@castelodigital.pt", nif: "509234567", status: "active", registeredAt: "2024-01-08", jobs: 3, location: "Castelo Branco" },
  { id: 3, name: "InnovaTech Lda", email: "hello@innovatech.pt", nif: "509345678", status: "pending", registeredAt: "2024-01-15", jobs: 0, location: "Covilhã" },
  { id: 4, name: "Digital Solutions SA", email: "contact@digitalsolutions.pt", nif: "509456789", status: "pending", registeredAt: "2024-01-14", jobs: 0, location: "Fundão" },
  { id: 5, name: "FastMoney", email: "contact@fastmoney.pt", nif: "509567890", status: "suspended", registeredAt: "2024-01-05", jobs: 2, location: "Guarda" },
];

export default function AdminEmpresas() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [companies, setCompanies] = useState(mockCompanies);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<{ type: 'suspend' | 'delete' | 'activate' | 'approve', company: typeof mockCompanies[0] } | null>(null);

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || company.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Ativa</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspensa</Badge>;
      case "pending":
        return <Badge variant="secondary">Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleApprove = (company: typeof mockCompanies[0]) => {
    setCompanies(prev => prev.map(c => c.id === company.id ? { ...c, status: 'active' } : c));
    toast({
      title: "Empresa aprovada",
      description: `${company.name} foi aprovada com sucesso.`,
    });
    setDialogOpen(false);
  };

  const handleSuspend = (company: typeof mockCompanies[0]) => {
    setCompanies(prev => prev.map(c => c.id === company.id ? { ...c, status: 'suspended' } : c));
    toast({
      title: "Empresa suspensa",
      description: `${company.name} foi suspensa com sucesso.`,
    });
    setDialogOpen(false);
  };

  const handleActivate = (company: typeof mockCompanies[0]) => {
    setCompanies(prev => prev.map(c => c.id === company.id ? { ...c, status: 'active' } : c));
    toast({
      title: "Empresa ativada",
      description: `${company.name} foi ativada com sucesso.`,
    });
    setDialogOpen(false);
  };

  const handleDelete = (company: typeof mockCompanies[0]) => {
    setCompanies(prev => prev.filter(c => c.id !== company.id));
    toast({
      title: "Empresa eliminada",
      description: `${company.name} foi eliminada permanentemente.`,
      variant: "destructive",
    });
    setDialogOpen(false);
  };

  const openDialog = (type: 'suspend' | 'delete' | 'activate' | 'approve', company: typeof mockCompanies[0]) => {
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
          {/* Back Button */}
          <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Dashboard
          </Link>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Gestão de Empresas
              </h1>
              <p className="text-muted-foreground">
                {filteredCompanies.length} empresas encontradas
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{companies.length}</p>
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
                  <p className="text-2xl font-bold">{companies.filter(c => c.status === 'active').length}</p>
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
                  <p className="text-2xl font-bold">{companies.filter(c => c.status === 'pending').length}</p>
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
                  <p className="text-2xl font-bold">{companies.reduce((sum, c) => sum + c.jobs, 0)}</p>
                  <p className="text-sm text-muted-foreground">Vagas Ativas</p>
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Estados</SelectItem>
                    <SelectItem value="active">Ativas</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="suspended">Suspensas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Companies Table */}
          <Card>
            <CardContent className="p-0">
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
                  {filteredCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{company.name}</p>
                          <p className="text-sm text-muted-foreground">{company.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{company.nif}</TableCell>
                      <TableCell>{company.location}</TableCell>
                      <TableCell>{getStatusBadge(company.status)}</TableCell>
                      <TableCell>{company.jobs}</TableCell>
                      <TableCell>{company.registeredAt}</TableCell>
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
                            {company.status === "pending" && (
                              <DropdownMenuItem 
                                onClick={() => openDialog('approve', company)} 
                                className="text-green-600"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Aprovar
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {company.status === "active" ? (
                              <DropdownMenuItem 
                                className="text-orange-600"
                                onClick={() => openDialog('suspend', company)}
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                Suspender
                              </DropdownMenuItem>
                            ) : company.status === "suspended" ? (
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
              {dialogAction?.type === 'approve' ? 'Aprovar' : dialogAction?.type === 'suspend' ? 'Suspender' : dialogAction?.type === 'activate' ? 'Ativar' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
