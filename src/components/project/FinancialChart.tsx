import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, DollarSign } from "lucide-react";

interface ScenarioData {
  receita_ano1?: string;
  receita_ano2?: string;
  receita_ano3?: string;
  custos_ano1?: string;
  custos_ano2?: string;
  custos_ano3?: string;
  lucro_liquido_ano1?: string;
  lucro_liquido_ano2?: string;
  lucro_liquido_ano3?: string;
  break_even?: string;
}

interface FinancialData {
  conservador?: ScenarioData;
  realista?: ScenarioData;
  agressivo?: ScenarioData;
}

interface FinancialChartProps {
  data: FinancialData;
}

export const FinancialChart = ({ data }: FinancialChartProps) => {
  if (!data) {
    return (
      <div className="text-center py-8">
        <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Dados financeiros não disponíveis</p>
      </div>
    );
  }

  const parseValue = (value?: string) => {
    if (!value) return 0;
    // Remove currency symbols and convert to number
    const numValue = value.replace(/[^\d.,]/g, '').replace(',', '.');
    return parseFloat(numValue) || 0;
  };

  const chartData = [
    {
      ano: 'Ano 1',
      Conservador_Receita: parseValue(data.conservador?.receita_ano1),
      Conservador_Custos: parseValue(data.conservador?.custos_ano1),
      Conservador_Lucro: parseValue(data.conservador?.lucro_liquido_ano1),
      Realista_Receita: parseValue(data.realista?.receita_ano1),
      Realista_Custos: parseValue(data.realista?.custos_ano1),
      Realista_Lucro: parseValue(data.realista?.lucro_liquido_ano1),
      Agressivo_Receita: parseValue(data.agressivo?.receita_ano1),
      Agressivo_Custos: parseValue(data.agressivo?.custos_ano1),
      Agressivo_Lucro: parseValue(data.agressivo?.lucro_liquido_ano1),
    },
    {
      ano: 'Ano 2',
      Conservador_Receita: parseValue(data.conservador?.receita_ano2),
      Conservador_Custos: parseValue(data.conservador?.custos_ano2),
      Conservador_Lucro: parseValue(data.conservador?.lucro_liquido_ano2),
      Realista_Receita: parseValue(data.realista?.receita_ano2),
      Realista_Custos: parseValue(data.realista?.custos_ano2),
      Realista_Lucro: parseValue(data.realista?.lucro_liquido_ano2),
      Agressivo_Receita: parseValue(data.agressivo?.receita_ano2),
      Agressivo_Custos: parseValue(data.agressivo?.custos_ano2),
      Agressivo_Lucro: parseValue(data.agressivo?.lucro_liquido_ano2),
    },
    {
      ano: 'Ano 3',
      Conservador_Receita: parseValue(data.conservador?.receita_ano3),
      Conservador_Custos: parseValue(data.conservador?.custos_ano3),
      Conservador_Lucro: parseValue(data.conservador?.lucro_liquido_ano3),
      Realista_Receita: parseValue(data.realista?.receita_ano3),
      Realista_Custos: parseValue(data.realista?.custos_ano3),
      Realista_Lucro: parseValue(data.realista?.lucro_liquido_ano3),
      Agressivo_Receita: parseValue(data.agressivo?.receita_ano3),
      Agressivo_Custos: parseValue(data.agressivo?.custos_ano3),
      Agressivo_Lucro: parseValue(data.agressivo?.lucro_liquido_ano3),
    },
  ];

  const getScenarioColor = (scenario: string) => {
    switch (scenario) {
      case 'conservador': return 'bg-blue-100 border-blue-300';
      case 'realista': return 'bg-green-100 border-green-300';
      case 'agressivo': return 'bg-purple-100 border-purple-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className="space-y-8">
      {/* Gráfico Principal */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ano" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, '']}
              labelFormatter={(label) => `${label}`}
            />
            <Legend />
            <Bar dataKey="Conservador_Receita" fill="#3b82f6" name="Conservador - Receita" />
            <Bar dataKey="Conservador_Lucro" fill="#1d4ed8" name="Conservador - Lucro" />
            <Bar dataKey="Realista_Receita" fill="#22c55e" name="Realista - Receita" />
            <Bar dataKey="Realista_Lucro" fill="#16a34a" name="Realista - Lucro" />
            <Bar dataKey="Agressivo_Receita" fill="#8b5cf6" name="Agressivo - Receita" />
            <Bar dataKey="Agressivo_Lucro" fill="#7c3aed" name="Agressivo - Lucro" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Cards Detalhados por Cenário */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {(['conservador', 'realista', 'agressivo'] as const).map((scenario) => {
          const scenarioData = data[scenario];
          if (!scenarioData) return null;
          
          return (
            <Card key={scenario} className={`${getScenarioColor(scenario)} border-2 hover:shadow-lg transition-shadow`}>
              <CardHeader className="pb-3">
                <CardTitle className="capitalize flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Cenário {scenario}
                </CardTitle>
                {scenarioData.break_even && (
                  <Badge variant="outline" className="w-fit">
                    <Calendar className="h-3 w-3 mr-1" />
                    Break-even: {scenarioData.break_even}
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-green-700 flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Receitas
                  </h4>
                  <div className="text-xs space-y-1 ml-5">
                    <p>Ano 1: <span className="font-medium">{scenarioData.receita_ano1 || 'N/A'}</span></p>
                    <p>Ano 2: <span className="font-medium">{scenarioData.receita_ano2 || 'N/A'}</span></p>
                    <p>Ano 3: <span className="font-medium">{scenarioData.receita_ano3 || 'N/A'}</span></p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-red-700">💰 Custos</h4>
                  <div className="text-xs space-y-1 ml-5">
                    <p>Ano 1: <span className="font-medium">{scenarioData.custos_ano1 || 'N/A'}</span></p>
                    <p>Ano 2: <span className="font-medium">{scenarioData.custos_ano2 || 'N/A'}</span></p>
                    <p>Ano 3: <span className="font-medium">{scenarioData.custos_ano3 || 'N/A'}</span></p>
                  </div>
                </div>

                {(scenarioData.lucro_liquido_ano1 || scenarioData.lucro_liquido_ano2 || scenarioData.lucro_liquido_ano3) && (
                  <div className="space-y-2 border-t pt-3">
                    <h4 className="font-semibold text-sm text-blue-700">📊 Lucro Líquido</h4>
                    <div className="text-xs space-y-1 ml-5">
                      {scenarioData.lucro_liquido_ano1 && <p>Ano 1: <span className="font-medium text-blue-600">{scenarioData.lucro_liquido_ano1}</span></p>}
                      {scenarioData.lucro_liquido_ano2 && <p>Ano 2: <span className="font-medium text-blue-600">{scenarioData.lucro_liquido_ano2}</span></p>}
                      {scenarioData.lucro_liquido_ano3 && <p>Ano 3: <span className="font-medium text-blue-600">{scenarioData.lucro_liquido_ano3}</span></p>}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};