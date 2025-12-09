import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  FileText, 
  Save, 
  ArrowLeft,
  RefreshCw,
  Eye,
  Clock
} from "lucide-react";

// Mock content data - in production this would come from an API/database
const contentPages: Record<string, { title: string; slug: string; content: string; lastUpdated: string }> = {
  termos: {
    title: "Termos e Condições",
    slug: "/termos",
    content: `# Termos e Condições de Utilização

## 1. Aceitação dos Termos

Ao aceder e utilizar a plataforma AlbiEmprego, o utilizador aceita e concorda em cumprir estes termos e condições de utilização.

## 2. Descrição do Serviço

O AlbiEmprego é uma plataforma de emprego online que conecta candidatos a empresas na região de Castelo Branco.

## 3. Registo e Conta

Para utilizar determinadas funcionalidades, é necessário criar uma conta. O utilizador é responsável por manter a confidencialidade das suas credenciais.

## 4. Obrigações do Utilizador

Os utilizadores comprometem-se a:
- Fornecer informações verdadeiras e atualizadas
- Não publicar conteúdo ilegal ou ofensivo
- Respeitar os direitos de outros utilizadores
- Não utilizar a plataforma para fins fraudulentos

## 5. Propriedade Intelectual

Todo o conteúdo da plataforma está protegido por direitos de autor e não pode ser reproduzido sem autorização.

## 6. Limitação de Responsabilidade

O AlbiEmprego não se responsabiliza por danos resultantes da utilização da plataforma ou de transações entre utilizadores.

## 7. Alterações aos Termos

Reservamo-nos o direito de alterar estes termos a qualquer momento. As alterações entram em vigor após publicação.

## 8. Contacto

Para questões sobre estes termos, contacte-nos através de info@albiemprego.pt.`,
    lastUpdated: "2024-01-10"
  },
  privacidade: {
    title: "Política de Privacidade",
    slug: "/privacidade",
    content: `# Política de Privacidade

## 1. Recolha de Dados

Recolhemos dados pessoais quando se regista na plataforma, incluindo nome, email, telefone e informações profissionais.

## 2. Utilização dos Dados

Os seus dados são utilizados para:
- Fornecer e melhorar os nossos serviços
- Processar candidaturas e comunicações
- Enviar notificações relevantes
- Análise estatística anónima

## 3. Partilha de Dados

Os seus dados podem ser partilhados com:
- Empresas às quais se candidata
- Prestadores de serviços essenciais
- Autoridades quando legalmente exigido

## 4. Segurança

Implementamos medidas técnicas e organizacionais para proteger os seus dados pessoais.

## 5. Direitos do Titular

Tem direito a aceder, retificar, apagar ou portar os seus dados. Pode também opor-se ao tratamento.

## 6. Cookies

Utilizamos cookies para melhorar a experiência. Consulte a nossa Política de Cookies para mais informações.

## 7. Contacto

Para exercer os seus direitos ou esclarecer dúvidas: privacidade@albiemprego.pt`,
    lastUpdated: "2024-01-08"
  },
  sobre: {
    title: "Sobre Nós",
    slug: "/sobre",
    content: `# Sobre o AlbiEmprego

## A Nossa Missão

Conectar talentos locais a oportunidades extraordinárias na região de Castelo Branco.

## Quem Somos

O AlbiEmprego nasceu da necessidade de criar uma plataforma dedicada ao mercado de trabalho regional. Somos uma equipa apaixonada por tecnologia e desenvolvimento local.

## O Que Fazemos

Oferecemos uma plataforma moderna e intuitiva que facilita:
- A procura de emprego para candidatos
- O recrutamento para empresas
- A conexão entre talento e oportunidade

## Os Nossos Valores

- **Transparência**: Comunicação clara e honesta
- **Inovação**: Melhoria contínua dos nossos serviços
- **Comunidade**: Foco no desenvolvimento regional
- **Qualidade**: Compromisso com a excelência

## Contacte-nos

Estamos sempre disponíveis para ouvir sugestões e responder a questões.`,
    lastUpdated: "2024-01-05"
  },
  faq: {
    title: "FAQ",
    slug: "/faq",
    content: `# Perguntas Frequentes

As perguntas frequentes são geridas através de um sistema dedicado. Aceda ao painel de FAQ para adicionar, editar ou remover perguntas.

## Categorias Disponíveis

- Candidatos
- Empresas
- Conta e Segurança
- Vagas e Candidaturas
- Pagamentos e Planos

## Gestão de Conteúdo

Utilize o editor de FAQ para gerir as perguntas e respostas de cada categoria.`,
    lastUpdated: "2024-01-03"
  },
  cookies: {
    title: "Política de Cookies",
    slug: "/cookies",
    content: `# Política de Cookies

## O que são Cookies?

Cookies são pequenos ficheiros de texto armazenados no seu dispositivo quando visita um website.

## Tipos de Cookies

### Cookies Essenciais
Necessários para o funcionamento básico do website.

### Cookies de Desempenho
Recolhem informações anónimas sobre como utiliza o site.

### Cookies de Funcionalidade
Permitem memorizar as suas preferências.

### Cookies de Publicidade
Utilizados para anúncios relevantes.

## Gestão de Cookies

Pode gerir os cookies através das definições do seu navegador.

## Cookies de Terceiros

Utilizamos serviços de terceiros como Google Analytics para análise de tráfego.

## Contacto

Para questões sobre cookies: privacidade@albiemprego.pt`,
    lastUpdated: "2024-01-01"
  }
};

export default function EditarConteudo() {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    if (pageId && contentPages[pageId]) {
      const page = contentPages[pageId];
      setTitle(page.title);
      setContent(page.content);
      setLastUpdated(page.lastUpdated);
    }
  }, [pageId]);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLastUpdated(new Date().toISOString().split('T')[0]);
      toast({
        title: "Conteúdo atualizado",
        description: `A página "${title}" foi atualizada com sucesso.`,
      });
    }, 1000);
  };

  const handlePreview = () => {
    if (pageId && contentPages[pageId]) {
      window.open(contentPages[pageId].slug, '_blank');
    }
  };

  if (!pageId || !contentPages[pageId]) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Página não encontrada</h3>
              <p className="text-muted-foreground mb-4">
                A página que procura não existe.
              </p>
              <Button asChild>
                <Link to="/admin/configuracoes">Voltar às Configurações</Link>
              </Button>
            </CardContent>
          </Card>
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/admin/configuracoes">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                  <FileText className="h-8 w-8 text-primary" />
                  Editar Conteúdo
                </h1>
                <p className="text-muted-foreground">
                  A editar: {title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handlePreview}>
                <Eye className="h-4 w-4 mr-2" />
                Pré-visualizar
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Guardar
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Editor */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Editor de Conteúdo</CardTitle>
                  <CardDescription>
                    Utilize Markdown para formatar o conteúdo da página
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título da Página</Label>
                    <Input 
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Conteúdo (Markdown)</Label>
                    <Textarea 
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[500px] font-mono text-sm"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">URL:</span>
                    <code className="bg-muted px-2 py-1 rounded text-xs">
                      {contentPages[pageId]?.slug}
                    </code>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Última atualização:
                    </span>
                    <span>{lastUpdated}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Markdown Help */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Guia Markdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-xs"># Título</code>
                    <span className="text-muted-foreground">Título H1</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-xs">## Subtítulo</code>
                    <span className="text-muted-foreground">Título H2</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-xs">**negrito**</code>
                    <span className="text-muted-foreground">Texto a negrito</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-xs">*itálico*</code>
                    <span className="text-muted-foreground">Texto em itálico</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-xs">- item</code>
                    <span className="text-muted-foreground">Lista não ordenada</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-xs">1. item</code>
                    <span className="text-muted-foreground">Lista ordenada</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-xs">[link](url)</code>
                    <span className="text-muted-foreground">Hiperligação</span>
                  </div>
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