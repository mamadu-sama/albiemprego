import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JobCard, Job } from "@/components/jobs/JobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  X, 
  Grid3X3, 
  List,
  ChevronLeft,
  ChevronRight,
  Target,
  Euro,
  Eye,
  Loader2,
  AlertCircle
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { jobApi, JobSearchFilters, savedJobsApi } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Mapear tipos do frontend para tipos da API
const contractTypeMap: Record<string, string> = {
  "Permanente": "FULL_TIME",
  "Temporário": "TEMPORARY",
  "Estágio": "INTERNSHIP",
  "Part-time": "PART_TIME",
  "Freelance": "FREELANCE"
};

const workModeMap: Record<string, string> = {
  "Presencial": "PRESENCIAL",
  "Remoto": "REMOTO",
  "Híbrido": "HIBRIDO"
};

// Converter job da API para formato do JobCard
function convertApiJobToCardJob(apiJob: any, matchScore?: number): Job {
  const salaryText = apiJob.showSalary && apiJob.salaryMin && apiJob.salaryMax
    ? `${apiJob.salaryMin}€ - ${apiJob.salaryMax}€/${apiJob.salaryPeriod === 'month' ? 'mês' : 'ano'}`
    : undefined;

  const contractTypeReverse: Record<string, string> = {
    "FULL_TIME": "Permanente",
    "PART_TIME": "Part-time",
    "TEMPORARY": "Temporário",
    "INTERNSHIP": "Estágio",
    "FREELANCE": "Freelance"
  };

  const workModeReverse: Record<string, string> = {
    "PRESENCIAL": "Presencial",
    "REMOTO": "Remoto",
    "HIBRIDO": "Híbrido"
  };

  const postedDate = apiJob.publishedAt 
    ? formatDistanceToNow(new Date(apiJob.publishedAt), { addSuffix: true, locale: ptBR })
    : "Recente";

  return {
    id: apiJob.id,
    title: apiJob.title,
    company: apiJob.company?.name || "Empresa",
    location: apiJob.location,
    contractType: contractTypeReverse[apiJob.type] || apiJob.type,
    workMode: workModeReverse[apiJob.workMode] || apiJob.workMode,
    salary: salaryText,
    postedAt: postedDate,
    isFeatured: apiJob.isFeatured || false,
    isUrgent: apiJob.isUrgent || false,
    quickApply: apiJob.quickApply || false,
    isNew: apiJob.publishedAt && (Date.now() - new Date(apiJob.publishedAt).getTime() < 3 * 24 * 60 * 60 * 1000),
    matchScore: matchScore
  };
}

const municipalities = [
  "Todos os concelhos",
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

const contractTypes = ["Permanente", "Temporário", "Estágio", "Part-time", "Freelance"];
const workModes = ["Presencial", "Remoto", "Híbrido"];
const categories = ["Tecnologia", "Saúde", "Administração", "Comércio", "Indústria", "Educação", "Hotelaria", "Outros"];

interface FiltersContentProps {
  selectedLocation: string;
  setSelectedLocation: (value: string) => void;
  selectedContracts: string[];
  setSelectedContracts: (value: string[]) => void;
  selectedWorkModes: string[];
  setSelectedWorkModes: (value: string[]) => void;
  salaryRange: number[];
  setSalaryRange: (value: number[]) => void;
  onClearFilters: () => void;
  showOnlyGoodMatches: boolean;
  setShowOnlyGoodMatches: (value: boolean) => void;
  showOnlySalaryVisible: boolean;
  setShowOnlySalaryVisible: (value: boolean) => void;
  salaryVisibleCount: number;
  isAuthenticated: boolean;
  userType: 'candidato' | 'empresa' | null;
}

function FiltersContent({ 
  selectedLocation, 
  setSelectedLocation,
  selectedContracts,
  setSelectedContracts,
  selectedWorkModes,
  setSelectedWorkModes,
  salaryRange,
  setSalaryRange,
  onClearFilters,
  showOnlyGoodMatches,
  setShowOnlyGoodMatches,
  showOnlySalaryVisible,
  setShowOnlySalaryVisible,
  salaryVisibleCount,
  isAuthenticated,
  userType
}: FiltersContentProps) {
  const toggleContract = (contract: string) => {
    setSelectedContracts(
      selectedContracts.includes(contract)
        ? selectedContracts.filter((c) => c !== contract)
        : [...selectedContracts, contract]
    );
  };

  const toggleWorkMode = (mode: string) => {
    setSelectedWorkModes(
      selectedWorkModes.includes(mode)
        ? selectedWorkModes.filter((m) => m !== mode)
        : [...selectedWorkModes, mode]
    );
  };

  const activeFiltersCount = 
    (selectedLocation !== "Todos os concelhos" ? 1 : 0) +
    selectedContracts.length +
    selectedWorkModes.length +
    (salaryRange[0] > 0 || salaryRange[1] < 5000 ? 1 : 0);

return (
    <div className="space-y-6">
      {/* Salary Filter - Highlighted */}
      <div className="p-4 bg-success/5 rounded-lg border border-success/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-success/20 rounded-lg">
              <Euro className="w-4 h-4 text-success" />
            </div>
            <div>
              <Label htmlFor="salary-filter" className="font-medium text-foreground flex items-center gap-1">
                <Eye className="w-3 h-3" />
                Apenas com salário
              </Label>
              <p className="text-xs text-muted-foreground">
                {salaryVisibleCount} vagas disponíveis
              </p>
            </div>
          </div>
          <Switch 
            id="salary-filter"
            checked={showOnlySalaryVisible}
            onCheckedChange={setShowOnlySalaryVisible}
          />
        </div>
      </div>

      {/* Match Score Filter - Only for authenticated candidates */}
      {isAuthenticated && userType === 'candidato' && (
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <div>
                <Label htmlFor="match-filter" className="font-medium text-foreground">
                  Apenas boas matches
                </Label>
                <p className="text-xs text-muted-foreground">
                  Vagas com +70% compatibilidade
                </p>
              </div>
            </div>
            <Switch 
              id="match-filter"
              checked={showOnlyGoodMatches}
              onCheckedChange={setShowOnlyGoodMatches}
            />
          </div>
        </div>
      )}

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button variant="ghost" onClick={onClearFilters} className="w-full justify-start text-muted-foreground">
          <X className="h-4 w-4 mr-2" />
          Limpar filtros ({activeFiltersCount})
        </Button>
      )}

      {/* Location */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Localização</h3>
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger>
            <SelectValue placeholder="Selecionar concelho" />
          </SelectTrigger>
          <SelectContent>
            {municipalities.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Contract Type */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Tipo de Contrato</h3>
        <div className="space-y-2">
          {contractTypes.map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <Checkbox 
                checked={selectedContracts.includes(type)}
                onCheckedChange={() => toggleContract(type)}
              />
              <span className="text-sm text-muted-foreground">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Work Mode */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Modo de Trabalho</h3>
        <div className="space-y-2">
          {workModes.map((mode) => (
            <label key={mode} className="flex items-center gap-2 cursor-pointer">
              <Checkbox 
                checked={selectedWorkModes.includes(mode)}
                onCheckedChange={() => toggleWorkMode(mode)}
              />
              <span className="text-sm text-muted-foreground">{mode}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Salary Range */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Salário (€/mês)</h3>
        <Slider
          value={salaryRange}
          onValueChange={setSalaryRange}
          min={0}
          max={5000}
          step={100}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{salaryRange[0]}€</span>
          <span>{salaryRange[1]}€+</span>
        </div>
      </div>
    </div>
  );
}

export default function VagasPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get("loc") || "Todos os concelhos");
  const [selectedContracts, setSelectedContracts] = useState<string[]>([]);
  const [selectedWorkModes, setSelectedWorkModes] = useState<string[]>([]);
  const [salaryRange, setSalaryRange] = useState([0, 5000]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
const [showOnlyGoodMatches, setShowOnlyGoodMatches] = useState(
    searchParams.get("goodMatches") === "true"
  );
  const [showOnlySalaryVisible, setShowOnlySalaryVisible] = useState(
    searchParams.get("salaryOnly") === "true"
  );

  const isAuthenticated = !!user;
  const userType = user?.type === "CANDIDATO" ? "candidato" : user?.type === "EMPRESA" ? "empresa" : null;
  const queryClient = useQueryClient();

  // Buscar IDs das vagas guardadas (apenas para candidatos autenticados)
  const { data: savedJobsData } = useQuery({
    queryKey: ["savedJobIds"],
    queryFn: () => savedJobsApi.getSavedJobIds(),
    enabled: isAuthenticated && userType === "candidato",
    retry: false,
  });

  const savedJobs = savedJobsData?.savedJobIds || [];

  const jobsPerPage = 20;

  // Construir filtros para API
  const apiFilters: JobSearchFilters = useMemo(() => {
    return {
      search: query || undefined,
      location: selectedLocation !== "Todos os concelhos" ? selectedLocation : undefined,
      type: selectedContracts.length > 0 
        ? selectedContracts.map(ct => contractTypeMap[ct]).filter(Boolean)
        : undefined,
      workMode: selectedWorkModes.length > 0
        ? selectedWorkModes.map(wm => workModeMap[wm]).filter(Boolean)
        : undefined,
      salaryMin: salaryRange[0] > 0 ? salaryRange[0] : undefined,
      salaryMax: salaryRange[1] < 5000 ? salaryRange[1] : undefined,
      showSalaryOnly: showOnlySalaryVisible || undefined,
      goodMatchesOnly: showOnlyGoodMatches || undefined,
      sortBy: sortBy as any,
      page: currentPage,
      limit: jobsPerPage,
    };
  }, [query, selectedLocation, selectedContracts, selectedWorkModes, salaryRange, showOnlyGoodMatches, showOnlySalaryVisible, sortBy, currentPage]);

  // Buscar vagas da API
  const { data: jobsData, isLoading, isError, error } = useQuery({
    queryKey: ["publicJobs", apiFilters],
    queryFn: () => jobApi.searchJobs(apiFilters),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });

  // Converter jobs da API para formato do JobCard
  const displayJobs = useMemo(() => {
    if (!jobsData) return [];
    
    return jobsData.jobs.map(job => 
      convertApiJobToCardJob(job, jobsData.matchScores?.[job.id])
    );
  }, [jobsData]);

  // Count jobs with visible salary (from API stats if available)
  const salaryVisibleCount = useMemo(() => {
    return displayJobs.filter(job => job.salary).length;
  }, [displayJobs]);

  const clearFilters = () => {
    setSelectedLocation("Todos os concelhos");
    setSelectedContracts([]);
    setSelectedWorkModes([]);
    setSalaryRange([0, 5000]);
    setQuery("");
    setShowOnlyGoodMatches(false);
    setShowOnlySalaryVisible(false);
    setCurrentPage(1);
  };

  // Mutation para guardar vaga
  const saveJobMutation = useMutation({
    mutationFn: (jobId: string) => savedJobsApi.saveJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedJobIds"] });
      toast.success("Vaga guardada com sucesso!");
    },
    onError: (error: any) => {
      if (error.response?.status === 401) {
        toast.error("Por favor, faça login para guardar vagas.");
      } else if (error.response?.data?.error === "JOB_ALREADY_SAVED") {
        toast.info("Esta vaga já está guardada.");
      } else {
        toast.error("Erro ao guardar vaga. Tente novamente.");
      }
    },
  });

  // Mutation para remover vaga guardada
  const unsaveJobMutation = useMutation({
    mutationFn: (jobId: string) => savedJobsApi.unsaveJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedJobIds"] });
      toast.success("Vaga removida dos guardados.");
    },
    onError: () => {
      toast.error("Erro ao remover vaga. Tente novamente.");
    },
  });

  const toggleSaveJob = (id: string) => {
    if (!isAuthenticated) {
      toast.error("Por favor, faça login para guardar vagas.", {
        action: {
          label: "Login",
          onClick: () => (window.location.href = "/auth/login"),
        },
      });
      return;
    }

    if (userType !== "candidato") {
      toast.error("Apenas candidatos podem guardar vagas.");
      return;
    }
    
    if (savedJobs.includes(id)) {
      unsaveJobMutation.mutate(id);
    } else {
      saveJobMutation.mutate(id);
    }
  };

  const totalPages = jobsData?.pagination.totalPages || 0;
  const totalResults = jobsData?.pagination.total || 0;

  const activeFiltersCount = 
    (selectedLocation !== "Todos os concelhos" ? 1 : 0) +
    selectedContracts.length +
    selectedWorkModes.length +
    (salaryRange[0] > 0 || salaryRange[1] < 5000 ? 1 : 0) +
    (showOnlyGoodMatches ? 1 : 0) +
    (showOnlySalaryVisible ? 1 : 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Search Header */}
        <div className="bg-card border-b border-border">
          <div className="container-custom py-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Cargo, empresa ou palavras-chave"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-12 h-12"
                />
              </div>
              <div className="flex gap-3">
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-[200px] h-12">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Localização" />
                  </SelectTrigger>
                  <SelectContent>
                    {municipalities.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Mobile Filters */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden h-12 relative">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filtros
                      {activeFiltersCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px]">
                    <SheetHeader>
                      <SheetTitle>Filtros</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
<FiltersContent 
                        selectedLocation={selectedLocation}
                        setSelectedLocation={setSelectedLocation}
                        selectedContracts={selectedContracts}
                        setSelectedContracts={setSelectedContracts}
                        selectedWorkModes={selectedWorkModes}
                        setSelectedWorkModes={setSelectedWorkModes}
                        salaryRange={salaryRange}
                        setSalaryRange={setSalaryRange}
                        onClearFilters={clearFilters}
                        showOnlyGoodMatches={showOnlyGoodMatches}
                        setShowOnlyGoodMatches={setShowOnlyGoodMatches}
                        showOnlySalaryVisible={showOnlySalaryVisible}
                        setShowOnlySalaryVisible={setShowOnlySalaryVisible}
                        salaryVisibleCount={salaryVisibleCount}
                        isAuthenticated={isAuthenticated}
                        userType={userType}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Active Filters */}
            {(query || activeFiltersCount > 0) && (
              <div className="flex flex-wrap items-center gap-2 mt-4">
                {query && (
                  <Badge variant="secondary" className="gap-1">
                    "{query}"
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setQuery("")} />
                  </Badge>
                )}
                {selectedLocation !== "Todos os concelhos" && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedLocation}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedLocation("Todos os concelhos")} />
                  </Badge>
                )}
                {selectedContracts.map((c) => (
                  <Badge key={c} variant="secondary" className="gap-1">
                    {c}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedContracts(selectedContracts.filter((x) => x !== c))} />
                  </Badge>
                ))}
                {selectedWorkModes.map((m) => (
                  <Badge key={m} variant="secondary" className="gap-1">
                    {m}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedWorkModes(selectedWorkModes.filter((x) => x !== m))} />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="container-custom py-8">
          <div className="flex gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 bg-card rounded-xl border border-border p-6">
                <h2 className="font-semibold text-lg text-foreground mb-6">Filtros</h2>
<FiltersContent 
                  selectedLocation={selectedLocation}
                  setSelectedLocation={setSelectedLocation}
                  selectedContracts={selectedContracts}
                  setSelectedContracts={setSelectedContracts}
                  selectedWorkModes={selectedWorkModes}
                  setSelectedWorkModes={setSelectedWorkModes}
                  salaryRange={salaryRange}
                  setSalaryRange={setSalaryRange}
                  onClearFilters={clearFilters}
                  showOnlyGoodMatches={showOnlyGoodMatches}
                  setShowOnlyGoodMatches={setShowOnlyGoodMatches}
                  showOnlySalaryVisible={showOnlySalaryVisible}
                  setShowOnlySalaryVisible={setShowOnlySalaryVisible}
                  salaryVisibleCount={salaryVisibleCount}
                  isAuthenticated={isAuthenticated}
                  userType={userType}
                />
              </div>
            </aside>

            {/* Jobs Grid */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <p className="text-muted-foreground">
                  {isLoading ? (
                    <span>A carregar...</span>
                  ) : (
                    <>
                      <span className="font-semibold text-foreground">{totalResults}</span> vagas encontradas
                      {showOnlyGoodMatches && userType === "candidato" && (
                        <Badge variant="secondary" className="ml-2">
                          <Target className="h-3 w-3 mr-1" />
                          Boas correspondências
                        </Badge>
                      )}
                    </>
                  )}
                </p>
                <div className="flex items-center gap-3">
                  <Select value={sortBy} onValueChange={(value) => { setSortBy(value); setCurrentPage(1); }}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Mais Recentes</SelectItem>
                      <SelectItem value="salary-high">Salário (Maior)</SelectItem>
                      <SelectItem value="salary-low">Salário (Menor)</SelectItem>
                      {userType === "candidato" && (
                        <SelectItem value="relevance">Relevância (Match)</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <div className="flex border border-border rounded-lg">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="icon"
                      className="rounded-r-none"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="icon"
                      className="rounded-l-none"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">A carregar vagas...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {isError && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center max-w-md">
                    <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
                    <p className="text-foreground font-medium mb-2">Erro ao carregar vagas</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {(error as any)?.response?.data?.message || "Ocorreu um erro. Tente novamente."}
                    </p>
                    <Button onClick={() => window.location.reload()}>
                      Tentar novamente
                    </Button>
                  </div>
                </div>
              )}

              {/* Jobs Grid/List */}
              {!isLoading && !isError && displayJobs.length > 0 ? (
                <>
                  <div className={viewMode === "grid" 
                    ? "grid md:grid-cols-2 xl:grid-cols-3 gap-4" 
                    : "space-y-4"
                  }>
                    {displayJobs.map((job) => (
                      <JobCard 
                        key={job.id} 
                        job={job} 
                        variant={viewMode === "list" ? "default" : "default"}
                        isSaved={savedJobs.includes(job.id)}
                        onSave={toggleSaveJob}
                        showMatchScore={true}
                        isAuthenticated={isAuthenticated}
                        userType={userType}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="icon"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Nenhuma vaga encontrada
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Tente ajustar os filtros ou pesquisar por outros termos
                  </p>
                  <Button onClick={clearFilters}>
                    Limpar Filtros
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
