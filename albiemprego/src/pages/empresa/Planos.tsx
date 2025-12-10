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
  AlertTriangle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function EmpresaPlanos() {
  const { toast } = useToast();
  const { plans, creditPackages, currentSubscription } = useSubscription();

  const handleSubscribe = (planId: string) => {
    toast({
      title: "Contacte o Administrador",
      description: "Para alterar o seu plano, por favor contacte o administrador da plataforma.",
      variant: "default",
    });
  };

  const handlePurchaseCredits = (packageId: string) => {
    toast({
      title: "Contacte o Administrador",
      description: "Para comprar créditos, por favor contacte o administrador da plataforma.",
      variant: "default",
    });
  };

  const getPlanIcon = (planName: string) => {
    if (planName.toLowerCase().includes('premium')) return Crown;
    if (planName.toLowerCase().includes('profissional')) return Zap;
    return Star;
  };

  if (!plans || !creditPackages) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">A carregar planos...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
                      {currentSubscription.status === 'active' ? 'Ativo' : currentSubscription.status === 'cancelled' ? 'Cancelado' : 'Expirado'}
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

          {/* Tabs */}
          <Tabs defaultValue="plans" className="space-y-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="plans">
                <CreditCard className="h-4 w-4 mr-2" />
                Planos
              </TabsTrigger>
              <TabsTrigger value="credits">
                <Package className="h-4 w-4 mr-2" />
                Créditos Avulsos
              </TabsTrigger>
            </TabsList>

            {/* Plans Tab */}
            <TabsContent value="plans">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan: any) => {
                  const PlanIcon = getPlanIcon(plan.name);
                  const isCurrentPlan = currentSubscription?.planName === plan.name;
                  const features = Array.isArray(plan.features) ? plan.features : [];

                  return (
                    <Card 
                      key={plan.id}
                      className={cn(
                        "relative flex flex-col",
                        plan.isPopular && "border-primary shadow-lg",
                        isCurrentPlan && "border-2 border-primary"
                      )}
                    >
                      {plan.isPopular && (
                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                          Mais Popular
                        </Badge>
                      )}
                      {isCurrentPlan && (
                        <Badge variant="secondary" className="absolute -top-3 right-4">
                          Plano Atual
                        </Badge>
                      )}
                      
                      <CardHeader className="text-center pb-4">
                        <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                          <PlanIcon className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                        <div className="mt-4">
                          <span className="text-4xl font-bold">€{plan.price}</span>
                          <span className="text-muted-foreground">/mês</span>
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1 space-y-4">
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-muted-foreground">Características:</p>
                          <ul className="space-y-2">
                            {features.map((feature: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-4 border-t">
                          <p className="text-sm font-semibold text-muted-foreground mb-2">Créditos Mensais:</p>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="p-2 bg-primary/5 rounded">
                              <p className="text-lg font-bold text-primary">{plan.featuredCreditsMonthly}</p>
                              <p className="text-xs text-muted-foreground">Destaque</p>
                            </div>
                            <div className="p-2 bg-accent/5 rounded">
                              <p className="text-lg font-bold text-accent">{plan.homepageCreditsMonthly}</p>
                              <p className="text-xs text-muted-foreground">Homepage</p>
                            </div>
                            <div className="p-2 bg-destructive/5 rounded">
                              <p className="text-lg font-bold text-destructive">{plan.urgentCreditsMonthly}</p>
                              <p className="text-xs text-muted-foreground">Urgente</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter>
                        <Button 
                          className="w-full" 
                          variant={isCurrentPlan ? "outline" : plan.isPopular ? "default" : "secondary"}
                          onClick={() => handleSubscribe(plan.id)}
                          disabled={isCurrentPlan}
                        >
                          {isCurrentPlan ? "Plano Atual" : "Escolher Plano"}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>

              <Card className="mt-8 bg-muted/50">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground text-center">
                    <strong>Nota:</strong> Para alterar o seu plano, por favor contacte o administrador da plataforma.
                    A integração com pagamentos estará disponível em breve.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Credit Packages Tab */}
            <TabsContent value="credits">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {creditPackages.map((pkg: any) => {
                  const hasFeature = pkg.featuredCredits > 0;
                  const hasHome = pkg.homepageCredits > 0;
                  const hasUrgent = pkg.urgentCredits > 0;

                  return (
                    <Card key={pkg.id} className="flex flex-col">
                      <CardHeader className="text-center">
                        <div className="mx-auto mb-2 p-2 bg-primary/10 rounded-full w-fit">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{pkg.name}</CardTitle>
                        <CardDescription className="text-sm">{pkg.description}</CardDescription>
                        <div className="mt-2">
                          <span className="text-3xl font-bold">€{pkg.price}</span>
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1 space-y-3">
                        {hasFeature && (
                          <div className="flex items-center gap-2 p-2 bg-primary/5 rounded">
                            <Sparkles className="h-5 w-5 text-primary" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold">Destaques</p>
                              <p className="text-xs text-muted-foreground">{pkg.featuredCredits} créditos</p>
                            </div>
                          </div>
                        )}
                        
                        {hasHome && (
                          <div className="flex items-center gap-2 p-2 bg-accent/5 rounded">
                            <Home className="h-5 w-5 text-accent" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold">Homepage</p>
                              <p className="text-xs text-muted-foreground">{pkg.homepageCredits} créditos</p>
                            </div>
                          </div>
                        )}
                        
                        {hasUrgent && (
                          <div className="flex items-center gap-2 p-2 bg-destructive/5 rounded">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold">Urgente</p>
                              <p className="text-xs text-muted-foreground">{pkg.urgentCredits} créditos</p>
                            </div>
                          </div>
                        )}

                        <div className="pt-2 text-center text-xs text-muted-foreground">
                          Validade: {pkg.creditDuration === 'DAYS_7' ? '7 dias' : pkg.creditDuration === 'DAYS_14' ? '14 dias' : '30 dias'}
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

              <Card className="mt-8 bg-muted/50">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground text-center">
                    <strong>Nota:</strong> Para comprar créditos avulsos, por favor contacte o administrador da plataforma.
                    A integração com pagamentos estará disponível em breve.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
