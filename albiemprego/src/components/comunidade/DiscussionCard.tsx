import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Eye, Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Discussion, formatRelativeTime, getInitials } from "@/data/mockCommunity";
import { CategoryBadge } from "./CategoryBadge";

interface DiscussionCardProps {
  discussion: Discussion;
  variant?: 'default' | 'compact';
  className?: string;
}

export function DiscussionCard({ discussion, variant = 'default', className }: DiscussionCardProps) {
  const isCompact = variant === 'compact';

  return (
    <Card className={cn(
      "group transition-all duration-200 hover:shadow-md hover:border-primary/20",
      discussion.isPinned && "border-primary/30 bg-primary/5",
      className
    )}>
      <CardContent className={cn("p-4", isCompact && "p-3")}>
        <div className="flex gap-3">
          {/* Avatar */}
          <Link to={`/comunidade/membros/${discussion.author.id}`} className="flex-shrink-0">
            <Avatar className={cn("ring-2 ring-background", isCompact ? "h-8 w-8" : "h-10 w-10")}>
              <AvatarImage src={discussion.author.avatar} alt={discussion.author.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                {getInitials(discussion.author.name)}
              </AvatarFallback>
            </Avatar>
          </Link>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 flex-wrap">
                {discussion.isPinned && (
                  <Pin className="h-3.5 w-3.5 text-primary fill-primary" />
                )}
                <Link 
                  to={`/comunidade/discussoes/${discussion.id}`}
                  className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                >
                  {discussion.title}
                </Link>
              </div>
              <CategoryBadge category={discussion.category} size="sm" />
            </div>

            {/* Excerpt */}
            {!isCompact && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {discussion.excerpt}
              </p>
            )}

            {/* Meta */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <Link 
                to={`/comunidade/membros/${discussion.author.id}`}
                className="hover:text-foreground transition-colors"
              >
                {discussion.author.name}
              </Link>
              <span>•</span>
              <span>{formatRelativeTime(discussion.createdAt)}</span>
              <div className="flex items-center gap-3 ml-auto">
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {discussion.replies}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {discussion.views}
                </span>
              </div>
            </div>

            {/* Last reply indicator */}
            {!isCompact && discussion.lastReplyBy && discussion.lastReplyAt && (
              <div className="mt-2 pt-2 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-[10px] bg-muted">
                    {getInitials(discussion.lastReplyBy.name)}
                  </AvatarFallback>
                </Avatar>
                <span>
                  Última resposta de <span className="text-foreground">{discussion.lastReplyBy.name}</span>
                  {' '}{formatRelativeTime(discussion.lastReplyAt)}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
