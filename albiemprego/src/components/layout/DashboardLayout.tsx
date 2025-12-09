import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Bookmark,
  User,
  MessageSquare,
  Settings,
  Briefcase,
  Building2,
  Users,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const { user } = useAuth();
  const isCandidato = user?.type === "CANDIDATO";
  const isEmpresa = user?.type === "EMPRESA";

  const candidatoNavItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/candidato/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Procurar Vagas",
      href: "/vagas",
      icon: Briefcase,
    },
    {
      label: "Candidaturas",
      href: "/candidato/candidaturas",
      icon: FileText,
    },
    {
      label: "Vagas Guardadas",
      href: "/candidato/vagas-guardadas",
      icon: Bookmark,
    },
    {
      label: "Mensagens",
      href: "/candidato/mensagens",
      icon: MessageSquare,
    },
    {
      label: "Meu Perfil",
      href: "/candidato/perfil",
      icon: User,
    },
  ];

  const empresaNavItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/empresa/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Minhas Vagas",
      href: "/empresa/vagas",
      icon: Briefcase,
    },
    {
      label: "Candidaturas",
      href: "/empresa/candidaturas",
      icon: Users,
    },
    {
      label: "Mensagens",
      href: "/empresa/mensagens",
      icon: MessageSquare,
    },
    {
      label: "Perfil da Empresa",
      href: "/empresa/perfil",
      icon: Building2,
    },
  ];

  const navItems = isCandidato ? candidatoNavItems : isEmpresa ? empresaNavItems : [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-20">
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <Button
                      key={item.href}
                      asChild
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3",
                        isActive && "bg-secondary font-medium"
                      )}
                    >
                      <Link to={item.href}>
                        <Icon className="h-4 w-4" />
                        {item.label}
                        {item.badge && (
                          <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </Button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

