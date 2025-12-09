import { Wrench, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMaintenance } from "@/contexts/MaintenanceContext";

export default function Manutencao() {
  const { maintenanceMessage, estimatedEndTime } = useMaintenance();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="text-center px-4 max-w-lg">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping bg-primary/20 rounded-full" />
            <div className="relative bg-primary/10 p-6 rounded-full">
              <Wrench className="h-16 w-16 text-primary animate-pulse" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Em Manutenção
        </h1>

        {/* Message */}
        <p className="text-lg text-muted-foreground mb-6">
          {maintenanceMessage}
        </p>

        {/* Estimated Time */}
        {estimatedEndTime && (
          <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-full mb-8">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Previsão de retorno: <span className="font-semibold text-foreground">{estimatedEndTime}</span>
            </span>
          </div>
        )}

        {/* Decorative Elements */}
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>

        {/* Info */}
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            Estamos a trabalhar para melhorar a sua experiência.
          </p>
          <p>
            Agradecemos a sua compreensão e paciência.
          </p>
        </div>

        {/* Logo */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-primary">AlbiEmprego</h2>
          <p className="text-sm text-muted-foreground">A sua plataforma de emprego regional</p>
        </div>
      </div>
    </div>
  );
}
