import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  ArrowRight,
  Sparkles,
  UserPlus
} from "lucide-react";
import { discussions, events, members, categories, formatRelativeTime, getInitials } from "@/data/mockCommunity";
import { DiscussionCard } from "@/components/comunidade/DiscussionCard";
import { EventCard } from "@/components/comunidade/EventCard";
import { CategoryBadge } from "@/components/comunidade/CategoryBadge";

// Mock auth state - replace with real auth
const isAuthenticated = false;

export default function ComunidadeIndex() {
  const recentDiscussions = discussions.slice(0, 5);
  const upcomingEvents = events.filter(e => !e.isPast).slice(0, 3);
  const activeMembers = members.slice(0, 5);

  const stats = {
    members: 1247,
    discussions: 342,
    events: 12,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          
          <div className="container-custom relative">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4">
                <Sparkles className="h-3 w-3 mr-1" />
                Beta
              </Badge>
              
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-primary/10">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                Comunidade <span className="text-primary">AlbiEmprego</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Conecte-se com profissionais da região de Castelo Branco. 
                Partilhe conhecimento, faça networking e participe em eventos.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {isAuthenticated ? (
                  <Button size="lg" asChild>
                    <Link to="/comunidade/discussoes/nova">
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Iniciar Discussão
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button size="lg" asChild>
                      <Link to="/auth/register">
                        <UserPlus className="h-5 w-5 mr-2" />
                        Junte-se à Comunidade
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link to="/auth/login">
                        Entrar
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-8 border-b border-border">
          <div className="container-custom">
            <div className="grid grid-cols-3 gap-4 md:gap-8">
              <Card className="text-center border-0 shadow-none bg-transparent">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="text-2xl md:text-3xl font-bold text-foreground">
                      {stats.members.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Membros</p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-0 shadow-none bg-transparent">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <span className="text-2xl md:text-3xl font-bold text-foreground">
                      {stats.discussions}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Discussões</p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-0 shadow-none bg-transparent">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="text-2xl md:text-3xl font-bold text-foreground">
                      {stats.events}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Eventos</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container-custom">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Recent Discussions */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        Discussões Recentes
                      </CardTitle>
                      <CardDescription>
                        As conversas mais recentes da comunidade
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/comunidade/discussoes">
                        Ver todas
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentDiscussions.map(discussion => (
                      <DiscussionCard 
                        key={discussion.id} 
                        discussion={discussion} 
                        variant="compact"
                      />
                    ))}
                  </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Próximos Eventos
                      </CardTitle>
                      <CardDescription>
                        Eventos e encontros da comunidade
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/comunidade/eventos">
                        Ver calendário
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {upcomingEvents.map(event => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        variant="compact"
                      />
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Categorias</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {categories.map(category => (
                      <Link 
                        key={category.id}
                        to={`/comunidade/discussoes?categoria=${category.slug}`}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors group"
                      >
                        <CategoryBadge category={category} />
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          {category.discussionCount}
                        </span>
                      </Link>
                    ))}
                  </CardContent>
                </Card>

                {/* Active Members */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Membros Ativos</CardTitle>
                    <CardDescription>Esta semana</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {activeMembers.map(member => (
                      <Link 
                        key={member.id}
                        to={`/comunidade/membros/${member.id}`}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                            {member.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {member.role}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {member.postsCount}
                        </Badge>
                      </Link>
                    ))}
                    
                    <Button variant="ghost" size="sm" className="w-full mt-2" asChild>
                      <Link to="/comunidade/membros">
                        Ver todos os membros
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* CTA for non-authenticated */}
                {!isAuthenticated && (
                  <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
                    <CardContent className="pt-6 text-center">
                      <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">
                        Junte-se à Comunidade
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Faça parte da maior comunidade profissional da região.
                      </p>
                      <Button className="w-full" asChild>
                        <Link to="/auth/register">
                          Registar Grátis
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
