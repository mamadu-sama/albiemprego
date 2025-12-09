import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMaintenance } from "@/contexts/MaintenanceContext";

export function MaintenanceBanner() {
  const { maintenanceBanner, dismissBanner } = useMaintenance();

  if (!maintenanceBanner) return null;

  return (
    <div className="w-full bg-yellow-500 text-yellow-950 px-4 py-3 relative">
      <div className="container mx-auto flex items-center justify-center gap-3">
        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
        <div className="flex-1 text-center">
          <span className="font-semibold">{maintenanceBanner.title}: </span>
          <span>{maintenanceBanner.message}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-yellow-950 hover:bg-yellow-600 hover:text-yellow-950 flex-shrink-0"
          onClick={dismissBanner}
          aria-label="Fechar aviso"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
