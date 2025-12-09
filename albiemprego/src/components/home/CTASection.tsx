import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, User, Building2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Candidates CTA */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative bg-gradient-to-br from-primary to-primary-hover rounded-2xl p-8 md:p-10 text-primary-foreground overflow-hidden group"
          >
            {/* Background decoration */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-foreground/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary-foreground/10 rounded-full blur-3xl" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-6 w-6" />
                <span className="text-sm font-medium text-primary-foreground/80">
                  Para Candidatos
                </span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Encontre a sua próxima oportunidade
              </h3>
              
              <p className="text-primary-foreground/80 mb-6 leading-relaxed">
                Crie o seu perfil gratuito, pesquise vagas na região e candidate-se às melhores oportunidades. Receba alertas personalizados diretamente no seu email.
              </p>
              
              <ul className="space-y-2 mb-8">
                {[
                  "Perfil profissional gratuito",
                  "Candidatura com um clique",
                  "Alertas de emprego personalizados",
                  "Acompanhamento de candidaturas",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4" />
                    {item}
                  </li>
                ))}
              </ul>
              
              <Link to="/auth/register?type=candidato">
                <Button 
                  variant="hero-outline" 
                  size="lg"
                  className="group/btn"
                >
                  Criar Conta Gratuita
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Companies CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl p-8 md:p-10 text-secondary-foreground overflow-hidden group"
          >
            {/* Background decoration */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-secondary-foreground/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary-foreground/10 rounded-full blur-3xl" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-6 w-6" />
                <span className="text-sm font-medium text-secondary-foreground/80">
                  Para Empresas
                </span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Encontre o talento que procura
              </h3>
              
              <p className="text-secondary-foreground/80 mb-6 leading-relaxed">
                Publique vagas, aceda a uma base de candidatos locais qualificados e contrate de forma rápida e eficiente na região de Castelo Branco.
              </p>
              
              <ul className="space-y-2 mb-8">
                {[
                  "Publicação de vagas ilimitada*",
                  "Acesso à base de candidatos",
                  "Ferramentas de gestão de candidaturas",
                  "Perfil de empresa personalizado",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4" />
                    {item}
                  </li>
                ))}
              </ul>
              
              <Link to="/auth/register?type=empresa">
                <Button 
                  variant="hero-outline" 
                  size="lg"
                  className="group/btn border-secondary-foreground/30 bg-secondary-foreground/10 hover:bg-secondary-foreground/20"
                >
                  Publicar Vaga Agora
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
