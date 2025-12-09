import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Clock, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  ArrowRight 
} from "lucide-react";

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          <Card className="border-2">
            <CardContent className="pt-12 pb-8 px-6 md:px-12">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-warning/10 flex items-center justify-center">
                    <Clock className="h-12 w-12 text-warning" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-primary-foreground" />
                  </div>
                </div>
              </div>

              {/* Título */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-3">
                  Conta em Análise
                </h1>
                <p className="text-muted-foreground text-lg">
                  O seu registo foi recebido com sucesso!
                </p>
              </div>

              {/* Informação */}
              <div className="space-y-6 mb-8">
                <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Dados Submetidos
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Recebemos toda a informação da sua empresa e já iniciámos o processo de verificação.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Em Análise
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      A nossa equipa está a verificar os dados da empresa. Este processo normalmente demora até 24 horas úteis.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex-shrink-0">
                    <Mail className="h-6 w-6 text-info" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Notificação por Email
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Assim que a análise estiver concluída, receberá um email com o resultado. Se aprovado, poderá aceder à plataforma imediatamente.
                    </p>
                  </div>
                </div>
              </div>

              {/* Aviso */}
              <div className="flex gap-3 p-4 bg-info/10 border border-info/20 rounded-lg mb-8">
                <AlertCircle className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
                <div className="text-sm text-info-foreground">
                  <strong className="font-semibold">Importante:</strong> Verifique a sua caixa de entrada (e spam) para o email de confirmação. Precisamos que confirme o seu endereço de email antes de aprovarmos a conta.
                </div>
              </div>

              {/* Próximos Passos */}
              <div className="mb-8">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 text-primary" />
                  Próximos Passos
                </h3>
                <ol className="space-y-3">
                  <li className="flex gap-3 text-sm">
                    <span className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                      1
                    </span>
                    <span className="text-muted-foreground">
                      Confirme o seu email através do link que enviámos
                    </span>
                  </li>
                  <li className="flex gap-3 text-sm">
                    <span className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                      2
                    </span>
                    <span className="text-muted-foreground">
                      Aguarde a análise da nossa equipa (até 24h úteis)
                    </span>
                  </li>
                  <li className="flex gap-3 text-sm">
                    <span className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                      3
                    </span>
                    <span className="text-muted-foreground">
                      Receberá um email quando a conta for aprovada
                    </span>
                  </li>
                  <li className="flex gap-3 text-sm">
                    <span className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                      4
                    </span>
                    <span className="text-muted-foreground">
                      Aceda à plataforma e comece a publicar vagas!
                    </span>
                  </li>
                </ol>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="flex-1">
                  <Link to="/">
                    Voltar à Página Inicial
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/vagas">
                    Ver Vagas Disponíveis
                  </Link>
                </Button>
              </div>

              {/* Suporte */}
              <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
                Dúvidas ou problemas?{" "}
                <Link to="/contacto" className="text-primary hover:underline font-medium">
                  Entre em contacto
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

