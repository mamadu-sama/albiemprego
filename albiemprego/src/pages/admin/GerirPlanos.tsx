import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { adminPlanApi, adminCreditPackageApi, adminSubscriptionApi } from "@/lib/api";
import { 
  CreditCard, 
  Package, 
  TrendingUp,
  Euro,
  Users,
  Edit,
  Plus,
  BarChart3,
  Loader2
} from "lucide-react";

export default function AdminGerirPlanos() {
  const { toast } = useToast();

  // Buscar estatísticas
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['adminStats'],
    queryFn: () => adminSubscriptionApi.getStats(),
  });

  // Buscar planos
  const { data: plans = [], isLoading: loadingPlans } = useQuery({
    queryKey: ['adminPlans'],
    queryFn: () => adminPlanApi.listPlans(true), // incluir inativos
  });

  // Buscar pacotes
  const { data: creditPackages = [], isLoading: loadingPackages } = useQuery({
    queryKey: ['adminPackages'],
    queryFn: () => adminCreditPackageApi.listPackages(true), // incluir inativos
  });

  // Buscar transações
  const { data: transactions = [], isLoading: loadingTransactions } = useQuery({
    queryKey: ['adminTransactions'],
    queryFn: () => adminSubscriptionApi.listTransactions(),
  });

  const subscriptionStats = stats ? [
    { 
      label: "Assinantes Ativos", 
      value: stats.activeSubscribers.toString(), 
      icon: Users, 
      color: "text-blue-500", 
      change: `${stats.totalCompanies} empresas total` 
    },
    { 
      label: "Receita Mensal", 
      value: `€${stats.monthlyRevenue.toFixed(2)}`, 
      icon: Euro, 
      color: "text-green-500", 
      change: `€${stats.totalRevenue.toFixed(2)} total` 
    },
    { 
      label: "Créditos Vendidos", 
      value: stats.creditPackagesSold.toString(), 
      icon: Package, 
      color: "text-purple-500", 
      change: "Pacotes totais" 
    },
    { 
      label: "Taxa Conversão", 
      value: stats.conversionRate, 
      icon: TrendingUp, 
      color: "text-orange-500", 
      change: "Básico → Pago" 
    },
  ] : [];

  if (loadingStats || loadingPlans || loadingPackages) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">A carregar dados...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerir Planos e Créditos</h1>
            <p className="text-gray-600 mt-2">
              Configure planos de assinatura, pacotes de créditos e visualize estatísticas
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subscriptionStats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </CardTitle>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="plans" className="space-y-6">
            <TabsList>
              <TabsTrigger value="plans" className="gap-2">
                <CreditCard className="h-4 w-4" />
                Planos de Assinatura
              </TabsTrigger>
              <TabsTrigger value="packages" className="gap-2">
                <Package className="h-4 w-4" />
                Pacotes de Créditos
              </TabsTrigger>
              <TabsTrigger value="transactions" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Transações
              </TabsTrigger>
            </TabsList>

            {/* Plans Tab */}
            <TabsContent value="plans">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Planos de Assinatura</CardTitle>
                      <CardDescription>
                        Gerir planos disponíveis para empresas
                      </CardDescription>
                    </div>
                    <Button onClick={() => toast({ title: "Em breve", description: "Funcionalidade de criar plano em desenvolvimento" })}>
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Plano
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Preço/Mês</TableHead>
                        <TableHead>Vagas Máx.</TableHead>
                        <TableHead>Créditos Mensais</TableHead>
                        <TableHead>Assinantes</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {plans.map((plan) => {
                        const planStats = stats?.subscriptionsByPlan.find(s => s.planId === plan.id);
                        return (
                          <TableRow key={plan.id}>
                            <TableCell className="font-medium">
                              {plan.name}
                              {plan.isPopular && (
                                <Badge variant="secondary" className="ml-2">Popular</Badge>
                              )}
                            </TableCell>
                            <TableCell>€{plan.price}</TableCell>
                            <TableCell>{plan.maxJobs === -1 ? 'Ilimitado' : plan.maxJobs}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {plan.featuredCreditsMonthly}F / {plan.homepageCreditsMonthly}H / {plan.urgentCreditsMonthly}U
                              </div>
                            </TableCell>
                            <TableCell>{planStats?.count || 0}</TableCell>
                            <TableCell>
                              {plan.isActive ? (
                                <Badge variant="default">Ativo</Badge>
                              ) : (
                                <Badge variant="secondary">Inativo</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => toast({ title: "Em breve", description: "Edição de planos em desenvolvimento" })}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Credit Packages Tab */}
            <TabsContent value="packages">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Pacotes de Créditos</CardTitle>
                      <CardDescription>
                        Gerir pacotes de créditos avulsos
                      </CardDescription>
                    </div>
                    <Button onClick={() => toast({ title: "Em breve", description: "Funcionalidade de criar pacote em desenvolvimento" })}>
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Pacote
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Créditos</TableHead>
                        <TableHead>Duração</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {creditPackages.map((pkg) => (
                        <TableRow key={pkg.id}>
                          <TableCell className="font-medium">{pkg.name}</TableCell>
                          <TableCell>€{pkg.price}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {pkg.featuredCredits}F / {pkg.homepageCredits}H / {pkg.urgentCredits}U
                            </div>
                          </TableCell>
                          <TableCell>
                            {pkg.creditDuration === 'DAYS_7' && '7 dias'}
                            {pkg.creditDuration === 'DAYS_14' && '14 dias'}
                            {pkg.creditDuration === 'DAYS_30' && '30 dias'}
                          </TableCell>
                          <TableCell>
                            {pkg.isActive ? (
                              <Badge variant="default">Ativo</Badge>
                            ) : (
                              <Badge variant="secondary">Inativo</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => toast({ title: "Em breve", description: "Edição de pacotes em desenvolvimento" })}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle>Transações Recentes</CardTitle>
                  <CardDescription>
                    Histórico de compras e atribuições
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingTransactions ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : transactions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Nenhuma transação registada
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Empresa</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                          <TableHead>Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              {new Date(transaction.createdAt).toLocaleDateString('pt-PT')}
                            </TableCell>
                            <TableCell className="font-medium">
                              {transaction.company?.name || 'N/A'}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {transaction.type.replace(/_/g, ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {transaction.description}
                            </TableCell>
                            <TableCell className="text-right">
                              €{Number(transaction.amount).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              {transaction.status === 'COMPLETED' && (
                                <Badge variant="default">Concluída</Badge>
                              )}
                              {transaction.status === 'PENDING' && (
                                <Badge variant="secondary">Pendente</Badge>
                              )}
                              {transaction.status === 'FAILED' && (
                                <Badge variant="destructive">Falhada</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
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
