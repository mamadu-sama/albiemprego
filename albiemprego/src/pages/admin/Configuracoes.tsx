import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminSettingsApi } from "@/lib/admin-api";
import { 
  Settings, 
  Globe, 
  Shield, 
  Bell, 
  Save,
  RefreshCw,
  FileText,
  Users,
  ExternalLink,
  Edit
} from "lucide-react";

export default function AdminConfiguracoes() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // General Settings
  const [siteName, setSiteName] = useState("AlbiEmprego");
  const [siteDescription, setSiteDescription] = useState("Plataforma de emprego para a região de Castelo Branco");
  const [contactEmail, setContactEmail] = useState("info@albiemprego.pt");
  const [supportEmail, setSupportEmail] = useState("suporte@albiemprego.pt");

  // Features
  const [requireCompanyApproval, setRequireCompanyApproval] = useState(true);
  const [requireJobApproval, setRequireJobApproval] = useState(true);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [enableEmailAlerts, setEnableEmailAlerts] = useState(true);
  const [allowGuestApplications, setAllowGuestApplications] = useState(false);

  // Limits
  const [maxJobsPerCompany, setMaxJobsPerCompany] = useState("10");
  const [maxApplicationsPerCandidate, setMaxApplicationsPerCandidate] = useState("50");
  const [jobExpirationDays, setJobExpirationDays] = useState("30");

  // Buscar configurações ao carregar
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const settings = await adminSettingsApi.getSettings();
      
      // Atualizar estados
      setSiteName(settings.siteName);
      setSiteDescription(settings.siteDescription);
      setContactEmail(settings.contactEmail);
      setSupportEmail(settings.supportEmail);
      setRequireCompanyApproval(settings.requireCompanyApproval);
      setRequireJobApproval(settings.requireJobApproval);
      setEnableNotifications(settings.enableNotifications);
      setEnableEmailAlerts(settings.enableEmailAlerts);
      setAllowGuestApplications(settings.allowGuestApplications);
      setMaxJobsPerCompany(settings.maxJobsPerCompany.toString());
      setMaxApplicationsPerCandidate(settings.maxApplicationsPerCandidate.toString());
      setJobExpirationDays(settings.jobExpirationDays.toString());
    } catch (error) {
      console.error("Erro ao buscar configurações:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      await adminSettingsApi.updateSettings({
        siteName,
        siteDescription,
        contactEmail,
        supportEmail,
        requireCompanyApproval,
        requireJobApproval,
        enableNotifications,
        enableEmailAlerts,
        allowGuestApplications,
        maxJobsPerCompany: parseInt(maxJobsPerCompany),
        maxApplicationsPerCandidate: parseInt(maxApplicationsPerCandidate),
        jobExpirationDays: parseInt(jobExpirationDays),
      });

      toast({
        title: "Configurações guardadas",
        description: "As alterações foram aplicadas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao guardar configurações:", error);
      toast({
        title: "Erro",
        description: "Não foi possível guardar as configurações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Mostrar loading inicial
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Settings className="h-8 w-8 text-primary" />
                Configurações da Plataforma
              </h1>
              <p className="text-muted-foreground">
                Gerir definições gerais e funcionalidades
              </p>
            </div>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Guardar Alterações
            </Button>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Geral</span>
              </TabsTrigger>
              <TabsTrigger value="features" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Funcionalidades</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notificações</span>
              </TabsTrigger>
              <TabsTrigger value="limits" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Limites</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Conteúdo</span>
              </TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações do Site</CardTitle>
                    <CardDescription>Configurações básicas da plataforma</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="siteName">Nome do Site</Label>
                        <Input 
                          id="siteName" 
                          value={siteName} 
                          onChange={(e) => setSiteName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">Email de Contacto</Label>
                        <Input 
                          id="contactEmail" 
                          type="email"
                          value={contactEmail} 
                          onChange={(e) => setContactEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="siteDescription">Descrição do Site</Label>
                      <Textarea 
                        id="siteDescription" 
                        value={siteDescription} 
                        onChange={(e) => setSiteDescription(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supportEmail">Email de Suporte</Label>
                      <Input 
                        id="supportEmail" 
                        type="email"
                        value={supportEmail} 
                        onChange={(e) => setSupportEmail(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/30">
                  <CardHeader>
                    <CardTitle className="text-primary">Nota sobre Modo de Manutenção</CardTitle>
                    <CardDescription>O modo de manutenção é gerido na página de Notificações</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Para ativar ou desativar o modo de manutenção, aceda à página de Gestão de Notificações.
                    </p>
                    <Button variant="outline" asChild>
                      <Link to="/admin/notificacoes">
                        Ir para Notificações
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features">
              <Card>
                <CardHeader>
                  <CardTitle>Funcionalidades</CardTitle>
                  <CardDescription>Ativar ou desativar funcionalidades da plataforma</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium">Aprovação de Empresas</p>
                      <p className="text-sm text-muted-foreground">
                        Novas empresas requerem aprovação antes de publicar vagas
                      </p>
                    </div>
                    <Switch 
                      checked={requireCompanyApproval} 
                      onCheckedChange={setRequireCompanyApproval}
                    />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium">Aprovação de Vagas</p>
                      <p className="text-sm text-muted-foreground">
                        Novas vagas requerem aprovação antes de serem publicadas
                      </p>
                    </div>
                    <Switch 
                      checked={requireJobApproval} 
                      onCheckedChange={setRequireJobApproval}
                    />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium">Candidaturas de Visitantes</p>
                      <p className="text-sm text-muted-foreground">
                        Permitir candidaturas sem registo na plataforma
                      </p>
                    </div>
                    <Switch 
                      checked={allowGuestApplications} 
                      onCheckedChange={setAllowGuestApplications}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notificações</CardTitle>
                  <CardDescription>Configurar notificações da plataforma</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium">Notificações Push</p>
                      <p className="text-sm text-muted-foreground">
                        Enviar notificações push aos utilizadores
                      </p>
                    </div>
                    <Switch 
                      checked={enableNotifications} 
                      onCheckedChange={setEnableNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium">Alertas por Email</p>
                      <p className="text-sm text-muted-foreground">
                        Enviar emails de alerta para novas vagas e candidaturas
                      </p>
                    </div>
                    <Switch 
                      checked={enableEmailAlerts} 
                      onCheckedChange={setEnableEmailAlerts}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Limits Tab */}
            <TabsContent value="limits">
              <Card>
                <CardHeader>
                  <CardTitle>Limites da Plataforma</CardTitle>
                  <CardDescription>Definir limites para utilizadores e empresas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="maxJobs">Máx. Vagas por Empresa</Label>
                      <Input 
                        id="maxJobs" 
                        type="number"
                        value={maxJobsPerCompany} 
                        onChange={(e) => setMaxJobsPerCompany(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">0 = ilimitado</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxApplications">Máx. Candidaturas por Candidato</Label>
                      <Input 
                        id="maxApplications" 
                        type="number"
                        value={maxApplicationsPerCandidate} 
                        onChange={(e) => setMaxApplicationsPerCandidate(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">0 = ilimitado</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiration">Expiração de Vagas (dias)</Label>
                      <Input 
                        id="expiration" 
                        type="number"
                        value={jobExpirationDays} 
                        onChange={(e) => setJobExpirationDays(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Após publicação</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle>Páginas de Conteúdo</CardTitle>
                  <CardDescription>Gerir páginas estáticas da plataforma</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium">Termos e Condições</p>
                        <p className="text-sm text-muted-foreground">Última atualização: 2024-01-10</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="/termos" target="_blank">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/admin/conteudo/termos">
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium">Política de Privacidade</p>
                        <p className="text-sm text-muted-foreground">Última atualização: 2024-01-08</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="/privacidade" target="_blank">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/admin/conteudo/privacidade">
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium">Política de Cookies</p>
                        <p className="text-sm text-muted-foreground">Última atualização: 2024-01-01</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="/cookies" target="_blank">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/admin/conteudo/cookies">
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium">Sobre Nós</p>
                        <p className="text-sm text-muted-foreground">Última atualização: 2024-01-05</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="/sobre" target="_blank">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/admin/conteudo/sobre">
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium">FAQ</p>
                        <p className="text-sm text-muted-foreground">Última atualização: 2024-01-03</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="/faq" target="_blank">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/admin/conteudo/faq">
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
