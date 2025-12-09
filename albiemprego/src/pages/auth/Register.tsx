import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Eye, 
  EyeOff, 
  User, 
  Building2, 
  Briefcase, 
  Mail, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  Check,
  Phone,
  MapPin,
  Globe
} from "lucide-react";

const municipalities = [
  "Castelo Branco",
  "Covilhã",
  "Fundão",
  "Idanha-a-Nova",
  "Penamacor",
  "Vila Velha de Ródão",
  "Oleiros",
  "Proença-a-Nova",
  "Sertã",
  "Vila de Rei",
];

const industries = [
  "Tecnologia",
  "Saúde",
  "Educação",
  "Comércio e Retalho",
  "Indústria",
  "Construção",
  "Hotelaria e Turismo",
  "Agricultura",
  "Serviços Financeiros",
  "Transportes e Logística",
  "Outro",
];

const companySizes = [
  "1-10 colaboradores",
  "11-50 colaboradores",
  "51-200 colaboradores",
  "201-500 colaboradores",
  "500+ colaboradores",
];

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { register } = useAuth();
  const initialType = searchParams.get("type") || "candidato";
  
  const [userType, setUserType] = useState(initialType);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Candidate form
  const [candidateForm, setCandidateForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  // Company form (multi-step)
  const [companyStep, setCompanyStep] = useState(1);
  const [companyForm, setCompanyForm] = useState({
    // Step 1 - Account
    contactName: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Step 2 - Company Info
    companyName: "",
    nif: "",
    industry: "",
    companySize: "",
    website: "",
    phone: "",
    // Step 3 - Location
    address: "",
    postalCode: "",
    city: "",
    // Step 4 - About
    description: "",
    acceptTerms: false,
  });

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;
    if (/[^a-zA-Z\d]/.test(password)) strength += 25;
    return strength;
  };

  const passwordStrength = getPasswordStrength(
    userType === "candidato" ? candidateForm.password : companyForm.password
  );

  const getStrengthLabel = () => {
    if (passwordStrength <= 25) return { label: "Fraca", color: "bg-destructive" };
    if (passwordStrength <= 50) return { label: "Razoável", color: "bg-warning" };
    if (passwordStrength <= 75) return { label: "Boa", color: "bg-info" };
    return { label: "Forte", color: "bg-success" };
  };

  const handleCandidateRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (candidateForm.password !== candidateForm.confirmPassword) {
      toast({
        title: "Erro",
        description: "As palavras-passe não coincidem.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await register({
        email: candidateForm.email,
        password: candidateForm.password,
        name: candidateForm.name,
        type: "candidato",
        phone: candidateForm.phone || undefined,
      });
      // Redirect é feito automaticamente no AuthContext
    } catch (error) {
      // Erro já tratado no AuthContext
      console.error("Register error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompanyRegister = async () => {
    if (!companyForm.acceptTerms) {
      toast({
        title: "Erro",
        description: "Tem de aceitar os termos e condições.",
        variant: "destructive",
      });
      return;
    }

    if (companyForm.password !== companyForm.confirmPassword) {
      toast({
        title: "Erro",
        description: "As palavras-passe não coincidem.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await register({
        email: companyForm.email,
        password: companyForm.password,
        name: companyForm.contactName,
        type: "empresa",
        companyName: companyForm.companyName,
        nif: companyForm.nif,
        phone: companyForm.phone || undefined,
      });
      // Redirect é feito automaticamente no AuthContext
    } catch (error) {
      // Erro já tratado no AuthContext
      console.error("Register error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextCompanyStep = () => {
    if (companyStep < 4) setCompanyStep(companyStep + 1);
  };

  const prevCompanyStep = () => {
    if (companyStep > 1) setCompanyStep(companyStep - 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-md">
                <Briefcase className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">
                Albi<span className="text-primary">Emprego</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Criar Conta</h1>
            <p className="text-muted-foreground mt-2">
              {userType === "candidato" 
                ? "Crie o seu perfil e comece a procurar emprego"
                : "Registe a sua empresa e encontre talentos"
              }
            </p>
          </div>

          <Card className="border-border shadow-lg">
            <CardContent className="pt-6">
              {/* User Type Tabs */}
              <Tabs value={userType} onValueChange={setUserType} className="mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="candidato" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Candidato
                  </TabsTrigger>
                  <TabsTrigger value="empresa" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Empresa
                  </TabsTrigger>
                </TabsList>

                {/* Candidate Registration */}
                <TabsContent value="candidato">
                  <form onSubmit={handleCandidateRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground">Nome</label>
                        <Input
                          placeholder="O seu nome"
                          value={candidateForm.firstName}
                          onChange={(e) => setCandidateForm({ ...candidateForm, firstName: e.target.value })}
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Apelido</label>
                        <Input
                          placeholder="O seu apelido"
                          value={candidateForm.lastName}
                          onChange={(e) => setCandidateForm({ ...candidateForm, lastName: e.target.value })}
                          className="mt-1"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground">Email</label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="email@exemplo.com"
                          value={candidateForm.email}
                          onChange={(e) => setCandidateForm({ ...candidateForm, email: e.target.value })}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground">Palavra-passe</label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Mínimo 8 caracteres"
                          value={candidateForm.password}
                          onChange={(e) => setCandidateForm({ ...candidateForm, password: e.target.value })}
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
                      {candidateForm.password && (
                        <div className="mt-2">
                          <Progress value={passwordStrength} className={`h-1.5 ${getStrengthLabel().color}`} />
                          <p className="text-xs text-muted-foreground mt-1">
                            Força: {getStrengthLabel().label}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground">Confirmar palavra-passe</label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="Repita a palavra-passe"
                          value={candidateForm.confirmPassword}
                          onChange={(e) => setCandidateForm({ ...candidateForm, confirmPassword: e.target.value })}
                          className="pl-10"
                          required
                        />
                        {candidateForm.confirmPassword && candidateForm.password === candidateForm.confirmPassword && (
                          <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-success" />
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="terms-candidate"
                        checked={candidateForm.acceptTerms}
                        onCheckedChange={(checked) => setCandidateForm({ ...candidateForm, acceptTerms: checked as boolean })}
                        className="mt-1"
                      />
                      <label htmlFor="terms-candidate" className="text-sm text-muted-foreground">
                        Li e aceito os{" "}
                        <Link to="/termos" className="text-primary hover:underline">termos de serviço</Link>
                        {" "}e a{" "}
                        <Link to="/privacidade" className="text-primary hover:underline">política de privacidade</Link>
                      </label>
                    </div>

                    <Button type="submit" className="w-full" size="lg" loading={isLoading} disabled={!candidateForm.acceptTerms}>
                      Criar Conta
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>

                {/* Company Registration */}
                <TabsContent value="empresa">
                  {/* Progress Indicator */}
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      {["Conta", "Empresa", "Localização", "Sobre"].map((label, index) => (
                        <div key={label} className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                            ${companyStep > index + 1 
                              ? "bg-success text-success-foreground" 
                              : companyStep === index + 1 
                                ? "bg-primary text-primary-foreground" 
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {companyStep > index + 1 ? <Check className="h-4 w-4" /> : index + 1}
                          </div>
                          {index < 3 && (
                            <div className={`w-8 md:w-12 h-0.5 mx-1 ${companyStep > index + 1 ? "bg-success" : "bg-muted"}`} />
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Passo {companyStep} de 4: {["Conta", "Informação da Empresa", "Localização", "Sobre"][companyStep - 1]}
                    </p>
                  </div>

                  {/* Step 1: Account */}
                  {companyStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground">Nome do Responsável</label>
                        <div className="relative mt-1">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="Nome completo do responsável"
                            value={companyForm.contactName}
                            onChange={(e) => setCompanyForm({ ...companyForm, contactName: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Email da Empresa</label>
                        <div className="relative mt-1">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="empresa@exemplo.com"
                            value={companyForm.email}
                            onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Palavra-passe</label>
                        <div className="relative mt-1">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mínimo 8 caracteres"
                            value={companyForm.password}
                            onChange={(e) => setCompanyForm({ ...companyForm, password: e.target.value })}
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
                        {companyForm.password && (
                          <div className="mt-2">
                            <Progress value={passwordStrength} className={`h-1.5 ${getStrengthLabel().color}`} />
                            <p className="text-xs text-muted-foreground mt-1">Força: {getStrengthLabel().label}</p>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Confirmar palavra-passe</label>
                        <Input
                          type="password"
                          placeholder="Repita a palavra-passe"
                          value={companyForm.confirmPassword}
                          onChange={(e) => setCompanyForm({ ...companyForm, confirmPassword: e.target.value })}
                          className="mt-1"
                          required
                        />
                      </div>
                      <Button onClick={nextCompanyStep} className="w-full" size="lg">
                        Continuar
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Step 2: Company Info */}
                  {companyStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground">Nome da Empresa</label>
                        <Input
                          placeholder="Nome oficial da empresa"
                          value={companyForm.companyName}
                          onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">NIF</label>
                        <Input
                          placeholder="123456789"
                          value={companyForm.nif}
                          onChange={(e) => setCompanyForm({ ...companyForm, nif: e.target.value })}
                          className="mt-1"
                          maxLength={9}
                          pattern="\d{9}"
                          required
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          9 dígitos
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Setor de Atividade</label>
                        <Select 
                          value={companyForm.industry} 
                          onValueChange={(value) => setCompanyForm({ ...companyForm, industry: value })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Selecione o setor" />
                          </SelectTrigger>
                          <SelectContent>
                            {industries.map((ind) => (
                              <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Dimensão</label>
                        <Select 
                          value={companyForm.companySize} 
                          onValueChange={(value) => setCompanyForm({ ...companyForm, companySize: value })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Número de colaboradores" />
                          </SelectTrigger>
                          <SelectContent>
                            {companySizes.map((size) => (
                              <SelectItem key={size} value={size}>{size}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-foreground">Website</label>
                          <div className="relative mt-1">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="www.empresa.pt"
                              value={companyForm.website}
                              onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground">Telefone</label>
                          <div className="relative mt-1">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="+351 272 000 000"
                              value={companyForm.phone}
                              onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={prevCompanyStep} className="flex-1">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Voltar
                        </Button>
                        <Button onClick={nextCompanyStep} className="flex-1">
                          Continuar
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Location */}
                  {companyStep === 3 && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground">Morada</label>
                        <div className="relative mt-1">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Rua, número, etc."
                            value={companyForm.address}
                            onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-foreground">Código Postal</label>
                          <Input
                            placeholder="6000-000"
                            value={companyForm.postalCode}
                            onChange={(e) => setCompanyForm({ ...companyForm, postalCode: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground">Concelho</label>
                          <Select 
                            value={companyForm.city} 
                            onValueChange={(value) => setCompanyForm({ ...companyForm, city: value })}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {municipalities.map((m) => (
                                <SelectItem key={m} value={m}>{m}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={prevCompanyStep} className="flex-1">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Voltar
                        </Button>
                        <Button onClick={nextCompanyStep} className="flex-1">
                          Continuar
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 4: About */}
                  {companyStep === 4 && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground">Descrição da Empresa</label>
                        <Textarea
                          placeholder="Descreva a atividade da sua empresa, cultura organizacional, etc."
                          value={companyForm.description}
                          onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                          className="mt-1"
                          rows={4}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {companyForm.description.length}/500 caracteres
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="terms-company"
                          checked={companyForm.acceptTerms}
                          onCheckedChange={(checked) => setCompanyForm({ ...companyForm, acceptTerms: checked as boolean })}
                          className="mt-1"
                        />
                        <label htmlFor="terms-company" className="text-sm text-muted-foreground">
                          Li e aceito os{" "}
                          <Link to="/termos" className="text-primary hover:underline">termos de serviço</Link>
                          {" "}e a{" "}
                          <Link to="/privacidade" className="text-primary hover:underline">política de privacidade</Link>
                        </label>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={prevCompanyStep} className="flex-1">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Voltar
                        </Button>
                        <Button 
                          onClick={handleCompanyRegister} 
                          className="flex-1" 
                          loading={isLoading}
                          disabled={!companyForm.acceptTerms}
                        >
                          Submeter Registo
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <Separator className="my-6" />

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Já tem uma conta?{" "}
                  <Link to={`/auth/login?type=${userType}`} className="text-primary font-medium hover:underline">
                    Iniciar sessão
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
