import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, Building2, Users, CheckCircle2 } from "lucide-react";

const stats = [
  {
    icon: Briefcase,
    value: 250,
    suffix: "+",
    label: "Vagas Ativas",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Building2,
    value: 80,
    suffix: "+",
    label: "Empresas Parceiras",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Users,
    value: 1500,
    suffix: "+",
    label: "Candidatos Registados",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: CheckCircle2,
    value: 500,
    suffix: "+",
    label: "Contratações Bem-sucedidas",
    color: "text-success",
    bgColor: "bg-success/10",
  },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold">
      {count.toLocaleString("pt-PT")}
      {suffix}
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-primary to-primary-hover text-primary-foreground overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
                  <stat.icon className="w-7 h-7" />
                </div>
              </div>
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <p className="mt-2 text-primary-foreground/80 font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
