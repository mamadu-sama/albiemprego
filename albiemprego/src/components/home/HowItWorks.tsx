import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  UserPlus, 
  FileSearch, 
  Send, 
  Handshake,
  Building2,
  FileText,
  Users,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const candidateSteps = [
  {
    icon: UserPlus,
    title: "Crie o seu perfil",
    description: "Registe-se gratuitamente e preencha o seu perfil profissional com as suas competências e experiência.",
  },
  {
    icon: FileSearch,
    title: "Encontre vagas",
    description: "Pesquise vagas na região, filtre por critérios e receba alertas personalizados.",
  },
  {
    icon: Send,
    title: "Candidate-se",
    description: "Envie a sua candidatura com um clique. Acompanhe o estado de todas as suas candidaturas.",
  },
  {
    icon: Handshake,
    title: "Seja contratado",
    description: "Conecte-se diretamente com as empresas e dê o próximo passo na sua carreira.",
  },
];

const companySteps = [
  {
    icon: Building2,
    title: "Registe a empresa",
    description: "Crie o perfil da sua empresa em minutos e comece a publicar vagas imediatamente.",
  },
  {
    icon: FileText,
    title: "Publique vagas",
    description: "Descreva a oportunidade, requisitos e benefícios. Alcance talentos locais qualificados.",
  },
  {
    icon: Users,
    title: "Receba candidaturas",
    description: "Visualize candidatos, analise perfis, CVs e gerencie todo o processo de seleção.",
  },
  {
    icon: CheckCircle2,
    title: "Contrate talentos",
    description: "Encontre o candidato ideal para a sua equipa de forma rápida e eficiente.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function StepCard({ step, index }: { step: typeof candidateSteps[0]; index: number }) {
  return (
    <motion.div
      variants={item}
      className="relative flex flex-col items-center text-center group"
    >
      {/* Connector Line */}
      {index < 3 && (
        <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
      )}
      
      {/* Step Number */}
      <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-md z-10">
        {index + 1}
      </div>
      
      {/* Icon Container */}
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
        <step.icon className="w-9 h-9 text-primary" />
      </div>
      
      {/* Content */}
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {step.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-[240px]">
        {step.description}
      </p>
    </motion.div>
  );
}

export function HowItWorks() {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Como Funciona
          </h2>
          <p className="text-lg text-muted-foreground">
            Simples, rápido e eficaz. Conectamos candidatos e empresas da região de Castelo Branco.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="candidatos" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="candidatos" className="text-base">
              Para Candidatos
            </TabsTrigger>
            <TabsTrigger value="empresas" className="text-base">
              Para Empresas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="candidatos">
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid md:grid-cols-4 gap-8 md:gap-4"
            >
              {candidateSteps.map((step, index) => (
                <StepCard key={step.title} step={step} index={index} />
              ))}
            </motion.div>
            <div className="text-center mt-12">
              <Link to="/auth/register?type=candidato">
                <Button size="lg">
                  Começar Agora - É Grátis
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="empresas">
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid md:grid-cols-4 gap-8 md:gap-4"
            >
              {companySteps.map((step, index) => (
                <StepCard key={step.title} step={step} index={index} />
              ))}
            </motion.div>
            <div className="text-center mt-12">
              <Link to="/auth/register?type=empresa">
                <Button size="lg" variant="secondary">
                  Publicar Primeira Vaga
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
