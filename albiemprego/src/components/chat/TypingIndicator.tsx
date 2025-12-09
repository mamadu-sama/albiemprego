import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ChatUser, getInitials } from '@/data/mockChat';

interface TypingIndicatorProps {
  user: ChatUser;
}

const TypingIndicator = ({ user }: TypingIndicatorProps) => {
  return (
    <div className="flex items-center gap-2 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Avatar className="h-6 w-6">
        <AvatarImage src={user.avatar} />
        <AvatarFallback className={cn(
          "text-xs",
          user.type === 'empresa' && "bg-primary/20 text-primary",
          user.type === 'admin' && "bg-secondary text-secondary-foreground"
        )}>
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>
      
      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
      
      <span className="text-xs text-muted-foreground">
        {user.name.split(' ')[0]} está a digitar...
      </span>
    </div>
  );
};

export default TypingIndicator;
