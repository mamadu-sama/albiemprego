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
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Search, 
  MoreHorizontal, 
  Eye, 
  Ban, 
  Trash2,
  CheckCircle2,
  Briefcase,
  Clock,
  AlertTriangle
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const mockJobs = [
  { id: 1, title: "Frontend Developer", company: "TechSolutions Lda", location: "Castelo Branco", status: "active", createdAt: "2024-01-10", applications: 15, reports: 0 },
  { id: 2, title: "Marketing Manager", company: "Castelo Digital", location: "Castelo Branco", status: "pending", createdAt: "2024-01-15", applications: 0, reports: 0 },
  { id: 3, title: "Backend Developer", company: "TechSolutions Lda", location: "Remoto", status: "active", createdAt: "2024-01-08", applications: 8, reports: 0 },
  { id: 4, title: "Trabalho Fácil - Ganhe €5000/mês", company: "FastMoney", location: "Online", status: "reported", createdAt: "2024-01-12", applications: 2, reports: 5 },
  { id: 5, title: "Designer Gráfico", company: "Castelo Digital", location: "Covilhã", status: "active", createdAt: "2024-01-05", applications: 6, reports: 0 },
  { id: 6, title: "Assistente Administrativo", company: "Digital Solutions SA", location: "Fundão", status: "pending", createdAt: "2024-01-14", applications: 0, reports: 0 },
];

export default function AdminVagas() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Ativa</Badge>;
      case "pending":
        return <Badge variant="secondary">Pendente</Badge>;
      case "reported":
        return <Badge variant="destructive">Denunciada</Badge>;
      case "paused":
        return <Badge variant="outline">Pausada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleApprove = (jobTitle: string) => {
    toast({
      title: "Vaga aprovada",
      description: `"${jobTitle}" foi aprovada e está agora visível.`,
    });
  };

  const handleRemove = (jobTitle: string) => {
    toast({
      title: "Vaga removida",
      description: `"${jobTitle}" foi removida da plataforma.`,
      variant: "destructive",
    });
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
                Gestão de Vagas
              </h1>
              <p className="text-muted-foreground">
                {filteredJobs.length} vagas encontradas
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockJobs.length}</p>
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
                  <p className="text-2xl font-bold">{mockJobs.filter(j => j.status === 'active').length}</p>
                  <p className="text-sm text-muted-foreground">Ativas</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2 rounded-full bg-orange-100">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockJobs.filter(j => j.status === 'pending').length}</p>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2 rounded-full bg-red-100">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockJobs.filter(j => j.status === 'reported').length}</p>
                  <p className="text-sm text-muted-foreground">Denunciadas</p>
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
                    placeholder="Pesquisar por título ou empresa..."
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
                    <SelectItem value="reported">Denunciadas</SelectItem>
                    <SelectItem value="paused">Pausadas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Jobs Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vaga</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Candidaturas</TableHead>
                    <TableHead>Denúncias</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <p className="font-medium">{job.title}</p>
                        <p className="text-sm text-muted-foreground">{job.createdAt}</p>
                      </TableCell>
                      <TableCell>{job.company}</TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>{getStatusBadge(job.status)}</TableCell>
                      <TableCell>{job.applications}</TableCell>
                      <TableCell>
                        {job.reports > 0 ? (
                          <Badge variant="destructive">{job.reports}</Badge>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalhes
                            </DropdownMenuItem>
                            {job.status === "pending" && (
                              <DropdownMenuItem onClick={() => handleApprove(job.title)} className="text-green-600">
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Aprovar
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-orange-600">
                              <Ban className="h-4 w-4 mr-2" />
                              Suspender
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRemove(job.title)} className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remover
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
    </div>
  );
}