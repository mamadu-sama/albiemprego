import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Privacidade() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold text-foreground mb-8">
            Política de Privacidade
          </h1>
          <p className="text-muted-foreground mb-8">
            Última atualização: Janeiro 2024
          </p>

          <div className="prose prose-lg max-w-none text-muted-foreground">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introdução</h2>
              <p>
                O AlbiEmprego está comprometido em proteger a privacidade dos seus utilizadores. 
                Esta Política de Privacidade explica como recolhemos, utilizamos, armazenamos e 
                protegemos os seus dados pessoais em conformidade com o Regulamento Geral sobre 
                a Proteção de Dados (RGPD).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Dados que Recolhemos</h2>
              <p className="mb-4">Recolhemos os seguintes tipos de dados:</p>
              
              <h3 className="text-xl font-medium text-foreground mb-2">2.1 Dados de Identificação</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Nome completo</li>
                <li>Endereço de email</li>
                <li>Número de telefone</li>
                <li>Morada</li>
              </ul>

              <h3 className="text-xl font-medium text-foreground mb-2">2.2 Dados Profissionais</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Curriculum vitae</li>
                <li>Experiência profissional</li>
                <li>Formação académica</li>
                <li>Competências e certificações</li>
              </ul>

              <h3 className="text-xl font-medium text-foreground mb-2">2.3 Dados Técnicos</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Endereço IP</li>
                <li>Tipo de browser e dispositivo</li>
                <li>Dados de navegação e interação com a plataforma</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Finalidade do Tratamento</h2>
              <p className="mb-4">Utilizamos os seus dados para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fornecer e melhorar os nossos serviços</li>
                <li>Processar candidaturas a ofertas de emprego</li>
                <li>Comunicar consigo sobre o seu perfil e candidaturas</li>
                <li>Personalizar a sua experiência na plataforma</li>
                <li>Cumprir obrigações legais</li>
                <li>Prevenir fraude e garantir a segurança</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Base Legal</h2>
              <p className="mb-4">O tratamento dos seus dados baseia-se em:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Consentimento:</strong> quando aceita os nossos termos e condições</li>
                <li><strong>Execução de contrato:</strong> para prestar os serviços solicitados</li>
                <li><strong>Interesse legítimo:</strong> para melhorar os nossos serviços</li>
                <li><strong>Obrigação legal:</strong> quando exigido por lei</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Partilha de Dados</h2>
              <p className="mb-4">Os seus dados podem ser partilhados com:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Empregadores:</strong> quando se candidata a uma vaga, os seus dados são partilhados com a empresa anunciante</li>
                <li><strong>Prestadores de serviços:</strong> parceiros que nos ajudam a operar a plataforma</li>
                <li><strong>Autoridades:</strong> quando legalmente exigido</li>
              </ul>
              <p className="mt-4">
                Nunca vendemos os seus dados pessoais a terceiros.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Retenção de Dados</h2>
              <p>
                Mantemos os seus dados enquanto a sua conta estiver ativa ou conforme necessário 
                para lhe fornecer os nossos serviços. Pode solicitar a eliminação da sua conta e 
                dados a qualquer momento. Após a eliminação, podemos reter alguns dados para 
                cumprir obrigações legais.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Os Seus Direitos</h2>
              <p className="mb-4">Ao abrigo do RGPD, tem direito a:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Acesso:</strong> obter uma cópia dos seus dados pessoais</li>
                <li><strong>Retificação:</strong> corrigir dados inexatos ou incompletos</li>
                <li><strong>Apagamento:</strong> solicitar a eliminação dos seus dados</li>
                <li><strong>Portabilidade:</strong> receber os seus dados em formato estruturado</li>
                <li><strong>Oposição:</strong> opor-se ao tratamento dos seus dados</li>
                <li><strong>Limitação:</strong> restringir o tratamento dos seus dados</li>
              </ul>
              <p className="mt-4">
                Para exercer estes direitos, contacte-nos através de privacidade@albiemprego.pt
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Segurança</h2>
              <p>
                Implementamos medidas técnicas e organizacionais adequadas para proteger os seus 
                dados contra acesso não autorizado, alteração, divulgação ou destruição. Isto inclui 
                encriptação, controlos de acesso e auditorias regulares de segurança.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Cookies</h2>
              <p>
                Utilizamos cookies e tecnologias semelhantes para melhorar a sua experiência, 
                analisar o tráfego e personalizar conteúdo. Pode gerir as suas preferências de 
                cookies nas definições do seu browser.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Alterações à Política</h2>
              <p>
                Podemos atualizar esta política periodicamente. Notificaremos sobre alterações 
                significativas através de email ou aviso na plataforma. Recomendamos que reveja 
                esta página regularmente.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contacto</h2>
              <p>
                Para questões sobre privacidade ou para exercer os seus direitos, contacte o nosso 
                Encarregado de Proteção de Dados:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> privacidade@albiemprego.pt<br />
                <strong>Morada:</strong> Av. da Liberdade, 123, 6000-000 Castelo Branco<br />
                <strong>Telefone:</strong> +351 272 123 456
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">12. Autoridade de Controlo</h2>
              <p>
                Se considerar que o tratamento dos seus dados viola a legislação aplicável, 
                tem direito a apresentar reclamação junto da Comissão Nacional de Proteção de 
                Dados (CNPD) - www.cnpd.pt
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
