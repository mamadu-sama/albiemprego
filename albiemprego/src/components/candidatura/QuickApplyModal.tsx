import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Zap, User, Mail, FileText, CheckCircle2 } from "lucide-react";

interface QuickApplyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle: string;
  companyName: string;
  user: any;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function QuickApplyModal({
  open,
  onOpenChange,
  jobTitle,
  companyName,
  user,
  onConfirm,
  isLoading = false,
}: QuickApplyModalProps) {
  const candidate = user?.candidate;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Candidatura Rápida
          </DialogTitle>
          <DialogDescription>
            <span className="font-medium">{jobTitle}</span> • {companyName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start gap-2 mb-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Candidatura em 1 clique!</p>
                <p className="text-xs text-muted-foreground">
                  Os dados do seu perfil serão enviados automaticamente
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Dados que serão enviados:</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{user.name}</span>
              </div>
              
              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              
              {candidate?.cvUrl && (
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>CV do perfil</span>
                  <Badge variant="secondary" className="ml-auto">
                    Anexado
                  </Badge>
                </div>
              )}

              {candidate?.skills && candidate.skills.length > 0 && (
                <div className="p-2 bg-muted rounded">
                  <p className="text-xs text-muted-foreground mb-1">Competências:</p>
                  <div className="flex flex-wrap gap-1">
                    {candidate.skills.slice(0, 5).map((skill: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {candidate.skills.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{candidate.skills.length - 5}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Ao confirmar, a empresa receberá acesso ao seu perfil completo e CV.
          </p>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                A enviar...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Confirmar Candidatura
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

