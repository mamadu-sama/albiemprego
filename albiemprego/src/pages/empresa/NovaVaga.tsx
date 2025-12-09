import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, X, Euro, TrendingUp, Eye, EyeOff, AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { jobApi, type CreateJobDTO } from "@/lib/api";

const skillSuggestions = [
  "React", "TypeScript", "JavaScript", "Node.js", "Python", "Java",
  "SQL", "Git", "Docker", "AWS", "Figma", "Photoshop", "Angular", "Vue.js"
];

export default function NovaVaga() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Estados do formulário
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [requirementsText, setRequirementsText] = useState("");
  const [responsibilitiesText, setResponsibilitiesText] = useState("");
  const [benefitsText, setBenefitsText] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [contractType, setContractType] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [sector, setSector] = useState("");
  
  // Salário
  const [salaryVisibility, setSalaryVisibility] = useState<"show" | "range" | "hide">("range");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [salaryPeriod, setSalaryPeriod] = useState("month");

  const addSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  // Mutation para criar vaga
  const createJobMutation = useMutation({
    mutationFn: (data: CreateJobDTO) => jobApi.createJob(data),
    onSuccess: (job) => {
      toast({
        title: "Sucesso",
        description: "Vaga criada como rascunho!",
      });
      navigate(`/empresa/vagas`);
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Falha ao criar vaga",
        variant: "destructive",
      });
    },
  });

  // Mutation para criar e publicar vaga
  const createAndPublishMutation = useMutation({
    mutationFn: async (data: CreateJobDTO) => {
      const job = await jobApi.createJob(data);
      return await jobApi.publishJob(job.id);
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Vaga publicada com sucesso!",
      });
      navigate("/empresa/vagas");
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Falha ao publicar vaga",
        variant: "destructive",
      });
    },
  });

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !requirementsText || !location || !contractType || !workMode || !sector) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const jobData: CreateJobDTO = {
      title,
      department: department || undefined,
      description,
      requirements: requirementsText.split("\n").filter(r => r.trim()),
      responsibilities: responsibilitiesText ? responsibilitiesText.split("\n").filter(r => r.trim()) : undefined,
      benefits: benefitsText ? benefitsText.split("\n").filter(b => b.trim()) : undefined,
      skills: skills.length > 0 ? skills : undefined,
      location,
      address: address || undefined,
      type: contractType,
      workMode: workMode,
      salaryMin: salaryVisibility !== "hide" && salaryMin ? parseFloat(salaryMin) : undefined,
      salaryMax: salaryVisibility === "range" && salaryMax ? parseFloat(salaryMax) : undefined,
      salaryCurrency: "EUR",
      salaryPeriod,
      showSalary: salaryVisibility !== "hide",
      sector,
      experienceLevel: experienceLevel || undefined,
    };

    createJobMutation.mutate(jobData);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !requirementsText || !location || !contractType || !workMode || !sector) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const jobData: CreateJobDTO = {
      title,
      department: department || undefined,
      description,
      requirements: requirementsText.split("\n").filter(r => r.trim()),
      responsibilities: responsibilitiesText ? responsibilitiesText.split("\n").filter(r => r.trim()) : undefined,
      benefits: benefitsText ? benefitsText.split("\n").filter(b => b.trim()) : undefined,
      skills: skills.length > 0 ? skills : undefined,
      location,
      address: address || undefined,
      type: contractType,
      workMode: workMode,
      salaryMin: salaryVisibility !== "hide" && salaryMin ? parseFloat(salaryMin) : undefined,
      salaryMax: salaryVisibility === "range" && salaryMax ? parseFloat(salaryMax) : undefined,
      salaryCurrency: "EUR",
      salaryPeriod,
      showSalary: salaryVisibility !== "hide",
      sector,
      experienceLevel: experienceLevel || undefined,
    };

    createAndPublishMutation.mutate(jobData);
  };

  const isLoading = createJobMutation.isPending || createAndPublishMutation.isPending;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link to="/empresa/vagas">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar às Vagas
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Publicar Nova Vaga
            </h1>
            <p className="text-muted-foreground">
              Preencha os detalhes da vaga para atrair os melhores candidatos.
            </p>
          </div>

          <form onSubmit={handlePublish} className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>Detalhes principais da vaga</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título da Vaga *</Label>
                    <Input 
                      id="title" 
                      placeholder="ex: Frontend Developer" 
                      required 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Departamento</Label>
                    <Input 
                      id="department" 
                      placeholder="ex: Tecnologia"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contractType">Tipo de Contrato *</Label>
                    <Select required value={contractType} onValueChange={setContractType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FULL_TIME">Full-time</SelectItem>
                        <SelectItem value="PART_TIME">Part-time</SelectItem>
                        <SelectItem value="TEMPORARY">Contrato a Termo</SelectItem>
                        <SelectItem value="INTERNSHIP">Estágio</SelectItem>
                        <SelectItem value="FREELANCE">Freelance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workMode">Modalidade *</Label>
                    <Select required value={workMode} onValueChange={setWorkMode}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PRESENCIAL">Presencial</SelectItem>
                        <SelectItem value="REMOTO">Remoto</SelectItem>
                        <SelectItem value="HIBRIDO">Híbrido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experiência *</Label>
                    <Select required value={experienceLevel} onValueChange={setExperienceLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Sem Experiência</SelectItem>
                        <SelectItem value="junior">1-2 anos</SelectItem>
                        <SelectItem value="mid">3-5 anos</SelectItem>
                        <SelectItem value="senior">5+ anos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sector">Sector *</Label>
                  <Input 
                    id="sector" 
                    placeholder="ex: Tecnologia, Saúde, Educação"
                    required
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Localização</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Localização *</Label>
                    <Input
                      id="location"
                      placeholder="ex: Castelo Branco"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Morada (opcional)</Label>
                    <Input 
                      id="address" 
                      placeholder="ex: Rua Principal, 123"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Salary */}
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Euro className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle>Informação Salarial</CardTitle>
                      <CardDescription>
                        Vagas com salário visível recebem 3x mais candidaturas
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-success/10 text-success border-success/20">
                    Recomendado
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup 
                  value={salaryVisibility} 
                  onValueChange={(value) => setSalaryVisibility(value as "show" | "range" | "hide")}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-success/30 bg-success/5 cursor-pointer hover:bg-success/10 transition-colors">
                    <RadioGroupItem value="show" id="salary-show" />
                    <Eye className="h-4 w-4 text-success" />
                    <div className="flex-1">
                      <Label htmlFor="salary-show" className="font-medium cursor-pointer">
                        Mostrar salário exato
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Transparência atrai melhores candidatos
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-border cursor-pointer hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="range" id="salary-range" />
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <div className="flex-1">
                      <Label htmlFor="salary-range" className="font-medium cursor-pointer">
                        Mostrar intervalo
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Flexibilidade mantendo transparência
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-destructive/30 bg-destructive/5 cursor-pointer hover:bg-destructive/10 transition-colors">
                    <RadioGroupItem value="hide" id="salary-hide" />
                    <EyeOff className="h-4 w-4 text-destructive" />
                    <div className="flex-1">
                      <Label htmlFor="salary-hide" className="font-medium cursor-pointer">
                        Não mostrar
                      </Label>
                      <p className="text-xs text-destructive">
                        ⚠️ Reduz candidaturas em 60%
                      </p>
                    </div>
                  </div>
                </RadioGroup>

                {salaryVisibility !== 'hide' && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="salaryMin">
                          Salário {salaryVisibility === 'range' ? 'Mínimo' : 'Base'} *
                        </Label>
                        <div className="relative">
                          <Input 
                            id="salaryMin" 
                            type="number" 
                            placeholder="1500"
                            value={salaryMin}
                            onChange={(e) => setSalaryMin(e.target.value)}
                            className="pr-8"
                            required
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            €
                          </span>
                        </div>
                      </div>

                      {salaryVisibility === 'range' && (
                        <div className="space-y-2">
                          <Label htmlFor="salaryMax">Salário Máximo</Label>
                          <div className="relative">
                            <Input 
                              id="salaryMax" 
                              type="number" 
                              placeholder="2500"
                              value={salaryMax}
                              onChange={(e) => setSalaryMax(e.target.value)}
                              className="pr-8"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              €
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="salaryPeriod">Período</Label>
                      <Select value={salaryPeriod} onValueChange={setSalaryPeriod}>
                        <SelectTrigger className="w-full md:w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hour">Por hora</SelectItem>
                          <SelectItem value="month">Por mês</SelectItem>
                          <SelectItem value="year">Por ano</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {salaryVisibility === 'hide' && (
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-destructive">Não recomendado</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Vagas sem salário visível recebem significativamente menos candidaturas.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Descrição da Vaga</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Descreva a vaga, responsabilidades principais e o que oferece..."
                    className="min-h-[150px]"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requirements">Requisitos *</Label>
                  <Textarea 
                    id="requirements" 
                    placeholder="Liste os requisitos necessários (um por linha)&#10;ex:&#10;Licenciatura em Informática&#10;3 anos de experiência com React&#10;Fluência em Inglês"
                    className="min-h-[100px]"
                    required
                    value={requirementsText}
                    onChange={(e) => setRequirementsText(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Um requisito por linha
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsibilities">Responsabilidades</Label>
                  <Textarea 
                    id="responsibilities" 
                    placeholder="Liste as responsabilidades do cargo (um por linha)"
                    className="min-h-[100px]"
                    value={responsibilitiesText}
                    onChange={(e) => setResponsibilitiesText(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Uma responsabilidade por linha
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="benefits">Benefícios</Label>
                  <Textarea 
                    id="benefits" 
                    placeholder="Liste os benefícios oferecidos (um por linha)"
                    className="min-h-[100px]"
                    value={benefitsText}
                    onChange={(e) => setBenefitsText(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Um benefício por linha
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Competências Requeridas</CardTitle>
                <CardDescription>Adicione as competências necessárias para a função</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Adicionar competência..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill(newSkill);
                      }
                    }}
                  />
                  <Button type="button" onClick={() => addSkill(newSkill)} disabled={!newSkill.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="pr-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-1 hover:bg-muted rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Sugestões:</p>
                  <div className="flex flex-wrap gap-2">
                    {skillSuggestions.filter(s => !skills.includes(s)).slice(0, 8).map((skill) => (
                      <Badge 
                        key={skill} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => addSkill(skill)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" asChild disabled={isLoading}>
                <Link to="/empresa/vagas">Cancelar</Link>
              </Button>
              <Button 
                type="button" 
                variant="secondary"
                onClick={handleSaveDraft}
                disabled={isLoading}
              >
                {createJobMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    A guardar...
                  </>
                ) : (
                  "Guardar Rascunho"
                )}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {createAndPublishMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    A publicar...
                  </>
                ) : (
                  "Publicar Vaga"
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
