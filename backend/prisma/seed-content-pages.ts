import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const contentPages = [
  {
    slug: "termos",
    title: "Termos e Condições",
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
  },
  {
    slug: "privacidade",
    title: "Política de Privacidade",
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

Para questões sobre privacidade: privacidade@albiemprego.pt`,
  },
  {
    slug: "cookies",
    title: "Política de Cookies",
    content: `# Política de Cookies

## O que são Cookies?

Cookies são pequenos ficheiros de texto armazenados no seu dispositivo quando visita um website.

## Como Utilizamos Cookies

Utilizamos cookies para:
- Manter a sua sessão iniciada
- Recordar as suas preferências
- Analisar o tráfego do website
- Melhorar a experiência do utilizador

## Tipos de Cookies

### Cookies Essenciais
Necessários para o funcionamento básico do website.

### Cookies de Análise
Ajudam-nos a entender como os visitantes utilizam o website.

### Cookies de Funcionalidade
Permitem memorizar as suas preferências.

## Gestão de Cookies

Pode gerir os cookies através das definições do seu navegador.

## Contacto

Para questões sobre cookies: privacidade@albiemprego.pt`,
  },
  {
    slug: "sobre",
    title: "Sobre Nós",
    content: `# Sobre o AlbiEmprego

## A Nossa Missão

O AlbiEmprego é uma plataforma regional dedicada a conectar talento local com oportunidades de emprego na região de Castelo Branco.

## O Que Fazemos

Facilitamos o processo de recrutamento, oferecendo:
- Uma plataforma intuitiva para candidatos procurarem emprego
- Ferramentas eficazes para empresas encontrarem os melhores profissionais
- Suporte personalizado para ambas as partes

## Por que Escolher o AlbiEmprego?

- **Foco Regional**: Especializados na região de Castelo Branco
- **Simples e Eficaz**: Interface intuitiva e processo simplificado
- **Suporte Dedicado**: Equipa pronta a ajudar
- **Segurança**: Proteção de dados e privacidade garantida

## Contacto

- Email: info@albiemprego.pt
- Telefone: (+351) 272 000 000
- Morada: Castelo Branco, Portugal`,
  },
  {
    slug: "faq",
    title: "Perguntas Frequentes",
    content: `# Perguntas Frequentes (FAQ)

## Para Candidatos

### Como me registo?
Clique em "Registar" no topo da página e escolha "Candidato". Preencha os dados solicitados e confirme o seu email.

### Como candidato-me a uma vaga?
Depois de iniciar sessão, procure vagas, clique em "Candidatar-me" e siga as instruções.

### Posso editar o meu perfil?
Sim, pode editar o seu perfil a qualquer momento através do painel de candidato.

## Para Empresas

### Como publico uma vaga?
Após registo e aprovação, aceda ao painel de empresa e clique em "Publicar Vaga".

### Quanto tempo demora a aprovação?
Normalmente, aprovamos empresas em 24-48 horas.

### Posso editar uma vaga publicada?
Sim, pode editar as suas vagas a qualquer momento através do painel de empresa.

## Geral

### A plataforma é gratuita?
Sim, o AlbiEmprego é gratuito tanto para candidatos como para empresas.

### Como posso contactar o suporte?
Envie um email para suporte@albiemprego.pt ou use o formulário de contacto.`,
  },
];

async function seedContentPages() {
  console.log("🌱 A fazer seed das páginas de conteúdo...");

  for (const page of contentPages) {
    await prisma.contentPage.upsert({
      where: { slug: page.slug },
      update: {
        title: page.title,
        content: page.content,
      },
      create: page,
    });
    console.log(`✅ Página "${page.title}" criada/atualizada`);
  }

  console.log("✅ Seed de páginas de conteúdo concluído!");
}

seedContentPages()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

