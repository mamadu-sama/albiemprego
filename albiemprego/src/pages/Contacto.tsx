import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "info@albiemprego.pt",
    description: "Resposta em até 24 horas",
  },
  {
    icon: Phone,
    title: "Telefone",
    value: "+351 272 123 456",
    description: "Segunda a Sexta, 9h-18h",
  },
  {
    icon: MapPin,
    title: "Morada",
    value: "Av. da Liberdade, 123",
    description: "6000-000 Castelo Branco",
  },
  {
    icon: Clock,
    title: "Horário",
    value: "Segunda a Sexta",
    description: "09:00 - 18:00",
  },
];

export default function Contacto() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mensagem enviada com sucesso! Entraremos em contacto em breve.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary/5 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Entre em Contacto
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tem dúvidas ou sugestões? Estamos aqui para ajudar. 
              Escolha o melhor canal para entrar em contacto connosco.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact Info */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Informações de Contacto
                </h2>
                {contactInfo.map((info) => (
                  <Card key={info.title}>
                    <CardContent className="flex items-start gap-4 pt-6">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{info.title}</h3>
                        <p className="text-foreground">{info.value}</p>
                        <p className="text-sm text-muted-foreground">{info.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Card className="bg-primary text-primary-foreground">
                  <CardContent className="pt-6">
                    <MessageSquare className="h-8 w-8 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Suporte Empresarial</h3>
                    <p className="text-primary-foreground/80 text-sm mb-4">
                      Para empresas que procuram recrutar ou têm questões sobre os nossos serviços empresariais.
                    </p>
                    <Button variant="secondary" size="sm">
                      empresas@albiemprego.pt
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Envie-nos uma Mensagem</CardTitle>
                  <CardDescription>
                    Preencha o formulário abaixo e entraremos em contacto o mais brevemente possível.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo *</Label>
                        <Input id="name" placeholder="O seu nome" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" placeholder="email@exemplo.com" required />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input id="phone" placeholder="+351 912 345 678" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Assunto *</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um assunto" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">Questão Geral</SelectItem>
                            <SelectItem value="candidate">Suporte Candidato</SelectItem>
                            <SelectItem value="company">Suporte Empresa</SelectItem>
                            <SelectItem value="technical">Problema Técnico</SelectItem>
                            <SelectItem value="partnership">Parceria</SelectItem>
                            <SelectItem value="feedback">Feedback/Sugestão</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem *</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Escreva a sua mensagem aqui..."
                        className="min-h-[150px]"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full md:w-auto">
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Mensagem
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Map placeholder */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="bg-muted rounded-xl h-[300px] flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Av. da Liberdade, 123 - 6000-000 Castelo Branco
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Perguntas Frequentes
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  q: "Como posso criar uma conta?",
                  a: "Clique em 'Registar' no canto superior direito e siga as instruções para criar a sua conta gratuitamente."
                },
                {
                  q: "O serviço é gratuito para candidatos?",
                  a: "Sim! O AlbiEmprego é completamente gratuito para candidatos. Pode pesquisar vagas, candidatar-se e gerir o seu perfil sem qualquer custo."
                },
                {
                  q: "Como posso publicar uma vaga?",
                  a: "Empresas devem primeiro criar uma conta empresarial. Depois, podem publicar vagas através do painel de gestão."
                },
                {
                  q: "Quanto tempo demora a aprovar uma vaga?",
                  a: "As vagas são normalmente aprovadas em até 24 horas úteis após a submissão."
                },
              ].map((faq, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                    <p className="text-muted-foreground text-sm">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
