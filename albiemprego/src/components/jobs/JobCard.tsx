import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MapPin, 
  Clock, 
  Building2, 
  Bookmark, 
  Euro, 
  Zap,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MatchScoreBadge } from "./MatchScoreBadge";
import { generateRandomMatchScore } from "@/utils/mockMatchScore";

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  contractType: string;
  workMode: string;
  salary?: string;
  showSalary?: boolean;
  postedAt: string;
  isNew?: boolean;
  isFeatured?: boolean;
  isUrgent?: boolean;
  isHomepageFeatured?: boolean;
  quickApply?: boolean;
  matchScore?: number;
}

interface JobCardProps {
  job: Job;
  variant?: "default" | "compact" | "featured";
  onSave?: (id: string) => void;
  isSaved?: boolean;
  showMatchScore?: boolean;
  isAuthenticated?: boolean;
  userType?: 'candidato' | 'empresa' | null;
}

const contractTypeBadgeVariant = (type: string) => {
  switch (type.toLowerCase()) {
    case "permanente":
    case "efetivo":
      return "default";
    case "temporário":
      return "secondary";
    case "estágio":
      return "outline";
    case "part-time":
      return "secondary";
    default:
      return "outline";
  }
};

const workModeBadgeVariant = (mode: string) => {
  switch (mode.toLowerCase()) {
    case "remoto":
      return "secondary";
    case "híbrido":
      return "outline";
    case "presencial":
      return "default";
    default:
      return "outline";
  }
};

export function JobCard({ 
  job, 
  variant = "default", 
  onSave, 
  isSaved = false,
  showMatchScore = true,
  isAuthenticated = true, // Mock: assume authenticated for demo
  userType = 'candidato' // Mock: assume candidate for demo
}: JobCardProps) {
  const isCompact = variant === "compact";
  const isFeatured = variant === "featured" || job.isFeatured;
  const isUrgent = job.isUrgent;

  // Mock match score - only show for authenticated candidates
  const matchScore = useMemo(() => {
    if (!showMatchScore || !isAuthenticated || userType !== 'candidato') return null;
    return job.matchScore ?? generateRandomMatchScore(job.id);
  }, [job.id, job.matchScore, showMatchScore, isAuthenticated, userType]);

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-lg border-border/50",
        isFeatured && "border-primary/30 bg-primary/[0.02] shadow-md",
        isUrgent && "border-destructive/30 bg-destructive/[0.02]",
        "hover:-translate-y-0.5"
      )}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute top-0 right-0">
          <div className="bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
            Destaque
          </div>
        </div>
      )}

      {/* Urgent Badge */}
      {isUrgent && !isFeatured && (
        <div className="absolute top-0 right-0">
          <div className="bg-destructive text-destructive-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
            Urgente
          </div>
        </div>
      )}

      <CardContent className={cn("p-4", isCompact ? "p-3" : "p-5")}>
        <div className="flex gap-4">
          {/* Company Logo */}
          <div className={cn(
            "flex-shrink-0 rounded-lg bg-muted flex items-center justify-center overflow-hidden",
            isCompact ? "w-12 h-12" : "w-14 h-14"
          )}>
            {job.companyLogo ? (
              <img 
                src={job.companyLogo} 
                alt={job.company} 
                className="w-full h-full object-cover"
              />
            ) : (
              <Building2 className="w-6 h-6 text-muted-foreground" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <Link 
                    to={`/vagas/${job.id}`}
                    className="block min-w-0"
                  >
                    <h3 className={cn(
                      "font-semibold text-foreground group-hover:text-primary transition-colors truncate",
                      isCompact ? "text-sm" : "text-base"
                    )}>
                      {job.title}
                    </h3>
                  </Link>
                  {/* Match Score Badge */}
                  {matchScore !== null && (
                    <MatchScoreBadge score={matchScore} variant="compact" className="flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {job.company}
                </p>
              </div>

              {/* Save Button */}
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 flex-shrink-0",
                  isSaved && "text-primary"
                )}
                onClick={() => onSave?.(job.id)}
              >
                <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
              </Button>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {job.location}
              </span>
              {job.salary && (
                <span className="flex items-center gap-1">
                  <Euro className="h-3.5 w-3.5" />
                  {job.salary}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {job.postedAt}
              </span>
            </div>

{/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {job.salary && (job.showSalary !== false) && (
                <Badge className="bg-success/10 text-success border-success/20">
                  <Eye className="h-3 w-3 mr-1" />
                  Salário Transparente
                </Badge>
              )}
              <Badge variant={contractTypeBadgeVariant(job.contractType) as any}>
                {job.contractType}
              </Badge>
              <Badge variant={workModeBadgeVariant(job.workMode) as any}>
                {job.workMode}
              </Badge>
              {job.isNew && (
                <Badge className="bg-success/10 text-success border-success/20">
                  Novo
                </Badge>
              )}
              {isUrgent && (
                <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                  <Zap className="h-3 w-3 mr-1" />
                  Urgente
                </Badge>
              )}
              {job.quickApply && (
                <Badge className="bg-accent/10 text-accent border-accent/20">
                  <Zap className="h-3 w-3 mr-1" />
                  Candidatura Rápida
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
