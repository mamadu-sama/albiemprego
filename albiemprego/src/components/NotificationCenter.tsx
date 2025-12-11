import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  Megaphone,
  Gift,
  Settings,
  Loader2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { notificationApi, type UserNotification } from "@/lib/api";
import { useMaintenance } from "@/contexts/MaintenanceContext";

export type NotificationType = 
  | "INFO" 
  | "SUCCESS" 
  | "WARNING" 
  | "ANNOUNCEMENT" 
  | "PROMOTION" 
  | "SYSTEM"
  | "MAINTENANCE";

export interface Notification extends Omit<UserNotification, 'createdAt' | 'userId'> {
  timestamp: Date;
}

const notificationIcons: Record<NotificationType, typeof Info> = {
  INFO: Info,
  SUCCESS: CheckCircle,
  WARNING: AlertTriangle,
  ANNOUNCEMENT: Megaphone,
  PROMOTION: Gift,
  SYSTEM: Settings,
  MAINTENANCE: AlertTriangle,
};

const notificationColors: Record<NotificationType, string> = {
  INFO: "bg-blue-100 text-blue-600",
  SUCCESS: "bg-green-100 text-green-600",
  WARNING: "bg-yellow-100 text-yellow-600",
  ANNOUNCEMENT: "bg-purple-100 text-purple-600",
  PROMOTION: "bg-pink-100 text-pink-600",
  SYSTEM: "bg-gray-100 text-gray-600",
  MAINTENANCE: "bg-orange-100 text-orange-600",
};

const notificationLabels: Record<NotificationType, string> = {
  INFO: "Informação",
  SUCCESS: "Sucesso",
  WARNING: "Aviso",
  ANNOUNCEMENT: "Anúncio",
  PROMOTION: "Promoção",
  SYSTEM: "Sistema",
  MAINTENANCE: "Manutenção",
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return `Há ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
  } else if (diffHours < 24) {
    return `Há ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
  } else {
    return `Há ${diffDays} dia${diffDays !== 1 ? 's' : ''}`;
  }
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { setMaintenanceBanner } = useMaintenance();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await notificationApi.getNotifications();
      const mapped = data.map((n) => ({
        ...n,
        timestamp: new Date(n.createdAt),
      }));
      setNotifications(mapped);

      // Se houver notificação de manutenção não lida, exibir banner
      const maintenanceNotif = mapped.find(
        (n) => n.type === "MAINTENANCE" && !n.read
      );
      if (maintenanceNotif) {
        setMaintenanceBanner({
          id: maintenanceNotif.id,
          title: maintenanceNotif.title,
          message: maintenanceNotif.message,
          sentAt: maintenanceNotif.timestamp,
        });
      }
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast({
        title: "Notificações atualizadas",
        description: "Todas as notificações foram marcadas como lidas.",
      });
    } catch (error) {
      console.error("Erro ao marcar todas como lidas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível marcar as notificações como lidas.",
        variant: "destructive",
      });
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await notificationApi.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast({
        title: "Notificação eliminada",
        description: "A notificação foi removida.",
      });
    } catch (error) {
      console.error("Erro ao eliminar notificação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível eliminar a notificação.",
        variant: "destructive",
      });
    }
  };

  const deleteAllRead = async () => {
    try {
      const result = await notificationApi.deleteAllRead();
      setNotifications(prev => prev.filter(n => !n.read));
      toast({
        title: "Notificações eliminadas",
        description: `${result.count} notificações lidas foram removidas.`,
      });
    } catch (error) {
      console.error("Erro ao eliminar lidas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível eliminar as notificações.",
        variant: "destructive",
      });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-foreground">Notificações</h3>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-8 px-2 text-xs"
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Marcar todas
              </Button>
            )}
          </div>
        </div>
        
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-12 w-12 mb-4 opacity-50 animate-spin" />
              <p className="text-sm">A carregar...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Bell className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-sm">Sem notificações</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type];
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-muted/50 transition-colors ${
                      !notification.read ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`mt-0.5 p-2 rounded-full ${notificationColors[notification.type]}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm text-foreground">
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <span className="h-2 w-2 rounded-full bg-primary" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {notificationLabels[notification.type]}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatTimeAgo(notification.timestamp)}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {notifications.some(n => n.read) && (
          <div className="p-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={deleteAllRead}
              className="w-full text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar notificações lidas
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}