// Mock salary statistics data for the regional market
export const mockSalaryStats = {
  overall: {
    average: 1750,
    median: 1650,
    min: 800,
    max: 4500,
    totalJobs: 347,
    withSalary: 278,
    percentageWithSalary: 80
  },
  
  distribution: [
    { range: '< 1.000€', count: 28, percentage: 8 },
    { range: '1.000€ - 1.500€', count: 87, percentage: 25 },
    { range: '1.500€ - 2.000€', count: 122, percentage: 35 },
    { range: '2.000€ - 2.500€', count: 69, percentage: 20 },
    { range: '2.500€ - 3.000€', count: 28, percentage: 8 },
    { range: '> 3.000€', count: 14, percentage: 4 },
  ],
  
  byRole: [
    { role: 'Desenvolvedor Full-Stack', avg: 2100, min: 1500, max: 2800, count: 23 },
    { role: 'Enfermeiro/a', avg: 1450, min: 1200, max: 1800, count: 18 },
    { role: 'Professor/a', avg: 1600, min: 1300, max: 2000, count: 15 },
    { role: 'Técnico de Turismo', avg: 1100, min: 900, max: 1400, count: 12 },
    { role: 'Gestor de Projeto', avg: 2400, min: 2000, max: 3000, count: 8 },
    { role: 'Designer Gráfico', avg: 1350, min: 1000, max: 1800, count: 10 },
    { role: 'Técnico de Contabilidade', avg: 1400, min: 1100, max: 1700, count: 14 },
    { role: 'Assistente Administrativo', avg: 1100, min: 900, max: 1300, count: 22 },
  ],
  
  bySector: {
    'it': { avg: 2200, count: 45, label: 'Tecnologia' },
    'health': { avg: 1500, count: 38, label: 'Saúde' },
    'education': { avg: 1600, count: 32, label: 'Educação' },
    'tourism': { avg: 1100, count: 28, label: 'Turismo' },
    'industry': { avg: 1400, count: 25, label: 'Indústria' },
    'commerce': { avg: 1200, count: 35, label: 'Comércio' },
  },
  
  trends: {
    lastMonth: { average: 1665, change: +5.1 },
    last3Months: { average: 1620, change: +8.0 },
  },

  // Monthly trend data for charts
  monthlyTrends: [
    { month: 'Jan', average: 1580, count: 42 },
    { month: 'Fev', average: 1620, count: 38 },
    { month: 'Mar', average: 1650, count: 45 },
    { month: 'Abr', average: 1680, count: 52 },
    { month: 'Mai', average: 1700, count: 48 },
    { month: 'Jun', average: 1720, count: 55 },
    { month: 'Jul', average: 1690, count: 41 },
    { month: 'Ago', average: 1710, count: 35 },
    { month: 'Set', average: 1740, count: 58 },
    { month: 'Out', average: 1760, count: 62 },
    { month: 'Nov', average: 1780, count: 54 },
    { month: 'Dez', average: 1750, count: 47 },
  ],

  // Sector comparison for pie/bar charts
  sectorComparison: [
    { name: 'Tecnologia', value: 2200, count: 45 },
    { name: 'Saúde', value: 1500, count: 38 },
    { name: 'Educação', value: 1600, count: 32 },
    { name: 'Turismo', value: 1100, count: 28 },
    { name: 'Indústria', value: 1400, count: 25 },
    { name: 'Comércio', value: 1200, count: 35 },
  ],

  marketAverages: {
    'desenvolvedor': 2100,
    'enfermeiro': 1450,
    'professor': 1600,
    'designer': 1350,
    'contabilista': 1400,
    'administrativo': 1100,
    'gestor': 2400,
    'técnico': 1300,
    'default': 1750
  }
};

// Helper function to get market average based on job title
export function getMarketAverage(jobTitle: string): number {
  const title = jobTitle.toLowerCase();
  
  for (const [key, value] of Object.entries(mockSalaryStats.marketAverages)) {
    if (title.includes(key)) {
      return value;
    }
  }
  
  return mockSalaryStats.marketAverages.default;
}

// Helper function to get salary comparison text
export function getSalaryComparison(offered: number, market: number): { text: string; variant: 'success' | 'warning' | 'neutral' } {
  const diff = ((offered - market) / market) * 100;
  
  if (diff > 10) {
    return { text: `✅ ${Math.round(diff)}% acima da média`, variant: 'success' };
  }
  if (diff > 0) {
    return { text: `✓ ligeiramente acima da média`, variant: 'success' };
  }
  if (diff > -10) {
    return { text: `≈ dentro da média`, variant: 'neutral' };
  }
  return { text: `⚠️ ${Math.abs(Math.round(diff))}% abaixo da média`, variant: 'warning' };
}
