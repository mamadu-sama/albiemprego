import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { useMaintenance } from "@/contexts/MaintenanceContext";
import { adminNotificationApi, adminMaintenanceApi } from "@/lib/admin-api";
import { 
  Send, 
  Bell, 
  Users, 
  Building2, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  Megaphone,
  Gift,
  Settings,
  Eye,
  Trash2,
  Wrench,
  Power,
  Clock,
  Loader2
} from "lucide-react";
import type { NotificationType } from "@/components/NotificationCenter";

interface SentNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType | "maintenance";
  recipients: "all" | "candidates" | "companies";
  sentAt: Date;
  readCount: number;
  totalRecipients: number;
}

const notificationTypeOptions: { value: NotificationType | "maintenance"; label: string; icon: typeof Info }[] = [
  { value: "info", label: "Informação", icon: Info },
  { value: "success", label: "Sucesso", icon: CheckCircle },
  { value: "warning", label: "Aviso", icon: AlertTriangle },
  { value: "announcement", label: "Anúncio", icon: Megaphone },
  { value: "promotion", label: "Promoção", icon: Gift },
  { value: "system", label: "Sistema", icon: Settings },
  { value: "maintenance", label: "Manutenção", icon: Wrench },
];

const recipientOptions = [
  { value: "all", label: "Todos os Utilizadores", icon: Users },
  { value: "candidates", label: "Apenas Candidatos", icon: Users },
  { value: "companies", label: "Apenas Empresas", icon: Building2 },
];

const typeColors: Record<NotificationType | "maintenance", string> = {
  info: "bg-blue-100 text-blue-700 border-blue-200",
  success: "bg-green-100 text-green-700 border-green-200",
  warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
  announcement: "bg-purple-100 text-purple-700 border-purple-200",
  promotion: "bg-pink-100 text-pink-700 border-pink-200",
  system: "bg-gray-100 text-gray-700 border-gray-200",
  maintenance: "bg-orange-100 text-orange-700 border-orange-200",
};

export default function AdminNotificacoes() {
  const {
    isMaintenanceMode,
    setMaintenanceMode,
    setMaintenanceBanner,
    maintenanceMessage,
    setMaintenanceMessage,
    estimatedEndTime,
    setEstimatedEndTime,
  } = useMaintenance();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotificationType | "maintenance">("info");
  const [recipients, setRecipients] = useState<"all" | "candidates" | "companies">("all");
  const [sendEmail, setSendEmail] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentNotifications, setSentNotifications] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Carregar histórico ao montar
  useEffect(() => {
    fetchHistory();
    syncMaintenanceMode();
  }, []);

  const syncMaintenanceMode = async () => {
    try {
      const maintenanceData = await adminMaintenanceApi.getStatus();
      setMaintenanceMode(maintenanceData.enabled);
      if (maintenanceData.message) {
        setMaintenanceMessage(maintenanceData.message);
      }
      if (maintenanceData.estimatedEndTime) {
        setEstimatedEndTime(maintenanceData.estimatedEndTime);
      }
    } catch (error) {
      console.error("Erro ao sincronizar modo de manutenção:", error);
    }
  };

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const data = await adminNotificationApi.getHistory();
      setSentNotifications(data.notifications || []);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o título e a mensagem.",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    
    try {
      await adminNotificationApi.send({
        title: title.trim(),
        message: message.trim(),
        type: type, // Será convertido para uppercase no admin-api.ts
        recipients,
        sendEmail,
      });

      // Se for notificação de manutenção, mostrar banner
      if (type === "maintenance") {
        setMaintenanceBanner({
          id: Date.now().toString(),
          title: title.trim(),
          message: message.trim(),
          sentAt: new Date(),
        });
      }

      toast({
        title: type === "maintenance" ? "Aviso de manutenção enviado" : "Notificação enviada",
        description: type === "maintenance" 
          ? "O banner de manutenção está agora visível para todos os utilizadores."
          : `A notificação foi enviada com sucesso${sendEmail ? " (incluindo email)" : ""}.`,
      });

      // Limpar formulário
      setTitle("");
      setMessage("");
      setType("info");
      setRecipients("all");
      setSendEmail(false);

      // Recarregar histórico
      fetchHistory();
    } catch (error: any) {
      toast({
        title: "Erro ao enviar notificação",
        description: error.response?.data?.message || "Ocorreu um erro",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleMaintenanceModeToggle = async (enabled: boolean) => {
    try {
      const payload: any = {
        enabled,
      };

      // Só incluir message se tiver valor e estiver ativando
      if (enabled && maintenanceMessage && maintenanceMessage.trim()) {
        payload.message = maintenanceMessage.trim();
      } else if (enabled) {
        payload.message = "Estamos a realizar melhorias na plataforma. Voltaremos em breve!";
      }

      // Só incluir estimatedEndTime se tiver valor e estiver ativando
      if (enabled && estimatedEndTime && estimatedEndTime.trim()) {
        payload.estimatedEndTime = estimatedEndTime;
      }

      console.log("Enviando payload de manutenção:", payload); // Debug

      const response = await adminMaintenanceApi.update(payload);
      
      console.log("Resposta do backend:", response); // Debug

      // Atualizar contexto
      setMaintenanceMode(enabled);
      
      if (enabled) {
        setMaintenanceMessage(payload.message);
        if (payload.estimatedEndTime) {
          setEstimatedEndTime(payload.estimatedEndTime);
        }
      }

      console.log("Estado atualizado - isMaintenanceMode:", enabled); // Debug

      toast({
        title: enabled ? "Modo de manutenção ativado" : "Modo de manutenção desativado",
        description: enabled 
          ? "Os utilizadores verão a página de manutenção ao aceder à plataforma."
          : "A plataforma está novamente acessível aos utilizadores.",
      });

      // Forçar re-sincronização após 1 segundo
      setTimeout(() => {
        syncMaintenanceMode();
      }, 1000);
    } catch (error: any) {
      console.error("Erro ao alterar modo de manutenção:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || "Ocorreu um erro";
      console.error("Detalhes do erro:", error.response?.data); // Debug
      toast({
        title: "Erro ao alterar modo de manutenção",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await adminNotificationApi.delete(id);
      toast({
        title: "Notificação eliminada",
        description: "A notificação foi removida do histórico.",
      });
      fetchHistory();
    } catch (error: any) {
      toast({
        title: "Erro ao eliminar notificação",
        description: error.response?.data?.message || "Ocorreu um erro",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getRecipientLabel = (recipients: string) => {
    switch (recipients) {
      case "all": return "Todos";
      case "candidates": return "Candidatos";
      case "companies": return "Empresas";
      default: return recipients;
    }
  };

  const getTypeLabel = (type: NotificationType | "maintenance") => {
    const option = notificationTypeOptions.find(o => o.value === type);
    return option?.label || type;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Gestão de Notificações
            </h1>
            <p className="text-muted-foreground">
              Envie notificações e gerencie o modo de manutenção da plataforma.
            </p>
          </div>

          {/* Maintenance Mode Card */}
          <Card className="mb-8 border-orange-200 bg-orange-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <Wrench className="h-5 w-5" />
                Modo de Manutenção
              </CardTitle>
              <CardDescription>
                Quando ativado, todos os utilizadores (exceto admins) verão apenas a página de manutenção.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Power className={`h-5 w-5 ${isMaintenanceMode ? "text-orange-600" : "text-muted-foreground"}`} />
                  <div>
                    <p className="font-medium">Estado do Modo de Manutenção</p>
                    <p className="text-sm text-muted-foreground">
                      {isMaintenanceMode ? "Ativo - Plataforma inacessível" : "Inativo - Plataforma acessível"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={isMaintenanceMode}
                  onCheckedChange={handleMaintenanceModeToggle}
                />
              </div>

              <Separator />

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maintenanceMessage">Mensagem de Manutenção</Label>
                  <Textarea
                    id="maintenanceMessage"
                    value={maintenanceMessage}
                    onChange={(e) => setMaintenanceMessage(e.target.value)}
                    placeholder="Mensagem exibida na página de manutenção..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedTime">Previsão de Retorno (opcional)</Label>
                  <div className="flex gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground mt-2" />
                    <Input
                      id="estimatedTime"
                      value={estimatedEndTime}
                      onChange={(e) => setEstimatedEndTime(e.target.value)}
                      placeholder="Ex: 14:00 ou Hoje às 18h"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Esta informação será exibida aos utilizadores na página de manutenção.
                  </p>
                </div>
              </div>

              {isMaintenanceMode && (
                <div className="bg-orange-100 border border-orange-300 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-orange-800">Modo de Manutenção Ativo</p>
                      <p className="text-sm text-orange-700 mt-1">
                        Todos os utilizadores que tentarem aceder à plataforma serão redirecionados para a página de manutenção. 
                        Apenas administradores podem navegar normalmente.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Send Notification Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Enviar Nova Notificação
                </CardTitle>
                <CardDescription>
                  Crie e envie uma notificação para os utilizadores selecionados.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Nova funcionalidade disponível"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem *</Label>
                  <Textarea
                    id="message"
                    placeholder="Escreva a mensagem da notificação..."
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Notificação</Label>
                    <Select value={type} onValueChange={(v) => setType(v as NotificationType | "maintenance")}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {notificationTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <option.icon className="h-4 w-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Destinatários</Label>
                    <Select value={recipients} onValueChange={(v) => setRecipients(v as typeof recipients)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {recipientOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <option.icon className="h-4 w-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {type === "maintenance" && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Wrench className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-orange-800">Aviso de Manutenção</p>
                        <p className="text-sm text-orange-700 mt-1">
                          Esta notificação aparecerá como um banner no topo de todas as páginas até o utilizador fechar.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sendEmail"
                    checked={sendEmail}
                    onCheckedChange={(checked) => setSendEmail(checked as boolean)}
                  />
                  <Label htmlFor="sendEmail" className="text-sm cursor-pointer">
                    Enviar também por email
                  </Label>
                </div>

                <Button
                  className="w-full"
                  onClick={handleSend}
                  disabled={sending || !title.trim() || !message.trim()}
                >
                  {sending ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      A enviar...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Notificação
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Preview Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Pré-visualização
                </CardTitle>
                <CardDescription>
                  Assim ficará a notificação para os utilizadores.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {type === "maintenance" ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-2">Banner de manutenção:</p>
                    <div className="bg-yellow-500 text-yellow-950 px-4 py-3 rounded-lg">
                      <div className="flex items-center justify-center gap-3">
                        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                        <div className="text-center">
                          <span className="font-semibold">{title || "Título do aviso"}: </span>
                          <span>{message || "Mensagem do aviso..."}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <div className="flex gap-3">
                      <div className={`p-2 rounded-full ${
                        type === "info" ? "bg-blue-100 text-blue-600" :
                        type === "success" ? "bg-green-100 text-green-600" :
                        type === "warning" ? "bg-yellow-100 text-yellow-600" :
                        type === "announcement" ? "bg-purple-100 text-purple-600" :
                        type === "promotion" ? "bg-pink-100 text-pink-600" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {type === "info" && <Info className="h-4 w-4" />}
                        {type === "success" && <CheckCircle className="h-4 w-4" />}
                        {type === "warning" && <AlertTriangle className="h-4 w-4" />}
                        {type === "announcement" && <Megaphone className="h-4 w-4" />}
                        {type === "promotion" && <Gift className="h-4 w-4" />}
                        {type === "system" && <Settings className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-foreground">
                          {title || "Título da notificação"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {message || "A mensagem da notificação aparecerá aqui..."}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {getTypeLabel(type)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Agora mesmo
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 p-4 border rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Resumo do Envio</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <span className="font-medium text-foreground">Destinatários:</span>{" "}
                      {getRecipientLabel(recipients)} (
                      {recipients === "all" ? "~500" : recipients === "candidates" ? "~380" : "~120"} utilizadores)
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Email:</span>{" "}
                      {sendEmail ? "Sim" : "Não"}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Tipo:</span>{" "}
                      {getTypeLabel(type)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sent Notifications History */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Histórico de Notificações
              </CardTitle>
              <CardDescription>
                Lista de notificações enviadas recentemente.
              </CardDescription>
            </CardHeader>
              <CardContent>
              {loadingHistory ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Notificação</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Destinatários</TableHead>
                    <TableHead>Enviada em</TableHead>
                    <TableHead className="text-center">Leituras</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sentNotifications.map((notification, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="font-medium truncate">{notification.title}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {notification.message}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={typeColors[notification.type as any] || "bg-gray-100"}>
                          {getTypeLabel(notification.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>Todos</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(new Date(notification.sentAt))}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-medium">{notification.readCount}</span>
                        <span className="text-muted-foreground">/{notification.totalRecipients}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-muted-foreground text-sm">-</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
