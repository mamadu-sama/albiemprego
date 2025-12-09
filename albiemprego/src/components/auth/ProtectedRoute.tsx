import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredType?: "CANDIDATO" | "EMPRESA" | "ADMIN";
  redirectTo?: string;
}

/**
 * Componente para proteger rotas que requerem autenticação
 * e/ou tipo específico de utilizador
 */
export function ProtectedRoute({ 
  children, 
  requiredType, 
  redirectTo = "/auth/login" 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Enquanto carrega o estado de autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">A verificar autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, redireciona para login
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Se o utilizador está pendente de aprovação, redireciona
  if (user.status === "PENDING") {
    return <Navigate to="/auth/pending-approval" replace />;
  }

  // Se o utilizador está suspenso
  if (user.status === "SUSPENDED") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md p-6">
          <h1 className="text-2xl font-bold text-destructive mb-4">
            Conta Suspensa
          </h1>
          <p className="text-muted-foreground mb-6">
            A sua conta foi suspensa. Por favor, contacte o suporte para mais informações.
          </p>
          <a 
            href="/suporte" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Contactar Suporte
          </a>
        </div>
      </div>
    );
  }

  // Se requer tipo específico de utilizador
  if (requiredType && user.type !== requiredType) {
    // Redireciona para o dashboard apropriado do utilizador
    const dashboardMap: Record<string, string> = {
      CANDIDATO: "/candidato/dashboard",
      EMPRESA: "/empresa/dashboard",
      ADMIN: "/admin/dashboard",
    };

    const userDashboard = dashboardMap[user.type];
    
    return (
      <Navigate 
        to={userDashboard} 
        replace 
        state={{ 
          error: "Não tem permissão para aceder a esta página." 
        }} 
      />
    );
  }

  // Se tudo está OK, renderiza o componente
  return <>{children}</>;
}

/**
 * Componente para rotas que devem ser acessíveis apenas por utilizadores NÃO autenticados
 * (ex: login, register)
 */
export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  // Enquanto carrega
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">A verificar autenticação...</p>
        </div>
      </div>
    );
  }

  // Se está autenticado, redireciona para o dashboard apropriado
  if (user) {
    const dashboardMap: Record<string, string> = {
      CANDIDATO: "/candidato/dashboard",
      EMPRESA: "/empresa/dashboard",
      ADMIN: "/admin/dashboard",
    };

    const userDashboard = dashboardMap[user.type] || "/";
    return <Navigate to={userDashboard} replace />;
  }

  // Se não está autenticado, mostra a página
  return <>{children}</>;
}

