import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Users,
  Share2,
  ArrowLeft,
  Linkedin,
  Facebook,
  Twitter,
  Link as LinkIcon,
  BadgeCheck,
  CalendarPlus,
  Loader2
} from "lucide-react";
import { getEventById, formatEventDate, getInitials } from "@/data/mockCommunity";
import { ParticipantsList } from "@/components/comunidade/ParticipantsList";
import { toast } from "@/hooks/use-toast";

const typeConfig = {
  online: { label: 'Online', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', icon: Video },
  presencial: { label: 'Presencial', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', icon: MapPin },
  hibrido: { label: 'Híbrido', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', icon: Users },
};

export default function EventoDetail() {
  const { id } = useParams<{ id: string }>();
  const event = getEventById(id || "");
  
  const [isConfirming, setIsConfirming] = useState(false);
  const [addToCalendar, setAddToCalendar] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 py-8">
          <div className="container-custom text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Evento não encontrado</h1>
            <Button asChild>
              <Link to="/comunidade/eventos">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar aos Eventos
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { day, month, time } = formatEventDate(event.date);
  const typeInfo = typeConfig[event.type];
  const TypeIcon = typeInfo.icon;
  const occupancy = (event.participants.length / event.maxParticipants) * 100;
  const isFull = occupancy >= 100;

  const handleConfirmPresence = async () => {
    setIsConfirming(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Presença confirmada!",
      description: addToCalendar 
        ? "Receberá um email de confirmação com os detalhes."
        : "Receberá um email de confirmação.",
    });
    
    setIsConfirming(false);
    setDialogOpen(false);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `${event.title} - AlbiEmprego`;
    
    const shareUrls: Record<string, string> = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copiado!",
        description: "O link foi copiado para a área de transferência.",
      });
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
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
                <BreadcrumbLink asChild>
                  <Link to="/comunidade/eventos">Eventos</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="truncate max-w-[200px]">
                  {event.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Hero */}
          <Card className="mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Date Block */}
                <div className="flex-shrink-0 bg-background rounded-xl p-4 text-center shadow-lg">
                  <span className="text-3xl md:text-4xl font-bold text-primary">{day}</span>
                  <p className="text-sm font-medium text-muted-foreground uppercase">{month}</p>
                </div>

                <div className="flex-1">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className={typeInfo.color}>
                      <TypeIcon className="h-3 w-3 mr-1" />
                      {typeInfo.label}
                    </Badge>
                    {event.isPast && (
                      <Badge variant="secondary">Encerrado</Badge>
                    )}
                    {!event.isPast && isFull && (
                      <Badge variant="destructive">Lotado</Badge>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    {event.title}
                  </h1>

                  {/* Quick Info */}
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {time}
                    </span>
                    {event.type !== 'online' && event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </span>
                    )}
                    {event.type === 'online' && (
                      <span className="flex items-center gap-1">
                        <Video className="h-4 w-4" />
                        Online
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Sobre o Evento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    {(event.fullDescription || event.description).split('\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>

                  {/* Tags */}
                  {event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t">
                      {event.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Organizer */}
              <Card>
                <CardHeader>
                  <CardTitle>Organizador</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                        {getInitials(event.organizer.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">{event.organizer.name}</span>
                        {event.organizer.isVerified && (
                          <BadgeCheck className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{event.organizer.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Participants */}
              <Card>
                <CardHeader>
                  <CardTitle>Participantes Confirmados ({event.participants.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {event.participants.slice(0, 8).map(participant => (
                      <Link
                        key={participant.id}
                        to={`/comunidade/membros/${participant.id}`}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {getInitials(participant.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium truncate">
                          {participant.name.split(' ')[0]}
                        </span>
                      </Link>
                    ))}
                  </div>
                  
                  {event.participants.length > 8 && (
                    <p className="text-sm text-muted-foreground mt-4 text-center">
                      +{event.participants.length - 8} mais participantes
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Info Card */}
              <Card className="sticky top-24">
                <CardContent className="pt-6 space-y-4">
                  {/* Date & Time */}
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">
                        {event.date.toLocaleDateString('pt-PT', { 
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">{time}</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3">
                    {event.type === 'online' ? (
                      <>
                        <Video className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Evento Online</p>
                          <p className="text-sm text-muted-foreground">
                            O link será enviado por email
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">{event.location}</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Capacity */}
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">
                        {event.participants.length} / {event.maxParticipants} participantes
                      </p>
                      <Progress value={occupancy} className="h-2 mt-2" />
                    </div>
                  </div>

                  {/* CTA Button */}
                  {!event.isPast && (
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full mt-4" 
                          size="lg"
                          disabled={isFull}
                        >
                          {isFull ? 'Evento Lotado' : 'Confirmar Presença'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirmar Presença</DialogTitle>
                          <DialogDescription>
                            Está a confirmar a sua presença em "{event.title}"
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="py-4 space-y-4">
                          <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                            <Calendar className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <p className="font-medium">
                                {event.date.toLocaleDateString('pt-PT', { 
                                  day: 'numeric',
                                  month: 'long'
                                })} às {time}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {event.type === 'online' 
                                  ? 'Receberá o link de acesso por email'
                                  : event.location
                                }
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Checkbox 
                              id="calendar" 
                              checked={addToCalendar}
                              onCheckedChange={(checked) => setAddToCalendar(checked as boolean)}
                            />
                            <Label htmlFor="calendar" className="cursor-pointer">
                              <CalendarPlus className="h-4 w-4 inline mr-1" />
                              Adicionar ao meu calendário
                            </Label>
                          </div>
                        </div>

                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleConfirmPresence} disabled={isConfirming}>
                            {isConfirming && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Confirmar
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}

                  {event.isPast && (
                    <Button className="w-full mt-4" variant="outline" disabled>
                      Evento Encerrado
                    </Button>
                  )}

                  {/* Share */}
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Share2 className="h-4 w-4" />
                      Partilhar
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleShare('linkedin')}
                      >
                        <Linkedin className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleShare('facebook')}
                      >
                        <Facebook className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleShare('twitter')}
                      >
                        <Twitter className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleShare('copy')}
                      >
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                    </div>
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
