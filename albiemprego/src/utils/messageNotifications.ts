import { toast } from "@/hooks/use-toast";

// Audio notification sound (base64 encoded short beep)
const NOTIFICATION_SOUND_DATA = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleicAHIu86markup5fCQELf7markup2aZUcBRl1yobPg4xgAkFKVrnZTFAEWTH2nxsKLJQARAl9ngbCTYhcAGjF5nLXBsncWGU1klK2npXIMExk+cI2TgnEYDCcSS2uIi4R7XC0kNlx5goyEezYABg==";

let audioContext: AudioContext | null = null;
let notificationBuffer: AudioBuffer | null = null;

// Initialize audio context
const initAudio = async () => {
  if (audioContext) return;
  
  try {
    audioContext = new AudioContext();
    
    // Create a simple notification beep
    const sampleRate = audioContext.sampleRate;
    const duration = 0.15;
    const frequency = 800;
    
    notificationBuffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const channelData = notificationBuffer.getChannelData(0);
    
    for (let i = 0; i < channelData.length; i++) {
      const t = i / sampleRate;
      // Sine wave with envelope
      const envelope = Math.sin(Math.PI * t / duration);
      channelData[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.3;
    }
  } catch (error) {
    console.error('Failed to initialize audio:', error);
  }
};

// Play notification sound
export const playNotificationSound = async () => {
  try {
    if (!audioContext) {
      await initAudio();
    }
    
    if (audioContext && notificationBuffer) {
      // Resume context if suspended (browser autoplay policy)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      const source = audioContext.createBufferSource();
      source.buffer = notificationBuffer;
      source.connect(audioContext.destination);
      source.start();
    }
  } catch (error) {
    console.error('Failed to play notification sound:', error);
  }
};

// Show toast notification for new message
export const showMessageNotification = (
  senderName: string,
  messagePreview: string,
  onClick?: () => void
) => {
  // Truncate message preview
  const truncatedMessage = messagePreview.length > 50 
    ? messagePreview.substring(0, 50) + '...' 
    : messagePreview;

  toast({
    title: `Nova mensagem de ${senderName}`,
    description: truncatedMessage,
    duration: 5000,
  });

  // Play sound
  playNotificationSound();
};

// Check if browser supports notifications
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};

// Show browser notification (for when app is in background)
export const showBrowserNotification = (
  senderName: string,
  messagePreview: string
) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(`Nova mensagem de ${senderName}`, {
      body: messagePreview,
      icon: '/favicon.ico',
      tag: 'new-message',
    });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
    
    // Auto close after 5 seconds
    setTimeout(() => notification.close(), 5000);
  }
};

// Combined notification (toast + sound + browser notification if in background)
export const notifyNewMessage = (
  senderName: string,
  messagePreview: string,
  isAppFocused: boolean = true
) => {
  // Always show toast and play sound
  showMessageNotification(senderName, messagePreview);
  
  // Show browser notification if app is not focused
  if (!isAppFocused && Notification.permission === 'granted') {
    showBrowserNotification(senderName, messagePreview);
  }
};
