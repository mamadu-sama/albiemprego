import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { 
  CreditCard, 
  Package, 
  TrendingUp,
  Euro,
  Users,
  Edit,
  Plus,
  BarChart3,
  Star,
  Zap,
  Crown
} from "lucide-react";

// Mock subscription stats
const subscriptionStats = [
  { label: "Assinantes Ativos", value: "127", icon: Users, color: "text-blue-500", change: "+12 este mês" },
  { label: "Receita Mensal", value: "€4.850", icon: Euro, color: "text-green-500", change: "+18% vs. mês anterior" },
  { label: "Créditos Vendidos", value: "342", icon: Package, color: "text-purple-500", change: "Esta semana" },
  { label: "Taxa Conversão", value: "23%", icon: TrendingUp, color: "text-orange-500", change: "Básico → Pago" },
];

// Mock plans data
const plansData = [
  { id: 'basic', name: 'Básico', price: 0, subscribers: 89, active: true },
  { id: 'professional', name: 'Profissional', price: 49, subscribers: 31, active: true },
  { id: 'premium', name: 'Premium', price: 99, subscribers: 7, active: true },
];

// Mock credit packages
const creditPackagesData = [
  { id: 'featured-5', name: '5 Destaques', price: 15, sold: 156, active: true },
  { id: 'featured-10', name: '10 Destaques', price: 25, sold: 89, active: true },
  { id: 'homepage-3', name: '3 Homepage', price: 30, sold: 45, active: true },
  { id: 'urgent-5', name: '5 Urgente', price: 20, sold: 34, active: true },
  { id: 'mixed-pack', name: 'Pack Completo', price: 50, sold: 18, active: true },
];

// Mock recent transactions
const recentTransactions = [
  { id: "1", company: "TechCorp", type: "Plano Profissional", amount: 49, date: "2024-01-15" },
  { id: "2", company: "InnovaLda", type: "Pack Completo", amount: 50, date: "2024-01-15" },
  { id: "3", company: "DesignPro", type: "5 Destaques", amount: 15, date: "2024-01-14" },
  { id: "4", company: "WebAgency", type: "Plano Premium", amount: 99, date: "2024-01-14" },
  { id: "5", company: "StartupXYZ", type: "3 Homepage", amount: 30, date: "2024-01-13" },
];

export default function AdminGerirPlanos() {
  const { toast } = useToast();
  const [plans, setPlans] = useState(plansData);
  const [creditPackages, setCreditPackages] = useState(creditPackagesData);
  const [editingPlan, setEditingPlan] = useState<typeof plansData[0] | null>(null);

  const handleTogglePlan = (planId: string) => {
    setPlans(prev => prev.map(p => 
      p.id === planId ? { ...p, active: !p.active } : p
    ));
    toast({
      title: "Estado atualizado",
      description: "O estado do plano foi alterado com sucesso.",
    });
  };

  const handleTogglePackage = (packageId: string) => {
    setCreditPackages(prev => prev.map(p => 
      p.id === packageId ? { ...p, active: !p.active } : p
    ));
    toast({
      title: "Estado atualizado",
      description: "O estado do pacote foi alterado com sucesso.",
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <CreditCard className="h-8 w-8 text-primary" />
                Gestão de Planos e Créditos
              </h1>
              <p className="text-muted-foreground">
                Gerir planos de assinatura e pacotes de créditos
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Plano
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Plano</DialogTitle>
                  <DialogDescription>
                    Adicione um novo plano de assinatura à plataforma.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="plan-name">Nome do Plano</Label>
                    <Input id="plan-name" placeholder="Ex: Empresarial" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plan-price">Preço Mensal (€)</Label>
                    <Input id="plan-price" type="number" placeholder="0" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="featured-credits">Créditos Destaque</Label>
                      <Input id="featured-credits" type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="homepage-credits">Créditos Homepage</Label>
                      <Input id="homepage-credits" type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="urgent-credits">Créditos Urgente</Label>
                      <Input id="urgent-credits" type="number" placeholder="0" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => toast({ title: "Plano criado", description: "O novo plano foi criado com sucesso." })}>
                    Criar Plano
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {subscriptionStats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    <span className="text-xs text-muted-foreground">{stat.change}</span>
                  </div>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="plans" className="space-y-6">
            <TabsList className="grid w-full max-w-lg grid-cols-3">
              <TabsTrigger value="plans">Planos</TabsTrigger>
              <TabsTrigger value="credits">Créditos</TabsTrigger>
              <TabsTrigger value="transactions">Transações</TabsTrigger>
            </TabsList>

            {/* Plans Tab */}
            <TabsContent value="plans">
              <Card>
                <CardHeader>
                  <CardTitle>Planos de Assinatura</CardTitle>
                  <CardDescription>Gerir os planos disponíveis para empresas</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Plano</TableHead>
                        <TableHead className="text-center">Preço</TableHead>
                        <TableHead className="text-center">Assinantes</TableHead>
                        <TableHead className="text-center">Estado</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {plans.map((plan) => {
                        const PlanIcon = getPlanIcon(plan.id);
                        return (
                          <TableRow key={plan.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <PlanIcon className="h-4 w-4 text-primary" />
                                </div>
                                <span className="font-medium">{plan.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {plan.price === 0 ? 'Grátis' : `€${plan.price}/mês`}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="secondary">{plan.subscribers}</Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Switch 
                                checked={plan.active}
                                onCheckedChange={() => handleTogglePlan(plan.id)}
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon">
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

            {/* Credits Tab */}
            <TabsContent value="credits">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Pacotes de Créditos</CardTitle>
                    <CardDescription>Gerir pacotes de créditos avulsos</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Pacote
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Criar Novo Pacote</DialogTitle>
                        <DialogDescription>
                          Adicione um novo pacote de créditos.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="pkg-name">Nome do Pacote</Label>
                          <Input id="pkg-name" placeholder="Ex: 20 Destaques" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="pkg-credits">Quantidade</Label>
                            <Input id="pkg-credits" type="number" placeholder="0" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pkg-price">Preço (€)</Label>
                            <Input id="pkg-price" type="number" placeholder="0" />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={() => toast({ title: "Pacote criado", description: "O novo pacote foi criado com sucesso." })}>
                          Criar Pacote
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pacote</TableHead>
                        <TableHead className="text-center">Preço</TableHead>
                        <TableHead className="text-center">Vendidos</TableHead>
                        <TableHead className="text-center">Receita</TableHead>
                        <TableHead className="text-center">Estado</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {creditPackages.map((pkg) => (
                        <TableRow key={pkg.id}>
                          <TableCell className="font-medium">{pkg.name}</TableCell>
                          <TableCell className="text-center">€{pkg.price}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary">{pkg.sold}</Badge>
                          </TableCell>
                          <TableCell className="text-center text-success font-medium">
                            €{pkg.sold * pkg.price}
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch 
                              checked={pkg.active}
                              onCheckedChange={() => handleTogglePackage(pkg.id)}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon">
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
                  <CardDescription>Histórico de pagamentos e compras</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="text-center">Valor</TableHead>
                        <TableHead className="text-right">Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentTransactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="font-medium">{tx.company}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{tx.type}</Badge>
                          </TableCell>
                          <TableCell className="text-center text-success font-medium">
                            €{tx.amount}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {tx.date}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
