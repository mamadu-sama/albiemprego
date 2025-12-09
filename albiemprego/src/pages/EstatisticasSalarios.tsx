import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  TrendingUp, 
  BarChart3, 
  Euro, 
  Briefcase,
  MapPin,
  Building2,
  ArrowUp,
  Download,
  FileSpreadsheet,
  FileText,
  Presentation
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart
} from "recharts";
import { mockSalaryStats } from "@/data/mockSalaryStats";
import { exportToCSV, exportToExcel, exportToPowerPoint } from "@/utils/exportData";
import { toast } from "sonner";

const CHART_COLORS = [
  'hsl(221, 83%, 53%)', // primary blue
  'hsl(142, 76%, 36%)', // green
  'hsl(38, 92%, 50%)',  // amber
  'hsl(0, 84%, 60%)',   // red
  'hsl(262, 83%, 58%)', // purple
  'hsl(199, 89%, 48%)', // cyan
];

export default function EstatisticasSalarios() {
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  // Prepare data for charts
  const distributionData = mockSalaryStats.distribution.map(item => ({
    range: item.range,
    vagas: item.count,
    percentage: item.percentage,
  }));

  const trendData = mockSalaryStats.monthlyTrends;
  const sectorData = mockSalaryStats.sectorComparison;

  // Export handlers
  const handleExportCSV = () => {
    const columns = [
      { header: 'Função', key: 'role' },
      { header: 'Salário Médio (€)', key: 'avg' },
      { header: 'Mínimo (€)', key: 'min' },
      { header: 'Máximo (€)', key: 'max' },
      { header: 'Nº Vagas', key: 'count' },
    ];
    exportToCSV(mockSalaryStats.byRole, columns, 'estatisticas-salariais-albiemprego');
    toast.success('Ficheiro CSV exportado com sucesso!');
  };

  const handleExportExcel = () => {
    const columns = [
      { header: 'Função', key: 'role' },
      { header: 'Salário Médio (€)', key: 'avg' },
      { header: 'Mínimo (€)', key: 'min' },
      { header: 'Máximo (€)', key: 'max' },
      { header: 'Nº Vagas', key: 'count' },
    ];
    exportToExcel(mockSalaryStats.byRole, columns, 'estatisticas-salariais-albiemprego');
    toast.success('Ficheiro Excel exportado com sucesso!');
  };

  const handleExportPowerPoint = () => {
    const stats = [
      { label: 'Salário Médio', value: `${mockSalaryStats.overall.average}€` },
      { label: 'Vagas Analisadas', value: String(mockSalaryStats.overall.withSalary) },
      { label: 'Crescimento', value: `+${mockSalaryStats.trends.lastMonth.change}%` },
    ];
    const columns = [
      { header: 'Função', key: 'role' },
      { header: 'Salário Médio', key: 'avg' },
      { header: 'Intervalo', key: 'range' },
      { header: 'Vagas', key: 'count' },
    ];
    const tableData = mockSalaryStats.byRole.map(item => ({
      ...item,
      range: `${item.min}€ - ${item.max}€`,
    }));
    
    exportToPowerPoint(
      'Estatísticas Salariais',
      'Região de Castelo Branco - AlbiEmprego',
      stats,
      tableData,
      columns,
      'apresentacao-salariais-albiemprego'
    );
    toast.success('Apresentação exportada com sucesso!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 via-primary/[0.02] to-background py-16 md:py-24">
          <div className="container-custom text-center">
            <Badge variant="secondary" className="mb-4">
              <BarChart3 className="h-3 w-3 mr-1" />
              Dados Reais do Mercado
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Estatísticas Salariais
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Salários reais de vagas publicadas na região de Castelo Branco.
              Dados atualizados e transparentes para decisões informadas.
            </p>
            
            {/* Export Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Exportar Dados
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuItem onClick={handleExportCSV} className="gap-2 cursor-pointer">
                  <FileText className="h-4 w-4" />
                  Exportar CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportExcel} className="gap-2 cursor-pointer">
                  <FileSpreadsheet className="h-4 w-4" />
                  Exportar Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPowerPoint} className="gap-2 cursor-pointer">
                  <Presentation className="h-4 w-4" />
                  Exportar PowerPoint
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>

        <div className="container-custom py-12">
          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Sector</label>
                  <Select value={selectedSector} onValueChange={setSelectedSector}>
                    <SelectTrigger>
                      <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Todos os sectores" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="it">Tecnologia</SelectItem>
                      <SelectItem value="health">Saúde</SelectItem>
                      <SelectItem value="education">Educação</SelectItem>
                      <SelectItem value="tourism">Turismo</SelectItem>
                      <SelectItem value="commerce">Comércio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Localização</label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Todas as localizações" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="castelo-branco">Castelo Branco</SelectItem>
                      <SelectItem value="covilha">Covilhã</SelectItem>
                      <SelectItem value="fundao">Fundão</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Nível</label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger>
                      <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Todos os níveis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="junior">Júnior</SelectItem>
                      <SelectItem value="mid">Pleno</SelectItem>
                      <SelectItem value="senior">Sénior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Euro className="h-4 w-4" />
                  Salário Médio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{mockSalaryStats.overall.average}€</p>
                <div className="flex items-center gap-1 text-sm text-success mt-1">
                  <ArrowUp className="h-3 w-3" />
                  +{mockSalaryStats.trends.lastMonth.change}% vs. mês anterior
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Intervalo Comum
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">1.200€ - 2.500€</p>
                <p className="text-sm text-muted-foreground mt-1">
                  68% das vagas neste intervalo
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Vagas Analisadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{mockSalaryStats.overall.withSalary}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Com informação salarial
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Salary Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Evolução Salarial Mensal
                </CardTitle>
                <CardDescription>
                  Salário médio ao longo dos últimos 12 meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorAverage" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <YAxis 
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        tickFormatter={(value) => `${value}€`}
                        domain={[1400, 1900]}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        formatter={(value: number) => [`${value}€`, 'Salário Médio']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="average" 
                        stroke="hsl(221, 83%, 53%)" 
                        strokeWidth={2}
                        fill="url(#colorAverage)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Salary by Sector Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Salário Médio por Sector
                </CardTitle>
                <CardDescription>
                  Comparação entre diferentes sectores de atividade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sectorData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        type="number" 
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        tickFormatter={(value) => `${value}€`}
                      />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        width={80}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        formatter={(value: number) => [`${value}€`, 'Salário Médio']}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="hsl(221, 83%, 53%)" 
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Distribution Bar Chart */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Distribuição Salarial
              </CardTitle>
              <CardDescription>
                Percentagem de vagas por faixa salarial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributionData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="range" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number, name: string) => {
                        if (name === 'percentage') return [`${value}%`, 'Percentagem'];
                        return [value, 'Vagas'];
                      }}
                    />
                    <Bar 
                      dataKey="percentage" 
                      fill="hsl(221, 83%, 53%)" 
                      radius={[4, 4, 0, 0]}
                    >
                      {distributionData.map((_, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={index === 2 ? 'hsl(221, 83%, 53%)' : 'hsl(221, 83%, 53%, 0.6)'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Sector Pie Chart and Jobs by Month */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Vagas por Sector
                </CardTitle>
                <CardDescription>
                  Distribuição das vagas publicadas por área de atividade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sectorData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="count"
                        nameKey="name"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={true}
                      >
                        {sectorData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        formatter={(value: number) => [value, 'Vagas']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Jobs Volume Line Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Volume de Vagas Mensal
                </CardTitle>
                <CardDescription>
                  Número de vagas publicadas por mês
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <YAxis 
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        formatter={(value: number) => [value, 'Vagas']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="hsl(142, 76%, 36%)" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(142, 76%, 36%)', strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table by Role */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Salários por Função</CardTitle>
                <CardDescription>
                  Médias salariais das funções mais procuradas
                </CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Exportar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleExportCSV} className="gap-2 cursor-pointer">
                    <FileText className="h-4 w-4" />
                    CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportExcel} className="gap-2 cursor-pointer">
                    <FileSpreadsheet className="h-4 w-4" />
                    Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Função</TableHead>
                    <TableHead className="text-right">Salário Médio</TableHead>
                    <TableHead className="text-right">Intervalo</TableHead>
                    <TableHead className="text-right">Vagas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSalaryStats.byRole.map((item) => (
                    <TableRow key={item.role}>
                      <TableCell className="font-medium">{item.role}</TableCell>
                      <TableCell className="text-right text-primary font-semibold">
                        {item.avg}€/mês
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {item.min}€ - {item.max}€
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">{item.count}</Badge>
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
