import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie, Shield, Settings, Eye, Clock, Mail } from "lucide-react";

export default function Cookies() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
              <Cookie className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Política de Cookies
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Informações sobre como utilizamos cookies e tecnologias similares no nosso website.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Última atualização: 6 de Dezembro de 2024
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-8">
              {/* O que são Cookies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cookie className="h-5 w-5 text-primary" />
                    O que são Cookies?
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-muted-foreground">
                    Cookies são pequenos ficheiros de texto que são armazenados no seu dispositivo (computador, tablet ou telemóvel) quando visita um website. Estes ficheiros permitem que o website reconheça o seu dispositivo e memorize informações sobre a sua visita, como as suas preferências de idioma e outras configurações.
                  </p>
                  <p className="text-muted-foreground mt-4">
                    Os cookies são amplamente utilizados para fazer os websites funcionarem de forma mais eficiente, bem como para fornecer informações aos proprietários do site.
                  </p>
                </CardContent>
              </Card>

              {/* Tipos de Cookies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Tipos de Cookies que Utilizamos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold text-foreground">Cookies Essenciais</h4>
                    <p className="text-muted-foreground text-sm mt-1">
                      Estes cookies são necessários para o funcionamento básico do website. Incluem cookies que permitem iniciar sessão em áreas seguras, utilizar o carrinho de compras ou serviços de faturação eletrónica.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-secondary pl-4">
                    <h4 className="font-semibold text-foreground">Cookies de Desempenho</h4>
                    <p className="text-muted-foreground text-sm mt-1">
                      Estes cookies recolhem informações sobre como os visitantes utilizam o website, por exemplo, quais as páginas mais visitadas. Não recolhem informações que identifiquem o visitante. Todas as informações são agregadas e anónimas.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-accent pl-4">
                    <h4 className="font-semibold text-foreground">Cookies de Funcionalidade</h4>
                    <p className="text-muted-foreground text-sm mt-1">
                      Estes cookies permitem que o website memorize as escolhas que faz (como o nome de utilizador, idioma ou região) e proporcione funcionalidades melhoradas e mais personalizadas.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-muted pl-4">
                    <h4 className="font-semibold text-foreground">Cookies de Publicidade</h4>
                    <p className="text-muted-foreground text-sm mt-1">
                      Estes cookies são utilizados para apresentar anúncios mais relevantes para si e os seus interesses. São também utilizados para limitar o número de vezes que vê um anúncio e para ajudar a medir a eficácia das campanhas publicitárias.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Cookies Específicos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    Cookies Específicos que Utilizamos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2 font-semibold">Nome</th>
                          <th className="text-left py-3 px-2 font-semibold">Finalidade</th>
                          <th className="text-left py-3 px-2 font-semibold">Duração</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted-foreground">
                        <tr className="border-b">
                          <td className="py-3 px-2 font-mono text-xs">session_id</td>
                          <td className="py-3 px-2">Manter a sessão do utilizador</td>
                          <td className="py-3 px-2">Sessão</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-2 font-mono text-xs">auth_token</td>
                          <td className="py-3 px-2">Autenticação do utilizador</td>
                          <td className="py-3 px-2">30 dias</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-2 font-mono text-xs">preferences</td>
                          <td className="py-3 px-2">Guardar preferências do utilizador</td>
                          <td className="py-3 px-2">1 ano</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-2 font-mono text-xs">cookie_consent</td>
                          <td className="py-3 px-2">Registar consentimento de cookies</td>
                          <td className="py-3 px-2">1 ano</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-2 font-mono text-xs">_ga</td>
                          <td className="py-3 px-2">Google Analytics - distinção de utilizadores</td>
                          <td className="py-3 px-2">2 anos</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Gestão de Cookies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Como Gerir os Seus Cookies
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-muted-foreground">
                    A maioria dos navegadores web permite algum controlo da maioria dos cookies através das definições do navegador. Para saber mais sobre cookies, incluindo como ver que cookies foram definidos e como geri-los e eliminá-los, visite:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
                    <li>Google Chrome: Definições → Privacidade e segurança → Cookies</li>
                    <li>Mozilla Firefox: Definições → Privacidade e Segurança → Cookies</li>
                    <li>Safari: Preferências → Privacidade → Cookies</li>
                    <li>Microsoft Edge: Definições → Cookies e permissões do site</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    <strong>Nota:</strong> Se optar por desativar os cookies, algumas funcionalidades do nosso website podem não funcionar corretamente.
                  </p>
                </CardContent>
              </Card>

              {/* Cookies de Terceiros */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Cookies de Terceiros
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-muted-foreground">
                    Além dos nossos próprios cookies, podemos também utilizar cookies de terceiros para reportar estatísticas de uso do website e entregar anúncios. Estes terceiros incluem:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
                    <li><strong>Google Analytics</strong> - Para análise de tráfego do website</li>
                    <li><strong>Facebook Pixel</strong> - Para medição de conversões e remarketing</li>
                    <li><strong>LinkedIn Insight Tag</strong> - Para análise de visitantes profissionais</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Contacto */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    Contacte-nos
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-muted-foreground">
                    Se tiver alguma dúvida sobre a nossa utilização de cookies ou outras tecnologias, por favor contacte-nos:
                  </p>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-foreground font-semibold">AlbiEmprego</p>
                    <p className="text-muted-foreground text-sm">Email: privacidade@albiemprego.pt</p>
                    <p className="text-muted-foreground text-sm">Telefone: +351 272 123 456</p>
                    <p className="text-muted-foreground text-sm">Morada: Castelo Branco, Portugal</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}