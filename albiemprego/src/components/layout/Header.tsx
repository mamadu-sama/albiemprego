import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Briefcase, User, Building2, ChevronDown, Users, LogOut, Settings, LayoutDashboard, FileText, MessageSquare, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { href: "/vagas", label: "Vagas" },
  { href: "/comunidade", label: "Comunidade", icon: Users },
  { href: "/estatisticas-salarios", label: "Salários", isNew: true },
  { href: "/sobre", label: "Sobre" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  // Obter iniciais para avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Links do dropdown baseado no tipo de utilizador
  const getUserMenuLinks = () => {
    if (!user) return [];

    const baseLinks = {
      CANDIDATO: [
        { href: "/candidato/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/candidato/perfil", label: "Perfil", icon: User },
        { href: "/candidato/candidaturas", label: "Candidaturas", icon: FileText },
        { href: "/candidato/mensagens", label: "Mensagens", icon: MessageSquare },
        { href: "/candidato/alertas", label: "Alertas", icon: Bell },
        { href: "/candidato/conta", label: "Configurações", icon: Settings },
      ],
      EMPRESA: [
        { href: "/empresa/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/empresa/perfil", label: "Perfil Empresa", icon: Building2 },
        { href: "/empresa/vagas", label: "Minhas Vagas", icon: Briefcase },
        { href: "/empresa/candidaturas", label: "Candidaturas", icon: FileText },
        { href: "/empresa/mensagens", label: "Mensagens", icon: MessageSquare },
        { href: "/empresa/conta", label: "Configurações", icon: Settings },
      ],
      ADMIN: [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/utilizadores", label: "Utilizadores", icon: Users },
        { href: "/admin/empresas", label: "Empresas", icon: Building2 },
        { href: "/admin/vagas", label: "Vagas", icon: Briefcase },
        { href: "/admin/notificacoes", label: "Notificações", icon: Bell },
        { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
      ],
    };

    return baseLinks[user.type] || [];
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-custom flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-md group-hover:shadow-lg transition-shadow">
            <Briefcase className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Albi<span className="text-primary">Emprego</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
{navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors relative",
                isActive(link.href)
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.label}
              {link.isNew && (
                <span className="absolute -top-1 -right-1 bg-success text-success-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  Novo
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth - Authenticated */}
        {isAuthenticated && user ? (
          <div className="hidden md:flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.type === "CANDIDATO" ? "Candidato" : user.type === "EMPRESA" ? "Empresa" : "Admin"}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {getUserMenuLinks().map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link to={link.href} className="flex items-center gap-2 cursor-pointer">
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logout()}
                  disabled={isLoading}
                  className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          /* Desktop Auth - Not Authenticated */
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/auth/login">
                Entrar
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-1">
                  Registar
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/auth/register?type=candidato" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    Sou Candidato
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/auth/register?type=empresa" className="flex items-center gap-2 cursor-pointer">
                    <Building2 className="h-4 w-4" />
                    Sou Empresa
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col gap-6 mt-6">
              {/* User Info - Se autenticado */}
              {isAuthenticated && user && (
                <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    <p className="text-xs text-primary font-medium">
                      {user.type === "CANDIDATO" ? "Candidato" : user.type === "EMPRESA" ? "Empresa" : "Admin"}
                    </p>
                  </div>
                </div>
              )}

              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "px-4 py-3 text-base font-medium rounded-lg transition-colors",
                      isActive(link.href)
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {isAuthenticated && user ? (
                /* Authenticated Menu */
                <>
                  <div className="border-t border-border pt-6">
                    <p className="px-4 text-sm font-medium text-muted-foreground mb-3">
                      Minha Conta
                    </p>
                    <div className="flex flex-col gap-1">
                      {getUserMenuLinks().map((link) => (
                        <Link
                          key={link.href}
                          to={link.href}
                          onClick={() => setIsOpen(false)}
                        >
                          <Button variant="ghost" className="w-full justify-start gap-2">
                            <link.icon className="h-4 w-4" />
                            {link.label}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-border pt-6">
                    <Button
                      variant="destructive"
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        setIsOpen(false);
                        logout();
                      }}
                      disabled={isLoading}
                    >
                      <LogOut className="h-4 w-4" />
                      Sair
                    </Button>
                  </div>
                </>
              ) : (
                /* Not Authenticated Menu */
                <>
                  <div className="border-t border-border pt-6">
                    <Link to="/auth/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <User className="h-4 w-4" />
                        Entrar
                      </Button>
                    </Link>
                  </div>

                  <div className="border-t border-border pt-6">
                    <p className="px-4 text-sm font-medium text-muted-foreground mb-3">
                      Criar Conta
                    </p>
                    <div className="flex flex-col gap-2">
                      <Link to="/auth/register?type=candidato" onClick={() => setIsOpen(false)}>
                        <Button className="w-full justify-start gap-2">
                          <User className="h-4 w-4" />
                          Como Candidato
                        </Button>
                      </Link>
                      <Link to="/auth/register?type=empresa" onClick={() => setIsOpen(false)}>
                        <Button variant="secondary" className="w-full justify-start gap-2">
                          <Building2 className="h-4 w-4" />
                          Como Empresa
                        </Button>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
