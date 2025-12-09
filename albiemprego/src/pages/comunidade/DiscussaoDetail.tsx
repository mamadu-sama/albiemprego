import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Eye, 
  MessageSquare, 
  Pin, 
  Edit2, 
  Trash2,
  BadgeCheck,
  ArrowLeft,
  LogIn
} from "lucide-react";
import { getDiscussionById, discussions, mockReplies, formatRelativeTime, getInitials } from "@/data/mockCommunity";
import { CategoryBadge } from "@/components/comunidade/CategoryBadge";
import { ReplyForm } from "@/components/comunidade/ReplyForm";
import { DiscussionCard } from "@/components/comunidade/DiscussionCard";

// Mock auth
const isAuthenticated = false;
const currentUserId = "1";

export default function DiscussaoDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const discussion = getDiscussionById(id || "");
  
  const [replies] = useState(mockReplies);

  if (!discussion) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 py-8">
          <div className="container-custom text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Discussão não encontrada</h1>
            <Button asChild>
              <Link to="/comunidade/discussoes">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar às Discussões
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isAuthor = discussion.author.id === currentUserId;
  const relatedDiscussions = discussions
    .filter(d => d.category.id === discussion.category.id && d.id !== discussion.id)
    .slice(0, 3);

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
                  <Link to="/comunidade/discussoes">Discussões</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="truncate max-w-[200px]">
                  {discussion.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Original Post */}
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    {/* Author Avatar */}
                    <Link to={`/comunidade/membros/${discussion.author.id}`} className="flex-shrink-0">
                      <Avatar className="h-12 w-12 ring-2 ring-background">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {getInitials(discussion.author.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Link>

                    <div className="flex-1 min-w-0">
                      {/* Author Info */}
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Link 
                          to={`/comunidade/membros/${discussion.author.id}`}
                          className="font-semibold text-foreground hover:text-primary transition-colors"
                        >
                          {discussion.author.name}
                        </Link>
                        {discussion.author.isVerified && (
                          <BadgeCheck className="h-4 w-4 text-primary" />
                        )}
                        {discussion.author.role && (
                          <span className="text-sm text-muted-foreground">
                            • {discussion.author.role}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <div className="flex items-center gap-2 mb-3">
                        {discussion.isPinned && (
                          <Pin className="h-4 w-4 text-primary fill-primary" />
                        )}
                        <h1 className="text-xl md:text-2xl font-bold text-foreground">
                          {discussion.title}
                        </h1>
                      </div>

                      {/* Category */}
                      <div className="mb-4">
                        <CategoryBadge category={discussion.category} size="md" />
                      </div>

                      {/* Content */}
                      <div className="prose prose-sm max-w-none dark:prose-invert mb-4">
                        {discussion.content.split('\n').map((paragraph, i) => (
                          <p key={i}>{paragraph}</p>
                        ))}
                      </div>

                      {/* Meta & Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{formatRelativeTime(discussion.createdAt)}</span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {discussion.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {discussion.replies}
                          </span>
                        </div>

                        {isAuthor && (
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit2 className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Eliminar
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Eliminar discussão?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta ação não pode ser desfeita. A discussão e todas as respostas serão permanentemente eliminadas.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    className="bg-destructive hover:bg-destructive/90"
                                    onClick={() => navigate("/comunidade/discussoes")}
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Replies */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Respostas ({replies.length})
                </h2>

                {replies.map(reply => (
                  <Card key={reply.id}>
                    <CardContent className="pt-4">
                      <div className="flex gap-3">
                        <Link to={`/comunidade/membros/${reply.author.id}`} className="flex-shrink-0">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                              {getInitials(reply.author.name)}
                            </AvatarFallback>
                          </Avatar>
                        </Link>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Link 
                              to={`/comunidade/membros/${reply.author.id}`}
                              className="font-medium text-foreground hover:text-primary transition-colors"
                            >
                              {reply.author.name}
                            </Link>
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeTime(reply.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-foreground">
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Reply Form or Login CTA */}
              {isAuthenticated ? (
                <ReplyForm discussionId={discussion.id} />
              ) : (
                <Card className="bg-muted/50">
                  <CardContent className="py-8 text-center">
                    <LogIn className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">
                      Faça login para participar
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Entre na sua conta para responder a esta discussão.
                    </p>
                    <Button asChild>
                      <Link to="/auth/login">Entrar</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Author Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Sobre o Autor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                        {getInitials(discussion.author.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">{discussion.author.name}</span>
                        {discussion.author.isVerified && (
                          <BadgeCheck className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{discussion.author.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                    <span>23 posts</span>
                    <span>87 respostas</span>
                  </div>

                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to={`/comunidade/membros/${discussion.author.id}`}>
                      Ver Perfil Completo
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Related Discussions */}
              {relatedDiscussions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Discussões Relacionadas</CardTitle>
                    <CardDescription>Mais sobre {discussion.category.name}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {relatedDiscussions.map(d => (
                      <Link 
                        key={d.id}
                        to={`/comunidade/discussoes/${d.id}`}
                        className="block p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <h4 className="font-medium text-sm line-clamp-2 mb-1">
                          {d.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{d.replies} respostas</span>
                          <span>•</span>
                          <span>{formatRelativeTime(d.createdAt)}</span>
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              )}
            </aside>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
