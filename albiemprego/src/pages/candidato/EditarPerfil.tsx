import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Plus,
  X,
  Calendar,
  Upload,
  Loader2,
  Save,
  Trash2,
  FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  candidateApi,
  type Experience,
  type Education,
  type Language,
} from "@/lib/api";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function EditarPerfil() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    user,
    uploadAvatar,
    deleteAvatar,
    updateUserProfile,
    isLoading: authLoading,
  } = useAuth();
  const queryClient = useQueryClient();

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCV, setIsUploadingCV] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  // Campos editáveis do perfil
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  // Fetch candidate profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ["candidateProfile"],
    queryFn: candidateApi.getProfile,
  });

  // Update form fields when profile loads
  useEffect(() => {
    if (profile) {
      setSkills(profile.skills || []);
      setName(profile.user.name || "");
      setPhone(profile.user.phone || "");
      setLocation(profile.user.location || "");
      setBio(profile.user.bio || "");
    }
  }, [profile]);

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: candidateApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
      toast({
        title: "Perfil atualizado",
        description: "As suas alterações foram guardadas com sucesso",
      });
    },
  });

  const uploadCVMutation = useMutation({
    mutationFn: candidateApi.uploadCV,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
      toast({
        title: "CV carregado",
        description: "O seu CV foi carregado com sucesso",
      });
    },
  });

  const createExperienceMutation = useMutation({
    mutationFn: candidateApi.createExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
      toast({ title: "Experiência adicionada" });
    },
  });

  const deleteExperienceMutation = useMutation({
    mutationFn: candidateApi.deleteExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
      toast({ title: "Experiência removida" });
    },
  });

  const createEducationMutation = useMutation({
    mutationFn: candidateApi.createEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
      toast({ title: "Educação adicionada" });
    },
  });

  const deleteEducationMutation = useMutation({
    mutationFn: candidateApi.deleteEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
      toast({ title: "Educação removida" });
    },
  });

  const createLanguageMutation = useMutation({
    mutationFn: candidateApi.createLanguage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
      toast({ title: "Idioma adicionado" });
    },
  });

  const deleteLanguageMutation = useMutation({
    mutationFn: candidateApi.deleteLanguage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
      toast({ title: "Idioma removido" });
    },
  });

  // Handlers
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas imagens (JPG, PNG)",
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

    setIsUploadingAvatar(true);
    try {
      await uploadAvatar(file);
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteAvatar = async () => {
    if (!user?.avatar) return;

    setIsUploadingAvatar(true);
    try {
      await deleteAvatar();
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas ficheiros PDF",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "O ficheiro deve ter no máximo 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingCV(true);
    try {
      await uploadCVMutation.mutateAsync(file);
    } finally {
      setIsUploadingCV(false);
      if (cvInputRef.current) {
        cvInputRef.current.value = "";
      }
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        skills,
        experienceYears: profile?.experienceYears,
        currentPosition: profile?.currentPosition,
      });

      await updateUserProfile({
        name,
        phone,
        location,
        bio,
      });

      navigate("/candidato/perfil");
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: "Erro",
        description: err.response?.data?.message || "Erro ao guardar perfil",
        variant: "destructive",
      });
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Editar Perfil
              </h1>
              <p className="text-muted-foreground">
                Atualize as suas informações pessoais e profissionais
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/candidato/perfil">Cancelar</Link>
              </Button>
              <Button
                onClick={handleSaveProfile}
                disabled={authLoading || updateProfileMutation.isPending}
              >
                {authLoading || updateProfileMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />A
                    guardar...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Alterações
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Foto de Perfil */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Foto de Perfil</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="h-32 w-32 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-32 w-32 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-16 w-16 text-primary" />
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAvatarClick}
                      disabled={isUploadingAvatar}
                    >
                      {isUploadingAvatar ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />A
                          enviar...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Alterar Foto
                        </>
                      )}
                    </Button>

                    {user?.avatar && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteAvatar}
                        disabled={isUploadingAvatar}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    JPG ou PNG. Máximo 5MB.
                  </p>
                </CardContent>
              </Card>

              {/* CV Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Curriculum Vitae
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile?.cvUrl && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-2">CV atual:</p>
                      <a
                        href={profile.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Ver CV
                      </a>
                    </div>
                  )}

                  <input
                    ref={cvInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleCVUpload}
                    className="hidden"
                  />

                  <Button
                    variant="outline"
                    onClick={() => cvInputRef.current?.click()}
                    disabled={isUploadingCV}
                    className="w-full"
                  >
                    {isUploadingCV ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />A
                        enviar...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        {profile?.cvUrl ? "Atualizar CV" : "Carregar CV"}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    PDF. Máximo 5MB.
                  </p>
                </CardContent>
              </Card>

              {/* Competências */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Competências
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="gap-1">
                        {skill}
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Adicionar competência"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleAddSkill}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Idiomas */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Idiomas</CardTitle>
                    <AddLanguageDialog
                      onAdd={(data) => createLanguageMutation.mutate(data)}
                      isLoading={createLanguageMutation.isPending}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profile?.languages &&
                    profile.languages.map((lang) => (
                      <div
                        key={lang.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium">{lang.language}</p>
                          <p className="text-xs text-muted-foreground">
                            {levelLabels[lang.level]}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteLanguageMutation.mutate(lang.id)}
                          disabled={deleteLanguageMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  {(!profile?.languages || profile.languages.length === 0) && (
                    <p className="text-sm text-muted-foreground">
                      Nenhum idioma adicionado
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informações Básicas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+351 912 345 678"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Localização</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Cidade, País"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Sobre Mim</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={5}
                      placeholder="Descreva a sua experiência, competências e objetivos profissionais..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Experiência Profissional */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Experiência Profissional
                    </CardTitle>
                    <AddExperienceDialog
                      onAdd={(data) => createExperienceMutation.mutate(data)}
                      isLoading={createExperienceMutation.isPending}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile?.experiences &&
                    profile.experiences.map((exp) => (
                      <div key={exp.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{exp.position}</h4>
                            <p className="text-sm text-muted-foreground">
                              {exp.company}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              deleteExperienceMutation.mutate(exp.id)
                            }
                            disabled={deleteExperienceMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(exp.startDate).toLocaleDateString("pt-PT")}{" "}
                          -{" "}
                          {exp.current
                            ? "Presente"
                            : exp.endDate
                            ? new Date(exp.endDate).toLocaleDateString("pt-PT")
                            : ""}
                        </p>
                        {exp.description && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  {(!profile?.experiences ||
                    profile.experiences.length === 0) && (
                    <p className="text-sm text-muted-foreground">
                      Nenhuma experiência adicionada
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Formação Académica */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Formação Académica
                    </CardTitle>
                    <AddEducationDialog
                      onAdd={(data) => createEducationMutation.mutate(data)}
                      isLoading={createEducationMutation.isPending}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile?.educations &&
                    profile.educations.map((edu) => (
                      <div key={edu.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{edu.degree}</h4>
                            <p className="text-sm text-muted-foreground">
                              {edu.institution}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Área: {edu.field}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              deleteEducationMutation.mutate(edu.id)
                            }
                            disabled={deleteEducationMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(edu.startDate).toLocaleDateString("pt-PT")}{" "}
                          -{" "}
                          {edu.current
                            ? "Presente"
                            : edu.endDate
                            ? new Date(edu.endDate).toLocaleDateString("pt-PT")
                            : ""}
                        </p>
                      </div>
                    ))}
                  {(!profile?.educations ||
                    profile.educations.length === 0) && (
                    <p className="text-sm text-muted-foreground">
                      Nenhuma formação adicionada
                    </p>
                  )}
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

// Dialog Components
const levelLabels = {
  BASIC: "Básico",
  INTERMEDIATE: "Intermédio",
  ADVANCED: "Avançado",
  NATIVE: "Nativo",
};

function AddLanguageDialog({
  onAdd,
  isLoading,
}: {
  onAdd: (data: Omit<Language, "id">) => void;
  isLoading: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState("");
  const [level, setLevel] = useState<Language["level"]>("BASIC");

  const handleAdd = () => {
    if (language.trim()) {
      onAdd({ language: language.trim(), level });
      setLanguage("");
      setLevel("BASIC");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-1" />
        Adicionar
      </Button>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Idioma</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="language">Idioma</Label>
            <Input
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="Ex: Inglês"
            />
          </div>

          <div>
            <Label htmlFor="level">Nível</Label>
            <Select
              value={level}
              onValueChange={(val) => setLevel(val as Language["level"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BASIC">Básico</SelectItem>
                <SelectItem value="INTERMEDIATE">Intermédio</SelectItem>
                <SelectItem value="ADVANCED">Avançado</SelectItem>
                <SelectItem value="NATIVE">Nativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAdd} disabled={isLoading || !language.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddExperienceDialog({
  onAdd,
  isLoading,
}: {
  onAdd: (data: Omit<Experience, "id">) => void;
  isLoading: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [current, setCurrent] = useState(false);
  const [description, setDescription] = useState("");

  const handleAdd = () => {
    if (company.trim() && position.trim() && startDate) {
      onAdd({
        company: company.trim(),
        position: position.trim(),
        startDate,
        endDate: current ? undefined : endDate || undefined,
        current,
        description: description.trim() || undefined,
      });
      setCompany("");
      setPosition("");
      setStartDate("");
      setEndDate("");
      setCurrent(false);
      setDescription("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-1" />
        Adicionar
      </Button>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Experiência</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="position">Cargo *</Label>
              <Input
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="company">Empresa *</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Data de Início *</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">Data de Fim</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={current}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="current"
              checked={current}
              onCheckedChange={(checked) => setCurrent(checked === true)}
            />
            <Label htmlFor="current">Trabalho aqui atualmente</Label>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleAdd}
            disabled={
              isLoading || !company.trim() || !position.trim() || !startDate
            }
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddEducationDialog({
  onAdd,
  isLoading,
}: {
  onAdd: (data: Omit<Education, "id">) => void;
  isLoading: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [field, setField] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [current, setCurrent] = useState(false);

  const handleAdd = () => {
    if (institution.trim() && degree.trim() && field.trim() && startDate) {
      onAdd({
        institution: institution.trim(),
        degree: degree.trim(),
        field: field.trim(),
        startDate,
        endDate: current ? undefined : endDate || undefined,
        current,
      });
      setInstitution("");
      setDegree("");
      setField("");
      setStartDate("");
      setEndDate("");
      setCurrent(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-1" />
        Adicionar
      </Button>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Formação</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="institution">Instituição *</Label>
            <Input
              id="institution"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="degree">Grau *</Label>
              <Input
                id="degree"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="field">Área de Estudo *</Label>
              <Input
                id="field"
                value={field}
                onChange={(e) => setField(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Ano de Início *</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">Ano de Conclusão</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={current}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="current-edu"
              checked={current}
              onCheckedChange={(checked) => setCurrent(checked === true)}
            />
            <Label htmlFor="current-edu">Estudo aqui atualmente</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleAdd}
            disabled={
              isLoading ||
              !institution.trim() ||
              !degree.trim() ||
              !field.trim() ||
              !startDate
            }
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
