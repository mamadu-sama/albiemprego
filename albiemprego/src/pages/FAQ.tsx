import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HelpCircle, Search, Users, Building2, FileText, Shield, CreditCard, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const faqCategories = [
  {
    id: "candidatos",
    title: "Candidatos",
    icon: Users,
    questions: [
      {
        question: "Como posso criar uma conta como candidato?",
        answer: "Para criar uma conta, clique no botão 'Registar' no canto superior direito do website e selecione 'Candidato'. Preencha os seus dados pessoais, email e crie uma palavra-passe segura. Receberá um email de confirmação para ativar a sua conta."
      },
      {
        question: "Como candidatar-me a uma vaga?",
        answer: "Após iniciar sessão, navegue até à página de vagas e encontre a oportunidade que lhe interessa. Clique no botão 'Candidatar-me' e siga as instruções. Poderá anexar o seu CV e carta de apresentação se desejar."
      },
      {
        question: "Posso editar o meu perfil depois de criado?",
        answer: "Sim, pode editar o seu perfil a qualquer momento. Aceda ao seu dashboard, clique em 'Perfil' e depois em 'Editar Perfil'. Pode atualizar informações pessoais, experiência profissional, formação académica e competências."
      },
      {
        question: "Como posso acompanhar as minhas candidaturas?",
        answer: "No seu dashboard de candidato, aceda à secção 'Minhas Candidaturas'. Aqui encontrará o estado de todas as suas candidaturas: pendente, em análise, entrevista agendada, aceite ou rejeitada."
      },
      {
        question: "Posso configurar alertas de emprego?",
        answer: "Sim! Aceda a 'Alertas de Emprego' no seu dashboard. Pode configurar alertas por categoria, localização, tipo de contrato e palavras-chave. Receberá notificações quando surgirem novas vagas que correspondam aos seus critérios."
      },
      {
        question: "O serviço é gratuito para candidatos?",
        answer: "Sim, o AlbiEmprego é totalmente gratuito para candidatos. Pode criar conta, candidatar-se a vagas, configurar alertas e utilizar todas as funcionalidades sem qualquer custo."
      }
    ]
  },
  {
    id: "empresas",
    title: "Empresas",
    icon: Building2,
    questions: [
      {
        question: "Como registar a minha empresa?",
        answer: "Clique em 'Registar' e selecione 'Empresa'. Preencha os dados da empresa incluindo nome, NIF, setor de atividade e contactos. A sua conta será analisada pela nossa equipa e aprovada em até 24 horas úteis."
      },
      {
        question: "Quanto custa publicar uma vaga?",
        answer: "Oferecemos diferentes planos para empresas. Temos um plano gratuito com funcionalidades básicas e planos premium com mais visibilidade e funcionalidades avançadas. Consulte a página 'Planos e Preços' para mais detalhes."
      },
      {
        question: "Como publicar uma nova vaga?",
        answer: "Após aprovação da conta, aceda ao dashboard da empresa e clique em 'Nova Vaga'. Preencha todos os detalhes: título, descrição, requisitos, tipo de contrato, localização e faixa salarial (opcional). A vaga será publicada após revisão."
      },
      {
        question: "Posso guardar vagas como rascunho?",
        answer: "Sim, ao criar uma vaga pode guardar como rascunho para continuar a editar mais tarde. Aceda a 'Rascunhos' no seu dashboard para ver e editar as vagas não publicadas."
      },
      {
        question: "Como gerir as candidaturas recebidas?",
        answer: "No dashboard da empresa, aceda a 'Candidaturas'. Pode filtrar por vaga, ordenar por data e alterar o estado de cada candidatura (pendente, em análise, entrevista, aceite, rejeitada)."
      },
      {
        question: "Quanto tempo demora a aprovação de vagas?",
        answer: "Normalmente as vagas são aprovadas em até 24 horas úteis. Vagas com informações completas e claras tendem a ser aprovadas mais rapidamente."
      }
    ]
  },
  {
    id: "conta",
    title: "Conta e Segurança",
    icon: Shield,
    questions: [
      {
        question: "Esqueci a minha palavra-passe. O que faço?",
        answer: "Na página de login, clique em 'Esqueci a palavra-passe'. Introduza o email associado à sua conta e receberá um link para redefinir a sua palavra-passe. O link expira em 24 horas."
      },
      {
        question: "Como alterar o email da minha conta?",
        answer: "Aceda às configurações da sua conta através do dashboard. Na secção 'Alterar Email', introduza o novo email e confirme com a sua palavra-passe atual. Receberá um email de verificação no novo endereço."
      },
      {
        question: "Posso eliminar a minha conta?",
        answer: "Sim, pode eliminar a sua conta nas configurações. Esta ação é irreversível e todos os seus dados serão permanentemente removidos, incluindo candidaturas, alertas e histórico."
      },
      {
        question: "Os meus dados estão seguros?",
        answer: "Sim, levamos a segurança muito a sério. Utilizamos encriptação SSL em todas as comunicações, armazenamos dados de forma segura e seguimos as melhores práticas de proteção de dados conforme o RGPD."
      },
      {
        question: "Como ativo a autenticação de dois fatores?",
        answer: "Nas configurações da conta, encontrará a opção de ativar autenticação de dois fatores (2FA). Pode configurar via SMS ou aplicação autenticadora para maior segurança."
      }
    ]
  },
  {
    id: "vagas",
    title: "Vagas e Candidaturas",
    icon: FileText,
    questions: [
      {
        question: "Como pesquisar vagas?",
        answer: "Utilize a barra de pesquisa na página de vagas. Pode pesquisar por título, empresa ou palavras-chave. Utilize os filtros para refinar por localização, categoria, tipo de contrato e data de publicação."
      },
      {
        question: "Posso candidatar-me a várias vagas?",
        answer: "Sim, pode candidatar-se a quantas vagas desejar. Recomendamos que personalize a sua candidatura para cada vaga, destacando as competências mais relevantes para cada posição."
      },
      {
        question: "Porque foi a minha candidatura rejeitada?",
        answer: "As empresas avaliam cada candidatura com base nos requisitos da vaga. Se foi rejeitado, significa que outro candidato se adequava melhor aos critérios. Continue a candidatar-se a outras oportunidades!"
      },
      {
        question: "Posso retirar uma candidatura?",
        answer: "Sim, pode retirar uma candidatura a qualquer momento, desde que ainda esteja em análise. Aceda às suas candidaturas e clique em 'Retirar Candidatura'."
      }
    ]
  },
  {
    id: "pagamentos",
    title: "Pagamentos e Planos",
    icon: CreditCard,
    questions: [
      {
        question: "Quais são os métodos de pagamento aceites?",
        answer: "Aceitamos cartões de crédito/débito (Visa, Mastercard), transferência bancária, MBWay e PayPal. Todos os pagamentos são processados de forma segura."
      },
      {
        question: "Posso cancelar a minha subscrição?",
        answer: "Sim, pode cancelar a qualquer momento nas configurações da conta. A subscrição permanecerá ativa até ao fim do período pago."
      },
      {
        question: "Emitem fatura?",
        answer: "Sim, emitimos fatura para todos os pagamentos. As faturas são enviadas automaticamente por email e ficam disponíveis no histórico de pagamentos do dashboard."
      },
      {
        question: "Existe período de teste gratuito?",
        answer: "Sim, oferecemos 14 dias de teste gratuito nos planos premium para empresas. Pode experimentar todas as funcionalidades antes de decidir subscrever."
      }
    ]
  }
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => 
    activeCategory === "all" || category.id === activeCategory
  ).filter(category => category.questions.length > 0);

  const totalQuestions = faqCategories.reduce((acc, cat) => acc + cat.questions.length, 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Perguntas Frequentes
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Encontre respostas às perguntas mais comuns sobre o AlbiEmprego. 
              Temos {totalQuestions} perguntas organizadas em {faqCategories.length} categorias.
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Pesquisar perguntas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="border-b">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 py-4 overflow-x-auto">
              <Button
                variant={activeCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory("all")}
              >
                Todas
              </Button>
              {faqCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <category.icon className="h-4 w-4" />
                  {category.title}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {filteredCategories.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Nenhuma pergunta encontrada
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Não encontrámos perguntas que correspondam à sua pesquisa.
                  </p>
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Limpar pesquisa
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {filteredCategories.map((category) => (
                  <Card key={category.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <category.icon className="h-5 w-5 text-primary" />
                        {category.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {category.questions.map((item, index) => (
                          <AccordionItem key={index} value={`${category.id}-${index}`}>
                            <AccordionTrigger className="text-left">
                              {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                              {item.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Não encontrou a resposta que procurava?
              </h2>
              <p className="text-muted-foreground mb-6">
                A nossa equipa de suporte está disponível para ajudar. 
                Entre em contacto connosco e responderemos o mais brevemente possível.
              </p>
              <Button asChild size="lg">
                <Link to="/contacto">
                  <Mail className="h-4 w-4 mr-2" />
                  Contactar Suporte
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}