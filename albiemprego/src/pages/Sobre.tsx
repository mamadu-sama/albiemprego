import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Target, 
  Heart, 
  Users, 
  MapPin, 
  Award,
  TrendingUp
} from "lucide-react";

const stats = [
  { value: "10.000+", label: "Candidatos Registados" },
  { value: "500+", label: "Empresas Parceiras" },
  { value: "2.500+", label: "Vagas Publicadas" },
  { value: "1.800+", label: "Contratações" },
];

const values = [
  {
    icon: Target,
    title: "Missão",
    description: "Conectar talentos locais com oportunidades de emprego na região de Castelo Branco, promovendo o desenvolvimento económico regional.",
  },
  {
    icon: Heart,
    title: "Valores",
    description: "Transparência, compromisso com a comunidade local, e dedicação em criar pontes entre candidatos e empresas.",
  },
  {
    icon: Users,
    title: "Comunidade",
    description: "Somos mais do que uma plataforma de emprego. Somos uma comunidade focada no crescimento profissional da nossa região.",
  },
];

const team = [
  { name: "Ana Rodrigues", role: "CEO & Fundadora" },
  { name: "Pedro Santos", role: "Diretor de Tecnologia" },
  { name: "Maria Costa", role: "Gestora de Parcerias" },
  { name: "João Ferreira", role: "Suporte ao Cliente" },
];

export default function Sobre() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary/5 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Sobre o AlbiEmprego
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Somos a plataforma líder de emprego na região de Castelo Branco, 
              dedicados a conectar os melhores talentos locais com as empresas da nossa região.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
                A Nossa História
              </h2>
              <div className="prose prose-lg text-muted-foreground">
                <p className="mb-4">
                  O AlbiEmprego nasceu em 2020 com uma missão clara: combater a fuga de talentos 
                  da região interior de Portugal e criar oportunidades de emprego locais de qualidade.
                </p>
                <p className="mb-4">
                  Fundado por uma equipa de profissionais naturais de Castelo Branco, compreendemos 
                  os desafios únicos do mercado de trabalho regional. Sabemos que existem talentos 
                  extraordinários na nossa região que merecem oportunidades à altura das suas capacidades.
                </p>
                <p>
                  Hoje, somos a ponte entre candidatos qualificados e empresas inovadoras, 
                  contribuindo para o crescimento económico e social da nossa comunidade.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
              O Que Nos Move
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value) => (
                <Card key={value.title}>
                  <CardContent className="pt-6 text-center">
                    <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Regional Focus */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 text-primary mb-4">
                  <MapPin className="h-5 w-5" />
                  <span className="font-medium">Foco Regional</span>
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  Conhecemos a Nossa Região
                </h2>
                <p className="text-muted-foreground mb-4">
                  A nossa especialização no mercado de trabalho de Castelo Branco e municípios 
                  vizinhos permite-nos oferecer um serviço personalizado e eficaz.
                </p>
                <p className="text-muted-foreground mb-6">
                  Trabalhamos ativamente com:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    Empresas locais e multinacionais na região
                  </li>
                  <li className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    Instituições de ensino superior
                  </li>
                  <li className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    Câmaras municipais e associações empresariais
                  </li>
                  <li className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    Incubadoras e startups regionais
                  </li>
                </ul>
              </div>
              <div className="bg-primary/5 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Municípios Abrangidos
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Castelo Branco", "Covilhã", "Fundão", "Idanha-a-Nova",
                    "Penamacor", "Vila Velha de Ródão", "Oleiros", "Proença-a-Nova",
                    "Sertã", "Vila de Rei", "Belmonte", "Guarda"
                  ].map((city) => (
                    <div key={city} className="flex items-center gap-2 text-sm">
                      <MapPin className="h-3 w-3 text-primary" />
                      {city}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
              A Nossa Equipa
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {team.map((member) => (
                <div key={member.name} className="text-center">
                  <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
