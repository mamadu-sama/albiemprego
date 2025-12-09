import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  BarChart3, 
  Building2, 
  CheckCircle2,
  Euro,
  ArrowRight
} from "lucide-react";

export function SalaryTransparencySection() {
  return (
    <section className="py-20 bg-gradient-to-b from-primary/5 via-primary/[0.02] to-background overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
              <Eye className="h-3 w-3 mr-1" />
              100% Transparente
            </Badge>
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Salários Reais. Sem Surpresas.
            </h2>
            
            <p className="text-lg text-muted-foreground">
              Somos a única plataforma da região que incentiva empresas 
              a mostrar salários. Mais de <span className="text-primary font-semibold">80%</span> das vagas têm 
              informação salarial transparente.
            </p>
            
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-muted-foreground">
                <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                Conhece o salário antes de candidatar
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                Estatísticas reais do mercado regional
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                Empresas comprometidas com transparência
              </li>
            </ul>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <Button asChild size="lg">
                <Link to="/vagas?salaryOnly=true">
                  <Euro className="h-4 w-4 mr-2" />
                  Ver Vagas com Salário
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/estatisticas-salarios">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Ver Estatísticas
                </Link>
              </Button>
            </div>
          </div>

          {/* Visual Cards */}
          <div className="relative">
            {/* Example Cards */}
            <div className="space-y-4">
              {/* Good Example Card */}
              <Card className="border-success/30 bg-success/5 shadow-lg transform hover:-translate-y-1 transition-transform">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground">Desenvolvedor Frontend</h4>
                      <p className="text-sm text-muted-foreground">TechSolutions • Castelo Branco</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-success">
                      <Euro className="h-4 w-4" />
                      <span className="font-bold">1.800€ - 2.200€/mês</span>
                    </div>
                    <Badge className="bg-success/10 text-success border-success/20">
                      <Eye className="h-3 w-3 mr-1" />
                      Salário Transparente
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Bad Example Card */}
              <Card className="border-muted bg-muted/30 opacity-60 transform translate-x-4">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground">Designer Gráfico</h4>
                      <p className="text-sm text-muted-foreground">AgencyXYZ • Covilhã</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-muted-foreground italic">Salário a negociar</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-4 -right-4 md:bottom-4 md:right-0 bg-primary text-primary-foreground rounded-2xl p-4 shadow-xl animate-pulse">
              <div className="text-center">
                <span className="text-3xl font-bold">80%</span>
                <p className="text-xs opacity-90">com salário</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
