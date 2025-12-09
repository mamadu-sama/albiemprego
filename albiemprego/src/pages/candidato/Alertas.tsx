import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useState } from "react";
import { 
  Bell, 
  BellRing,
  Mail, 
  Briefcase,
  MapPin,
  Euro,
  Plus,
  Trash2,
  Edit,
  Clock,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const savedAlerts = [
  {
    id: "1",
    name: "Developer em Castelo Branco",
    keywords: "developer, frontend, react",
    location: "Castelo Branco",
    salaryMin: 1500,
    salaryMax: 2500,
    frequency: "diário",
    active: true,
    matchCount: 5,
  },
  {
    id: "2",
    name: "Remote Frontend",
    keywords: "frontend, javascript, remoto",
    location: "Remoto",
    salaryMin: 1800,
    salaryMax: 3000,
    frequency: "semanal",
    active: true,
    matchCount: 12,
  },
  {
    id: "3",
    name: "UI/UX Designer",
    keywords: "designer, ui, ux, figma",
    location: "Qualquer",
    salaryMin: 1200,
    salaryMax: 2000,
    frequency: "diário",
    active: false,
    matchCount: 3,
  },
];

const notificationPreferences = [
  { id: "new_jobs", label: "Novas vagas correspondentes", description: "Receber notificação quando houver novas vagas que correspondam aos seus alertas", enabled: true },
  { id: "application_status", label: "Atualizações de candidaturas", description: "Receber notificação quando o estado das suas candidaturas mudar", enabled: true },
  { id: "profile_views", label: "Visualizações de perfil", description: "Receber notificação quando empresas visualizarem o seu perfil", enabled: true },
  { id: "interview_reminders", label: "Lembretes de entrevistas", description: "Receber lembretes antes das suas entrevistas agendadas", enabled: true },
  { id: "weekly_summary", label: "Resumo semanal", description: "Receber um resumo semanal da sua atividade e novas oportunidades", enabled: false },
  { id: "marketing", label: "Novidades e dicas", description: "Receber dicas de carreira e novidades sobre a plataforma", enabled: false },
];

export default function Alertas() {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState(savedAlerts);
  const [preferences, setPreferences] = useState(notificationPreferences);
  const [showNewAlert, setShowNewAlert] = useState(false);

  const toggleAlertStatus = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, active: !alert.active } : alert
    ));
    toast({
      title: "Alerta atualizado",
      description: "O estado do alerta foi alterado com sucesso.",
    });
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast({
      title: "Alerta removido",
      description: "O alerta foi removido com sucesso.",
    });
  };

  const togglePreference = (id: string) => {
    setPreferences(preferences.map(pref => 
      pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
    ));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Alertas de Emprego</h1>
              <p className="text-muted-foreground">
                Configure alertas para receber notificações sobre novas vagas
              </p>
            </div>
            <Button onClick={() => setShowNewAlert(!showNewAlert)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Novo Alerta
            </Button>
          </div>

          {/* New Alert Form */}
          {showNewAlert && (
            <Card className="mb-8 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Novo Alerta</CardTitle>
                <CardDescription>Configure os critérios para o seu novo alerta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="alert-name">Nome do Alerta</Label>
                    <Input id="alert-name" placeholder="Ex: Developer em Lisboa" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keywords">Palavras-chave</Label>
                    <Input id="keywords" placeholder="Ex: react, frontend, javascript" />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Localização</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar localização" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="castelo-branco">Castelo Branco</SelectItem>
                        <SelectItem value="covilha">Covilhã</SelectItem>
                        <SelectItem value="fundao">Fundão</SelectItem>
                        <SelectItem value="remoto">Remoto</SelectItem>
                        <SelectItem value="qualquer">Qualquer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary-min">Salário Mínimo</Label>
                    <Input id="salary-min" type="number" placeholder="1000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary-max">Salário Máximo</Label>
                    <Input id="salary-max" type="number" placeholder="3000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Frequência de Notificação</Label>
                  <Select defaultValue="diario">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="imediato">Imediato</SelectItem>
                      <SelectItem value="diario">Diário</SelectItem>
                      <SelectItem value="semanal">Semanal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={() => {
                    setShowNewAlert(false);
                    toast({
                      title: "Alerta criado",
                      description: "O seu novo alerta foi criado com sucesso.",
                    });
                  }}>
                    Criar Alerta
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewAlert(false)}>
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Saved Alerts */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BellRing className="h-5 w-5" />
                    Alertas Guardados
                  </CardTitle>
                  <CardDescription>
                    {alerts.filter(a => a.active).length} alertas ativos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {alerts.map((alert) => (
                    <div 
                      key={alert.id} 
                      className={`p-4 border rounded-lg ${alert.active ? 'bg-background' : 'bg-muted/30'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-foreground">{alert.name}</h4>
                            {alert.active ? (
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Ativo
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-muted text-muted-foreground">
                                Pausado
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              {alert.keywords}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {alert.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Euro className="h-3 w-3" />
                              {alert.salaryMin}€ - {alert.salaryMax}€
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {alert.frequency}
                            </span>
                          </div>
                          <p className="text-sm text-primary mt-2">
                            {alert.matchCount} vagas encontradas
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={alert.active} 
                            onCheckedChange={() => toggleAlertStatus(alert.id)}
                          />
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => deleteAlert(alert.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {alerts.length === 0 && (
                    <div className="text-center py-8">
                      <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-medium text-foreground mb-2">Sem alertas configurados</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Crie um alerta para receber notificações sobre novas vagas
                      </p>
                      <Button onClick={() => setShowNewAlert(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Primeiro Alerta
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Notification Preferences */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Preferências de Notificação
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {preferences.map((pref, index) => (
                    <div key={pref.id}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{pref.label}</p>
                          <p className="text-xs text-muted-foreground">{pref.description}</p>
                        </div>
                        <Switch 
                          checked={pref.enabled}
                          onCheckedChange={() => togglePreference(pref.id)}
                        />
                      </div>
                      {index < preferences.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    • Use palavras-chave específicas para resultados mais relevantes
                  </p>
                  <p>
                    • Configure alertas diários para não perder novas oportunidades
                  </p>
                  <p>
                    • Combine localização com palavras-chave para melhores resultados
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
