import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, ArrowRight, Sparkles, Users, Building2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const popularSearches = [
  "Desenvolvedor",
  "Enfermeiro",
  "Administrativo",
  "Vendedor",
  "Engenheiro",
];

const municipalities = [
  "Castelo Branco",
  "Covilhã",
  "Fundão",
  "Idanha-a-Nova",
  "Penamacor",
  "Vila Velha de Ródão",
  "Oleiros",
  "Proença-a-Nova",
  "Sertã",
  "Vila de Rei",
];

export function HeroSection() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (location) params.set("loc", location);
    navigate(`/vagas?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-16 md:py-24 lg:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container-custom relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles className="h-4 w-4" />
            <span>A plataforma de emprego da região de Castelo Branco</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
          >
            Encontre o seu{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              emprego ideal
            </span>
            <br />
            na sua região
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            Conectamos talentos locais às melhores oportunidades em Castelo Branco e concelhos vizinhos. O seu próximo passo na carreira começa aqui.
          </motion.p>

          {/* Search Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onSubmit={handleSearch}
            className="bg-card rounded-2xl shadow-xl border border-border/50 p-3 md:p-4 max-w-3xl mx-auto"
          >
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Cargo, empresa ou palavras-chave"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-12 h-12 bg-background border-0 focus-visible:ring-0 text-base"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-12 h-12 bg-background border-0 rounded-lg text-base text-foreground focus:outline-none focus:ring-0 appearance-none cursor-pointer"
                >
                  <option value="">Todos os concelhos</option>
                  {municipalities.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" size="lg" className="h-12 px-8">
                Pesquisar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.form>

          {/* Popular Searches */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-2"
          >
            <span className="text-sm text-muted-foreground">Populares:</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => {
                  setQuery(term);
                  navigate(`/vagas?q=${term}`);
                }}
                className="text-sm text-primary hover:text-primary-hover hover:underline transition-colors"
              >
                {term}
              </button>
            ))}
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-primary mb-1">
                <TrendingUp className="h-5 w-5" />
                <span className="text-2xl font-bold">250+</span>
              </div>
              <p className="text-sm text-muted-foreground">Vagas Ativas</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-secondary mb-1">
                <Building2 className="h-5 w-5" />
                <span className="text-2xl font-bold">80+</span>
              </div>
              <p className="text-sm text-muted-foreground">Empresas</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-accent mb-1">
                <Users className="h-5 w-5" />
                <span className="text-2xl font-bold">1.5k+</span>
              </div>
              <p className="text-sm text-muted-foreground">Candidatos</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
