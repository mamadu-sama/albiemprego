import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, User, Mail, Phone, Briefcase, GraduationCap, Globe, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ProfilePreviewProps {
  user: any;
}

export function ProfilePreview({ user }: ProfilePreviewProps) {
  const candidate = user?.candidate;
  const profileCompleteness = candidate?.profileCompleteness || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Dados que serão enviados
        </CardTitle>
        <CardDescription>
          Estas informações do seu perfil serão partilhadas com a empresa
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Aviso se perfil incompleto */}
        {profileCompleteness < 70 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              O seu perfil está {profileCompleteness}% completo. Complete pelo menos 70% para se candidatar.
              <Button asChild variant="link" className="px-1">
                <Link to="/candidato/perfil/editar">Completar perfil</Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Informações pessoais */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Informações Pessoais</h4>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{user.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{user.phone}</span>
              </div>
            )}
            {user.location && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>{user.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* CV */}
        {candidate?.cvUrl ? (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Currículo</h4>
            <a 
              href={candidate.cvUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <FileText className="h-4 w-4" />
              Ver CV atual
            </a>
          </div>
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              CV não carregado. 
              <Button asChild variant="link" className="px-1">
                <Link to="/candidato/perfil/editar">Carregar CV</Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Experiências */}
        {candidate?.experiences && candidate.experiences.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Experiências Recentes
            </h4>
            <div className="space-y-2">
              {candidate.experiences.slice(0, 2).map((exp: any, idx: number) => (
                <div key={idx} className="text-sm border-l-2 border-primary/20 pl-3">
                  <p className="font-medium">{exp.position}</p>
                  <p className="text-muted-foreground text-xs">{exp.company}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Educações */}
        {candidate?.educations && candidate.educations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Formação Académica
            </h4>
            <div className="space-y-2">
              {candidate.educations.slice(0, 2).map((edu: any, idx: number) => (
                <div key={idx} className="text-sm border-l-2 border-primary/20 pl-3">
                  <p className="font-medium">{edu.degree}</p>
                  <p className="text-muted-foreground text-xs">{edu.institution}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {candidate?.skills && candidate.skills.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Competências</h4>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.slice(0, 10).map((skill: string, idx: number) => (
                <Badge key={idx} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Completude do perfil */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Completude do perfil</span>
            <span className={`font-semibold ${profileCompleteness >= 70 ? 'text-success' : 'text-destructive'}`}>
              {profileCompleteness}%
            </span>
          </div>
          <div className="w-full bg-secondary h-2 rounded-full mt-2">
            <div 
              className={`h-2 rounded-full transition-all ${profileCompleteness >= 70 ? 'bg-success' : 'bg-destructive'}`}
              style={{ width: `${profileCompleteness}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

