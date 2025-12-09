import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Send, Paperclip, X } from "lucide-react";

// Mock candidate data
const candidatoData = {
  id: "1",
  nome: "João Silva",
  email: "joao.silva@email.com",
  vaga: "Frontend Developer",
};

// Email templates
const emailTemplates = [
  {
    id: "convite-entrevista",
    nome: "Convite para Entrevista",
    assunto: "Convite para Entrevista - {vaga}",
    corpo: `Caro(a) {nome},

Obrigado pelo seu interesse na posição de {vaga} na nossa empresa.

Temos o prazer de o/a convidar para uma entrevista para discutirmos a sua candidatura em maior detalhe.

Por favor, confirme a sua disponibilidade para os seguintes horários:
- [Data e hora opção 1]
- [Data e hora opção 2]

Aguardamos a sua resposta.

Cumprimentos,
[O seu nome]
[Nome da empresa]`,
  },
  {
    id: "pedido-info",
    nome: "Pedido de Informação Adicional",
    assunto: "Candidatura {vaga} - Informação Adicional",
    corpo: `Caro(a) {nome},

Obrigado pela sua candidatura à posição de {vaga}.

Gostaríamos de solicitar algumas informações adicionais para complementar a sua candidatura:

- [Informação 1]
- [Informação 2]

Agradecemos a sua resposta o mais brevemente possível.

Cumprimentos,
[O seu nome]
[Nome da empresa]`,
  },
  {
    id: "feedback-positivo",
    nome: "Feedback Positivo",
    assunto: "Boa notícia sobre a sua candidatura - {vaga}",
    corpo: `Caro(a) {nome},

Temos o prazer de informar que a sua candidatura à posição de {vaga} foi bem-sucedida!

Gostaríamos de avançar para a próxima fase do processo de recrutamento.

Entraremos em contacto brevemente com mais detalhes.

Cumprimentos,
[O seu nome]
[Nome da empresa]`,
  },
  {
    id: "feedback-negativo",
    nome: "Feedback de Rejeição",
    assunto: "Atualização sobre a sua candidatura - {vaga}",
    corpo: `Caro(a) {nome},

Obrigado pelo seu interesse na posição de {vaga} e pelo tempo investido no processo de seleção.

Após uma análise cuidadosa de todas as candidaturas, decidimos avançar com outros candidatos cujos perfis estão mais alinhados com as necessidades atuais.

Agradecemos a sua compreensão e desejamos-lhe sucesso nas suas futuras oportunidades.

Cumprimentos,
[O seu nome]
[Nome da empresa]`,
  },
  {
    id: "personalizado",
    nome: "Email Personalizado",
    assunto: "",
    corpo: "",
  },
];

export default function EnviarEmail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [assunto, setAssunto] = useState("");
  const [corpo, setCorpo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [anexos, setAnexos] = useState<string[]>([]);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      const assuntoProcessado = template.assunto
        .replace("{nome}", candidatoData.nome)
        .replace("{vaga}", candidatoData.vaga);
      const corpoProcessado = template.corpo
        .replace(/{nome}/g, candidatoData.nome)
        .replace(/{vaga}/g, candidatoData.vaga);
      
      setAssunto(assuntoProcessado);
      setCorpo(corpoProcessado);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate sending email
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Email enviado com sucesso!",
      description: `O email foi enviado para ${candidatoData.email}.`,
    });

    setIsLoading(false);
    navigate(`/empresa/candidato/${id}`);
  };

  const removeAnexo = (index: number) => {
    setAnexos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          {/* Back Button */}
          <Link
            to={`/empresa/candidato/${id}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao perfil
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Enviar Email</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Recipient Info */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg mb-6">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {candidatoData.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-foreground">{candidatoData.nome}</h3>
                  <p className="text-sm text-muted-foreground">{candidatoData.email}</p>
                  <p className="text-xs text-muted-foreground">Candidatura: {candidatoData.vaga}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Template Selection */}
                <div className="space-y-2">
                  <Label>Modelo de Email</Label>
                  <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um modelo ou escreva do zero" />
                    </SelectTrigger>
                    <SelectContent>
                      {emailTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="assunto">Assunto</Label>
                  <Input
                    id="assunto"
                    value={assunto}
                    onChange={(e) => setAssunto(e.target.value)}
                    placeholder="Introduza o assunto do email"
                    required
                  />
                </div>

                {/* Body */}
                <div className="space-y-2">
                  <Label htmlFor="corpo">Mensagem</Label>
                  <Textarea
                    id="corpo"
                    value={corpo}
                    onChange={(e) => setCorpo(e.target.value)}
                    placeholder="Escreva a sua mensagem aqui..."
                    rows={12}
                    className="resize-none"
                    required
                  />
                </div>

                {/* Attachments */}
                <div className="space-y-2">
                  <Label>Anexos</Label>
                  <div className="flex flex-wrap gap-2">
                    {anexos.map((anexo, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-md text-sm"
                      >
                        <Paperclip className="h-3 w-3" />
                        {anexo}
                        <button
                          type="button"
                          onClick={() => removeAnexo(index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setAnexos(prev => [...prev, `documento-${prev.length + 1}.pdf`])}
                    >
                      <Paperclip className="h-4 w-4 mr-2" />
                      Adicionar Anexo
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    {isLoading ? "A enviar..." : "Enviar Email"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/empresa/candidato/${id}`)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
