import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { MessageSquare, Plus, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import ConversationItem from '@/components/chat/ConversationItem';
import ChatHeader from '@/components/chat/ChatHeader';
import MessageBubble from '@/components/chat/MessageBubble';
import MessageInput from '@/components/chat/MessageInput';
import TypingIndicator from '@/components/chat/TypingIndicator';
import ApplicationContextCard from '@/components/chat/ApplicationContextCard';
import NewConversationDialog from '@/components/chat/NewConversationDialog';
import {
  Conversation,
  Message,
  getStoredConversations,
  addMessageToConversation,
  markConversationAsRead,
  currentUser,
  searchConversations,
} from '@/data/mockChat';

const EmpresaMensagens = () => {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);

  useEffect(() => {
    const loadData = () => {
      const convs = getStoredConversations();
      setConversations(convs);
      
      if (conversationId) {
        const conv = convs.find(c => c.id === conversationId);
        if (conv) {
          setActiveConversation(conv);
          markConversationAsRead(conv.id);
          setShowMobileChat(true);
        }
      }
    };
    
    loadData();
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  useEffect(() => {
    if (activeConversation) {
      const interval = setInterval(() => {
        if (Math.random() > 0.8) {
          setIsTyping(true);
          setTimeout(() => setIsTyping(false), 3000);
        }
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [activeConversation]);

  const handleSelectConversation = (conv: Conversation) => {
    setActiveConversation(conv);
    markConversationAsRead(conv.id);
    setShowMobileChat(true);
    navigate(`/empresa/mensagens/${conv.id}`, { replace: true });
    setConversations(getStoredConversations());
  };

  const handleSendMessage = (text: string, files?: File[]) => {
    if (!activeConversation || !text.trim()) return;

    const newMessage = addMessageToConversation(activeConversation.id, {
      conversationId: activeConversation.id,
      senderId: currentUser.id,
      text,
      timestamp: new Date(),
      status: 'sending',
    });

    setActiveConversation(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMessage],
      lastMessageAt: new Date()
    } : null);

    setTimeout(() => {
      setActiveConversation(prev => prev ? {
        ...prev,
        messages: prev.messages.map(m => 
          m.id === newMessage.id ? { ...m, status: 'sent' } : m
        )
      } : null);
    }, 500);

    setTimeout(() => {
      setActiveConversation(prev => prev ? {
        ...prev,
        messages: prev.messages.map(m => 
          m.id === newMessage.id ? { ...m, status: 'delivered' } : m
        )
      } : null);
    }, 1500);

    setTimeout(() => {
      setActiveConversation(prev => prev ? {
        ...prev,
        messages: prev.messages.map(m => 
          m.id === newMessage.id ? { ...m, status: 'read' } : m
        )
      } : null);
    }, 3000);

    setConversations(getStoredConversations());
  };

  const handleNewConversation = (convId: string) => {
    const convs = getStoredConversations();
    setConversations(convs);
    const newConv = convs.find(c => c.id === convId);
    if (newConv) {
      handleSelectConversation(newConv);
    }
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
    setActiveConversation(null);
    navigate('/empresa/mensagens', { replace: true });
  };

  const filteredConversations = searchQuery 
    ? searchConversations(searchQuery, conversations)
    : conversations.filter(conv => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'unread') return conv.unreadCount > 0;
        if (activeFilter === 'candidatos') {
          return conv.participants.some(p => p.type === 'candidato');
        }
        if (activeFilter === 'suporte') {
          return conv.context?.type === 'support' || conv.participants.some(p => p.type === 'admin');
        }
        return true;
      });

  const otherParticipant = activeConversation?.participants.find(p => p.id !== currentUser.id);

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = '';

    messages.forEach(msg => {
      const msgDate = msg.timestamp.toLocaleDateString('pt-PT');
      const today = new Date().toLocaleDateString('pt-PT');
      const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('pt-PT');

      let dateLabel = msgDate;
      if (msgDate === today) dateLabel = 'Hoje';
      else if (msgDate === yesterday) dateLabel = 'Ontem';

      if (dateLabel !== currentDate) {
        currentDate = dateLabel;
        groups.push({ date: dateLabel, messages: [msg] });
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    });

    return groups;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Simple Header for Messages */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 flex h-14 items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/empresa/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="font-semibold">Mensagens</h1>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-4">
        <div className="h-[calc(100vh-120px)] min-h-[500px] border rounded-xl overflow-hidden flex bg-card shadow-sm">
          {/* Sidebar */}
          <div className={cn(
            "w-full md:w-[350px] border-r flex flex-col",
            showMobileChat && "hidden md:flex"
          )}>
            <div className="p-4 border-b space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Conversas</h2>
                <Button size="sm" onClick={() => setShowNewDialog(true)}>
                  <Plus className="w-4 h-4 mr-1" />
                  Nova
                </Button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar conversas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Tabs value={activeFilter} onValueChange={setActiveFilter}>
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="all" className="text-xs">Todas</TabsTrigger>
                  <TabsTrigger value="unread" className="text-xs">Não lidas</TabsTrigger>
                  <TabsTrigger value="candidatos" className="text-xs">Candidatos</TabsTrigger>
                  <TabsTrigger value="suporte" className="text-xs">Suporte</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-4">
                      {searchQuery ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}
                    </p>
                    <Button variant="outline" onClick={() => setShowNewDialog(true)}>
                      Iniciar Conversa
                    </Button>
                  </div>
                ) : (
                  filteredConversations.map(conv => (
                    <ConversationItem
                      key={conv.id}
                      conversation={conv}
                      isActive={activeConversation?.id === conv.id}
                      onClick={() => handleSelectConversation(conv)}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className={cn(
            "flex-1 flex flex-col",
            !showMobileChat && "hidden md:flex"
          )}>
            {activeConversation && otherParticipant ? (
              <>
                <ChatHeader
                  participant={otherParticipant}
                  onBack={handleBackToList}
                  showBackButton={true}
                />

                {activeConversation.context && (
                  <ApplicationContextCard context={activeConversation.context} />
                )}

                <ScrollArea className="flex-1 p-4">
                  {groupMessagesByDate(activeConversation.messages).map(group => (
                    <div key={group.date}>
                      <div className="flex justify-center my-4">
                        <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                          {group.date}
                        </span>
                      </div>
                      {group.messages.map((msg, i) => (
                        <MessageBubble
                          key={msg.id}
                          message={msg}
                          isMine={msg.senderId === currentUser.id}
                          showTimestamp={
                            i === group.messages.length - 1 ||
                            group.messages[i + 1]?.senderId !== msg.senderId
                          }
                        />
                      ))}
                    </div>
                  ))}
                  
                  {isTyping && otherParticipant && (
                    <TypingIndicator user={otherParticipant} />
                  )}
                  
                  <div ref={messagesEndRef} />
                </ScrollArea>

                <MessageInput onSend={handleSendMessage} />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-8">
                  <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">
                    Selecione uma conversa
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Escolha uma conversa da lista ou inicie uma nova
                  </p>
                  <Button onClick={() => setShowNewDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Conversa
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <NewConversationDialog
        open={showNewDialog}
        onOpenChange={setShowNewDialog}
        onConversationCreated={handleNewConversation}
      />
    </div>
  );
};

export default EmpresaMensagens;
