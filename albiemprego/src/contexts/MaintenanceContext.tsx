import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { maintenanceApi } from "@/lib/admin-api";

interface MaintenanceBanner {
  id: string;
  title: string;
  message: string;
  sentAt: Date;
}

interface MaintenanceContextType {
  isMaintenanceMode: boolean;
  setMaintenanceMode: (value: boolean) => void;
  maintenanceBanner: MaintenanceBanner | null;
  setMaintenanceBanner: (banner: MaintenanceBanner | null) => void;
  dismissBanner: () => void;
  maintenanceMessage: string;
  setMaintenanceMessage: (message: string) => void;
  estimatedEndTime: string;
  setEstimatedEndTime: (time: string) => void;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export function MaintenanceProvider({ children }: { children: ReactNode }) {
  const [isMaintenanceMode, setMaintenanceMode] = useState(() => {
    const saved = localStorage.getItem("maintenanceMode");
    return saved === "true";
  });
  
  const [maintenanceMessage, setMaintenanceMessage] = useState(() => {
    return localStorage.getItem("maintenanceMessage") || "Estamos a realizar melhorias na plataforma. Voltaremos em breve!";
  });
  
  const [estimatedEndTime, setEstimatedEndTime] = useState(() => {
    return localStorage.getItem("maintenanceEstimatedTime") || "";
  });

  const [maintenanceBanner, setMaintenanceBanner] = useState<MaintenanceBanner | null>(() => {
    const saved = localStorage.getItem("maintenanceBanner");
    const dismissed = localStorage.getItem("maintenanceBannerDismissed");
    if (saved && !dismissed) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        sentAt: new Date(parsed.sentAt)
      };
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem("maintenanceMode", String(isMaintenanceMode));
  }, [isMaintenanceMode]);

  useEffect(() => {
    localStorage.setItem("maintenanceMessage", maintenanceMessage);
  }, [maintenanceMessage]);

  useEffect(() => {
    localStorage.setItem("maintenanceEstimatedTime", estimatedEndTime);
  }, [estimatedEndTime]);

  useEffect(() => {
    if (maintenanceBanner) {
      localStorage.setItem("maintenanceBanner", JSON.stringify(maintenanceBanner));
      localStorage.removeItem("maintenanceBannerDismissed");
    } else {
      localStorage.removeItem("maintenanceBanner");
    }
  }, [maintenanceBanner]);

  const dismissBanner = () => {
    localStorage.setItem("maintenanceBannerDismissed", "true");
    setMaintenanceBanner(null);
  };

  // Sincronizar com backend a cada 30 segundos
  useEffect(() => {
    const checkMaintenanceStatus = async () => {
      try {
        // Buscar notificações de manutenção públicas
        const maintenanceNotifs = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1"}/notifications/maintenance`
        ).then((r) => r.json());

        console.log("🔄 Notificações de manutenção:", maintenanceNotifs); // Debug

        // Se houver notificação de manutenção recente, exibir banner
        if (maintenanceNotifs.length > 0) {
          const notif = maintenanceNotifs[0];
          setMaintenanceBanner({
            id: notif.id,
            title: notif.title,
            message: notif.message,
            sentAt: new Date(notif.createdAt),
          });
        }

        // Também verifica o status geral de manutenção
        const data = await maintenanceApi.getStatus();
        
        console.log("🔄 Status de manutenção:", data); // Debug
        
        if (data.enabled !== isMaintenanceMode) {
          console.log(`🔧 Modo de manutenção mudou: ${isMaintenanceMode} → ${data.enabled}`); // Debug
          setMaintenanceMode(data.enabled);
          localStorage.setItem("maintenanceMode", String(data.enabled));
        }

        if (data.message && data.message !== maintenanceMessage) {
          setMaintenanceMessage(data.message);
          localStorage.setItem("maintenanceMessage", data.message);
        }

        if (data.estimatedEndTime && data.estimatedEndTime !== estimatedEndTime) {
          setEstimatedEndTime(data.estimatedEndTime);
          localStorage.setItem("maintenanceEstimatedTime", data.estimatedEndTime);
        }
      } catch (error) {
        console.error("Erro ao verificar manutenção:", error);
      }
    };

    // Verificar imediatamente
    checkMaintenanceStatus();

    // Verificar a cada 10 segundos (mais frequente para teste)
    const interval = setInterval(checkMaintenanceStatus, 10000);

    return () => clearInterval(interval);
  }, [isMaintenanceMode, maintenanceMessage, estimatedEndTime]);

  return (
    <MaintenanceContext.Provider
      value={{
        isMaintenanceMode,
        setMaintenanceMode,
        maintenanceBanner,
        setMaintenanceBanner,
        dismissBanner,
        maintenanceMessage,
        setMaintenanceMessage,
        estimatedEndTime,
        setEstimatedEndTime,
      }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenance() {
  const context = useContext(MaintenanceContext);
  if (context === undefined) {
    throw new Error("useMaintenance must be used within a MaintenanceProvider");
  }
  return context;
}
