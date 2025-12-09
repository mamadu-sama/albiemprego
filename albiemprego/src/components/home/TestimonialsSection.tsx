import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    id: 1,
    quote: "Encontrei o meu emprego de sonho em menos de duas semanas. A plataforma é intuitiva e as vagas são todas da região, o que facilita muito a procura.",
    author: "Ana Marques",
    role: "Engenheira de Software",
    company: "TechCast Solutions",
    avatar: "AM",
  },
  {
    id: 2,
    quote: "Como empresa local, o AlbiEmprego foi fundamental para encontrarmos talento qualificado na região. Já contratámos 5 colaboradores através da plataforma.",
    author: "Pedro Santos",
    role: "Diretor de RH",
    company: "Indústrias Beira Interior",
    avatar: "PS",
  },
  {
    id: 3,
    quote: "Depois de muitos anos a trabalhar fora, voltei a Castelo Branco e o AlbiEmprego ajudou-me a encontrar uma oportunidade perfeita perto de casa.",
    author: "Maria Silva",
    role: "Gestora Comercial",
    company: "Grupo Albicastrense",
    avatar: "MS",
  },
  {
    id: 4,
    quote: "A melhor parte é poder filtrar por concelho. Encontrei um trabalho a 10 minutos de casa no Fundão. Recomendo a todos os jovens da região.",
    author: "Rui Costa",
    role: "Técnico de Manutenção",
    company: "Metalúrgica Central",
    avatar: "RC",
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="section-padding bg-muted/30 overflow-hidden">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            O Que Dizem os Nossos Utilizadores
          </h2>
          <p className="text-lg text-muted-foreground">
            Histórias de sucesso de candidatos e empresas da região de Castelo Branco
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Buttons */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full shadow-md"
              onClick={prev}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full shadow-md"
              onClick={next}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Testimonial Card */}
          <div className="overflow-hidden px-8 md:px-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-card border-border/50 shadow-lg">
                  <CardContent className="p-8 md:p-12">
                    <Quote className="h-10 w-10 text-primary/20 mb-6" />
                    <blockquote className="text-lg md:text-xl text-foreground leading-relaxed mb-8">
                      "{testimonials[currentIndex].quote}"
                    </blockquote>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
                        {testimonials[currentIndex].avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {testimonials[currentIndex].author}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {testimonials[currentIndex].role} @ {testimonials[currentIndex].company}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === currentIndex
                    ? "bg-primary"
                    : "bg-border hover:bg-muted-foreground"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
