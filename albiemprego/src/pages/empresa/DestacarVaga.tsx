import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { 
  Sparkles, 
  Home, 
  AlertTriangle,
  ArrowLeft,
  CreditCard,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock job data
const mockJob = {
  id: "1",
  title: "Frontend Developer",
  company: "TechCorp",
  location: "Castelo Branco"
};

export default function DestacarVaga() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentSubscription, useCredit } = useSubscription();
  
  const [selectedOptions, setSelectedOptions] = useState<{
    featured: boolean;
    homepage: boolean;
    urgent: boolean;
  }>({
    featured: false,
    homepage: false,
    urgent: false
  });

  const credits = currentSubscription?.credits || { featured: 0, homepage: 0, urgent: 0 };

  const handleToggle = (type: 'featured' | 'homepage' | 'urgent') => {
    setSelectedOptions(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleApplyHighlights = () => {
    const applied: string[] = [];
    const failed: string[] = [];

    if (selectedOptions.featured) {
      if (useCredit('featured')) {
        applied.push('Destaque na listagem');
      } else {
        failed.push('Destaque na listagem');
      }
    }

    if (selectedOptions.homepage) {
      if (useCredit('homepage')) {
        applied.push('Destaque na homepage');
      } else {
        failed.push('Destaque na homepage');
      }
    }

    if (selectedOptions.urgent) {
      if (useCredit('urgent')) {
        applied.push('Badge urgente');
      } else {
        failed.push('Badge urgente');
      }
    }

    if (applied.length > 0) {
      toast({
        title: "Destaques aplicados!",
        description: `Aplicados: ${applied.join(', ')}`,
      });
    }

    if (failed.length > 0) {
      toast({
        title: "Créditos insuficientes",
        description: `Sem créditos para: ${failed.join(', ')}. Compre mais créditos.`,
        variant: "destructive"
      });
    }

    if (applied.length > 0) {
      navigate('/empresa/vagas');
    }
  };

  const highlightOptions = [
    {
      id: 'featured',
      icon: Sparkles,
      title: 'Destaque na Listagem',
      description: 'A vaga aparece no topo da lista com badge especial',
      credits: credits.featured,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      selected: selectedOptions.featured
    },
    {
      id: 'homepage',
      icon: Home,
      title: 'Destaque na Homepage',
      description: 'A vaga aparece na secção de vagas em destaque',
      credits: credits.homepage,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      selected: selectedOptions.homepage
    },
    {
      id: 'urgent',
      icon: AlertTriangle,
      title: 'Badge Urgente',
      description: 'Adiciona badge "Urgente" para atrair candidatos',
      credits: credits.urgent,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      selected: selectedOptions.urgent
    }
  ];

  const selectedCount = Object.values(selectedOptions).filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Destacar Vaga
            </h1>
            <p className="text-muted-foreground">
              Escolha as opções de destaque para a vaga: <strong>{mockJob.title}</strong>
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Highlight Options */}
            <div className="lg:col-span-2 space-y-4">
              {highlightOptions.map((option) => {
                const Icon = option.icon;
                const hasCredits = option.credits > 0;

                return (
                  <Card 
                    key={option.id}
                    className={cn(
                      "cursor-pointer transition-all",
                      option.selected && "ring-2 ring-primary border-primary",
                      !hasCredits && "opacity-60"
                    )}
                    onClick={() => hasCredits && handleToggle(option.id as any)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Checkbox 
                          checked={option.selected}
                          disabled={!hasCredits}
                          className="mt-1"
                        />
                        <div className={cn(
                          "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
                          option.bgColor
                        )}>
                          <Icon className={cn("h-6 w-6", option.color)} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-foreground">{option.title}</h3>
                            <Badge variant={hasCredits ? "secondary" : "destructive"}>
                              {option.credits} créditos
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {option.description}
                          </p>
                          {!hasCredits && (
                            <p className="text-sm text-destructive mt-2">
                              Sem créditos disponíveis
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Resumo</CardTitle>
                  <CardDescription>Destaques selecionados para a vaga</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="font-medium text-foreground">{mockJob.title}</p>
                    <p className="text-sm text-muted-foreground">{mockJob.company} • {mockJob.location}</p>
                  </div>

                  {selectedCount > 0 ? (
                    <div className="space-y-2">
                      {selectedOptions.featured && (
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-success" />
                          <span>Destaque na listagem</span>
                        </div>
                      )}
                      {selectedOptions.homepage && (
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-success" />
                          <span>Destaque na homepage</span>
                        </div>
                      )}
                      {selectedOptions.urgent && (
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-success" />
                          <span>Badge urgente</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Selecione pelo menos uma opção
                    </p>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  <Button 
                    className="w-full"
                    disabled={selectedCount === 0}
                    onClick={handleApplyHighlights}
                  >
                    Aplicar Destaques
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/empresa/planos">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Comprar Créditos
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
