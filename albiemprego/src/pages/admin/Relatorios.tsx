import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Building2, 
  Briefcase, 
  FileText,
  Download,
  Calendar,
  MapPin,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";

const monthlyData = [
  { month: "Jul", utilizadores: 180, empresas: 12, vagas: 45, candidaturas: 320 },
  { month: "Ago", utilizadores: 210, empresas: 15, vagas: 52, candidaturas: 380 },
  { month: "Set", utilizadores: 290, empresas: 22, vagas: 68, candidaturas: 520 },
  { month: "Out", utilizadores: 350, empresas: 28, vagas: 75, candidaturas: 680 },
  { month: "Nov", utilizadores: 420, empresas: 35, vagas: 88, candidaturas: 850 },
  { month: "Dez", utilizadores: 480, empresas: 42, vagas: 95, candidaturas: 1020 },
  { month: "Jan", utilizadores: 520, empresas: 48, vagas: 102, candidaturas: 1150 },
];

const categoryData = [
  { name: "Tecnologia", value: 35, color: "#3B82F6" },
  { name: "Comércio", value: 25, color: "#10B981" },
  { name: "Saúde", value: 15, color: "#F59E0B" },
  { name: "Educação", value: 12, color: "#8B5CF6" },
  { name: "Indústria", value: 8, color: "#EF4444" },
  { name: "Outros", value: 5, color: "#6B7280" },
];

const locationData = [
  { location: "Castelo Branco", vagas: 145, candidaturas: 2340 },
  { location: "Covilhã", vagas: 68, candidaturas: 890 },
  { location: "Fundão", vagas: 42, candidaturas: 520 },
  { location: "Idanha-a-Nova", vagas: 18, candidaturas: 180 },
  { location: "Penamacor", vagas: 12, candidaturas: 95 },
  { location: "Vila Velha de Ródão", vagas: 8, candidaturas: 65 },
];

const topCompanies = [
  { name: "TechSolutions SA", vagas: 28, candidaturas: 456 },
  { name: "Castelo Digital", vagas: 22, candidaturas: 380 },
  { name: "InnovaTech Lda", vagas: 18, candidaturas: 312 },
  { name: "WebAgency", vagas: 15, candidaturas: 245 },
  { name: "ContaPlus", vagas: 12, candidaturas: 189 },
];

const kpis = [
  { 
    label: "Total Utilizadores", 
    value: "2,456", 
    change: 12, 
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-50"
  },
  { 
    label: "Empresas Registadas", 
    value: "189", 
    change: 8, 
    icon: Building2,
    color: "text-green-500",
    bgColor: "bg-green-50"
  },
  { 
    label: "Vagas Ativas", 
    value: "342", 
    change: 23, 
    icon: Briefcase,
    color: "text-purple-500",
    bgColor: "bg-purple-50"
  },
  { 
    label: "Candidaturas", 
    value: "5,891", 
    change: -5, 
    icon: FileText,
    color: "text-orange-500",
    bgColor: "bg-orange-50"
  },
];

export default function AdminRelatorios() {
  const [period, setPeriod] = useState("6months");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-8 w-8 text-primary" />
                Relatórios e Analytics
              </h1>
              <p className="text-muted-foreground">
                Análise de desempenho da plataforma
              </p>
            </div>
            <div className="flex gap-2">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-40">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Últimos 7 dias</SelectItem>
                  <SelectItem value="30days">Últimos 30 dias</SelectItem>
                  <SelectItem value="6months">Últimos 6 meses</SelectItem>
                  <SelectItem value="1year">Último ano</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpis.map((kpi) => (
              <Card key={kpi.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{kpi.label}</p>
                      <p className="text-3xl font-bold text-foreground mt-1">{kpi.value}</p>
                      <div className={`flex items-center gap-1 mt-2 text-sm ${kpi.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {kpi.change >= 0 ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        <span>{Math.abs(kpi.change)}% vs mês anterior</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full ${kpi.bgColor} ${kpi.color}`}>
                      <kpi.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Row 1 */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Crescimento da Plataforma</CardTitle>
                <CardDescription>Evolução de utilizadores e empresas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorCompanies" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Area type="monotone" dataKey="utilizadores" stroke="#3B82F6" fillOpacity={1} fill="url(#colorUsers)" name="Utilizadores" />
                      <Area type="monotone" dataKey="empresas" stroke="#10B981" fillOpacity={1} fill="url(#colorCompanies)" name="Empresas" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Categoria</CardTitle>
                <CardDescription>Vagas por setor de atividade</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Location Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Distribuição Geográfica
                </CardTitle>
                <CardDescription>Vagas e candidaturas por localização</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={locationData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" className="text-xs" />
                      <YAxis dataKey="location" type="category" className="text-xs" width={120} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="vagas" fill="#3B82F6" name="Vagas" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Top Companies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Top Empresas
                </CardTitle>
                <CardDescription>Empresas com mais vagas ativas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCompanies.map((company, index) => (
                    <div key={company.name} className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{company.name}</p>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{company.vagas} vagas</span>
                          <span>{company.candidaturas} candidaturas</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">
                          {((company.candidaturas / company.vagas)).toFixed(1)} média
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Candidaturas Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Vagas e Candidaturas</CardTitle>
              <CardDescription>Evolução mensal de vagas publicadas e candidaturas recebidas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="vagas" fill="#8B5CF6" name="Vagas" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="candidaturas" fill="#F59E0B" name="Candidaturas" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
