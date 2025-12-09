import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Send, Paperclip } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const emailTemplates = [
  { 
    id: "warning", 
    name: "Aviso de Violação",
    subject: "Aviso: Violação dos Termos de Uso",
    body: `Prezado(a) [NOME],

Detetámos que a sua conta pode estar em violação dos nossos Termos de Uso.

[DESCREVER A VIOLAÇÃO]

Solicitamos que regularize a situação no prazo de 5 dias úteis, caso contrário, a sua conta poderá ser suspensa.

Se acredita que se trata de um erro, por favor responda a este email com as devidas justificações.

Atenciosamente,
Equipa AlbiEmprego`
  },
  { 
    id: "suspension", 
    name: "Notificação de Suspensão",
    subject: "Conta Suspensa",
    body: `Prezado(a) [NOME],

Informamos que a sua conta foi suspensa devido a:

[MOTIVO DA SUSPENSÃO]

Durante o período de suspensão, não poderá aceder às funcionalidades da plataforma.

Para apelar desta decisão, responda a este email explicando a sua situação.

Atenciosamente,
Equipa AlbiEmprego`
  },
  { 
    id: "activation", 
    name: "Conta Ativada",
    subject: "A sua conta foi ativada!",
    body: `Prezado(a) [NOME],

Temos o prazer de informar que a sua conta foi ativada com sucesso!

Agora pode aceder a todas as funcionalidades da plataforma AlbiEmprego.

Se tiver alguma dúvida, não hesite em contactar-nos.

Bem-vindo(a)!
Equipa AlbiEmprego`
  },
  { 
    id: "info_request", 
    name: "Pedido de Informações",
    subject: "Pedido de Informações Adicionais",
    body: `Prezado(a) [NOME],

Para darmos continuidade ao processo de verificação da sua conta, necessitamos das seguintes informações:

[LISTA DE INFORMAÇÕES NECESSÁRIAS]

Por favor, responda a este email com os documentos/informações solicitados.

Obrigado pela colaboração.

Atenciosamente,
Equipa AlbiEmprego`
  },
  { 
    id: "custom", 
    name: "Email Personalizado",
    subject: "",
    body: ""
  },
];

export default function EnviarEmailAdmin() {
  const { id } = useParams();
  const location = useLocation();
  const { toast } = useToast();
  
  const isCompany = location.pathname.includes('/empresa/');
  const recipientType = isCompany ? 'empresa' : 'utilizador';
  
  const mockRecipient = isCompany 
    ? { name: "TechSolutions Lda", email: "contact@techsolutions.pt", avatar: "" }
    : { name: "João Silva", email: "joao.silva@email.com", avatar: "" };

  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setSubject(template.subject.replace("[NOME]", mockRecipient.name));
      setBody(template.body.replace(/\[NOME\]/g, mockRecipient.name));
    }
  };

  const handleSend = () => {
    if (!subject.trim() || !body.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o assunto e a mensagem.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Email enviado",
      description: `Email enviado com sucesso para ${mockRecipient.email}`,
    });
  };

  const backUrl = isCompany ? `/admin/empresa/${id}` : `/admin/utilizador/${id}`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          {/* Back Button */}
          <Link to={backUrl} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao perfil
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Enviar Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Recipient Info */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={mockRecipient.avatar} alt={mockRecipient.name} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {mockRecipient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{mockRecipient.name}</p>
                  <p className="text-sm text-muted-foreground">{mockRecipient.email}</p>
                </div>
              </div>

              {/* Template Selection */}
              <div className="space-y-2">
                <Label>Modelo de Email</Label>
                <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar modelo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {emailTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject">Assunto *</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Assunto do email"
                />
              </div>

              {/* Body */}
              <div className="space-y-2">
                <Label htmlFor="body">Mensagem *</Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Escreva a sua mensagem..."
                  rows={12}
                />
              </div>

              {/* Attachment */}
              <div className="space-y-2">
                <Label>Anexos</Label>
                <Button variant="outline" className="w-full">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Adicionar anexo
                </Button>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button variant="outline" className="flex-1" asChild>
                  <Link to={backUrl}>Cancelar</Link>
                </Button>
                <Button className="flex-1" onClick={handleSend}>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
