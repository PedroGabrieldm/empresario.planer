import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, GitBranch } from "lucide-react";

interface VersionInfoProps {
  version: number;
  lastUpdated: string;
}

export const VersionInfo = ({ version, lastUpdated }: VersionInfoProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
      <CardContent className="py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <GitBranch className="h-3 w-3" />
              <span>Versão {version}</span>
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">
              VERSÃO ATUAL
            </span>
          </div>
          
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Última edição: {formatDate(lastUpdated)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};