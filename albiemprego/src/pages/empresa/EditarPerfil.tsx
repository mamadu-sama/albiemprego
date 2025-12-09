import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companyApi, type CompanyProfile } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Building2,
  Camera,
  Loader2,
  Upload,
  Trash2,
} from "lucide-react";

export default function EditarPerfilEmpresa() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, updateUserProfile, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch company profile
  const { data: profile, isLoading: isProfileLoading } = useQuery<CompanyProfile, Error>({
    queryKey: ["companyProfile"],
    queryFn: companyApi.getProfile,
    enabled: !!user && user.type === "EMPRESA",
  });

  // Local state
  const [contactName, setContactName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [location, setLocation] = useState(user?.location || "");
  const [companyName, setCompanyName] = useState(profile?.name || "");
  const [website, setWebsite] = useState(profile?.website || "");
  const [sector, setSector] = useState(profile?.sector || "");
  const [employees, setEmployees] = useState(profile?.employees || "");
  const [description, setDescription] = useState(profile?.description || "");

  // Upload states
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isDeletingLogo, setIsDeletingLogo] = useState(false);

  useEffect(() => {
    if (user) {
      setContactName(user.name);
      setPhone(user.phone || "");
      setLocation(user.location || "");
    }
    if (profile) {
      setCompanyName(profile.name);
      setWebsite(profile.website || "");
      setSector(profile.sector || "");
      setEmployees(profile.employees || "");
      setDescription(profile.description || "");
    }
  }, [user, profile]);

  // Mutations
  const updateUserMutation = useMutation<
    any,
    Error,
    { name?: string; phone?: string; location?: string }
  >({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyProfile"] });
    },
  });

  const updateCompanyMutation = useMutation<
    CompanyProfile,
    Error,
    {
      name?: string;
      website?: string;
      sector?: string;
      employees?: string;
      description?: string;
    }
  >({
    mutationFn: (data) => companyApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyProfile"] });
    },
  });

  const uploadLogoMutation = useMutation<CompanyProfile, Error, File>({
    mutationFn: (file) => companyApi.uploadLogo(file),
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Logo atualizado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["companyProfile"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Falha ao fazer upload do logo",
        variant: "destructive",
      });
    },
  });

  const deleteLogoMutation = useMutation<CompanyProfile, Error>({
    mutationFn: () => companyApi.deleteLogo(),
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Logo removido com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["companyProfile"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Falha ao remover logo",
        variant: "destructive",
      });
    },
  });

  const handleSaveProfile = async () => {
    try {
      // Update user info
      await updateUserMutation.mutateAsync({
        name: contactName,
        phone,
        location,
      });

      // Update company info
      await updateCompanyMutation.mutateAsync({
        name: companyName,
        website,
        sector,
        employees,
        description,
      });

      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!",
      });

      navigate("/empresa/perfil");
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Falha ao atualizar perfil",
        variant: "destructive",
      });
    }
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validations
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma imagem válida",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingLogo(true);
    try {
      await uploadLogoMutation.mutateAsync(file);
    } finally {
      setIsUploadingLogo(false);
      e.target.value = "";
    }
  };

  const handleDeleteLogo = async () => {
    setIsDeletingLogo(true);
    try {
      await deleteLogoMutation.mutateAsync();
    } finally {
      setIsDeletingLogo(false);
    }
  };

  if (isProfileLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">A carregar perfil...</p>
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
              <h1 className="text-3xl font-bold text-foreground">Editar Perfil</h1>
              <p className="text-muted-foreground">
                Atualize as informações da sua empresa
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/empresa/perfil">Cancelar</Link>
              </Button>
              <Button
                onClick={handleSaveProfile}
                disabled={
                  authLoading ||
                  updateUserMutation.isPending ||
                  updateCompanyMutation.isPending
                }
              >
                {authLoading ||
                updateUserMutation.isPending ||
                updateCompanyMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />A guardar...
                  </>
                ) : (
                  "Guardar Alterações"
                )}
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Coluna Principal */}
            <div className="lg:col-span-2 space-y-8">
              {/* Informações da Empresa */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Informações da Empresa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">Nome da Empresa *</Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nif">NIF</Label>
                      <Input id="nif" value={profile?.nif} disabled />
                      <p className="text-xs text-muted-foreground mt-1">
                        Não é possível alterar o NIF
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="sector">Sector</Label>
                      <Input
                        id="sector"
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        placeholder="Ex: Tecnologia, Saúde, Educação"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="employees">Número de Funcionários</Label>
                      <Select value={employees} onValueChange={setEmployees}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10</SelectItem>
                          <SelectItem value="11-50">11-50</SelectItem>
                          <SelectItem value="51-200">51-200</SelectItem>
                          <SelectItem value="201-500">201-500</SelectItem>
                          <SelectItem value="501-1000">501-1000</SelectItem>
                          <SelectItem value="1000+">1000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://exemplo.com"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Sobre a Empresa</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      placeholder="Descreva a sua empresa, missão, valores..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Dados de Contacto */}
              <Card>
                <CardHeader>
                  <CardTitle>Dados de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="contactName">Nome do Contacto *</Label>
                    <Input
                      id="contactName"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+351 912 345 678"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Localização</Label>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Castelo Branco"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Coluna Lateral */}
            <div className="lg:col-span-1 space-y-8">
              {/* Logo da Empresa */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Logo da Empresa
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={profile?.logo || "/placeholder-company.jpg"} />
                    <AvatarFallback>
                      <Building2 className="h-16 w-16" />
                    </AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogoClick}
                      disabled={isUploadingLogo}
                    >
                      {isUploadingLogo ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />A
                          enviar...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Alterar Logo
                        </>
                      )}
                    </Button>
                    {profile?.logo && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteLogo}
                        disabled={isDeletingLogo}
                      >
                        {isDeletingLogo ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />A
                            remover...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remover Logo
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    JPG ou PNG. Máximo 5MB.
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

