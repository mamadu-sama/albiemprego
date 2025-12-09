import { Link, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { 
  MapPin, 
  Calendar,
  MessageSquare,
  ExternalLink,
  BadgeCheck,
  Building2,
  User,
  ArrowLeft,
  Linkedin,
  Globe,
  Briefcase
} from "lucide-react";
import { getMemberById, discussions, events, getInitials, formatRelativeTime } from "@/data/mockCommunity";
import { DiscussionCard } from "@/components/comunidade/DiscussionCard";
import { EventCard } from "@/components/comunidade/EventCard";

export default function MembroPerfil() {
  const { id } = useParams<{ id: string }>();
  const member = getMemberById(id || "");

  if (!member) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 py-8">
          <div className="container-custom text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Membro não encontrado</h1>
            <Button asChild>
              <Link to="/comunidade/membros">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar aos Membros
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get member's discussions and events (mock)
  const memberDiscussions = discussions.filter(d => d.author.name === member.name).slice(0, 5);
  const memberEvents = events.filter(e => 
    e.participants.some(p => p.name === member.name) || e.organizer.name === member.name
  ).slice(0, 5);

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
                <BreadcrumbLink asChild>
                  <Link to="/comunidade/membros">Membros</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{member.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <Avatar className="h-24 w-24 ring-4 ring-background shadow-lg">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h1 className="text-2xl font-bold text-foreground">{member.name}</h1>
                        {member.isVerified && (
                          <BadgeCheck className="h-5 w-5 text-primary" />
                        )}
                      </div>

                      <p className="text-lg text-muted-foreground mb-2">
                        {member.role}
                        {member.company && ` • ${member.company}`}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {member.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Membro desde {member.joinedAt.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge 
                          variant="outline" 
                          className={member.type === 'empresa' 
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" 
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          }
                        >
                          {member.type === 'empresa' ? (
                            <>
                              <Building2 className="h-3 w-3 mr-1" />
                              Empresa
                            </>
                          ) : (
                            <>
                              <User className="h-3 w-3 mr-1" />
                              Candidato
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs */}
              <Tabs defaultValue="sobre">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="sobre">Sobre</TabsTrigger>
                  <TabsTrigger value="atividade">Atividade</TabsTrigger>
                  <TabsTrigger value="eventos">Eventos</TabsTrigger>
                </TabsList>

                <TabsContent value="sobre" className="mt-6 space-y-6">
                  {/* Bio */}
                  {member.bio && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Biografia</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{member.bio}</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Sectors */}
                  {member.sectors.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Setores de Interesse</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {member.sectors.map(sector => (
                            <Badge key={sector} variant="secondary">{sector}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Skills */}
                  {member.skills.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Competências</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {member.skills.map(skill => (
                            <Badge key={skill} variant="outline">{skill}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Links */}
                  {member.links && Object.keys(member.links).length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Links</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {member.links.linkedin && (
                          <a 
                            href={member.links.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Linkedin className="h-4 w-4" />
                            LinkedIn
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {member.links.portfolio && (
                          <a 
                            href={member.links.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Briefcase className="h-4 w-4" />
                            Portfolio
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {member.links.website && (
                          <a 
                            href={member.links.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Globe className="h-4 w-4" />
                            Website
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="atividade" className="mt-6 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Discussões Criadas</CardTitle>
                      <CardDescription>
                        {memberDiscussions.length} discussões
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {memberDiscussions.length > 0 ? (
                        memberDiscussions.map(discussion => (
                          <DiscussionCard 
                            key={discussion.id} 
                            discussion={discussion} 
                            variant="compact"
                          />
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm py-4 text-center">
                          Este membro ainda não criou discussões.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="eventos" className="mt-6 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Eventos</CardTitle>
                      <CardDescription>
                        {memberEvents.length} eventos
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {memberEvents.length > 0 ? (
                        memberEvents.map(event => (
                          <EventCard 
                            key={event.id} 
                            event={event} 
                            variant="compact"
                          />
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm py-4 text-center">
                          Este membro ainda não participou em eventos.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Stats Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Estatísticas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Membro desde</span>
                    <span className="font-medium">
                      {member.joinedAt.toLocaleDateString('pt-PT', { 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Discussões</span>
                    <span className="font-medium">{member.postsCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Respostas</span>
                    <span className="font-medium">{member.repliesCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Eventos</span>
                    <span className="font-medium">{member.eventsAttended}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Badges (Future) */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Badges</CardTitle>
                  <CardDescription>Em breve</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {member.postsCount > 0 && (
                      <Badge variant="secondary">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Primeiro Post
                      </Badge>
                    )}
                    {member.repliesCount >= 10 && (
                      <Badge variant="secondary">
                        💬 10 Respostas
                      </Badge>
                    )}
                    {member.eventsAttended >= 5 && (
                      <Badge variant="secondary">
                        <Calendar className="h-3 w-3 mr-1" />
                        5 Eventos
                      </Badge>
                    )}
                    {member.isVerified && (
                      <Badge variant="secondary">
                        <BadgeCheck className="h-3 w-3 mr-1" />
                        Verificado
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
