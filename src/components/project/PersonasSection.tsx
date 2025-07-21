import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, AlertCircle, MessageCircle } from "lucide-react";

interface Persona {
  nome?: string;
  idade?: string;
  perfil?: string;
  necessidades?: string;
  comportamento?: string;
  pain_points?: string;
  canais?: string;
}

interface PersonasSectionProps {
  personas: Persona[] | null;
}

export const PersonasSection = ({ personas }: PersonasSectionProps) => {
  if (!personas || personas.length === 0) {
    return (
      <div className="text-center py-8">
        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Nenhuma persona definida</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {personas.map((persona, index) => (
        <Card key={index} className="h-full hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <span>{persona.nome || `Persona ${index + 1}`}</span>
            </CardTitle>
            {persona.idade && (
              <Badge variant="secondary" className="w-fit">
                {persona.idade}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {persona.perfil && (
              <div>
                <h4 className="font-semibold text-sm mb-2 text-blue-600">👤 Perfil</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {persona.perfil}
                </p>
              </div>
            )}
            
            {persona.necessidades && (
              <div>
                <h4 className="font-semibold text-sm mb-2 text-green-600">🎯 Necessidades</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {persona.necessidades}
                </p>
              </div>
            )}

            {persona.pain_points && (
              <div>
                <h4 className="font-semibold text-sm mb-2 text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Pontos de Dor
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {persona.pain_points}
                </p>
              </div>
            )}
            
            {persona.comportamento && (
              <div>
                <h4 className="font-semibold text-sm mb-2 text-purple-600">🛒 Comportamento</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {persona.comportamento}
                </p>
              </div>
            )}

            {persona.canais && (
              <div>
                <h4 className="font-semibold text-sm mb-2 text-orange-600 flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Canais Preferidos
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {persona.canais}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};