import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Video, Users, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Event, formatEventDate } from "@/data/mockCommunity";
import { ParticipantsList } from "./ParticipantsList";

interface EventCardProps {
  event: Event;
  variant?: 'default' | 'compact';
  className?: string;
}

const typeConfig = {
  online: { label: 'Online', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', icon: Video },
  presencial: { label: 'Presencial', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', icon: MapPin },
  hibrido: { label: 'Híbrido', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', icon: Users },
};

function getEventStatus(event: Event): { label: string; color: string } | null {
  if (event.isPast) {
    return { label: 'Encerrado', color: 'bg-muted text-muted-foreground' };
  }
  
  const now = new Date();
  const diffDays = Math.floor((event.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const occupancy = (event.participants.length / event.maxParticipants) * 100;
  
  if (occupancy >= 100) {
    return { label: 'Lotado', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' };
  }
  if (occupancy >= 80) {
    return { label: 'Vagas limitadas', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' };
  }
  if (diffDays <= 7) {
    return { label: 'Em breve', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' };
  }
  
  return null;
}

export function EventCard({ event, variant = 'default', className }: EventCardProps) {
  const isCompact = variant === 'compact';
  const { day, month, time } = formatEventDate(event.date);
  const typeInfo = typeConfig[event.type];
  const status = getEventStatus(event);
  const TypeIcon = typeInfo.icon;

  return (
    <Card className={cn(
      "group transition-all duration-200 hover:shadow-md hover:border-primary/20 overflow-hidden",
      event.isPast && "opacity-75",
      className
    )}>
      <CardContent className={cn("p-0", isCompact && "p-0")}>
        <div className="flex">
          {/* Date Column */}
          <div className={cn(
            "flex-shrink-0 flex flex-col items-center justify-center bg-primary/10 text-primary",
            isCompact ? "w-16 py-3" : "w-20 py-4"
          )}>
            <span className={cn("font-bold", isCompact ? "text-xl" : "text-2xl")}>{day}</span>
            <span className={cn("uppercase font-medium", isCompact ? "text-[10px]" : "text-xs")}>{month}</span>
          </div>

          {/* Content */}
          <div className={cn("flex-1 p-4", isCompact && "p-3")}>
            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              <Badge variant="outline" className={cn("text-xs", typeInfo.color)}>
                <TypeIcon className="h-3 w-3 mr-1" />
                {typeInfo.label}
              </Badge>
              {status && (
                <Badge variant="outline" className={cn("text-xs", status.color)}>
                  {status.label}
                </Badge>
              )}
            </div>

            {/* Title */}
            <Link 
              to={`/comunidade/eventos/${event.id}`}
              className={cn(
                "font-semibold text-foreground hover:text-primary transition-colors block",
                isCompact ? "text-sm line-clamp-1" : "text-base line-clamp-2"
              )}
            >
              {event.title}
            </Link>

            {/* Description (only on default) */}
            {!isCompact && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {event.description}
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {time}
              </span>
              {event.type === 'online' ? (
                <span className="flex items-center gap-1">
                  <Video className="h-3.5 w-3.5" />
                  Online
                </span>
              ) : event.location && (
                <span className="flex items-center gap-1 truncate max-w-[150px]">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                  {event.location.split(',')[0]}
                </span>
              )}
            </div>

            {/* Participants & Action (only on default) */}
            {!isCompact && (
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <ParticipantsList participants={event.participants} max={4} size="sm" />
                  <span className="text-xs text-muted-foreground">
                    {event.participants.length}/{event.maxParticipants}
                  </span>
                </div>
                <Button 
                  size="sm" 
                  variant={event.isPast ? "outline" : "default"}
                  asChild
                >
                  <Link to={`/comunidade/eventos/${event.id}`}>
                    {event.isPast ? 'Ver Detalhes' : 'Participar'}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
