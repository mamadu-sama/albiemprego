import { useState } from 'react';
import { Search, MessageSquare, Headphones, Building2, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { 
  mockParticipants, 
  ChatUser, 
  getInitials, 
  getParticipantTypeBadge,
  createNewConversation,
  currentUser
} from '@/data/mockChat';

interface NewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConversationCreated: (conversationId: string) => void;
}

const NewConversationDialog = ({ 
  open, 
  onOpenChange, 
  onConversationCreated 
}: NewConversationDialogProps) => {
  const [search, setSearch] = useState('');

  // Filter participants based on current user type and search
  const availableParticipants = mockParticipants.filter(p => {
    // Don't show current user or admin in regular search
    if (p.id === currentUser.id) return false;
    if (p.type === 'admin') return false;
    
    // Filter by search
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const handleSelectParticipant = (participant: ChatUser) => {
    const conversation = createNewConversation(participant);
    onConversationCreated(conversation.id);
    onOpenChange(false);
    setSearch('');
  };

  const handleContactSupport = () => {
    const admin = mockParticipants.find(p => p.type === 'admin');
    if (admin) {
      const conversation = createNewConversation(admin, { type: 'support' });
      onConversationCreated(conversation.id);
      onOpenChange(false);
      setSearch('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Nova Conversa
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              Com quem deseja conversar?
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar pessoas ou empresas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <ScrollArea className="max-h-[250px]">
            {availableParticipants.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhum resultado encontrado</p>
              </div>
            ) : (
              <div className="space-y-1">
                {availableParticipants.map(participant => {
                  const typeBadge = getParticipantTypeBadge(participant.type);
                  
                  return (
                    <button
                      key={participant.id}
                      onClick={() => handleSelectParticipant(participant)}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback className={cn(
                          participant.type === 'empresa' && "bg-primary/20 text-primary"
                        )}>
                          {getInitials(participant.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">
                            {participant.name}
                          </span>
                          <Badge variant={typeBadge.variant} className="text-[10px] px-1.5 py-0">
                            {typeBadge.label}
                          </Badge>
                        </div>
                        {(participant.role || participant.company) && (
                          <p className="text-xs text-muted-foreground truncate">
                            {participant.role || participant.company}
                          </p>
                        )}
                      </div>
                      {participant.type === 'empresa' ? (
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <User className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          <Separator />

          <Button 
            variant="outline" 
            className="w-full justify-start gap-2"
            onClick={handleContactSupport}
          >
            <Headphones className="w-4 h-4 text-primary" />
            <span>Falar com Suporte</span>
            <Badge variant="secondary" className="ml-auto text-[10px]">
              24/7
            </Badge>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewConversationDialog;
