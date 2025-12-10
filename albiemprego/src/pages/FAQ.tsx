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
    title: "Planos, Créditos e Pagamentos",
    icon: CreditCard,
    questions: [
      {
        question: "🎯 Que planos de assinatura estão disponíveis?",
        answer: "Oferecemos 3 planos cuidadosamente concebidos para empresas em Castelo Branco:\n\nPlano Básico (GRATUITO): Perfeito para pequenas empresas ou startups. Inclui até 5 vagas ativas, 1 crédito de destaque por mês, visualização de candidaturas e perfil básico. Sem custos mensais!\n\nPlano Profissional (€35/mês) - MAIS POPULAR: Ideal para empresas em crescimento. Oferece 20 vagas ativas, 3 créditos Featured, 1 crédito Homepage e 1 crédito Urgent por mês. Inclui perfil completo da empresa e suporte prioritário. Melhor relação qualidade/preço!\n\nPlano Premium (€75/mês): Para máxima visibilidade! Vagas ilimitadas, 5 créditos Featured (14 dias), 3 créditos Homepage (14 dias) e 3 créditos Urgent (14 dias) mensais. Analytics avançado, perfil premium destacado e suporte 24/7.\n\nConsulte todos os detalhes na página de Planos: /empresa/planos"
      },
      {
        question: "💎 O que são créditos e como funcionam?",
        answer: "Os créditos são a moeda de visibilidade do AlbiEmprego! Permitem destacar as suas vagas para alcançar mais candidatos qualificados.\n\nExistem 3 tipos de créditos:\n\n• Créditos Featured (Destaque): A sua vaga aparece no topo da listagem com um badge especial, aumentando drasticamente a visibilidade. Perfeito para atrair atenção imediata!\n\n• Créditos Homepage: A sua vaga é promovida na página inicial do AlbiEmprego, onde recebe milhares de visualizações diárias. Exposição máxima garantida!\n\n• Créditos Urgent (Urgente): Adiciona um badge URGENTE vermelho à sua vaga, criando um sentido de urgência. Ideal para contratações rápidas!\n\nDuração dos créditos: Os créditos dos planos duram 7 dias (Premium: 14 dias). Os créditos avulsos podem ter validade de 7, 14 ou 30 dias.\n\nExemplo prático: usar 1 crédito Featured = vaga em destaque durante 7 dias completos!"
      },
      {
        question: "📦 Posso comprar créditos avulsos sem mudar de plano?",
        answer: "Sim! Além dos créditos mensais incluídos no seu plano, oferecemos pacotes de créditos avulsos:\n\nStarter (€15): 3 créditos Featured (7 dias) - Ideal para começar\n\nLocal Boost (€35): 5 Featured + 2 Homepage (7 dias) - Aumente sua visibilidade local\n\nCompleto (€60): 8 Featured + 4 Homepage + 2 Urgent (7 dias) - Pacote completo\n\nCampanha (€95): 15 Featured + 5 Homepage + 3 Urgent (14 dias) - Máxima visibilidade!\n\nOs créditos avulsos expiram em 90 dias após a compra. Receberá notificações quando estiverem próximos de expirar.\n\nDica: Combine os créditos do plano mensal com pacotes avulsos durante períodos de recrutamento intensivo!"
      },
      {
        question: "🚀 Como usar os créditos nas minhas vagas?",
        answer: "Usar créditos é simples! Siga estes passos:\n\n1. Aceda ao seu dashboard - Entre na área da empresa\n2. Escolha a vaga - Vá para As Minhas Vagas\n3. Aplique o crédito - Clique em Aplicar Crédito e escolha o tipo\n4. Confirme - O crédito é ativado instantaneamente!\n\nPode aplicar múltiplos tipos na mesma vaga. Exemplo: Featured + Homepage + Urgent = tripla exposição!\n\nMonitorização em tempo real: Acompanhe visualizações, cliques e candidaturas através do analytics. ROI transparente!\n\nNotificações inteligentes:\n• Alertas quando restarem poucos créditos\n• Aviso quando próximos de expirar\n• Lembrete de renovação mensal\n\nNunca perca uma oportunidade de destaque!"
      },
      {
        question: "💰 Qual é a diferença entre créditos do plano e créditos avulsos?",
        answer: "Créditos do Plano (Mensais):\n• Renovam automaticamente todo mês\n• Não expiram enquanto mantiver o plano\n• Incluídos na mensalidade\n• Duração: 7 dias (Premium: 14 dias)\n• Limitados à quantidade do plano\n\nCréditos Avulsos (Compra única):\n• Compra quando precisar\n• Flexibilidade total de uso\n• Durações: 7, 14 ou 30 dias\n• Perfeitos para picos de recrutamento\n• Expiram em 90 dias se não usados\n\nEstratégia recomendada: Use créditos mensais regularmente. Compre avulsos para campanhas sazonais, posições difíceis ou múltiplas vagas simultâneas."
      },
      {
        question: "📊 Como posso ver o ROI dos créditos investidos?",
        answer: "O AlbiEmprego oferece analytics detalhado para cada crédito usado:\n\nMétricas por vaga:\n• Visualizações - Quantas pessoas viram\n• Cliques - Quantos abriram detalhes\n• Candidaturas - Recebidas durante destaque\n\nTaxas automáticas:\n• Taxa de Clique (CTR)\n• Taxa de Candidatura\n• Taxa de Conversão\n\nAnálise por tipo: Veja qual tipo (Featured/Homepage/Urgent) gera melhores resultados.\n\nNo Plano Premium:\n• Comparação entre vagas\n• Histórico completo\n• Recomendações inteligentes\n• Benchmark do sector\n\nAcesso: Dashboard > As Minhas Vagas > Analytics"
      },
      {
        question: "🔄 O que acontece quando um crédito expira?",
        answer: "Durante a validade:\n• Vaga permanece destacada\n• Métricas registadas\n• Máxima visibilidade\n\nQuando expira:\n• Vaga continua publicada (não é removida!)\n• Candidaturas mantidas\n• Histórico guardado\n• Destaque visual removido\n• Volta para ordem normal\n\nNotificações:\n• 7 dias antes - Alerta de expiração\n• 3 dias antes - Lembrete\n• No dia - Notificação final\n\nCréditos não usados:\n• Do plano: Renovam mensalmente\n• Avulsos: Expiram em 90 dias\n\nDica: Configure alertas para reativar destaques quando créditos renovarem!"
      },
      {
        question: "🎁 Porque o Plano Básico é gratuito? Há alguma limitação oculta?",
        answer: "Transparência total - SEM truques!\n\nO Plano Básico é GRATUITO porque queremos apoiar pequenas empresas locais e provar o valor da plataforma.\n\nIncluído (€0/mês):\n• Até 5 vagas ativas\n• 1 crédito Featured por mês\n• Acesso à base de candidatos\n• Gestão ilimitada de candidaturas\n• Perfil básico da empresa\n• Suporte por email\n• Sem anúncios\n• ZERO compromissos\n\nLimitações claras:\n• Máximo 5 vagas ativas\n• 1 crédito Featured/mês\n• Sem créditos Homepage ou Urgent\n• Perfil simples\n• Analytics básico\n\n99% das pequenas empresas locais acham suficiente! Comece grátis: /empresa/planos"
      },
      {
        question: "⚡ Porque escolher o Plano Profissional (€35/mês)?",
        answer: "O Plano Profissional é o MAIS ESCOLHIDO pelas empresas em Castelo Branco:\n\nROI imbatível:\n• Apenas €1,16 por dia\n• 20 vagas ativas (vs 5 no Básico)\n• Encontrar 1 bom colaborador = investimento recuperado\n\nCréditos Mensais:\n• 3 créditos Featured (vs 1 no Básico)\n• 1 crédito Homepage (exposição na página inicial)\n• 1 crédito Urgent (badge de urgência)\n\nBenefícios Extra:\n• Perfil completo da empresa\n• Suporte prioritário (resposta em 2 horas)\n• Analytics detalhado\n• Galeria de fotos e vídeos\n\nIdeal para:\n• Empresas com 10-50 colaboradores\n• 5-15 vagas por ano\n• Necessidade de destaque consistente\n• Crescimento acelerado\n\nCaso real: Empresa local aumentou candidaturas em 340% no primeiro mês!\n\nExperimente 14 dias grátis - cancele quando quiser."
      },
      {
        question: "👑 Para quem é o Plano Premium (€75/mês)?",
        answer: "Nível executivo - para empresas sérias sobre recrutamento:\n\nVagas Ilimitadas:\n• Publique quantas precisar\n• Sem limites de vagas ativas\n• Múltiplas equipas e localizações\n\nCréditos de Longa Duração (14 dias):\n• 5 Featured mensais\n• 3 Homepage mensais\n• 3 Urgent mensais\n• Dobro da duração vs outros planos!\n\nAnalytics Avançado:\n• ROI detalhado por crédito\n• Funil completo de conversão\n• Benchmark com concorrentes\n• Previsões inteligentes\n• Reports automáticos\n\nSuporte 24/7:\n• Linha direta prioritária\n• Chat ao vivo\n• Email com resposta em 1h\n• Gestor de conta exclusivo\n• Consultoria mensal\n\nIdeal para:\n• Empresas 50+ colaboradores\n• Recrutamento contínuo\n• 10+ vagas simultâneas\n• Posições especializadas\n\nComparação custos:\n• Recrutador externo: €3.000-5.000/contratação\n• Anúncio jornal: €500/semana\n• Premium AlbiEmprego: €75/mês\n\nResultado típico: Redução de 60% no tempo e 80% nos custos!"
      },
      {
        question: "🔐 Como funcionam os pagamentos? É seguro?",
        answer: "Segurança e transparência garantidas:\n\nMétodos Aceites:\n• Cartões (Visa, Mastercard, Amex)\n• MBWay\n• Transferência Bancária\n• PayPal\n• Multibanco\n\nSegurança:\n• Encriptação SSL 256-bit\n• Processamento via Stripe\n• Conformidade PCI-DSS\n• Nunca armazenamos dados de cartão\n• 3D Secure obrigatório\n\nFaturação:\n• Fatura PDF instantânea\n• NIF incluído automaticamente\n• Histórico no dashboard\n• Conformidade fiscal portuguesa\n\nCancelamento:\n• A qualquer momento\n• Sem períodos de fidelização\n• Sem taxas extras\n• Acesso até fim do período pago\n\nGarantia: Reembolso total nos primeiros 14 dias se não estiver satisfeito!"
      },
      {
        question: "📞 Como posso fazer upgrade, downgrade ou cancelar?",
        answer: "Flexibilidade total:\n\nFAZER UPGRADE:\n1. Dashboard → Planos e Créditos\n2. Escolha novo plano\n3. Pagamento processado\n4. Créditos creditados imediatamente\n5. Limite atualizado na hora\n\nBónus: Crédito proporcional do tempo restante!\n\nFAZER DOWNGRADE:\n1. Dashboard → Planos → Alterar\n2. Selecione plano inferior\n3. Confirme mudança\n4. Aplicado no próximo ciclo\n5. Mantém plano atual até renovação\n\nCANCELAR:\n1. Dashboard → Definições\n2. Cancelar Assinatura\n3. Sem taxas\n4. Mantém acesso até fim do período\n\nContacto direto: planos@albiemprego.pt"
      },
      {
        question: "🎓 Existem descontos ou promoções especiais?",
        answer: "Sim! Valorizamos fidelidade e apoiamos a economia local:\n\nDesconto Anual (20% OFF):\n• Profissional: €336/ano (poupa €84)\n• Premium: €720/ano (poupa €180)\n• 2 meses grátis!\n\nEmpresas Locais de Castelo Branco:\n• 15% desconto no primeiro ano\n• NIF registado em CB\n• Apoio à economia regional\n\nStartups e Incubadoras:\n• 6 meses Profissional GRÁTIS\n• 25% desconto permanente depois\n• Certificação necessária\n\nOrganizações Sem Fins Lucrativos:\n• 50% desconto em todos os planos\n• IPSS, associações, cooperativas\n• Nossa contribuição social\n\nPrograma de Referências:\n• Indique empresa → ambos ganham 1 mês grátis\n• Sem limite de referências\n\nCódigos Promocionais:\n• CBLOCAL15 - 15% empresas locais\n• ANUAL20 - 20% planos anuais\n• STARTUP50 - 50% startups\n\nContacto: descontos@albiemprego.pt"
      },
      {
        question: "📱 Posso testar antes de comprar?",
        answer: "Sim! Experimente sem compromisso:\n\nTeste Gratuito:\n• Profissional: 14 dias GRÁTIS\n• Premium: 7 dias GRÁTIS\n• Sem cartão necessário\n• Sem renovação automática\n\nDurante o teste pode:\n• Publicar vagas reais\n• Usar todos os créditos\n• Receber candidaturas\n• Testar analytics completo\n• Contactar suporte\n\nApós o teste:\n• Decida se continuar\n• Dados mantidos\n• Volte a Básico grátis se preferir\n• Zero compromisso\n\nPlano Básico = Teste Permanente:\n• Gratuito para sempre\n• Experimente à vontade\n• Upgrade quando quiser\n\nGarantia 100%:\n• Reembolso total em 14 dias\n• Sem perguntas\n\nAgende demo: demo@albiemprego.pt"
      },
      {
        question: "🌟 Qual plano devo escolher para a minha empresa?",
        answer: "Guia rápido de decisão:\n\nEscolha BÁSICO (€0) se:\n• 1-10 colaboradores\n• 1-3 vagas por trimestre\n• Orçamento limitado\n• Primeira vez na plataforma\n\nEscolha PROFISSIONAL (€35) se:\n• 10-50 colaboradores\n• 5-15 vagas por ano\n• Múltiplos departamentos\n• Contratações regulares\n• Quer construir marca\n\nEscolha PREMIUM (€75) se:\n• 50+ colaboradores\n• Contratação contínua\n• 10+ vagas simultâneas\n• Múltiplas localizações\n• Analytics críticos\n\nExemplos Reais:\n• Restaurante local (8 funcionários) → Básico\n• Loja retail (20 funcionários) → Profissional\n• Indústria (80 funcionários) → Premium\n\nCalculadora: Se contratação custa €3.000+\n• 1 contratação/ano → Básico\n• 2-6 contratações/ano → Profissional\n• 7+ contratações/ano → Premium\n\nDúvidas? ajuda@albiemprego.pt\n\nRegra de ouro: Comece com Básico, faça upgrade quando sentir necessidade!"
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
                            <AccordionContent className="text-muted-foreground prose prose-sm max-w-none">
                              <div className="space-y-3 whitespace-pre-line">
                                {item.answer}
                              </div>
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