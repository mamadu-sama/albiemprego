import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { 
  Users, 
  Search,
  UserX
} from "lucide-react";
import { members } from "@/data/mockCommunity";
import { MemberCard } from "@/components/comunidade/MemberCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const locations = ["Todas", "Castelo Branco", "Covilhã", "Fundão", "Idanha-a-Nova"];
const sectors = ["Todos", "Tecnologia", "Saúde", "Educação", "Turismo", "Marketing", "Design", "Gestão"];

export default function Membros() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "candidato" | "empresa">("all");
  const [locationFilter, setLocationFilter] = useState("Todas");
  const [sectorFilter, setSectorFilter] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  const filteredMembers = useMemo(() => {
    let filtered = [...members];

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(m => m.type === typeFilter);
    }

    // Location filter
    if (locationFilter !== "Todas") {
      filtered = filtered.filter(m => m.location === locationFilter);
    }

    // Sector filter
    if (sectorFilter !== "Todos") {
      filtered = filtered.filter(m => m.sectors.includes(sectorFilter));
    }

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(query) ||
        m.role.toLowerCase().includes(query) ||
        m.company?.toLowerCase().includes(query)
      );
    }

    // Sort by activity
    filtered.sort((a, b) => (b.postsCount + b.repliesCount) - (a.postsCount + a.repliesCount));

    return filtered;
  }, [searchQuery, typeFilter, locationFilter, sectorFilter]);

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container-custom">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Início</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/comunidade">Comunidade</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Membros</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <Users className="h-7 w-7 text-primary" />
              Membros da Comunidade
            </h1>
            <p className="text-muted-foreground mt-1">
              {filteredMembers.length} membros ativos
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            {/* Type Tabs */}
            <Tabs 
              value={typeFilter} 
              onValueChange={(v) => { setTypeFilter(v as any); handleFilterChange(); }}
            >
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="candidato">Candidatos</TabsTrigger>
                <TabsTrigger value="empresa">Empresas</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Location */}
            <div className="flex-1 max-w-[200px]">
              <Select 
                value={locationFilter} 
                onValueChange={(v) => { setLocationFilter(v); handleFilterChange(); }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Localização" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(loc => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sector */}
            <div className="flex-1 max-w-[200px]">
              <Select 
                value={sectorFilter} 
                onValueChange={(v) => { setSectorFilter(v); handleFilterChange(); }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Setor" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map(sec => (
                    <SelectItem key={sec} value={sec}>{sec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-sm ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar membros..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); handleFilterChange(); }}
                className="pl-9"
              />
            </div>
          </div>

          {/* Members Grid */}
          {paginatedMembers.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedMembers.map(member => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <UserX className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Nenhum membro encontrado
                </h3>
                <p className="text-muted-foreground">
                  Não encontrámos membros com os filtros selecionados.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
