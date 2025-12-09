import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Lock, Eye, EyeOff, CheckCircle, ArrowLeft, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { resetPassword, isLoading } = useAuth();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const passwordRequirements = [
    { label: "Mínimo 8 caracteres", valid: password.length >= 8 },
    { label: "Pelo menos uma letra maiúscula", valid: /[A-Z]/.test(password) },
    { label: "Pelo menos uma letra minúscula", valid: /[a-z]/.test(password) },
    { label: "Pelo menos um número", valid: /\d/.test(password) },
  ];

  const isPasswordValid = passwordRequirements.every((req) => req.valid);
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      toast({
        title: "Palavra-passe inválida",
        description: "Por favor, cumpra todos os requisitos de segurança.",
        variant: "destructive",
      });
      return;
    }

    if (!doPasswordsMatch) {
      toast({
        title: "As palavras-passe não coincidem",
        description: "Por favor, verifique se as palavras-passe são iguais.",
        variant: "destructive",
      });
      return;
    }

    if (!token) {
      toast({
        title: "Token inválido",
        description: "Link de redefinição inválido.",
        variant: "destructive",
      });
      return;
    }

    try {
      await resetPassword(token, password);
      setIsSuccess(true);
    } catch (error) {
      // Erro já tratado no AuthContext
      console.error("Reset password error:", error);
    }
  };

  // Check if token is valid (in real app, this would be verified with backend)
  if (!token) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md">
            <Card className="border-border shadow-lg">
              <CardContent className="pt-6 text-center">
                <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Link inválido ou expirado
                </h3>
                <p className="text-muted-foreground mb-6">
                  Este link de redefinição de palavra-passe é inválido ou já expirou. 
                  Por favor, solicite um novo link.
                </p>
                <Link to="/auth/forgot-password">
                  <Button className="w-full">
                    Solicitar novo link
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-md">
                <Briefcase className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">
                Albi<span className="text-primary">Emprego</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Redefinir palavra-passe</h1>
            <p className="text-muted-foreground mt-2">
              Introduza a sua nova palavra-passe
            </p>
          </div>

          <Card className="border-border shadow-lg">
            <CardContent className="pt-6">
              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Nova palavra-passe</label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs font-medium text-muted-foreground">Requisitos da palavra-passe:</p>
                    <ul className="space-y-1">
                      {passwordRequirements.map((req, index) => (
                        <li 
                          key={index} 
                          className={`text-xs flex items-center gap-2 ${
                            req.valid ? "text-green-600" : "text-muted-foreground"
                          }`}
                        >
                          <CheckCircle className={`h-3 w-3 ${req.valid ? "opacity-100" : "opacity-30"}`} />
                          {req.label}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">Confirmar palavra-passe</label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {confirmPassword && (
                      <p className={`text-xs mt-1 ${doPasswordsMatch ? "text-green-600" : "text-destructive"}`}>
                        {doPasswordsMatch ? "✓ As palavras-passe coincidem" : "✗ As palavras-passe não coincidem"}
                      </p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg" 
                    disabled={isLoading || !isPasswordValid || !doPasswordsMatch}
                  >
                    {isLoading ? "A redefinir..." : "Redefinir palavra-passe"}
                  </Button>

                  <div className="text-center">
                    <Link 
                      to="/auth/login" 
                      className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Voltar ao login
                    </Link>
                  </div>
                </form>
              ) : (
                <div className="text-center py-6">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Palavra-passe redefinida!
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    A sua palavra-passe foi alterada com sucesso. 
                    Agora pode iniciar sessão com a nova palavra-passe.
                  </p>
                  <Button 
                    className="w-full"
                    onClick={() => navigate("/auth/login")}
                  >
                    Ir para o login
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
