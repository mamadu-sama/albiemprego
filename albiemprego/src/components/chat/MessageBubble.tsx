import { Check, CheckCheck, Paperclip, FileText, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Message, Attachment, formatRelativeTime } from '@/data/mockChat';

interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
  showTimestamp?: boolean;
  highlightText?: string;
}

const MessageBubble = ({ message, isMine, showTimestamp = true, highlightText }: MessageBubbleProps) => {
  const renderStatus = () => {
    if (!isMine) return null;
    
    switch (message.status) {
      case 'sending':
        return <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />;
      case 'sent':
        return <Check className="w-3 h-3" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-400" />;
      default:
        return null;
    }
  };

  const renderAttachment = (attachment: Attachment) => {
    const isImage = attachment.type === 'image';
    
    return (
      <div 
        key={attachment.id}
        className={cn(
          "mt-2 rounded-lg overflow-hidden",
          isImage ? "max-w-[200px]" : "bg-background/50 p-2"
        )}
      >
        {isImage ? (
          <img 
            src={attachment.url} 
            alt={attachment.name}
            className="w-full h-auto rounded"
          />
        ) : (
          <div className="flex items-center gap-2">
            {attachment.type === 'pdf' ? (
              <FileText className="w-5 h-5" />
            ) : (
              <Paperclip className="w-5 h-5" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{attachment.name}</p>
              <p className="text-xs opacity-70">
                {(attachment.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const highlightMatch = (text: string) => {
    if (!highlightText) return text;
    
    const regex = new RegExp(`(${highlightText})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-300 text-foreground px-0.5 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  if (message.isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-muted/50 text-muted-foreground text-xs px-3 py-1.5 rounded-full italic">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex w-full mb-2",
      isMine ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[75%] px-4 py-2 rounded-2xl animate-in slide-in-from-bottom-2 duration-300",
        isMine 
          ? "bg-primary text-primary-foreground rounded-br-md" 
          : "bg-muted text-foreground rounded-bl-md"
      )}>
        <p className="text-sm whitespace-pre-wrap break-words">
          {highlightMatch(message.text)}
        </p>
        
        {message.attachments?.map(renderAttachment)}
        
        <div className={cn(
          "flex items-center gap-1 mt-1",
          isMine ? "justify-end" : "justify-start"
        )}>
          {showTimestamp && (
            <span className={cn(
              "text-[10px]",
              isMine ? "text-primary-foreground/70" : "text-muted-foreground"
            )}>
              {formatRelativeTime(message.timestamp)}
            </span>
          )}
          {renderStatus()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
