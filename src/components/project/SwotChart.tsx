import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SwotData {
  forcas?: string[];
  fraquezas?: string[];
  oportunidades?: string[];
  ameacas?: string[];
}

interface SwotChartProps {
  data: SwotData;
}

export const SwotChart = ({ data }: SwotChartProps) => {
  const sections = [
    {
      title: "Forças",
      items: data?.forcas || [],
      color: "bg-green-100 text-green-800 border-green-200",
      textColor: "text-green-700"
    },
    {
      title: "Fraquezas", 
      items: data?.fraquezas || [],
      color: "bg-red-100 text-red-800 border-red-200",
      textColor: "text-red-700"
    },
    {
      title: "Oportunidades",
      items: data?.oportunidades || [],
      color: "bg-blue-100 text-blue-800 border-blue-200", 
      textColor: "text-blue-700"
    },
    {
      title: "Ameaças",
      items: data?.ameacas || [],
      color: "bg-orange-100 text-orange-800 border-orange-200",
      textColor: "text-orange-700"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sections.map((section) => (
        <Card key={section.title} className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className={`text-lg ${section.textColor}`}>
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {section.items.length > 0 ? (
                section.items.map((item, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className={`${section.color} block text-left p-2 h-auto whitespace-normal`}
                  >
                    {item}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  Nenhum item identificado
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};