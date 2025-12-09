import { Link } from 'react-router-dom';
import { Briefcase, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConversationContext } from '@/data/mockChat';

interface ApplicationContextCardProps {
  context: ConversationContext;
}

const ApplicationContextCard = ({ context }: ApplicationContextCardProps) => {
  if (context.type !== 'application' || !context.jobTitle) return null;

  return (
    <Card className="mx-3 mt-3 bg-muted/50 border-dashed">
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">
              Esta conversa é sobre:
            </p>
            <h4 className="font-medium text-sm truncate">
              {context.jobTitle}
            </h4>
            {context.companyName && (
              <p className="text-xs text-muted-foreground">
                {context.companyName}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-[10px]">
                Em Análise
              </Badge>
              <Link to={`/candidato/candidaturas`}>
                <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                  Ver Candidatura
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationContextCard;
