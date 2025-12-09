import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { 
  Check, 
  Star, 
  Zap, 
  Crown,
  CreditCard,
  Package,
  Sparkles,
  Home,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function EmpresaPlanos() {
  const { toast } = useToast();
  const { plans, creditPackages, currentSubscription, subscribeToPlan, purchaseCredits } = useSubscription();

  const handleSubscribe = (planId: string) => {
    subscribeToPlan(planId);
    toast({
      title: "Plano ativado!",
      description: "O seu novo plano foi ativado com sucesso.",
    });
  };

  const handlePurchaseCredits = (packageId: string) => {
    purchaseCredits(packageId);
    toast({
      title: "Créditos adicionados!",
      description: "Os créditos foram adicionados à sua conta.",
    });
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'basic': return Star;
      case 'professional': return Zap;
      case 'premium': return Crown;
      default: return Star;
    }
  };

  const getCreditIcon = (type: string) => {
    switch (type) {
      case 'featured': return Sparkles;
      case 'homepage': return Home;
      case 'urgent': return AlertTriangle;
      case 'mixed': return Package;
      default: return Package;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Planos e Créditos
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Escolha o plano ideal para a sua empresa ou compre créditos avulsos para destacar as suas vagas.
            </p>
          </div>

          {/* Current Plan Summary */}
          {currentSubscription && (
            <Card className="mb-8 border-primary/30 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Plano Atual</p>
                    <p className="text-xl font-bold text-foreground">{currentSubscription.planName}</p>
                    <Badge variant={currentSubscription.status === 'active' ? 'default' : 'secondary'}>
                      {currentSubscription.status === 'active' ? 'Ativo' : 'Cancelado'}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="text-center px-4 py-2 bg-background rounded-lg">
                      <p className="text-2xl font-bold text-primary">{currentSubscription.credits.featured}</p>
                      <p className="text-xs text-muted-foreground">Destaques</p>
                    </div>
                    <div className="text-center px-4 py-2 bg-background rounded-lg">
                      <p className="text-2xl font-bold text-accent">{currentSubscription.credits.homepage}</p>
                      <p className="text-xs text-muted-foreground">Homepage</p>
                    </div>
                    <div className="text-center px-4 py-2 bg-background rounded-lg">
                      <p className="text-2xl font-bold text-destructive">{currentSubscription.credits.urgent}</p>
                      <p className="text-xs text-muted-foreground">Urgente</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="plans" className="space-y-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="plans" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Planos Mensais
              </TabsTrigger>
              <TabsTrigger value="credits" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Créditos Avulsos
              </TabsTrigger>
            </TabsList>

            {/* Plans Tab */}
            <TabsContent value="plans">
              <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan) => {
                  const PlanIcon = getPlanIcon(plan.id);
                  const isCurrentPlan = currentSubscription?.planId === plan.id;

                  return (
                    <Card 
                      key={plan.id}
                      className={cn(
                        "relative flex flex-col",
                        plan.isPopular && "border-primary shadow-lg scale-105",
                        isCurrentPlan && "ring-2 ring-primary"
                      )}
                    >
                      {plan.isPopular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-primary text-primary-foreground">
                            Mais Popular
                          </Badge>
                        </div>
                      )}

                      <CardHeader className="text-center pb-2">
                        <div className={cn(
                          "mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4",
                          plan.id === 'basic' && "bg-muted",
                          plan.id === 'professional' && "bg-primary/10",
                          plan.id === 'premium' && "bg-accent/10"
                        )}>
                          <PlanIcon className={cn(
                            "h-6 w-6",
                            plan.id === 'basic' && "text-muted-foreground",
                            plan.id === 'professional' && "text-primary",
                            plan.id === 'premium' && "text-accent"
                          )} />
                        </div>
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription>
                          <span className="text-3xl font-bold text-foreground">
                            {plan.price === 0 ? 'Grátis' : `€${plan.price}`}
                          </span>
                          {plan.price > 0 && (
                            <span className="text-muted-foreground">/mês</span>
                          )}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="flex-1">
                        <ul className="space-y-3">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>

                      <CardFooter>
                        <Button 
                          className="w-full"
                          variant={isCurrentPlan ? "outline" : plan.isPopular ? "default" : "secondary"}
                          disabled={isCurrentPlan}
                          onClick={() => handleSubscribe(plan.id)}
                        >
                          {isCurrentPlan ? 'Plano Atual' : 'Escolher Plano'}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Credits Tab */}
            <TabsContent value="credits">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {creditPackages.map((pkg) => {
                  const CreditIcon = getCreditIcon(pkg.type);

                  return (
                    <Card key={pkg.id} className="flex flex-col">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            pkg.type === 'featured' && "bg-primary/10",
                            pkg.type === 'homepage' && "bg-accent/10",
                            pkg.type === 'urgent' && "bg-destructive/10",
                            pkg.type === 'mixed' && "bg-muted"
                          )}>
                            <CreditIcon className={cn(
                              "h-5 w-5",
                              pkg.type === 'featured' && "text-primary",
                              pkg.type === 'homepage' && "text-accent",
                              pkg.type === 'urgent' && "text-destructive",
                              pkg.type === 'mixed' && "text-foreground"
                            )} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{pkg.name}</CardTitle>
                            <CardDescription>{pkg.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold text-foreground">€{pkg.price}</span>
                          {pkg.type !== 'mixed' && (
                            <span className="text-sm text-muted-foreground">
                              (€{(pkg.price / pkg.credits).toFixed(2)}/crédito)
                            </span>
                          )}
                        </div>
                      </CardContent>

                      <CardFooter>
                        <Button 
                          className="w-full"
                          variant="outline"
                          onClick={() => handlePurchaseCredits(pkg.id)}
                        >
                          Comprar
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">
              Perguntas Frequentes
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">O que é um destaque na listagem?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    As vagas destacadas aparecem no topo da lista de vagas com um badge especial, 
                    aumentando a visibilidade até 3x mais candidaturas.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">O que é um destaque na homepage?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    A vaga aparece na secção "Vagas em Destaque" na página inicial, 
                    visível para todos os visitantes do site.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">O que é o badge urgente?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    O badge "Urgente" indica que a vaga precisa ser preenchida rapidamente, 
                    atraindo candidatos que procuram oportunidades imediatas.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Os créditos expiram?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Os créditos do plano são renovados mensalmente. 
                    Créditos avulsos não expiram e podem ser utilizados a qualquer momento.
                  </p>
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
