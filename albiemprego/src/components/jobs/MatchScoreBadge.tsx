import { Target } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MatchScoreBadgeProps {
  score: number;
  variant?: "default" | "compact";
  showTooltip?: boolean;
  className?: string;
}

const getScoreColor = (score: number) => {
  if (score >= 71) return {
    bg: "bg-success/10",
    text: "text-success",
    border: "border-success/20",
    progress: "bg-success"
  };
  if (score >= 41) return {
    bg: "bg-warning/10",
    text: "text-warning",
    border: "border-warning/20",
    progress: "bg-warning"
  };
  return {
    bg: "bg-destructive/10",
    text: "text-destructive",
    border: "border-destructive/20",
    progress: "bg-destructive"
  };
};

export function MatchScoreBadge({ 
  score, 
  variant = "default", 
  showTooltip = true,
  className 
}: MatchScoreBadgeProps) {
  const colors = getScoreColor(score);
  const isCompact = variant === "compact";

  const BadgeContent = (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border transition-all duration-300",
        colors.bg,
        colors.text,
        colors.border,
        isCompact ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        className
      )}
    >
      <Target className={cn("flex-shrink-0", isCompact ? "h-3 w-3" : "h-4 w-4")} />
      <span className="font-semibold">{score}%</span>
      {!isCompact && (
        <div className="ml-1.5 h-1.5 w-12 rounded-full bg-current/20 overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all duration-500", colors.progress)}
            style={{ width: `${score}%` }}
          />
        </div>
      )}
    </div>
  );

  if (!showTooltip) return BadgeContent;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {BadgeContent}
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[200px]">
          <p className="text-sm">
            <strong>Match Score:</strong> {score}% de compatibilidade com o seu perfil, 
            baseado em competências, experiência e localização.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
