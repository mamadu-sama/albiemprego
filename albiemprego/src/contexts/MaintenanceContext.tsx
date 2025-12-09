import { createContext, useContext, useState, ReactNode, useEffect } from "react";

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
