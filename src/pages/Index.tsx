import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Rocket, Users, TrendingUp, ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b shadow-sm bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gradient">Novo Empreendedor</span>
          </div>
          <div className="space-x-4">
            <Button className="gradient-primary" onClick={() => navigate('/create-plan')}>
              Começar Grátis
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto">
            Transforme Suas{" "}
            <span className="text-gradient">Ideias</span>{" "}
            em Negócios de{" "}
            <span className="text-gradient">Sucesso</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Use o poder da IA para criar planos de negócio completos, validar suas ideias e acelerar o crescimento da sua startup.
          </p>
          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex justify-center">
            <Button 
              size="lg" 
              className="gradient-primary shadow-elegant text-lg px-8 py-6"
              onClick={() => navigate('/create-plan')}
            >
              <Rocket className="mr-2 h-5 w-5" />
              Criar Meu Primeiro Plano
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6"
              onClick={() => navigate('/dashboard')}
            >
              Ver Exemplo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Tudo que Você Precisa para{" "}
              <span className="text-gradient">Empreender</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Nossa plataforma combina inteligência artificial com metodologias comprovadas para acelerar seu sucesso.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-card hover:shadow-elegant transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Geração com IA</CardTitle>
                <CardDescription>
                  GPT-4 analisa suas ideias e cria planos de negócio completos em minutos.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-card hover:shadow-elegant transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Validação de Mercado</CardTitle>
                <CardDescription>
                  Análise automática de concorrência e identificação de oportunidades.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-card hover:shadow-elegant transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Projeções Financeiras</CardTitle>
                <CardDescription>
                  Modelos financeiros realistas com cenários otimista, realista e pessimista.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Pronto para Começar Sua{" "}
            <span className="text-gradient">Jornada Empreendedora?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de empreendedores que já transformaram suas ideias em negócios reais.
          </p>
          <Button 
            size="lg" 
            className="gradient-primary shadow-elegant text-lg px-8 py-6"
            onClick={() => navigate('/create-plan')}
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            Começar Agora - É Grátis
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Lightbulb className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-gradient">Novo Empreendedor</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 Novo Empreendedor. Transformando ideias em realidade.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
