import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Author } from "@/data/mockCommunity";
import { getInitials } from "@/data/mockCommunity";

interface ParticipantsListProps {
  participants: Author[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showNames?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-8 w-8 text-xs',
  lg: 'h-10 w-10 text-sm',
};

export function ParticipantsList({ 
  participants, 
  max = 5, 
  size = 'md', 
  showNames = false,
  className 
}: ParticipantsListProps) {
  const visible = participants.slice(0, max);
  const remaining = participants.length - max;

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex -space-x-2">
        {visible.map((participant, index) => (
          <Tooltip key={participant.id}>
            <TooltipTrigger asChild>
              <Avatar 
                className={cn(
                  sizeClasses[size],
                  "border-2 border-background ring-0 transition-transform hover:scale-110 hover:z-10"
                )}
                style={{ zIndex: visible.length - index }}
              >
                <AvatarImage src={participant.avatar} alt={participant.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {getInitials(participant.name)}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              <p className="font-medium">{participant.name}</p>
              {participant.role && (
                <p className="text-muted-foreground">{participant.role}</p>
              )}
            </TooltipContent>
          </Tooltip>
        ))}
        
        {remaining > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className={cn(
                  sizeClasses[size],
                  "flex items-center justify-center rounded-full border-2 border-background bg-muted text-muted-foreground font-medium"
                )}
              >
                +{remaining}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              <p>+{remaining} participantes</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      
      {showNames && visible.length > 0 && (
        <span className="ml-3 text-sm text-muted-foreground">
          {visible.length === 1 
            ? visible[0].name 
            : `${visible[0].name} e +${participants.length - 1}`
          }
        </span>
      )}
    </div>
  );
}
