import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  Euro, 
  Clock, 
  Building2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText
} from "lucide-react";
import { useState } from "react";

const candidaturas = [
  {
    id: "1",
    jobTitle: "Frontend Developer",
    company: "TechCorp",
    location: "Castelo Branco",
    salary: "1.500€ - 2.000€",
    appliedDate: "2024-01-15",
    status: "in_review",
    timeline: [
      { date: "2024-01-15", status: "applied", message: "Candidatura enviada" },
      { date: "2024-01-16", status: "received", message: "Candidatura recebida pela empresa" },
      { date: "2024-01-18", status: "in_review", message: "CV em análise" },
    ],
  },
  {
    id: "2",
    jobTitle: "Full Stack Developer",
    company: "InnovateTech",
    location: "Covilhã",
    salary: "1.800€ - 2.500€",
    appliedDate: "2024-01-10",
    status: "interview",
    timeline: [
      { date: "2024-01-10", status: "applied", message: "Candidatura enviada" },
      { date: "2024-01-11", status: "received", message: "Candidatura recebida pela empresa" },
      { date: "2024-01-13", status: "in_review", message: "CV em análise" },
      { date: "2024-01-17", status: "interview", message: "Entrevista agendada para 25/01" },
    ],
  },
  {
    id: "3",
    jobTitle: "React Developer",
    company: "DigitalAgency",
    location: "Fundão",
    salary: "1.400€ - 1.800€",
    appliedDate: "2024-01-05",
    status: "rejected",
    timeline: [
      { date: "2024-01-05", status: "applied", message: "Candidatura enviada" },
      { date: "2024-01-06", status: "received", message: "Candidatura recebida pela empresa" },
      { date: "2024-01-08", status: "in_review", message: "CV em análise" },
      { date: "2024-01-12", status: "rejected", message: "Candidatura não selecionada" },
    ],
  },
  {
    id: "4",
    jobTitle: "UI/UX Designer",
    company: "CreativeStudio",
    location: "Castelo Branco",
    salary: "1.200€ - 1.600€",
    appliedDate: "2024-01-03",
    status: "accepted",
    timeline: [
      { date: "2024-01-03", status: "applied", message: "Candidatura enviada" },
      { date: "2024-01-04", status: "received", message: "Candidatura recebida pela empresa" },
      { date: "2024-01-06", status: "in_review", message: "CV em análise" },
      { date: "2024-01-10", status: "interview", message: "Entrevista realizada" },
      { date: "2024-01-15", status: "accepted", message: "Proposta de emprego recebida!" },
    ],
  },
];

const statusConfig = {
  in_review: { label: "Em Análise", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  interview: { label: "Entrevista", color: "bg-blue-100 text-blue-700", icon: AlertCircle },
  rejected: { label: "Não Selecionado", color: "bg-red-100 text-red-700", icon: XCircle },
  accepted: { label: "Aceite", color: "bg-green-100 text-green-700", icon: CheckCircle },
};

function CandidaturaCard({ candidatura }: { candidatura: typeof candidaturas[0] }) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[candidatura.status as keyof typeof statusConfig];
  const StatusIcon = status.icon;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{candidatura.jobTitle}</h3>
                <p className="text-sm text-muted-foreground">{candidatura.company}</p>
              </div>
            </div>
            <Badge className={status.color}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {status.label}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {candidatura.location}
            </span>
            <span className="flex items-center gap-1">
              <Euro className="h-4 w-4" />
              {candidatura.salary}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Candidatura: {new Date(candidatura.appliedDate).toLocaleDateString('pt-PT')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/vagas/${candidatura.id}`}>
                <ExternalLink className="h-4 w-4 mr-1" />
                Ver Vaga
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Ocultar Timeline
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Ver Timeline
                </>
              )}
            </Button>
          </div>
        </div>

        {expanded && (
          <div className="border-t bg-muted/30 p-4">
            <h4 className="text-sm font-medium mb-3">Histórico da Candidatura</h4>
            <div className="space-y-3">
              {candidatura.timeline.map((event, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      index === candidatura.timeline.length - 1 ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`} />
                    {index < candidatura.timeline.length - 1 && (
                      <div className="w-0.5 h-full bg-muted-foreground/30 my-1" />
                    )}
                  </div>
                  <div className="pb-3">
                    <p className="text-sm text-foreground">{event.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.date).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Candidaturas() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredCandidaturas = candidaturas.filter(c => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return c.status === "in_review" || c.status === "interview";
    if (activeTab === "rejected") return c.status === "rejected";
    if (activeTab === "accepted") return c.status === "accepted";
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              As Minhas Candidaturas
            </h1>
            <p className="text-muted-foreground">
              Acompanhe o estado das suas candidaturas.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">
                Todas ({candidaturas.length})
              </TabsTrigger>
              <TabsTrigger value="active">
                Ativas ({candidaturas.filter(c => c.status === "in_review" || c.status === "interview").length})
              </TabsTrigger>
              <TabsTrigger value="accepted">
                Aceites ({candidaturas.filter(c => c.status === "accepted").length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejeitadas ({candidaturas.filter(c => c.status === "rejected").length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4">
            {filteredCandidaturas.length > 0 ? (
              filteredCandidaturas.map((candidatura) => (
                <CandidaturaCard key={candidatura.id} candidatura={candidatura} />
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Nenhuma candidatura encontrada
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Não tem candidaturas nesta categoria.
                  </p>
                  <Button asChild>
                    <Link to="/vagas">Explorar Vagas</Link>
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
