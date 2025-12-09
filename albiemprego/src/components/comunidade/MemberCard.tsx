import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, MessageSquare, BadgeCheck, Building2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Member, getInitials } from "@/data/mockCommunity";

interface MemberCardProps {
  member: Member;
  variant?: 'default' | 'compact';
  className?: string;
}

export function MemberCard({ member, variant = 'default', className }: MemberCardProps) {
  const isCompact = variant === 'compact';

  return (
    <Card className={cn(
      "group transition-all duration-200 hover:shadow-md hover:border-primary/20",
      className
    )}>
      <CardContent className={cn("p-4", isCompact && "p-3")}>
        <div className={cn("flex", isCompact ? "flex-row gap-3 items-center" : "flex-col items-center text-center")}>
          {/* Avatar */}
          <Link 
            to={`/comunidade/membros/${member.id}`} 
            className="flex-shrink-0"
          >
            <Avatar className={cn(
              "ring-2 ring-background transition-transform group-hover:scale-105",
              isCompact ? "h-12 w-12" : "h-16 w-16"
            )}>
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                {getInitials(member.name)}
              </AvatarFallback>
            </Avatar>
          </Link>

          {/* Info */}
          <div className={cn("flex-1 min-w-0", !isCompact && "mt-3")}>
            {/* Name & Badge */}
            <div className={cn("flex items-center gap-1.5", !isCompact && "justify-center")}>
              <Link 
                to={`/comunidade/membros/${member.id}`}
                className="font-semibold text-foreground hover:text-primary transition-colors truncate"
              >
                {member.name}
              </Link>
              {member.isVerified && (
                <BadgeCheck className="h-4 w-4 text-primary flex-shrink-0" />
              )}
            </div>

            {/* Role & Company */}
            <p className={cn(
              "text-sm text-muted-foreground truncate",
              !isCompact && "mt-0.5"
            )}>
              {member.role}
              {member.company && ` • ${member.company}`}
            </p>

            {/* Location */}
            <div className={cn(
              "flex items-center gap-1 text-xs text-muted-foreground",
              !isCompact && "justify-center mt-1"
            )}>
              <MapPin className="h-3 w-3" />
              {member.location}
            </div>

            {/* Type Badge */}
            {!isCompact && (
              <Badge 
                variant="outline" 
                className={cn(
                  "mt-2 text-xs",
                  member.type === 'empresa' 
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" 
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                )}
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
            )}

            {/* Sectors (only default) */}
            {!isCompact && member.sectors.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-center mt-2">
                {member.sectors.slice(0, 3).map(sector => (
                  <Badge key={sector} variant="secondary" className="text-[10px] px-1.5 py-0">
                    {sector}
                  </Badge>
                ))}
              </div>
            )}

            {/* Stats */}
            {!isCompact && (
              <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {member.postsCount} posts
                </span>
                <span>{member.repliesCount} respostas</span>
              </div>
            )}
          </div>

          {/* Action Button (compact) */}
          {isCompact && (
            <Button size="sm" variant="outline" asChild className="flex-shrink-0">
              <Link to={`/comunidade/membros/${member.id}`}>Ver</Link>
            </Button>
          )}
        </div>

        {/* Action Button (default) */}
        {!isCompact && (
          <Button variant="outline" size="sm" className="w-full mt-4" asChild>
            <Link to={`/comunidade/membros/${member.id}`}>Ver Perfil</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
