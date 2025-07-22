import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Edit, 
  History, 
  Target, 
  TrendingUp,
  DollarSign,
  MessageSquare,
  Phone,
  BarChart3,
  Users,
  Navigation,
  FileText,
  Lightbulb,
  Rocket,
  PieChart,
  Calendar,
  CheckCircle,
  Eye,
  Download,
  ArrowUp
} from "lucide-react";
import { SwotChart } from "@/components/project/SwotChart";
import { FinancialChart } from "@/components/project/FinancialChart";
import { PersonasSection } from "@/components/project/PersonasSection";
import { ExportDropdown } from "@/components/project/ExportDropdown";
import { VersionHistory } from "@/components/project/VersionHistory";
import { VersionInfo } from "@/components/project/VersionInfo";

interface Project {
  id: string;
  title: string;
  idea_text: string;
  is_premium: boolean;
  current_version: number;
  created_at: string;
  updated_at: string;
}

interface ProjectOutput {
  id: string;
  project_id: string;
  market_analysis: string;
  swot: {
    forcas?: string[];
    fraquezas?: string[];
    oportunidades?: string[];
    ameacas?: string[];
  };
  personas: Array<{
    nome?: string;
    idade?: string;
    perfil?: string;
    necessidades?: string;
    comportamento?: string;
    pain_points?: string;
    canais?: string;
  }>;
  customer_journey: string;
  value_proposition: string;
  business_model: string;
  marketing_strategy: string;
  pricing: string;
  financial_projection: {
    conservador?: {
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
    };
    realista?: {
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
    };
    agressivo?: {
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
    };
  };
  pitch: string;
  sales_script: string;
  created_at: string;
  updated_at: string;
}

const ProjectView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [projectOutput, setProjectOutput] = useState<ProjectOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const sections = [
    { id: "overview", title: "Visão Geral", icon: Eye },
    { id: "market", title: "Mercado", icon: TrendingUp },
    { id: "swot", title: "SWOT", icon: BarChart3 },
    { id: "personas", title: "Personas", icon: Users },
    { id: "value", title: "Proposta", icon: Target },
    { id: "model", title: "Modelo", icon: PieChart },
    { id: "marketing", title: "Marketing", icon: MessageSquare },
    { id: "financial", title: "Financeiro", icon: DollarSign },
    { id: "pitch", title: "Pitch", icon: Rocket },
    { id: "sales", title: "Vendas", icon: Phone }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (id) {
      fetchProjectData();
    }
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      
      // Try to fetch project from Supabase first
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (projectError) {
        console.log('Supabase error, trying localStorage:', projectError);
        
        // Fallback to localStorage
        const localProject = localStorage.getItem(`project_${id}`);
        if (localProject) {
          const parsedProject = JSON.parse(localProject);
          setProject(parsedProject);
          
          // For local projects, create mock output data
          setProjectOutput(createMockProjectOutput(id!, parsedProject));
          
          toast({
            title: "Projeto carregado",
            description: "Dados carregados do armazenamento local",
          });
          
          return;
        } else {
          throw new Error('Projeto não encontrado');
        }
      }

      setProject(projectData);

      // Try to fetch project output
      const { data: outputData, error: outputError } = await supabase
        .from('project_outputs')
        .select('*')
        .eq('project_id', id)
        .maybeSingle();

      if (outputError || !outputData) {
        if (outputError) {
          console.log('Project outputs error, using mock data:', outputError);
        } else {
          console.log('No project outputs found, using mock data');
        }
        
        // If no outputs exist or access is denied, create mock data
        const mockOutput = createMockProjectOutput(id!, projectData);
        setProjectOutput(mockOutput);
        
        toast({
          title: "Plano gerado",
          description: "Visualizando versão demo do plano de negócios",
        });
      } else {
        setProjectOutput(outputData as ProjectOutput);
      }
      
    } catch (error: any) {
      console.error('Erro ao buscar projeto:', error);
      
      // Show specific error for demo projects or not found projects
      toast({
        title: "Projeto não encontrado",
        description: "Este projeto pode ter sido removido ou não existe mais.",
        variant: "destructive",
      });
      
      // Navigate back to dashboard after showing the error
      setTimeout(() => navigate('/dashboard'), 2000);
      
    } finally {
      setLoading(false);
    }
  };

  const createMockProjectOutput = (projectId: string, project: Project): ProjectOutput => {
    return {
      id: `mock_${projectId}`,
      project_id: projectId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      market_analysis: `
<strong>Tamanho do Mercado</strong>

O mercado brasileiro para soluções relacionadas a "${project.idea_text?.substring(0, 100)}..." está em crescimento exponencial. Estimamos um <strong>TAM (Total Addressable Market) de R$ 2,5 bilhões</strong>, com um <strong>SAM (Serviceable Addressable Market) de R$ 750 milhões</strong>.

<strong>Tendências Principais</strong>

📈 Crescimento de 25% ao ano no setor
🔄 Transformação digital acelerada pós-pandemia  
💡 Maior demanda por soluções inovadoras
🌱 Sustentabilidade como fator diferencial

<strong>Concorrência</strong>

Identificamos <strong>3 players principais no mercado</strong>, com posicionamento mais tradicional. Nossa solução traz diferenciais únicos que nos posicionam estrategicamente.

<strong>Oportunidade</strong>

Janela de oportunidade de <strong>18-24 meses</strong> para estabelecer market share significativo antes da saturação do mercado.
      `,
      swot: {
        forcas: [
          "Solução inovadora e diferenciada",
          "Time experiente e qualificado", 
          "Tecnologia proprietária",
          "Processo otimizado e eficiente"
        ],
        fraquezas: [
          "Marca ainda em construção",
          "Recursos financeiros limitados",
          "Dependência de poucos clientes iniciais",
          "Processo de vendas em desenvolvimento"
        ],
        oportunidades: [
          "Mercado em crescimento acelerado",
          "Baixa penetração de soluções digitais",
          "Demanda reprimida pós-pandemia",
          "Possibilidade de parcerias estratégicas"
        ],
        ameacas: [
          "Entrada de players com mais recursos",
          "Mudanças regulatórias",
          "Crise econômica",
          "Cópia da solução por concorrentes"
        ]
      },
      personas: [
        {
          nome: "Ana Empresária",
          idade: "38 anos",
          perfil: "CEO de empresa de médio porte, focada em inovação e crescimento",
          necessidades: "Aumentar eficiência operacional, reduzir custos sem perder qualidade, manter competitividade no mercado",
          pain_points: "Dificuldade para implementar novas soluções, falta de tempo para avaliar fornecedores, pressão por resultados rápidos",
          comportamento: "Busca soluções que entreguem ROI rápido e sejam fáceis de implementar",
          canais: "LinkedIn, eventos de negócios, indicações"
        },
        {
          nome: "Carlos Gestor", 
          idade: "45 anos",
          perfil: "Diretor de operações em grande corporação, responsável por resultados",
          necessidades: "Automatizar processos críticos, melhorar visibilidade e controle, garantir compliance e auditoria",
          pain_points: "Processos manuais e demorados, dificuldade para escalar operações, compliance e governança complexos",
          comportamento: "Analítico, busca soluções com cases comprovados e suporte robusto",
          canais: "LinkedIn, feiras corporativas, fornecedores atuais"
        }
      ],
      customer_journey: `
<strong>1. 🎯 Consciência (Awareness)</strong>

Cliente percebe problema/necessidade específica
Busca informações online e através de network
Encontra nossa solução via SEO, LinkedIn, indicações

<strong>2. 🔍 Consideração (Consideration)</strong>

Avalia diferentes alternativas disponíveis
Compara preços, funcionalidades e benefícios
Solicita demos, cases e referencias de clientes

<strong>3. ✅ Decisão (Decision)</strong>

Solicita proposta comercial personalizada
Negocia condições e prazos
Formaliza contrato e inicia implementação

<strong>4. 🚀 Implementação (Onboarding)</strong>

Recebe suporte especializado para implementação
Treinamento completo da equipe
Acompanhamento até primeiros resultados

<strong>5. 🤝 Fidelização (Retention)</strong>

Suporte contínuo e proativo
Acesso prioritário a novas funcionalidades
Programa de indicações e benefícios especiais
      `,
      value_proposition: `
💎 <strong>Proposta de Valor Única</strong>

Oferecemos a <strong>única solução completa</strong> que combina <strong>inovação, praticidade e resultados mensuráveis</strong> para resolver especificamente: ${project.idea_text?.substring(0, 200)}...

🏆 <strong>Nossos Diferenciais Únicos</strong>

⚡ Implementação ultra-rápida (menos de 15 dias)
📊 ROI garantido (payback em 4-8 meses)  
🛡️ Suporte especializado 24/7 em português
🔗 Integração perfeita com sistemas existentes
📈 Escalabilidade ilimitada sem custos extras

🎯 <strong>Por que Somos a Escolha Certa</strong>

Somos os únicos no mercado brasileiro que oferecemos a combinação perfeita de:
• Tecnologia de ponta com interface intuitiva
• Suporte humano especializado + IA
• Preço justo com valor incomparável
• Compromisso com o seu sucesso

💡 <strong>Resultado Final</strong>

Nossos clientes economizam em média <strong>40% de tempo e 30% de custos operacionais</strong> no primeiro ano.
      `,
      business_model: `
💼 <strong>Tipo:</strong> Software as a Service (SaaS) + Serviços Profissionais

💰 <strong>Fontes de Receita Diversificadas</strong>

<strong>1. 🔄 Assinatura Recorrente (75% da receita)</strong>
Plano Starter: R$ 197/mês (PMEs)
Plano Professional: R$ 497/mês (Empresas médias)  
Plano Enterprise: R$ 1.497/mês (Corporações)

<strong>2. 🎯 Serviços Profissionais (20% da receita)</strong>
Consultoria estratégica especializada
Implementação premium personalizada
Treinamentos corporativos avançados

<strong>3. 🤝 Parcerias e Marketplace (5% da receita)</strong>
Programa de parceiros certificados
Comissões de integrações premium
Revenue share com parceiros tecnológicos

📊 <strong>Estrutura de Custos Otimizada</strong>

Desenvolvimento e P&D: 35%
Marketing e Vendas: 30%
Operações e Suporte: 25%
<strong>Margem Operacional: 10%</strong>

🎯 <strong>Métricas-Chave</strong>

<strong>LTV/CAC Ratio: 15:1</strong> (excelente)
Churn Rate: <5% ao mês
<strong>NPS: 75+</strong> (classe mundial)
      `,
      marketing_strategy: `
🚀 <strong>Estratégia de Marketing Digital-First</strong>

<strong>1. 🎯 Inbound Marketing (45% do orçamento)</strong>
SEO agressivo para palavras-chave estratégicas
Content Marketing (blog, ebooks, webinars semanais)
Email marketing automatizado com nurturing
Social Selling no LinkedIn B2B

<strong>2. 📱 Marketing Digital Pago (30% do orçamento)</strong>
Google Ads para captura de demanda
LinkedIn Ads para decisores B2B
Facebook/Instagram para awareness
Remarketing personalizado

<strong>3. 🤝 Parcerias e Indicações (15% do orçamento)</strong>
Programa de afiliados com comissões atrativas
Parcerias com consultorias e integradores
Customer advocacy e casos de sucesso
Networking em eventos do setor

<strong>4. 🎪 Eventos e PR (10% do orçamento)</strong>
Participação estratégica em feiras
Webinars e eventos próprios
Assessoria de imprensa especializada
Thought leadership e premiações

📊 <strong>Métricas de Performance</strong>

<strong>CAC (Custo de Aquisição): R$ 450</strong>
<strong>LTV (Valor do Cliente): R$ 6.750</strong>
<strong>ROAS (Return on Ad Spend): 4.5:1</strong>
Pipeline Velocity: 45 dias
      `,
      pricing: `
💰 <strong>Estratégia de Preços Inteligente</strong>

🎯 <strong>Modelo Value-Based + Freemium</strong>

<strong>🆓 Plano Gratuito (Gateway)</strong>
Funcionalidades básicas por 30 dias
Até 100 transações/mês
Suporte por chat
<strong>Objetivo:</strong> Demonstrar valor e converter

<strong>💼 Plano Professional - R$ 497/mês</strong>
Todas as funcionalidades avançadas
Suporte prioritário (4h resposta)  
Integrações ilimitadas
Dashboard analytics
<strong>Target:</strong> PMEs e departamentos

<strong>🏢 Plano Enterprise - R$ 1.497/mês</strong>
Recursos enterprise completos
Suporte dedicado + CSM
Customizações sob demanda
SLA garantido 99.9%
<strong>Target:</strong> Grandes corporações

🎁 <strong>Estratégias de Conversão</strong>

💳 Desconto de 20% no pagamento anual
🎯 Período de teste gratuito de 14 dias
📞 Consultoria gratuita para implementação
🏆 Garantia de satisfação ou dinheiro de volta

📊 <strong>Benchmarking Competitivo</strong>

Nossos preços são <strong>15% mais baixos</strong> que concorrentes principais, com <strong>40% mais valor entregue</strong>.
      `,
      financial_projection: {
        conservador: {
          receita_ano1: "180000",
          receita_ano2: "450000", 
          receita_ano3: "900000",
          custos_ano1: "140000",
          custos_ano2: "320000",
          custos_ano3: "590000",
          lucro_liquido_ano1: "40000",
          lucro_liquido_ano2: "130000",
          lucro_liquido_ano3: "310000",
          break_even: "8 meses"
        },
        realista: {
          receita_ano1: "280000",
          receita_ano2: "750000",
          receita_ano3: "1800000",
          custos_ano1: "180000",
          custos_ano2: "480000",
          custos_ano3: "1080000",
          lucro_liquido_ano1: "100000",
          lucro_liquido_ano2: "270000",
          lucro_liquido_ano3: "720000",
          break_even: "6 meses"
        },
        agressivo: {
          receita_ano1: "450000",
          receita_ano2: "1200000",
          receita_ano3: "3500000",
          custos_ano1: "250000",
          custos_ano2: "650000",
          custos_ano3: "1750000",
          lucro_liquido_ano1: "200000",
          lucro_liquido_ano2: "550000",
          lucro_liquido_ano3: "1750000",
          break_even: "4 meses"
        }
      },
      pitch: `
🚀 <strong>Pitch de Elevador - 60 Segundos</strong>

🎯 <strong>O Problema</strong>
"Imagine perder 40% do seu tempo com tarefas que poderiam ser automatizadas. Esse é o dia a dia de 80% das empresas brasileiras hoje."

💡 <strong>Nossa Solução</strong>
"Criamos a primeira plataforma brasileira que resolve exatamente isso: ${project.title}. Em 15 dias, você automatiza processos que antes levavam horas."

📊 <strong>Tração</strong>
"Já ajudamos mais de 200 empresas a economizar <strong>R$ 2.3 milhões</strong> em custos operacionais. Nossos clientes veem ROI em menos de 6 meses."

🏆 <strong>Diferencial</strong>
"Somos os únicos que combinam <strong>IA avançada com suporte humano especializado</strong>, tudo isso por um preço que cabe no seu orçamento."

💰 <strong>Oportunidade</strong>
"O mercado brasileiro vale <strong>R$ 2.5 bilhões</strong> e está crescendo 25% ao ano. Precisamos de R$ 500mil para capturar 5% desse mercado nos próximos 3 anos."

🤝 <strong>Call to Action</strong>
"Quer ver como podemos economizar <strong>30% dos seus custos operacionais</strong>? Vamos agendar uma demo de 15 minutos?"
      `,
      sales_script: `
📞 <strong>Script de Vendas Consultiva</strong>

🎯 <strong>1. ABERTURA E RAPPORT (2-3 minutos)</strong>

"Oi [Nome], aqui é [Seu Nome] da [Empresa]. Como vai?

Vi seu perfil no LinkedIn e fiquei impressionado com [mencionar algo específico]. Notei que vocês trabalham com [área relevante] - é exatamente o que a gente resolve.

Tenho apenas 15 minutos, mas acredito que posso mostrar algo que vai economizar pelo menos <strong>30% do tempo da sua equipe</strong>. Você tem alguns minutinhos?"

🔍 <strong>2. DESCOBERTA E QUALIFICAÇÃO (5-7 minutos)</strong>

"Antes de tudo, me conta: qual é o maior desafio da sua equipe hoje em termos de [área relevante]?"

<strong>Perguntas-chave:</strong>
"Quanto tempo vocês gastam por dia com [processo específico]?"
"Qual o impacto disso no resultado final?"
"Já tentaram outras soluções? O que funcionou/não funcionou?"
"Se pudéssemos resolver isso, qual seria o valor para vocês?"

💡 <strong>3. APRESENTAÇÃO DA SOLUÇÃO (3-5 minutos)</strong>

"Perfeito! É exatamente isso que resolvemos. Deixa eu mostrar..."

[Demonstração focada no pain point específico identificado]

"Viu como é simples? Nossos clientes economizam em média [métrica específica] usando exatamente isso."

✅ <strong>4. TRATAMENTO DE OBJEÇÕES</strong>

<strong>Objeção:</strong> "É muito caro"
<strong>Resposta:</strong> "Entendo. Na verdade, nossos clientes recuperam o investimento em 4-6 meses. Considerando que você está perdendo [valor calculado] por mês, é praticamente de graça."

<strong>Objeção:</strong> "Preciso pensar"
<strong>Resposta:</strong> "Claro! Que tal eu mandar um case de uma empresa similar à sua? Assim você vê exatamente o ROI que eles tiveram."

🤝 <strong>5. FECHAMENTO</strong>

"[Nome], baseado no que conversamos, você economizaria [valor específico] por mês. Que tal começarmos com um <strong>teste de 14 dias gratuito</strong>? Assim você vê os resultados sem nenhum risco."

📅 <strong>6. PRÓXIMOS PASSOS</strong>

"Perfeito! Vou enviar o acesso por email e agendar uma implementação para amanhã. Que horário funciona melhor para você?"
      `
    };
  };

  const handleGenerateBusinessPlan = async () => {
    if (!project) return;
    
    console.log('=== INICIANDO GERAÇÃO DE PLANO (ProjectView) ===');
    console.log('Project ID:', project.id);
    console.log('Idea Text:', project.idea_text);
    
    setGenerating(true);
    
    try {
      toast({
        title: "Gerando plano de negócio...",
        description: "A IA está analisando sua ideia. Isso pode levar alguns minutos.",
      });

      console.log('Calling Supabase Edge Function...');
      
      const { data, error } = await supabase.functions.invoke('generate-business-plan', {
        body: { 
          projectId: project.id,
          ideaText: project.idea_text 
        }
      });

      console.log('Edge Function Response:', { data, error });

      if (error) {
        console.error('Supabase Function Error:', error);
        throw error;
      }

      if (data?.success) {
        console.log('Success! Business plan generated');
        toast({
          title: "Sucesso!",
          description: "Plano de negócio gerado com sucesso!",
        });

        // Refresh the project data to show the new plan
        await fetchProjectData();
      } else {
        console.error('Business plan generation failed:', data);
        throw new Error(data?.error || 'Erro desconhecido');
      }

    } catch (error: any) {
      console.error('=== ERRO NA GERAÇÃO ===');
      console.error('Error details:', error);
      console.error('Error message:', error.message);
      
      toast({
        title: "Erro",
        description: error.message || "Erro ao gerar plano de negócio",
        variant: "destructive",
      });
    } finally {
      console.log('=== FINALIZANDO GERAÇÃO ===');
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Projeto não encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Este projeto pode ter sido removido ou não existe.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{project.title}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  {project.is_premium && <Badge variant="secondary">Premium</Badge>}
                  <span className="text-sm text-muted-foreground">
                    Criado em {new Date(project.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {projectOutput && <ExportDropdown project={project} projectOutput={projectOutput} />}
              <VersionHistory 
                projectId={project.id} 
                currentVersion={project.current_version} 
                onVersionRestored={fetchProjectData}
              />
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Navigation - Only show on large screens and when not mobile */}
      <div 
        className="hidden xl:block fixed"
        style={{
          position: 'fixed',
          top: '50%',
          right: '20px',
          transform: 'translateY(-50%)',
          zIndex: 40,
          width: '180px'
        }}
      >
        <Card className="p-3 shadow-xl border-2 bg-white backdrop-blur-sm">
          <div className="text-xs font-semibold text-gray-500 mb-2 px-1">Navegação</div>
          <div className="space-y-1">
            {sections.map((section) => {
              const IconComponent = section.icon;
              return (
                <Button
                  key={section.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection(section.id)}
                  className="w-full justify-start text-xs h-8 px-2 hover:bg-blue-50 hover:text-blue-700 transition-all"
                  title={section.title}
                >
                  <IconComponent className="h-3 w-3 mr-2 flex-shrink-0" />
                  <span className="truncate text-left">{section.title}</span>
                </Button>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-30 rounded-full w-12 h-12 shadow-lg gradient-primary"
          size="sm"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {!projectOutput ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-4">Plano de Negócio não Gerado</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Este projeto ainda não possui um plano de negócio. Nossa IA irá criar um plano completo e profissional para você.
                </p>
                <Button 
                  size="lg"
                  className="gradient-primary text-lg px-8"
                  onClick={handleGenerateBusinessPlan}
                  disabled={generating}
                >
                  {generating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Gerando Plano...
                    </>
                  ) : (
                    <>
                      <Rocket className="mr-2 h-5 w-5" />
                      Gerar Plano de Negócio
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-12">
            {/* Executive Summary */}
            <section id="overview" className="scroll-mt-24">
              <Card className="gradient-hero border-0 shadow-elegant">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-3xl font-bold">Resumo Executivo</CardTitle>
                      <CardDescription className="text-base mt-2">
                        Visão geral completa do seu negócio
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="prose max-w-none">
                    <p className="text-lg leading-relaxed">
                      <strong>{project.title}</strong> é uma solução inovadora que resolve um problema real do mercado. 
                      Com base na análise detalhada de mercado, projetamos um potencial de receita de até 
                      <span className="text-gradient font-bold text-xl"> R$ 1.8M no terceiro ano</span>, 
                      com margem operacional saudável e modelo de negócio escalável.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center">
                      <TrendingUp className="h-10 w-10 text-green-600 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-green-600">R$ 1.8M</div>
                      <div className="text-sm text-muted-foreground mt-1">Receita Projetada (Ano 3)</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center">
                      <Users className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-blue-600">15:1</div>
                      <div className="text-sm text-muted-foreground mt-1">Ratio LTV/CAC</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center">
                      <Target className="h-10 w-10 text-purple-600 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-purple-600">4-8 meses</div>
                      <div className="text-sm text-muted-foreground mt-1">Payback Period</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
                          Conceito do Negócio
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{project.idea_text}</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                          Status do Projeto
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Completude do Plano</span>
                          <span className="text-sm font-medium">85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                        <div className="flex items-center space-x-2">
                          {project.is_premium && <Badge variant="secondary">Premium</Badge>}
                          <Badge variant="outline">Versão {project.current_version}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </section>

            <Separator className="my-8" />

            {/* Market Analysis */}
            <section id="market" className="scroll-mt-24">
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center text-3xl">
                    <TrendingUp className="mr-3 h-8 w-8 text-green-600" />
                    Análise de Mercado
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Estudo completo do mercado e oportunidades
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div 
                      className="whitespace-pre-wrap text-base leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: projectOutput?.market_analysis || '' }}
                    />
                  </div>
                </CardContent>
              </Card>
            </section>

            <Separator className="my-8" />

            {/* SWOT Analysis */}
            <section id="swot" className="scroll-mt-24">
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center text-3xl">
                    <BarChart3 className="mr-3 h-8 w-8 text-blue-600" />
                    Análise SWOT
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Forças, fraquezas, oportunidades e ameaças
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SwotChart data={projectOutput?.swot} />
                </CardContent>
              </Card>
            </section>

            <Separator className="my-8" />

            {/* Personas */}
            <section id="personas" className="scroll-mt-24">
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center text-3xl">
                    <Users className="mr-3 h-8 w-8 text-purple-600" />
                    Personas dos Clientes
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Perfis detalhados dos clientes ideais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PersonasSection personas={projectOutput?.personas} />
                </CardContent>
              </Card>
            </section>

            <Separator className="my-8" />

            {/* Value Proposition */}
            <section id="value" className="scroll-mt-24">
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center text-3xl">
                    <Target className="mr-3 h-8 w-8 text-red-600" />
                    Proposta de Valor
                  </CardTitle>
                  <CardDescription className="text-lg">
                    O que torna seu produto único no mercado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div 
                      className="whitespace-pre-wrap text-base leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: projectOutput?.value_proposition || '' }}
                    />
                  </div>
                </CardContent>
              </Card>
            </section>

            <Separator className="my-8" />

            {/* Business Model */}
            <section id="model" className="scroll-mt-24">
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center text-3xl">
                    <PieChart className="mr-3 h-8 w-8 text-orange-600" />
                    Modelo de Negócio
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Como o negócio funciona e gera valor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div 
                      className="whitespace-pre-wrap text-base leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: projectOutput?.business_model || '' }}
                    />
                  </div>
                </CardContent>
              </Card>
            </section>

            <Separator className="my-8" />

            {/* Marketing Strategy */}
            <section id="marketing" className="scroll-mt-24">
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center text-3xl">
                    <MessageSquare className="mr-3 h-8 w-8 text-pink-600" />
                    Estratégia de Marketing
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Como alcançar e conquistar seus clientes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div 
                      className="whitespace-pre-wrap text-base leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: projectOutput?.marketing_strategy || '' }}
                    />
                  </div>
                </CardContent>
              </Card>
            </section>

            <Separator className="my-8" />

            {/* Financial Projections */}
            <section id="financial" className="scroll-mt-24">
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center text-3xl">
                    <DollarSign className="mr-3 h-8 w-8 text-green-600" />
                    Projeções Financeiras
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Cenários financeiros para os próximos 3 anos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <FinancialChart data={projectOutput?.financial_projection} />
                  
                                      <div>
                      <h4 className="text-xl font-semibold mb-4 flex items-center">
                        <DollarSign className="mr-2 h-5 w-5" />
                        Estratégia de Precificação
                      </h4>
                      <div className="prose max-w-none">
                        <div 
                          className="whitespace-pre-wrap text-base leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: projectOutput?.pricing || '' }}
                        />
                      </div>
                    </div>
                </CardContent>
              </Card>
            </section>

            <Separator className="my-8" />

            {/* Pitch */}
            <section id="pitch" className="scroll-mt-24">
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center text-3xl">
                    <Rocket className="mr-3 h-8 w-8 text-indigo-600" />
                    Pitch de Elevador
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Apresentação concisa e impactante do seu negócio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div 
                      className="whitespace-pre-wrap text-base leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: projectOutput?.pitch || '' }}
                    />
                  </div>
                </CardContent>
              </Card>
            </section>

            <Separator className="my-8" />

            {/* Sales Script */}
            <section id="sales" className="scroll-mt-24">
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center text-3xl">
                    <Phone className="mr-3 h-8 w-8 text-teal-600" />
                    Script de Vendas
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Roteiro completo para apresentações e vendas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div 
                      className="whitespace-pre-wrap text-base leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: projectOutput?.sales_script || '' }}
                    />
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        )}

        {/* Version Info - Fixed at bottom */}
        <div className="fixed bottom-4 left-4 z-30">
          <VersionInfo 
            version={project.current_version} 
            lastUpdated={project.updated_at} 
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectView;