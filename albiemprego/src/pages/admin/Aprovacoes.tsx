import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { 
  Clock, 
  Search, 
  Eye, 
  CheckCircle2, 
  Ban, 
  Building2,
  Briefcase,
  Calendar,
  MapPin,
  Mail,
  Phone,
  ExternalLink
} from "lucide-react";

interface PendingItem {
  id: number;
  type: "empresa" | "vaga";
  name: string;
  description: string;
  submittedBy: string;
  submittedAt: string;
  details: Record<string, string>;
}

const mockPendingItems: PendingItem[] = [
  { 
    id: 1, 
    type: "empresa", 
    name: "InnovaTech Lda", 
    description: "Empresa de desenvolvimento de software focada em soluções de IA.",
    submittedBy: "Carlos Mendes",
    submittedAt: "2024-01-15 10:30",
    details: {
      email: "info@innovatech.pt",
      telefone: "+351 275 123 456",
      localizacao: "Castelo Branco",
      nif: "509876543"
    }
  },
  { 
    id: 2, 
    type: "vaga", 
    name: "Marketing Manager", 
    description: "Procuramos gestor de marketing digital com experiência em redes sociais.",
    submittedBy: "TechSolutions SA",
    submittedAt: "2024-01-15 09:15",
    details: {
      empresa: "TechSolutions SA",
      localizacao: "Fundão",
      tipoContrato: "Tempo Inteiro",
      salario: "1800€ - 2500€"
    }
  },
  { 
    id: 3, 
    type: "empresa", 
    name: "Digital Solutions SA", 
    description: "Consultoria em transformação digital para PMEs.",
    submittedBy: "Ana Rodrigues",
    submittedAt: "2024-01-14 16:45",
    details: {
      email: "geral@digitalsolutions.pt",
      telefone: "+351 275 987 654",
      localizacao: "Covilhã",
      nif: "508765432"
    }
  },
  { 
    id: 4, 
    type: "vaga", 
    name: "Frontend Developer", 
    description: "Desenvolvimento de aplicações web com React e TypeScript.",
    submittedBy: "WebAgency Lda",
    submittedAt: "2024-01-14 14:20",
    details: {
      empresa: "WebAgency Lda",
      localizacao: "Castelo Branco",
      tipoContrato: "Tempo Inteiro",
      salario: "1500€ - 2000€"
    }
  },
  { 
    id: 5, 
    type: "vaga", 
    name: "Contabilista Certificado", 
    description: "Gestão contabilística e fiscal de carteira de clientes.",
    submittedBy: "ContaPlus Lda",
    submittedAt: "2024-01-13 11:00",
    details: {
      empresa: "ContaPlus Lda",
      localizacao: "Idanha-a-Nova",
      tipoContrato: "Tempo Inteiro",
      salario: "1200€ - 1600€"
    }
  },
];

export default function AdminAprovacoes() {
  const { toast } = useToast();
  const [items, setItems] = useState(mockPendingItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || item.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleApprove = (id: number) => {
    const item = items.find(i => i.id === id);
    setItems(prev => prev.filter(i => i.id !== id));
    toast({
      title: "Aprovado com sucesso",
      description: `${item?.type === "empresa" ? "A empresa" : "A vaga"} "${item?.name}" foi aprovada e está agora visível.`,
    });
  };

  const handleReject = (id: number) => {
    const item = items.find(i => i.id === id);
    setItems(prev => prev.filter(i => i.id !== id));
    toast({
      title: "Rejeitado",
      description: `${item?.type === "empresa" ? "A empresa" : "A vaga"} "${item?.name}" foi rejeitada.`,
      variant: "destructive",
    });
  };

  const empresasCount = items.filter(i => i.type === "empresa").length;
  const vagasCount = items.filter(i => i.type === "vaga").length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Clock className="h-8 w-8 text-primary" />
                Aprovações Pendentes
              </h1>
              <p className="text-muted-foreground">
                Rever e aprovar novos registos na plataforma
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-sm px-3 py-1">
                <Building2 className="h-3 w-3 mr-1" />
                {empresasCount} Empresas
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">
                <Briefcase className="h-3 w-3 mr-1" />
                {vagasCount} Vagas
              </Badge>
            </div>
          </div>

          {/* Tabs & Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
                  <TabsList>
                    <TabsTrigger value="all">Todos ({items.length})</TabsTrigger>
                    <TabsTrigger value="empresa">Empresas ({empresasCount})</TabsTrigger>
                    <TabsTrigger value="vaga">Vagas ({vagasCount})</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Items List */}
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Item Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 rounded-full bg-primary/10 text-primary">
                        {item.type === "empresa" ? (
                          <Building2 className="h-6 w-6" />
                        ) : (
                          <Briefcase className="h-6 w-6" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
                          <Badge variant="outline">
                            {item.type === "empresa" ? "Empresa" : "Vaga"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          {item.description}
                        </p>
                        
                        {/* Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          {Object.entries(item.details).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-2">
                              {key === "email" && <Mail className="h-4 w-4 text-muted-foreground" />}
                              {key === "telefone" && <Phone className="h-4 w-4 text-muted-foreground" />}
                              {key === "localizacao" && <MapPin className="h-4 w-4 text-muted-foreground" />}
                              {key === "empresa" && <Building2 className="h-4 w-4 text-muted-foreground" />}
                              {key === "tipoContrato" && <Briefcase className="h-4 w-4 text-muted-foreground" />}
                              <span className="text-muted-foreground">{value}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                          <span>Submetido por: <strong>{item.submittedBy}</strong></span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {item.submittedAt}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 lg:flex-col">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1 lg:flex-none"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 lg:flex-none bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(item.id)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Aprovar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        className="flex-1 lg:flex-none"
                        onClick={() => handleReject(item.id)}
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        Rejeitar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredItems.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-4" />
                  <h3 className="text-lg font-medium text-foreground">Tudo em dia!</h3>
                  <p className="text-muted-foreground">Não existem itens pendentes de aprovação.</p>
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
