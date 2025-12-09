import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Conversation, 
  currentUser, 
  formatRelativeTime, 
  getInitials, 
  truncateText,
  getParticipantTypeBadge 
} from '@/data/mockChat';

interface ConversationItemProps {
  conversation: Conversation;
  isActive?: boolean;
  onClick: () => void;
}

const ConversationItem = ({ conversation, isActive, onClick }: ConversationItemProps) => {
  const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id);
  if (!otherParticipant) return null;

  const lastMessage = conversation.messages[conversation.messages.length - 1];
  const isLastMsgMine = lastMessage?.senderId === currentUser.id;
  const typeBadge = getParticipantTypeBadge(otherParticipant.type);

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left",
        isActive 
          ? "bg-primary/10 border border-primary/20" 
          : "hover:bg-muted/50",
        conversation.unreadCount > 0 && !isActive && "bg-muted/30"
      )}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <Avatar className="h-12 w-12">
          <AvatarImage src={otherParticipant.avatar} />
          <AvatarFallback className={cn(
            otherParticipant.type === 'empresa' && "bg-primary/20 text-primary",
            otherParticipant.type === 'admin' && "bg-secondary text-secondary-foreground"
          )}>
            {getInitials(otherParticipant.name)}
          </AvatarFallback>
        </Avatar>
        {otherParticipant.isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className={cn(
              "font-medium truncate",
              conversation.unreadCount > 0 && "font-semibold"
            )}>
              {otherParticipant.name}
            </span>
            <Badge variant={typeBadge.variant} className="text-[10px] px-1.5 py-0 hidden sm:inline-flex">
              {typeBadge.label}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {formatRelativeTime(conversation.lastMessageAt)}
          </span>
        </div>

        {lastMessage && (
          <div className="flex items-center justify-between gap-2 mt-0.5">
            <p className={cn(
              "text-sm truncate",
              conversation.unreadCount > 0 
                ? "text-foreground font-medium" 
                : "text-muted-foreground"
            )}>
              {isLastMsgMine && <span className="text-muted-foreground">Você: </span>}
              {truncateText(lastMessage.text, 40)}
            </p>
            
            {conversation.unreadCount > 0 && (
              <span className="flex-shrink-0 min-w-[20px] h-5 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center justify-center px-1.5">
                {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
              </span>
            )}
          </div>
        )}

        {conversation.context?.type === 'application' && conversation.context.jobTitle && (
          <p className="text-xs text-muted-foreground mt-1 truncate">
            📋 {truncateText(conversation.context.jobTitle, 30)}
          </p>
        )}
      </div>
    </button>
  );
};

export default ConversationItem;
