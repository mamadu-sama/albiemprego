import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { 
  Calendar, 
  Search,
  CalendarDays
} from "lucide-react";
import { events } from "@/data/mockCommunity";
import { EventCard } from "@/components/comunidade/EventCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Eventos() {
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState<"all" | "upcoming" | "past">("all");
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    // Time filter
    if (timeFilter === "upcoming") {
      filtered = filtered.filter(e => !e.isPast);
    } else if (timeFilter === "past") {
      filtered = filtered.filter(e => e.isPast);
    }

    // Type filter
    if (typeFilters.length > 0) {
      filtered = filtered.filter(e => typeFilters.includes(e.type));
    }

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(e => 
        e.title.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query)
      );
    }

    // Sort by date
    filtered.sort((a, b) => {
      if (a.isPast === b.isPast) {
        return a.date.getTime() - b.date.getTime();
      }
      return a.isPast ? 1 : -1;
    });

    return filtered;
  }, [searchQuery, timeFilter, typeFilters]);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleTypeFilter = (type: string) => {
    setTypeFilters(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
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
                <BreadcrumbPage>Eventos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                <Calendar className="h-7 w-7 text-primary" />
                Eventos da Comunidade
              </h1>
              <p className="text-muted-foreground mt-1">
                {filteredEvents.length} eventos encontrados
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Tabs */}
            <Tabs value={timeFilter} onValueChange={(v) => { setTimeFilter(v as any); setCurrentPage(1); }}>
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="upcoming">Próximos</TabsTrigger>
                <TabsTrigger value="past">Passados</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Type Filters */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="presencial" 
                  checked={typeFilters.includes("presencial")}
                  onCheckedChange={() => toggleTypeFilter("presencial")}
                />
                <Label htmlFor="presencial" className="text-sm cursor-pointer">Presencial</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="online" 
                  checked={typeFilters.includes("online")}
                  onCheckedChange={() => toggleTypeFilter("online")}
                />
                <Label htmlFor="online" className="text-sm cursor-pointer">Online</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="hibrido" 
                  checked={typeFilters.includes("hibrido")}
                  onCheckedChange={() => toggleTypeFilter("hibrido")}
                />
                <Label htmlFor="hibrido" className="text-sm cursor-pointer">Híbrido</Label>
              </div>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-sm ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar eventos..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="pl-9"
              />
            </div>
          </div>

          {/* Events Grid */}
          {paginatedEvents.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                {paginatedEvents.map(event => (
                  <EventCard key={event.id} event={event} />
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
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
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
                <CalendarDays className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Nenhum evento encontrado
                </h3>
                <p className="text-muted-foreground">
                  Não encontrámos eventos com os filtros selecionados.
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
