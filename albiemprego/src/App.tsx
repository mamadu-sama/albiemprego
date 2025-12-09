import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CookieConsent } from "@/components/CookieConsent";
import { MaintenanceProvider, useMaintenance } from "@/contexts/MaintenanceContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { MaintenanceBanner } from "@/components/MaintenanceBanner";
import Index from "./pages/Index";
import Vagas from "./pages/Vagas";
import VagaDetail from "./pages/VagaDetail";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PendingApproval from "./pages/auth/PendingApproval";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import NotFound from "./pages/NotFound";
import Manutencao from "./pages/Manutencao";
import CandidatoDashboard from "./pages/candidato/Dashboard";
import CandidatoCandidaturas from "./pages/candidato/Candidaturas";
import CandidatoPerfil from "./pages/candidato/Perfil";
import EditarPerfil from "./pages/candidato/EditarPerfil";
import Alertas from "./pages/candidato/Alertas";
import CandidatoConta from "./pages/candidato/Conta";
import EmpresaDashboard from "./pages/empresa/Dashboard";
import EmpresaVagas from "./pages/empresa/Vagas";
import NovaVaga from "./pages/empresa/NovaVaga";
import EmpresaPerfil from "./pages/empresa/Perfil";
import EditarPerfilEmpresa from "./pages/empresa/EditarPerfil";
import EmpresaCandidaturas from "./pages/empresa/Candidaturas";
import VagaCandidaturas from "./pages/empresa/VagaCandidaturas";
import EditarVaga from "./pages/empresa/EditarVaga";
import Rascunhos from "./pages/empresa/Rascunhos";
import EmpresaConta from "./pages/empresa/Conta";
import PerfilCandidato from "./pages/empresa/PerfilCandidato";
import EnviarEmail from "./pages/empresa/EnviarEmail";
import EmpresaPlanos from "./pages/empresa/Planos";
import DestacarVaga from "./pages/empresa/DestacarVaga";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUtilizadores from "./pages/admin/Utilizadores";
import AdminEmpresas from "./pages/admin/Empresas";
import AdminVagas from "./pages/admin/Vagas";
import AdminDenuncias from "./pages/admin/Denuncias";
import AdminAprovacoes from "./pages/admin/Aprovacoes";
import AdminConfiguracoes from "./pages/admin/Configuracoes";
import AdminRelatorios from "./pages/admin/Relatorios";
import EditarConteudo from "./pages/admin/EditarConteudo";
import AdminNotificacoes from "./pages/admin/Notificacoes";
import AdminPerfilUtilizador from "./pages/admin/PerfilUtilizador";
import AdminPerfilEmpresa from "./pages/admin/PerfilEmpresa";
import EnviarEmailAdmin from "./pages/admin/EnviarEmailAdmin";
import AdminGerirPlanos from "./pages/admin/GerirPlanos";
import AdminMensagens from "./pages/admin/Mensagens";
import Sobre from "./pages/Sobre";
import Contacto from "./pages/Contacto";
import Termos from "./pages/Termos";
import Privacidade from "./pages/Privacidade";
import Cookies from "./pages/Cookies";
import FAQ from "./pages/FAQ";
import EstatisticasSalarios from "./pages/EstatisticasSalarios";
import ComunidadeIndex from "./pages/comunidade/Index";
import Discussoes from "./pages/comunidade/Discussoes";
import DiscussaoDetail from "./pages/comunidade/DiscussaoDetail";
import NovaDiscussao from "./pages/comunidade/NovaDiscussao";
import Eventos from "./pages/comunidade/Eventos";
import EventoDetail from "./pages/comunidade/EventoDetail";
import Membros from "./pages/comunidade/Membros";
import MembroPerfil from "./pages/comunidade/MembroPerfil";
import Suporte from "./pages/Suporte";
import CandidatoMensagens from "./pages/candidato/Mensagens";
import EmpresaMensagens from "./pages/empresa/Mensagens";
import { useMessageNotifications } from "./hooks/useMessageNotifications";

const queryClient = new QueryClient();

function MessageNotificationProvider({ children }: { children: React.ReactNode }) {
  // Enable message notifications globally
  useMessageNotifications({ pollingInterval: 15000 });
  return <>{children}</>;
}

function AppContent() {
  const location = useLocation();
  const { isMaintenanceMode } = useMaintenance();
  
  // Check if current route is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Show maintenance page for non-admin users when maintenance mode is active
  if (isMaintenanceMode && !isAdminRoute) {
    return <Manutencao />;
  }

  return (
    <MessageNotificationProvider>
      <MaintenanceBanner />
      <CookieConsent />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/vagas" element={<Vagas />} />
        <Route path="/vagas/:id" element={<VagaDetail />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/pending-approval" element={<PendingApproval />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        {/* Candidate Routes */}
        <Route path="/candidato/dashboard" element={<CandidatoDashboard />} />
        <Route path="/candidato/candidaturas" element={<CandidatoCandidaturas />} />
        <Route path="/candidato/perfil" element={<CandidatoPerfil />} />
        <Route path="/candidato/perfil/editar" element={<EditarPerfil />} />
        <Route path="/candidato/alertas" element={<Alertas />} />
        <Route path="/candidato/conta" element={<CandidatoConta />} />
        <Route path="/candidato/mensagens" element={<CandidatoMensagens />} />
        <Route path="/candidato/mensagens/:conversationId" element={<CandidatoMensagens />} />
        {/* Company Routes */}
        <Route path="/empresa/dashboard" element={<EmpresaDashboard />} />
        <Route path="/empresa/vagas" element={<EmpresaVagas />} />
        <Route path="/empresa/vagas/nova" element={<NovaVaga />} />
        <Route path="/empresa/vagas/:id/editar" element={<EditarVaga />} />
        <Route path="/empresa/vagas/:id/candidaturas" element={<VagaCandidaturas />} />
        <Route path="/empresa/candidaturas" element={<EmpresaCandidaturas />} />
        <Route path="/empresa/candidato/:id" element={<PerfilCandidato />} />
        <Route path="/empresa/candidato/:id/email" element={<EnviarEmail />} />
        <Route path="/empresa/perfil/editar" element={<EditarPerfilEmpresa />} />
        <Route path="/empresa/perfil" element={<EmpresaPerfil />} />
        <Route path="/empresa/rascunhos" element={<Rascunhos />} />
        <Route path="/empresa/conta" element={<EmpresaConta />} />
        <Route path="/empresa/planos" element={<EmpresaPlanos />} />
        <Route path="/empresa/vagas/:id/destacar" element={<DestacarVaga />} />
        <Route path="/empresa/mensagens" element={<EmpresaMensagens />} />
        <Route path="/empresa/mensagens/:conversationId" element={<EmpresaMensagens />} />
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/utilizadores" element={<AdminUtilizadores />} />
        <Route path="/admin/empresas" element={<AdminEmpresas />} />
        <Route path="/admin/vagas" element={<AdminVagas />} />
        <Route path="/admin/denuncias" element={<AdminDenuncias />} />
        <Route path="/admin/aprovacoes" element={<AdminAprovacoes />} />
        <Route path="/admin/configuracoes" element={<AdminConfiguracoes />} />
        <Route path="/admin/relatorios" element={<AdminRelatorios />} />
        <Route path="/admin/notificacoes" element={<AdminNotificacoes />} />
        <Route path="/admin/conteudo/:pageId" element={<EditarConteudo />} />
        <Route path="/admin/utilizador/:id" element={<AdminPerfilUtilizador />} />
        <Route path="/admin/utilizador/:id/email" element={<EnviarEmailAdmin />} />
        <Route path="/admin/empresa/:id" element={<AdminPerfilEmpresa />} />
        <Route path="/admin/empresa/:id/email" element={<EnviarEmailAdmin />} />
        <Route path="/admin/planos" element={<AdminGerirPlanos />} />
        <Route path="/admin/mensagens" element={<AdminMensagens />} />
        <Route path="/admin/mensagens/:conversationId" element={<AdminMensagens />} />
        {/* Static Pages */}
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/termos" element={<Termos />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="/cookies" element={<Cookies />} />
<Route path="/faq" element={<FAQ />} />
        <Route path="/estatisticas-salarios" element={<EstatisticasSalarios />} />
        {/* Community Routes */}
        <Route path="/comunidade" element={<ComunidadeIndex />} />
        <Route path="/comunidade/discussoes" element={<Discussoes />} />
        <Route path="/comunidade/discussoes/nova" element={<NovaDiscussao />} />
        <Route path="/comunidade/discussoes/:id" element={<DiscussaoDetail />} />
        <Route path="/comunidade/eventos" element={<Eventos />} />
        <Route path="/comunidade/eventos/:id" element={<EventoDetail />} />
        <Route path="/comunidade/membros" element={<Membros />} />
        <Route path="/comunidade/membros/:id" element={<MembroPerfil />} />
        {/* Support Route */}
        <Route path="/suporte" element={<Suporte />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MessageNotificationProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <MaintenanceProvider>
          <SubscriptionProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </SubscriptionProvider>
        </MaintenanceProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
