import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface ReplyFormProps {
  discussionId: string;
  onSubmit?: (content: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

export function ReplyForm({ 
  discussionId, 
  onSubmit,
  placeholder = "Escreva a sua resposta...",
  maxLength = 2000,
  className 
}: ReplyFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Erro",
        description: "A resposta não pode estar vazia.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (onSubmit) {
      onSubmit(content);
    }
    
    toast({
      title: "Resposta publicada",
      description: "A sua resposta foi publicada com sucesso.",
    });
    
    setContent("");
    setIsSubmitting(false);
  };

  const remainingChars = maxLength - content.length;
  const isOverLimit = remainingChars < 0;
  const isNearLimit = remainingChars < 100 && remainingChars >= 0;

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                U
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={placeholder}
                className="min-h-[100px] resize-none"
                disabled={isSubmitting}
              />
              
              <div className="flex items-center justify-between mt-3">
                <span className={cn(
                  "text-xs",
                  isOverLimit && "text-destructive font-medium",
                  isNearLimit && !isOverLimit && "text-amber-600",
                  !isNearLimit && !isOverLimit && "text-muted-foreground"
                )}>
                  {remainingChars} caracteres restantes
                </span>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting || isOverLimit || !content.trim()}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Publicar Resposta
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
