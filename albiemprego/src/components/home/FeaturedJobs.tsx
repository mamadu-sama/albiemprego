import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { JobCard, Job } from "@/components/jobs/JobCard";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// Mock data for featured jobs
const featuredJobs: Job[] = [
  {
    id: "1",
    title: "Engenheiro de Software Full Stack",
    company: "TechCast Solutions",
    location: "Castelo Branco",
    contractType: "Permanente",
    workMode: "Híbrido",
    salary: "35.000€ - 45.000€/ano",
    postedAt: "Há 2 dias",
    isFeatured: true,
    quickApply: true,
  },
  {
    id: "2",
    title: "Enfermeiro/a - Urgência",
    company: "Hospital Amato Lusitano",
    location: "Castelo Branco",
    contractType: "Permanente",
    workMode: "Presencial",
    salary: "1.800€ - 2.200€/mês",
    postedAt: "Há 1 dia",
    isNew: true,
  },
  {
    id: "3",
    title: "Gestor Comercial",
    company: "Beira Interior Consulting",
    location: "Covilhã",
    contractType: "Permanente",
    workMode: "Presencial",
    salary: "1.500€ + comissões",
    postedAt: "Há 3 dias",
    isFeatured: true,
  },
  {
    id: "4",
    title: "Designer Gráfico",
    company: "Creative Studio CB",
    location: "Castelo Branco",
    contractType: "Part-time",
    workMode: "Remoto",
    postedAt: "Há 5 dias",
    quickApply: true,
  },
  {
    id: "5",
    title: "Técnico de Contabilidade",
    company: "Gabinete Contas Certas",
    location: "Fundão",
    contractType: "Permanente",
    workMode: "Presencial",
    salary: "1.200€ - 1.500€/mês",
    postedAt: "Há 1 semana",
    isNew: true,
  },
  {
    id: "6",
    title: "Assistente Administrativo/a",
    company: "Município de Idanha-a-Nova",
    location: "Idanha-a-Nova",
    contractType: "Temporário",
    workMode: "Presencial",
    postedAt: "Há 4 dias",
  },
  {
    id: "7",
    title: "Chef de Cozinha",
    company: "Hotel & Spa Serra da Estrela",
    location: "Covilhã",
    contractType: "Permanente",
    workMode: "Presencial",
    salary: "1.400€ - 1.800€/mês",
    postedAt: "Há 6 dias",
  },
  {
    id: "8",
    title: "Estágio - Marketing Digital",
    company: "Digital Beira",
    location: "Castelo Branco",
    contractType: "Estágio",
    workMode: "Híbrido",
    postedAt: "Há 2 dias",
    isNew: true,
    quickApply: true,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function FeaturedJobs() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Vagas em Destaque
            </h2>
            <p className="text-muted-foreground text-lg">
              As melhores oportunidades da região selecionadas para si
            </p>
          </div>
          <Link to="/vagas">
            <Button variant="outline" className="group">
              Ver Todas as Vagas
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Jobs Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {featuredJobs.map((job) => (
            <motion.div key={job.id} variants={item}>
              <JobCard job={job} />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Não encontrou o que procura?
          </p>
          <Link to="/candidato/alertas">
            <Button variant="secondary" size="lg">
              Criar Alerta de Emprego
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
