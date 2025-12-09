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
import { ProtectedRoute, GuestRoute } from "@/components/auth/ProtectedRoute";

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
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/vagas" element={<Vagas />} />
        <Route path="/vagas/:id" element={<VagaDetail />} />
        
        {/* Auth Routes - Only for guests (non-authenticated users) */}
        <Route path="/auth/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/auth/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/auth/pending-approval" element={<PendingApproval />} />
        <Route path="/auth/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
        <Route path="/auth/reset-password" element={<GuestRoute><ResetPassword /></GuestRoute>} />
        
        {/* Candidate Routes - Only for authenticated candidates */}
        <Route 
          path="/candidato/dashboard" 
          element={
            <ProtectedRoute requiredType="CANDIDATO">
              <CandidatoDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/candidato/candidaturas" 
          element={
            <ProtectedRoute requiredType="CANDIDATO">
              <CandidatoCandidaturas />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/candidato/perfil" 
          element={
            <ProtectedRoute requiredType="CANDIDATO">
              <CandidatoPerfil />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/candidato/perfil/editar" 
          element={
            <ProtectedRoute requiredType="CANDIDATO">
              <EditarPerfil />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/candidato/alertas" 
          element={
            <ProtectedRoute requiredType="CANDIDATO">
              <Alertas />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/candidato/conta" 
          element={
            <ProtectedRoute requiredType="CANDIDATO">
              <CandidatoConta />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/candidato/mensagens" 
          element={
            <ProtectedRoute requiredType="CANDIDATO">
              <CandidatoMensagens />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/candidato/mensagens/:conversationId" 
          element={
            <ProtectedRoute requiredType="CANDIDATO">
              <CandidatoMensagens />
            </ProtectedRoute>
          } 
        />
        {/* Company Routes - Only for authenticated companies */}
        <Route 
          path="/empresa/dashboard" 
          element={
            <ProtectedRoute requiredType="EMPRESA">
              <EmpresaDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/empresa/vagas" 
          element={
            <ProtectedRoute requiredType="EMPRESA">
              <EmpresaVagas />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/empresa/vagas/nova" 
          element={
            <ProtectedRoute requiredType="EMPRESA">
              <NovaVaga />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/empresa/vagas/:id/editar" 
          element={
            <ProtectedRoute requiredType="EMPRESA">
              <EditarVaga />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/empresa/vagas/:id/candidaturas" 
          element={
            <ProtectedRoute requiredType="EMPRESA">
              <VagaCandidaturas />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/empresa/candidaturas" 
          element={
            <ProtectedRoute requiredType="EMPRESA">
              <EmpresaCandidaturas />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/empresa/candidato/:id" 
          element={
            <ProtectedRoute requiredType="EMPRESA">
              <PerfilCandidato />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/empresa/candidato/:id/email" 
          element={
            <ProtectedRoute requiredType="EMPRESA">
              <EnviarEmail />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/empresa/perfil/editar" 
          element={
            <ProtectedRoute requiredType="EMPRESA">
              <EditarPerfilEmpresa />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/empresa/perfil" 
          element={
            <ProtectedRoute requiredType="EMPRESA">
              <EmpresaPerfil />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/empresa/rascunhos" 
          element={
            <ProtectedRoute requiredType="EMPRESA">
              <Rascunhos />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/empresa/conta" 
          element={
            <ProtectedRoute requiredType="EMPRESA">
              <EmpresaConta />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/empresa/planos" 
          element={
            <ProtectedRoute requiredType="EMPRESA">
              <EmpresaPlanos />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/empresa/vagas/:id/destacar" 
          element={
            <ProtectedRoute requiredType="EMPRESA">
              <DestacarVaga />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/empresa/mensagens" 
          element={
            <ProtectedRoute requiredType="EMPRESA">
              <EmpresaMensagens />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/empresa/mensagens/:conversationId" 
          element={
            <ProtectedRoute requiredType="EMPRESA">
              <EmpresaMensagens />
            </ProtectedRoute>
          } 
        />
        {/* Admin Routes - Only for authenticated admins */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute requiredType="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/utilizadores" 
          element={
            <ProtectedRoute requiredType="ADMIN">
              <AdminUtilizadores />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/empresas" 
          element={
            <ProtectedRoute requiredType="ADMIN">
              <AdminEmpresas />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/vagas" 
          element={
            <ProtectedRoute requiredType="ADMIN">
              <AdminVagas />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/denuncias" 
          element={
            <ProtectedRoute requiredType="ADMIN">
              <AdminDenuncias />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/aprovacoes" 
          element={
            <ProtectedRoute requiredType="ADMIN">
              <AdminAprovacoes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/configuracoes" 
          element={
            <ProtectedRoute requiredType="ADMIN">
              <AdminConfiguracoes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/relatorios" 
          element={
            <ProtectedRoute requiredType="ADMIN">
              <AdminRelatorios />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/notificacoes" 
          element={
            <ProtectedRoute requiredType="ADMIN">
              <AdminNotificacoes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/conteudo/:pageId" 
          element={
            <ProtectedRoute requiredType="ADMIN">
              <EditarConteudo />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/utilizador/:id" 
          element={
            <ProtectedRoute requiredType="ADMIN">
              <AdminPerfilUtilizador />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/utilizador/:id/email" 
          element={
            <ProtectedRoute requiredType="ADMIN">
              <EnviarEmailAdmin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/empresa/:id" 
          element={
            <ProtectedRoute requiredType="ADMIN">
              <AdminPerfilEmpresa />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/empresa/:id/email" 
          element={
            <ProtectedRoute requiredType="ADMIN">
              <EnviarEmailAdmin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/planos" 
          element={
            <ProtectedRoute requiredType="ADMIN">
              <AdminGerirPlanos />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/mensagens" 
          element={
            <ProtectedRoute requiredType="ADMIN">
              <AdminMensagens />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/mensagens/:conversationId" 
          element={
            <ProtectedRoute requiredType="ADMIN">
              <AdminMensagens />
            </ProtectedRoute>
          } 
        />
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
        <Route 
          path="/comunidade/discussoes/nova" 
          element={
            <ProtectedRoute>
              <NovaDiscussao />
            </ProtectedRoute>
          } 
        />
        <Route path="/comunidade/discussoes/:id" element={<DiscussaoDetail />} />
        <Route path="/comunidade/eventos" element={<Eventos />} />
        <Route path="/comunidade/eventos/:id" element={<EventoDetail />} />
        <Route path="/comunidade/membros" element={<Membros />} />
        <Route path="/comunidade/membros/:id" element={<MembroPerfil />} />
        
        {/* Support Route - requires authentication */}
        <Route 
          path="/suporte" 
          element={
            <ProtectedRoute>
              <Suporte />
            </ProtectedRoute>
          } 
        />
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
