import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Search, 
  MoreHorizontal,
  Calendar,
  MapPin,
  Euro,
  Edit,
  Trash2,
  Send,
  FileText
} from "lucide-react";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const rascunhosData = [
  {
    id: "d1",
    title: "Full Stack Developer",
    location: "Castelo Branco",
    salary: "2.000€ - 2.800€",
    createdAt: "2024-01-18",
    lastModified: "2024-01-19",
    completeness: 85,
  },
  {
    id: "d2",
    title: "Marketing Manager",
    location: "Covilhã",
    salary: "",
    createdAt: "2024-01-15",
    lastModified: "2024-01-15",
    completeness: 40,
  },
  {
    id: "d3",
    title: "Data Analyst",
    location: "Remoto",
    salary: "1.800€ - 2.200€",
    createdAt: "2024-01-10",
    lastModified: "2024-01-12",
    completeness: 70,
  },
  {
    id: "d4",
    title: "",
    location: "",
    salary: "",
    createdAt: "2024-01-08",
    lastModified: "2024-01-08",
    completeness: 10,
  },
];

export default function Rascunhos() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [rascunhos, setRascunhos] = useState(rascunhosData);

  const filteredRascunhos = rascunhos.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePublish = (id: string) => {
    const rascunho = rascunhos.find(r => r.id === id);
    if (rascunho && rascunho.completeness < 80) {
      toast({
        title: "Vaga incompleta",
        description: "Complete pelo menos 80% da vaga antes de publicar.",
        variant: "destructive",
      });
      return;
    }
    
    setRascunhos(prev => prev.filter(r => r.id !== id));
    toast({
      title: "Vaga publicada",
      description: "A sua vaga está agora ativa e visível para candidatos.",
    });
  };

  const handleDelete = (id: string) => {
    setRascunhos(prev => prev.filter(r => r.id !== id));
    toast({
      title: "Rascunho eliminado",
      description: "O rascunho foi eliminado permanentemente.",
    });
  };

  const getCompletenessColor = (completeness: number) => {
    if (completeness >= 80) return "bg-green-100 text-green-700";
    if (completeness >= 50) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Rascunhos
              </h1>
              <p className="text-muted-foreground">
                Vagas em preparação que ainda não foram publicadas.
              </p>
            </div>
            <Button asChild>
              <Link to="/empresa/vagas/nova">
                <Plus className="h-4 w-4 mr-2" />
                Nova Vaga
              </Link>
            </Button>
          </div>

          {/* Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar rascunhos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Rascunhos List */}
          <div className="space-y-4">
            {filteredRascunhos.length > 0 ? (
              filteredRascunhos.map((rascunho) => (
                <Card key={rascunho.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {rascunho.title || "Sem título"}
                          </h3>
                          <Badge className={getCompletenessColor(rascunho.completeness)}>
                            {rascunho.completeness}% completo
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          {rascunho.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {rascunho.location}
                            </span>
                          )}
                          {rascunho.salary && (
                            <span className="flex items-center gap-1">
                              <Euro className="h-4 w-4" />
                              {rascunho.salary}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Modificado: {new Date(rascunho.lastModified).toLocaleDateString('pt-PT')}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handlePublish(rascunho.id)}
                          disabled={rascunho.completeness < 80}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Publicar
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/empresa/vagas/${rascunho.id}/editar`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Continuar
                          </Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/empresa/vagas/${rascunho.id}/editar`} className="flex items-center">
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/empresa/vagas/${rascunho.id}/preview`} className="flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                Pré-visualizar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Eliminar
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Eliminar rascunho?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta ação não pode ser revertida. O rascunho será eliminado permanentemente.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(rascunho.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all ${
                                rascunho.completeness >= 80 ? 'bg-green-500' :
                                rascunho.completeness >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${rascunho.completeness}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {rascunho.completeness >= 80 
                            ? "Pronto para publicar" 
                            : "Complete mais informações"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Sem rascunhos
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Não tem nenhuma vaga em rascunho.
                  </p>
                  <Button asChild>
                    <Link to="/empresa/vagas/nova">
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Nova Vaga
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}