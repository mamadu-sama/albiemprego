import { ArrowLeft, Info, MoreVertical, Search, Video, Phone } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { ChatUser, getInitials, getParticipantTypeBadge } from '@/data/mockChat';

interface ChatHeaderProps {
  participant: ChatUser;
  onBack?: () => void;
  onInfoClick?: () => void;
  onSearchClick?: () => void;
  showBackButton?: boolean;
}

const ChatHeader = ({ 
  participant, 
  onBack, 
  onInfoClick, 
  onSearchClick,
  showBackButton = false 
}: ChatHeaderProps) => {
  const typeBadge = getParticipantTypeBadge(participant.type);

  return (
    <div className="flex items-center justify-between gap-3 p-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3 min-w-0">
        {showBackButton && (
          <Button variant="ghost" size="icon" onClick={onBack} className="flex-shrink-0 md:hidden">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={participant.avatar} />
            <AvatarFallback className={cn(
              participant.type === 'empresa' && "bg-primary/20 text-primary",
              participant.type === 'admin' && "bg-secondary text-secondary-foreground"
            )}>
              {getInitials(participant.name)}
            </AvatarFallback>
          </Avatar>
          {participant.isOnline && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold truncate">{participant.name}</h2>
            <Badge variant={typeBadge.variant} className="text-[10px] px-1.5 py-0 hidden sm:inline-flex">
              {typeBadge.label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {participant.isOnline ? (
              <span className="text-green-600">Online</span>
            ) : (
              participant.role || participant.company || 'Offline'
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={onSearchClick} className="hidden sm:flex">
          <Search className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="icon" onClick={onInfoClick} className="hidden sm:flex">
          <Info className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onSearchClick} className="sm:hidden">
              <Search className="h-4 w-4 mr-2" />
              Pesquisar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onInfoClick} className="sm:hidden">
              <Info className="h-4 w-4 mr-2" />
              Informações
            </DropdownMenuItem>
            <DropdownMenuSeparator className="sm:hidden" />
            <DropdownMenuItem>
              Silenciar notificações
            </DropdownMenuItem>
            <DropdownMenuItem>
              Ver perfil completo
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Eliminar conversa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChatHeader;
