import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Search, 
  Plus, 
  Shield
} from 'lucide-react';
import ConversationItem from '@/components/chat/ConversationItem';
import MessageBubble from '@/components/chat/MessageBubble';
import MessageInput from '@/components/chat/MessageInput';
import ChatHeader from '@/components/chat/ChatHeader';
import ApplicationContextCard from '@/components/chat/ApplicationContextCard';
import NewConversationDialog from '@/components/chat/NewConversationDialog';
import { 
  Conversation, 
  getStoredConversations, 
  addMessageToConversation, 
  markConversationAsRead,
  searchConversations,
  currentUser
} from '@/data/mockChat';

export default function AdminMensagens() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);
  const [isMobileViewingChat, setIsMobileViewingChat] = useState(false);

  useEffect(() => {
    const stored = getStoredConversations();
    setConversations(stored);
  }, []);

  useEffect(() => {
    if (conversationId && conversations.length > 0) {
      const conv = conversations.find(c => c.id === conversationId);
      if (conv) {
        setActiveConversation(conv);
        markConversationAsRead(conversationId);
        setIsMobileViewingChat(true);
      }
    } else {
      setActiveConversation(null);
      setIsMobileViewingChat(false);
    }
  }, [conversationId, conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const handleSendMessage = (text: string, files?: File[]) => {
    if (!activeConversation) return;
    
    const attachments = files?.map(file => ({
      id: `att-${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' as const : 'pdf' as const,
      size: file.size
    }));

    addMessageToConversation(activeConversation.id, {
      conversationId: activeConversation.id,
      text,
      senderId: currentUser.id,
      timestamp: new Date(),
      status: 'sent',
      attachments
    });

    const updated = getStoredConversations();
    setConversations(updated);
    setActiveConversation(updated.find(c => c.id === activeConversation.id) || null);
  };

  const handleSelectConversation = (conv: Conversation) => {
    navigate(`/admin/mensagens/${conv.id}`);
  };

  const handleBackToList = () => {
    navigate('/admin/mensagens');
    setIsMobileViewingChat(false);
  };

  const handleNewConversation = (convId: string) => {
    const updated = getStoredConversations();
    setConversations(updated);
    navigate(`/admin/mensagens/${convId}`);
  };

  const filteredConversations = searchQuery 
    ? searchConversations(searchQuery, conversations)
    : conversations.filter(conv => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'unread') return conv.unreadCount > 0;
        if (activeFilter === 'support') return conv.context?.type === 'support';
        if (activeFilter === 'candidatos') {
          const other = conv.participants.find(p => p.id !== currentUser.id);
          return other?.type === 'candidato';
        }
        if (activeFilter === 'empresas') {
          const other = conv.participants.find(p => p.id !== currentUser.id);
          return other?.type === 'empresa';
        }
        return true;
      });

  const getOtherParticipant = (conv: Conversation) => {
    return conv.participants.find(p => p.id !== currentUser.id);
  };

  const groupMessagesByDate = (messages: typeof activeConversation.messages) => {
    const groups: { date: string; messages: typeof messages }[] = [];
    let currentDate = '';
    
    messages.forEach(msg => {
      const msgDate = new Date(msg.timestamp).toLocaleDateString('pt-PT');
      if (msgDate !== currentDate) {
        currentDate = msgDate;
        groups.push({ date: msgDate, messages: [msg] });
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    });
    
    return groups;
  };

  const formatDateHeader = (dateStr: string) => {
    const today = new Date().toLocaleDateString('pt-PT');
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('pt-PT');
    
    if (dateStr === today) return 'Hoje';
    if (dateStr === yesterday) return 'Ontem';
    return dateStr;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Mensagens</h1>
                <p className="text-sm text-muted-foreground">Gerir todas as comunicações da plataforma</p>
              </div>
            </div>
            <Button onClick={() => setIsNewConversationOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Mensagem
            </Button>
          </div>

          {/* Chat Layout */}
          <Card className="h-[calc(100vh-280px)] min-h-[500px]">
            <div className="flex h-full">
              {/* Sidebar - Conversations List */}
              <div className={`w-full md:w-80 lg:w-96 border-r border-border flex flex-col ${
                isMobileViewingChat ? 'hidden md:flex' : 'flex'
              }`}>
                {/* Search & Filters */}
                <div className="p-4 border-b border-border space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Pesquisar conversas..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Tabs value={activeFilter} onValueChange={setActiveFilter}>
                    <TabsList className="w-full grid grid-cols-5">
                      <TabsTrigger value="all" className="text-xs">Todas</TabsTrigger>
                      <TabsTrigger value="unread" className="text-xs">Não lidas</TabsTrigger>
                      <TabsTrigger value="support" className="text-xs">Suporte</TabsTrigger>
                      <TabsTrigger value="candidatos" className="text-xs">Cand.</TabsTrigger>
                      <TabsTrigger value="empresas" className="text-xs">Emp.</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Conversations List */}
                <ScrollArea className="flex-1">
                  {filteredConversations.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="font-medium mb-1">Nenhuma conversa</p>
                      <p className="text-sm">Inicie uma nova conversa para começar</p>
                    </div>
                  ) : (
                    <div className="p-2">
                      {filteredConversations.map(conv => (
                        <ConversationItem
                          key={conv.id}
                          conversation={conv}
                          isActive={activeConversation?.id === conv.id}
                          onClick={() => handleSelectConversation(conv)}
                        />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>

              {/* Chat Area */}
              <div className={`flex-1 flex flex-col ${
                !isMobileViewingChat ? 'hidden md:flex' : 'flex'
              }`}>
                {activeConversation ? (
                  <>
                    {/* Chat Header */}
                    <ChatHeader
                      participant={getOtherParticipant(activeConversation)!}
                      onBack={handleBackToList}
                      onSearchClick={() => {}}
                      onInfoClick={() => {}}
                      showBackButton
                    />

                    {/* Context Card */}
                    {activeConversation.context && (
                      <ApplicationContextCard context={activeConversation.context} />
                    )}

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4">
                      {groupMessagesByDate(activeConversation.messages).map((group, groupIndex) => (
                        <div key={groupIndex}>
                          {/* Date Separator */}
                          <div className="flex items-center justify-center my-4">
                            <span className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                              {formatDateHeader(group.date)}
                            </span>
                          </div>
                          
                          {/* Messages */}
                          {group.messages.map((message) => (
                            <MessageBubble
                              key={message.id}
                              message={message}
                              isMine={message.senderId === currentUser.id}
                            />
                          ))}
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </ScrollArea>

                    {/* Message Input */}
                    <div className="border-t border-border">
                      <MessageInput onSend={handleSendMessage} />
                    </div>
                  </>
                ) : (
                  /* Empty State */
                  <div className="flex-1 flex items-center justify-center text-center p-8">
                    <div>
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">
                        Selecione uma conversa
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Escolha uma conversa da lista ou inicie uma nova
                      </p>
                      <Button variant="outline" onClick={() => setIsNewConversationOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Conversa
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </main>
      <Footer />

      <NewConversationDialog
        open={isNewConversationOpen}
        onOpenChange={setIsNewConversationOpen}
        onConversationCreated={handleNewConversation}
      />
    </div>
  );
}
