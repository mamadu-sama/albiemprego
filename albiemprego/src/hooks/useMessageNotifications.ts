import { useEffect, useRef, useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  getStoredConversations, 
  getTotalUnreadCount,
  Conversation,
  currentUser
} from '@/data/mockChat';
import { notifyNewMessage, requestNotificationPermission } from '@/utils/messageNotifications';

interface UseMessageNotificationsOptions {
  pollingInterval?: number;
  enabled?: boolean;
}

export const useMessageNotifications = (options: UseMessageNotificationsOptions = {}) => {
  const { pollingInterval = 30000, enabled = true } = options;
  const location = useLocation();
  const previousUnreadRef = useRef<number>(0);
  const previousConversationsRef = useRef<Conversation[]>([]);
  const [isAppFocused, setIsAppFocused] = useState(true);

  // Track app focus state
  useEffect(() => {
    const handleFocus = () => setIsAppFocused(true);
    const handleBlur = () => setIsAppFocused(false);

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Check for new messages
  const checkForNewMessages = useCallback(() => {
    if (!enabled) return;

    const conversations = getStoredConversations();
    const currentUnread = getTotalUnreadCount();
    
    // Check if we're currently viewing a messages page
    const isOnMessagesPage = location.pathname.includes('/mensagens');
    
    // Only notify if unread count increased and we're not on messages page
    if (currentUnread > previousUnreadRef.current && !isOnMessagesPage) {
      // Find the conversation with new messages
      const previousConvs = previousConversationsRef.current;
      
      for (const conv of conversations) {
        const prevConv = previousConvs.find(c => c.id === conv.id);
        
        // Check if this conversation has new messages
        if (prevConv && conv.messages.length > prevConv.messages.length) {
          const newMessages = conv.messages.slice(prevConv.messages.length);
          
          // Get messages from other users (not current user)
          const otherUserMessages = newMessages.filter(
            msg => msg.senderId !== currentUser.id && !msg.isSystem
          );
          
          if (otherUserMessages.length > 0) {
            const latestMessage = otherUserMessages[otherUserMessages.length - 1];
            const sender = conv.participants.find(p => p.id === latestMessage.senderId);
            
            if (sender) {
              notifyNewMessage(
                sender.name,
                latestMessage.text,
                isAppFocused
              );
            }
          }
        }
      }
    }

    // Update refs for next comparison
    previousUnreadRef.current = currentUnread;
    previousConversationsRef.current = conversations;
  }, [enabled, location.pathname, isAppFocused]);

  // Poll for new messages
  useEffect(() => {
    if (!enabled) return;

    // Initialize refs
    previousConversationsRef.current = getStoredConversations();
    previousUnreadRef.current = getTotalUnreadCount();

    const interval = setInterval(checkForNewMessages, pollingInterval);

    return () => clearInterval(interval);
  }, [enabled, pollingInterval, checkForNewMessages]);

  return {
    checkForNewMessages,
    unreadCount: getTotalUnreadCount(),
  };
};
