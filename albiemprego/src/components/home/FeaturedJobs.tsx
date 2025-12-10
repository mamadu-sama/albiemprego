import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { JobCard, Job } from "@/components/jobs/JobCard";
import { ArrowRight, Loader2, Home } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { jobApi } from "@/lib/api";

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
  const { data: jobs, isLoading } = useQuery({
    queryKey: ["featured-homepage-jobs"],
    queryFn: () => jobApi.getFeaturedHomepageJobs(6),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const formatJob = (job: any): Job => ({
    id: job.id,
    title: job.title,
    company: job.company.name,
    location: job.location,
    contractType: job.type === "FULL_TIME" ? "Permanente" : 
                  job.type === "PART_TIME" ? "Part-time" : 
                  job.type === "TEMPORARY" ? "Temporário" :
                  job.type === "INTERNSHIP" ? "Estágio" : "Freelance",
    workMode: job.workMode === "PRESENCIAL" ? "Presencial" :
              job.workMode === "REMOTO" ? "Remoto" : "Híbrido",
    salary: job.showSalary && job.salaryMin ? 
            `${job.salaryMin}€${job.salaryMax ? ` - ${job.salaryMax}€` : ''}/${job.salaryPeriod || 'mês'}` : 
            undefined,
    postedAt: new Date(job.createdAt).toLocaleDateString("pt-PT"),
    isFeatured: job.creditUsages?.some((u: any) => u.creditType === "HOMEPAGE" && u.isActive),
    isUrgent: job.creditUsages?.some((u: any) => u.creditType === "URGENT" && u.isActive),
    quickApply: true,
  });

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Home className="h-6 w-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Vagas em Destaque
              </h2>
            </div>
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Jobs Grid */}
        {!isLoading && jobs && jobs.length > 0 && (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {jobs.map((job) => (
              <motion.div key={job.id} variants={item}>
                <JobCard job={formatJob(job)} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && (!jobs || jobs.length === 0) && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhuma vaga em destaque disponível no momento.
            </p>
          </div>
        )}

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
