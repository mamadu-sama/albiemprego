import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Headphones, MessageSquare, Send, HelpCircle, FileQuestion, AlertTriangle, Lightbulb, MoreHorizontal, Paperclip, ExternalLink } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  getStoredConversations,
  createNewConversation,
  addMessageToConversation,
  mockParticipants,
  currentUser,
} from '@/data/mockChat';

const subjectOptions = [
  { value: 'candidatura', label: 'Problema com candidatura', icon: FileQuestion },
  { value: 'conta', label: 'Dúvida sobre conta', icon: HelpCircle },
  { value: 'reportar', label: 'Reportar vaga inadequada', icon: AlertTriangle },
  { value: 'sugestao', label: 'Sugestão', icon: Lightbulb },
  { value: 'outro', label: 'Outro', icon: MoreHorizontal },
];

const faqItems = [
  {
    question: 'Como atualizo o meu CV?',
    answer: 'Aceda ao seu perfil e clique em "Editar Perfil". Na secção de CV, pode fazer upload de um novo ficheiro.'
  },
  {
    question: 'Como vejo o estado das minhas candidaturas?',
    answer: 'No seu dashboard, clique em "Candidaturas" para ver todas as suas candidaturas e respetivos estados.'
  },
  {
    question: 'Como cancelo uma candidatura?',
    answer: 'Aceda às suas candidaturas, encontre a vaga desejada e clique em "Cancelar Candidatura".'
  },
];

const Suporte = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingConversation, setExistingConversation] = useState<string | null>(null);

  // Check if user already has a support conversation
  useEffect(() => {
    const conversations = getStoredConversations();
    const supportConv = conversations.find(
      c => c.context?.type === 'support' || c.participants.some(p => p.type === 'admin')
    );
    if (supportConv) {
      setExistingConversation(supportConv.id);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject || message.length < 20) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor preencha todos os campos. A mensagem deve ter pelo menos 20 caracteres.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Find admin user
      const admin = mockParticipants.find(p => p.type === 'admin');
      if (!admin) {
        throw new Error('Suporte não disponível');
      }

      // Create or get existing conversation
      const conversation = createNewConversation(admin, { type: 'support' });

      // Add the message with subject
      const subjectLabel = subjectOptions.find(s => s.value === subject)?.label || subject;
      const fullMessage = `📋 Assunto: ${subjectLabel}\n\n${message}`;
      
      addMessageToConversation(conversation.id, {
        conversationId: conversation.id,
        senderId: currentUser.id,
        text: fullMessage,
        timestamp: new Date(),
        status: 'sent',
      });

      toast({
        title: 'Mensagem enviada!',
        description: 'A nossa equipa responderá o mais breve possível.',
      });

      // Navigate to the conversation
      navigate(`/mensagens/${conversation.id}`);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar a mensagem. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
              <Headphones className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Como podemos ajudar?</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Fale connosco, responderemos o mais rápido possível.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              {existingConversation ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      Conversa de Suporte Ativa
                    </CardTitle>
                    <CardDescription>
                      Já tem uma conversa de suporte em aberto
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Pode continuar a sua conversa existente ou iniciar uma nova mensagem.
                    </p>
                    <div className="flex gap-3">
                      <Button asChild>
                        <Link to={`/mensagens/${existingConversation}`}>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Continuar Conversa
                        </Link>
                      </Button>
                      <Button variant="outline" onClick={() => setExistingConversation(null)}>
                        Nova Mensagem
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="w-5 h-5 text-primary" />
                      Enviar Mensagem
                    </CardTitle>
                    <CardDescription>
                      Descreva o seu problema ou dúvida
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="subject">Assunto *</Label>
                        <Select value={subject} onValueChange={setSubject}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o assunto" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjectOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center gap-2">
                                  <option.icon className="w-4 h-4" />
                                  {option.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Mensagem *</Label>
                        <Textarea
                          id="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Descreva detalhadamente o seu problema ou dúvida..."
                          rows={6}
                          className="resize-none"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Mínimo 20 caracteres</span>
                          <span className={message.length < 20 ? 'text-destructive' : ''}>
                            {message.length}/2000
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <Button type="button" variant="outline" disabled>
                          <Paperclip className="w-4 h-4 mr-2" />
                          Anexar (em breve)
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                              A enviar...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Enviar Mensagem
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar - FAQ */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-primary" />
                    Perguntas Frequentes
                  </CardTitle>
                  <CardDescription>
                    Talvez a sua dúvida já tenha resposta
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {faqItems.map((item, index) => (
                    <div key={index} className="pb-4 border-b last:border-0 last:pb-0">
                      <h4 className="font-medium text-sm mb-1">{item.question}</h4>
                      <p className="text-xs text-muted-foreground">{item.answer}</p>
                    </div>
                  ))}
                  <Link 
                    to="/faq" 
                    className="flex items-center text-sm text-primary hover:underline"
                  >
                    Ver todas as perguntas
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Tempo médio de resposta
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      &lt; 24 horas
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Em dias úteis
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Suporte;
