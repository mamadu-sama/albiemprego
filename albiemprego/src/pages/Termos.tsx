import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Termos() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold text-foreground mb-8">
            Termos e Condições de Utilização
          </h1>
          <p className="text-muted-foreground mb-8">
            Última atualização: Janeiro 2024
          </p>

          <div className="prose prose-lg max-w-none text-muted-foreground">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Aceitação dos Termos</h2>
              <p>
                Ao aceder e utilizar a plataforma AlbiEmprego, concorda em cumprir e ficar vinculado 
                aos presentes Termos e Condições de Utilização. Se não concordar com alguma parte 
                destes termos, não deverá utilizar a nossa plataforma.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Descrição do Serviço</h2>
              <p className="mb-4">
                O AlbiEmprego é uma plataforma online de emprego que permite:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>A candidatos procurar e candidatar-se a ofertas de emprego</li>
                <li>A empresas publicar ofertas de emprego e gerir candidaturas</li>
                <li>A ligação entre candidatos e empregadores na região de Castelo Branco</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Registo e Conta</h2>
              <p className="mb-4">
                Para utilizar determinados serviços da plataforma, é necessário criar uma conta. Ao registar-se, compromete-se a:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fornecer informações verdadeiras, precisas e atualizadas</li>
                <li>Manter a confidencialidade da sua palavra-passe</li>
                <li>Notificar-nos imediatamente de qualquer utilização não autorizada da sua conta</li>
                <li>Ser responsável por todas as atividades realizadas através da sua conta</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Utilização Aceitável</h2>
              <p className="mb-4">
                Ao utilizar a plataforma, concorda em não:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Publicar conteúdo falso, enganoso ou fraudulento</li>
                <li>Violar quaisquer leis ou regulamentos aplicáveis</li>
                <li>Interferir com o funcionamento normal da plataforma</li>
                <li>Utilizar a plataforma para fins diferentes dos previstos</li>
                <li>Recolher dados de outros utilizadores sem autorização</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Conteúdo do Utilizador</h2>
              <p>
                Os utilizadores são responsáveis pelo conteúdo que publicam na plataforma, 
                incluindo currículos, descrições de vagas e qualquer outra informação. 
                O AlbiEmprego reserva-se o direito de remover conteúdo que viole estes termos 
                ou que considere inadequado.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo da plataforma, incluindo textos, gráficos, logótipos, ícones e software, 
                é propriedade do AlbiEmprego ou dos seus licenciadores e está protegido por leis de 
                propriedade intelectual.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Limitação de Responsabilidade</h2>
              <p>
                O AlbiEmprego não garante a obtenção de emprego ou a contratação de candidatos. 
                A plataforma serve apenas como intermediário entre candidatos e empresas. 
                Não somos responsáveis por quaisquer decisões de contratação ou por disputas 
                entre utilizadores.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Alterações aos Termos</h2>
              <p>
                Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                As alterações serão publicadas nesta página e, quando significativas, 
                notificaremos os utilizadores por email ou através da plataforma.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Lei Aplicável</h2>
              <p>
                Estes termos são regidos pela lei portuguesa. Quaisquer disputas serão 
                resolvidas nos tribunais competentes de Castelo Branco, Portugal.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contacto</h2>
              <p>
                Para questões relacionadas com estes Termos e Condições, contacte-nos através de:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> legal@albiemprego.pt<br />
                <strong>Morada:</strong> Av. da Liberdade, 123, 6000-000 Castelo Branco
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
