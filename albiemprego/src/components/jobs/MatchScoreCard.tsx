import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { Zap, Briefcase, MapPin, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MatchBreakdown {
  skills: number;
  experience: number;
  location: number;
}

interface MatchScoreCardProps {
  score: number;
  breakdown: MatchBreakdown;
}

interface MatchBreakdownItemProps {
  label: string;
  score: number;
  icon: ReactNode;
}

const getScoreColor = (score: number) => {
  if (score >= 71) return "text-success";
  if (score >= 41) return "text-warning";
  return "text-destructive";
};

const getScoreLabel = (score: number) => {
  if (score >= 80) return { emoji: "🎯", text: "Excelente Match!" };
  if (score >= 60) return { emoji: "✓", text: "Bom Match" };
  return { emoji: "⚠️", text: "Match Moderado" };
};

const MatchBreakdownItem = ({ label, score, icon }: MatchBreakdownItemProps) => (
  <div className="flex items-center gap-3">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
      {icon}
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm text-muted-foreground">{score}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-500", getScoreColor(score).replace("text-", "bg-"))}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  </div>
);

export function MatchScoreCard({ score, breakdown }: MatchScoreCardProps) {
  const scoreLabel = getScoreLabel(score);
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference * (1 - score / 100);

  return (
    <Card className="mb-6 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Circular Progress */}
          <div className="flex-shrink-0">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className={cn(getScoreColor(score), "transition-all duration-1000")}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={cn("text-2xl font-bold", getScoreColor(score))}>{score}%</span>
              </div>
            </div>
          </div>
          
          {/* Details */}
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {scoreLabel.emoji} {scoreLabel.text}
            </h3>
            <p className="text-muted-foreground mb-4">
              O seu perfil tem {score}% de compatibilidade com esta vaga
              baseado em competências, experiência e localização.
            </p>
            
            {/* Match breakdown */}
            <div className="space-y-3">
              <MatchBreakdownItem 
                label="Competências" 
                score={breakdown.skills} 
                icon={<Zap className="h-4 w-4" />}
              />
              <MatchBreakdownItem 
                label="Experiência" 
                score={breakdown.experience} 
                icon={<Briefcase className="h-4 w-4" />}
              />
              <MatchBreakdownItem 
                label="Localização" 
                score={breakdown.location} 
                icon={<MapPin className="h-4 w-4" />}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface IncompleteProfileAlertProps {
  profileCompleteness: number;
}

export function IncompleteProfileAlert({ profileCompleteness }: IncompleteProfileAlertProps) {
  return (
    <Alert className="mb-6 border-warning/30 bg-warning/5">
      <AlertTriangle className="h-4 w-4 text-warning" />
      <AlertTitle className="text-warning">
        Match Score Limitado
      </AlertTitle>
      <AlertDescription className="text-muted-foreground">
        O seu perfil está {profileCompleteness}% completo. 
        Complete o seu perfil para obter match scores mais precisos.
        <Button variant="link" className="pl-1 h-auto text-primary underline" asChild>
          <Link to="/candidato/perfil/editar">
            Completar agora
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
