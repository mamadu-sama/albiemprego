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
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, X, Euro, TrendingUp, Eye, EyeOff, AlertTriangle, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobApi, type CreateJobDTO } from "@/lib/api";

const skillSuggestions = [
  "React", "TypeScript", "JavaScript", "Node.js", "Python", "Java",
  "SQL", "Git", "Docker", "AWS", "Figma", "Photoshop", "Angular", "Vue.js"
];

export default function EditarVaga() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar vaga existente
  const { data: job, isLoading: isLoadingJob, isError } = useQuery({
    queryKey: ["job", id],
    queryFn: () => jobApi.getJob(id!),
    enabled: !!id,
  });

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

  // Preencher formulário com dados da vaga
  useEffect(() => {
    if (job) {
      setTitle(job.title);
      setDepartment(job.department || "");
      setDescription(job.description);
      setRequirementsText(job.requirements.join("\n"));
      setResponsibilitiesText(job.responsibilities.join("\n"));
      setBenefitsText(job.benefits.join("\n"));
      setSkills(job.skills || []);
      setLocation(job.location);
      setAddress(job.address || "");
      setContractType(job.type);
      setWorkMode(job.workMode);
      setExperienceLevel(job.experienceLevel || "");
      setSector(job.sector);
      setSalaryMin(job.salaryMin?.toString() || "");
      setSalaryMax(job.salaryMax?.toString() || "");
      setSalaryPeriod(job.salaryPeriod || "month");
      
      if (!job.showSalary) {
        setSalaryVisibility("hide");
      } else if (job.salaryMax) {
        setSalaryVisibility("range");
      } else {
        setSalaryVisibility("show");
      }
    }
  }, [job]);

  const addSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  // Mutation para atualizar vaga
  const updateJobMutation = useMutation({
    mutationFn: (data: Partial<CreateJobDTO>) => jobApi.updateJob(id!, data),
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Vaga atualizada com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ["job", id] });
      queryClient.invalidateQueries({ queryKey: ["companyJobs"] });
      navigate("/empresa/vagas");
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Falha ao atualizar vaga",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !requirementsText || !location || !contractType || !workMode || !sector) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const jobData: Partial<CreateJobDTO> = {
      title,
      department: department || undefined,
      description,
      requirements: requirementsText.split("\n").filter(r => r.trim()),
      responsibilities: responsibilitiesText ? responsibilitiesText.split("\n").filter(r => r.trim()) : [],
      benefits: benefitsText ? benefitsText.split("\n").filter(b => b.trim()) : [],
      skills: skills.length > 0 ? skills : [],
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

    updateJobMutation.mutate(jobData);
  };

  if (isLoadingJob) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Erro ao carregar vaga</p>
            <Button asChild>
              <Link to="/empresa/vagas">Voltar às Vagas</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
              Editar Vaga
            </h1>
            <p className="text-muted-foreground">
              Atualize os detalhes da vaga.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                    <Label htmlFor="experience">Experiência</Label>
                    <Select value={experienceLevel} onValueChange={setExperienceLevel}>
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
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Euro className="h-5 w-5 text-primary" />
                  <CardTitle>Informação Salarial</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup 
                  value={salaryVisibility} 
                  onValueChange={(value) => setSalaryVisibility(value as "show" | "range" | "hide")}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer">
                    <RadioGroupItem value="show" id="salary-show" />
                    <Eye className="h-4 w-4" />
                    <Label htmlFor="salary-show" className="flex-1 cursor-pointer">
                      Mostrar salário exato
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer">
                    <RadioGroupItem value="range" id="salary-range" />
                    <TrendingUp className="h-4 w-4" />
                    <Label htmlFor="salary-range" className="flex-1 cursor-pointer">
                      Mostrar intervalo
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer">
                    <RadioGroupItem value="hide" id="salary-hide" />
                    <EyeOff className="h-4 w-4" />
                    <Label htmlFor="salary-hide" className="flex-1 cursor-pointer">
                      Não mostrar
                    </Label>
                  </div>
                </RadioGroup>

                {salaryVisibility !== 'hide' && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="salaryMin">
                          Salário {salaryVisibility === 'range' ? 'Mínimo' : 'Base'}
                        </Label>
                        <div className="relative">
                          <Input 
                            id="salaryMin" 
                            type="number" 
                            placeholder="1500"
                            value={salaryMin}
                            onChange={(e) => setSalaryMin(e.target.value)}
                            className="pr-8"
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
                    placeholder="Descreva a vaga..."
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
                    placeholder="Liste os requisitos (um por linha)"
                    className="min-h-[100px]"
                    required
                    value={requirementsText}
                    onChange={(e) => setRequirementsText(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsibilities">Responsabilidades</Label>
                  <Textarea 
                    id="responsibilities" 
                    placeholder="Liste as responsabilidades (um por linha)"
                    className="min-h-[100px]"
                    value={responsibilitiesText}
                    onChange={(e) => setResponsibilitiesText(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="benefits">Benefícios</Label>
                  <Textarea 
                    id="benefits" 
                    placeholder="Liste os benefícios (um por linha)"
                    className="min-h-[100px]"
                    value={benefitsText}
                    onChange={(e) => setBenefitsText(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Competências Requeridas</CardTitle>
                <CardDescription>Adicione as competências necessárias</CardDescription>
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
              <Button type="button" variant="outline" asChild disabled={updateJobMutation.isPending}>
                <Link to="/empresa/vagas">Cancelar</Link>
              </Button>
              <Button type="submit" disabled={updateJobMutation.isPending}>
                {updateJobMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    A guardar...
                  </>
                ) : (
                  "Guardar Alterações"
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
