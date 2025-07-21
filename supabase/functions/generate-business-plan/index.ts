import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectId, ideaText } = await req.json();

    if (!projectId || !ideaText) {
      return new Response(
        JSON.stringify({ error: 'projectId and ideaText are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating comprehensive business plan for project ${projectId}`);

    const prompt = `Você é um consultor sênior de estratégia empresarial com 20+ anos de experiência em desenvolvimento de planos de negócio para startups e empresas consolidadas. Sua expertise inclui análise de mercado, modelagem financeira, estratégia competitiva e desenvolvimento de negócios.

IDEIA DE NEGÓCIO: ${ideaText}

Desenvolva um PLANO DE NEGÓCIO ABRANGENTE E PROFISSIONAL seguindo as diretrizes específicas abaixo. Cada seção deve ter profundidade analítica e aplicabilidade prática.

DIRETRIZES GERAIS:
- Use dados do mercado brasileiro quando relevante
- Inclua números específicos, percentuais e métricas sempre que possível
- Forneça insights acionáveis, não apenas descrições genéricas
- Base suas análises em frameworks reconhecidos (Porter, Canvas, etc.)
- Considere tendências atuais e futuras do mercado
- Seja específico sobre segmentos, nichos e oportunidades

ESTRUTURA DETALHADA REQUERIDA:

1. **MARKET_ANALYSIS** (Análise de Mercado - mínimo 800 palavras)
Deve incluir:
- Tamanho do mercado (TAM, SAM, SOM) com valores estimados
- Taxa de crescimento anual e projeções
- Principais segmentos e nichos identificados
- Análise das 5 Forças de Porter aplicada
- Tendências macro e microeconômicas relevantes
- Barreiras de entrada e regulamentações
- Sazonalidade e ciclos do mercado
- Benchmarking com mercados internacionais
- Oportunidades não exploradas identificadas

2. **SWOT** (Análise SWOT Estratégica)
Cada categoria deve ter 5-7 itens específicos e detalhados:
- Forças: Vantagens competitivas únicas, recursos diferenciados
- Fraquezas: Limitações específicas, gaps identificados
- Oportunidades: Tendências favoráveis, mudanças regulatórias
- Ameaças: Riscos específicos, concorrentes emergentes

3. **PERSONAS** (3 Personas Detalhadas)
Para cada persona, inclua:
- Demografia completa (idade, renda, localização, profissão)
- Psicografia (valores, motivações, lifestyle)
- Comportamento de compra específico
- Pontos de dor (pain points) detalhados
- Jornada de decisão completa
- Canais de comunicação preferidos
- Objeções típicas e como superá-las

4. **CUSTOMER_JOURNEY** (Jornada do Cliente - mínimo 600 palavras)
Mapear detalhadamente:
- Estágio de Conscientização: Como descobrem o problema
- Estágio de Consideração: Processo de avaliação de soluções
- Estágio de Decisão: Fatores decisivos de compra
- Pós-compra: Experiência de uso e fidelização
- Pontos de contato (touchpoints) em cada estágio
- Oportunidades de melhoria identificadas

5. **VALUE_PROPOSITION** (Proposta de Valor - mínimo 400 palavras)
Desenvolva usando o Canvas de Proposta de Valor:
- Trabalhos do cliente (jobs to be done)
- Dores específicas que resolve
- Ganhos que proporciona
- Produtos/serviços oferecidos
- Analgésicos (pain relievers)
- Criadores de ganho (gain creators)
- Diferenciação competitiva clara

6. **BUSINESS_MODEL** (Modelo de Negócio - mínimo 700 palavras)
Baseado no Business Model Canvas:
- Segmentos de clientes detalhados
- Propostas de valor específicas
- Canais de distribuição e vendas
- Relacionamento com clientes
- Fontes de receita diversificadas
- Recursos-chave necessários
- Atividades-chave do negócio
- Parcerias estratégicas essenciais
- Estrutura de custos otimizada

7. **MARKETING_STRATEGY** (Estratégia de Marketing - mínimo 800 palavras)
Estratégia completa incluindo:
- Posicionamento de marca e messaging
- Mix de Marketing (4Ps/7Ps) detalhado
- Estratégia digital: SEO, SEM, Social Media
- Marketing de conteúdo e inbound
- Parcerias e co-marketing
- Eventos e ativações
- Métricas de performance (KPIs)
- Budget sugerido por canal
- Timeline de implementação

8. **PRICING** (Estratégia de Precificação - mínimo 500 palavras)
Análise abrangente:
- Modelos de precificação avaliados
- Análise de preços da concorrência
- Sensibilidade ao preço do mercado
- Estratégias de penetração vs. premium
- Estrutura de descontos e promoções
- Preços por segmento/persona
- Elasticidade e otimização
- Estratégia de evolução dos preços

9. **FINANCIAL_PROJECTION** (Projeção Financeira Detalhada)
3 cenários completos (conservador, realista, agressivo) para 3 anos:
- Receitas mensais detalhadas por fonte
- Custos fixos e variáveis específicos
- CAPEX e OPEX segregados
- Fluxo de caixa mensal
- Break-even point
- Margem bruta e líquida
- ROI e payback
- Necessidade de capital

10. **PITCH** (Pitch de Elevador - 200-300 palavras)
Estrutura persuasiva:
- Hook inicial impactante
- Problema identificado
- Solução única
- Mercado e oportunidade
- Modelo de negócio
- Tração e validação
- Pedido específico (call to action)

11. **SALES_SCRIPT** (Script de Vendas - mínimo 600 palavras)
Roteiro profissional:
- Abertura e rapport
- Descoberta de necessidades
- Apresentação customizada
- Tratamento de objeções
- Fechamento e follow-up
- Técnicas específicas por persona

FORMATO DE SAÍDA - JSON VÁLIDO OBRIGATÓRIO:

{
  "market_analysis": "análise detalhada de mercado (800+ palavras)",
  "swot": {
    "forcas": ["força específica 1", "força específica 2", "força específica 3", "força específica 4", "força específica 5"],
    "fraquezas": ["fraqueza específica 1", "fraqueza específica 2", "fraqueza específica 3", "fraqueza específica 4", "fraqueza específica 5"],
    "oportunidades": ["oportunidade específica 1", "oportunidade específica 2", "oportunidade específica 3", "oportunidade específica 4", "oportunidade específica 5"],
    "ameacas": ["ameaça específica 1", "ameaça específica 2", "ameaça específica 3", "ameaça específica 4", "ameaça específica 5"]
  },
  "personas": [
    {
      "nome": "Nome Real da Persona",
      "idade": "faixa etária específica",
      "perfil": "descrição demográfica e psicográfica completa",
      "necessidades": "necessidades específicas e detalhadas",
      "comportamento": "comportamento de compra detalhado",
      "pain_points": "pontos de dor específicos",
      "canais": "canais de comunicação preferidos"
    }
  ],
  "customer_journey": "jornada completa do cliente (600+ palavras)",
  "value_proposition": "proposta de valor detalhada (400+ palavras)",
  "business_model": "modelo de negócio completo (700+ palavras)",
  "marketing_strategy": "estratégia de marketing abrangente (800+ palavras)",
  "pricing": "estratégia de precificação detalhada (500+ palavras)",
  "financial_projection": {
    "conservador": {
      "receita_ano1": "R$ XX.XXX",
      "receita_ano2": "R$ XX.XXX",
      "receita_ano3": "R$ XX.XXX",
      "custos_ano1": "R$ XX.XXX",
      "custos_ano2": "R$ XX.XXX",
      "custos_ano3": "R$ XX.XXX",
      "lucro_liquido_ano1": "R$ XX.XXX",
      "lucro_liquido_ano2": "R$ XX.XXX",
      "lucro_liquido_ano3": "R$ XX.XXX",
      "break_even": "X meses"
    },
    "realista": {
      "receita_ano1": "R$ XX.XXX",
      "receita_ano2": "R$ XX.XXX",
      "receita_ano3": "R$ XX.XXX",
      "custos_ano1": "R$ XX.XXX",
      "custos_ano2": "R$ XX.XXX",
      "custos_ano3": "R$ XX.XXX",
      "lucro_liquido_ano1": "R$ XX.XXX",
      "lucro_liquido_ano2": "R$ XX.XXX",
      "lucro_liquido_ano3": "R$ XX.XXX",
      "break_even": "X meses"
    },
    "agressivo": {
      "receita_ano1": "R$ XX.XXX",
      "receita_ano2": "R$ XX.XXX",
      "receita_ano3": "R$ XX.XXX",
      "custos_ano1": "R$ XX.XXX",
      "custos_ano2": "R$ XX.XXX",
      "custos_ano3": "R$ XX.XXX",
      "lucro_liquido_ano1": "R$ XX.XXX",
      "lucro_liquido_ano2": "R$ XX.XXX",
      "lucro_liquido_ano3": "R$ XX.XXX",
      "break_even": "X meses"
    }
  },
  "pitch": "pitch de elevador profissional (200-300 palavras)",
  "sales_script": "script de vendas detalhado (600+ palavras)"
}

IMPORTANTE: Este plano deve ser robusto, específico e implementável. Use sua expertise para criar um documento que realmente agregue valor estratégico ao empreendedor.`;

    // Call OpenAI API
    console.log('Calling OpenAI API with enhanced prompt...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: 'Você é um consultor estratégico sênior especializado em planos de negócio. Sua experiência abrange análise de mercado, modelagem financeira, desenvolvimento de estratégias competitivas e validação de modelos de negócio. Sempre retorne análises profundas, específicas e acionáveis em formato JSON válido.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 16000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    console.log('Generated content from OpenAI:', generatedContent);

    // Parse the JSON response
    let businessPlan;
    try {
      businessPlan = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Error parsing OpenAI response as JSON:', parseError);
      throw new Error('Failed to parse OpenAI response as JSON');
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Save to project_outputs table
    console.log('Saving business plan to database...');
    const { data: savedData, error: saveError } = await supabase
      .from('project_outputs')
      .upsert({
        project_id: projectId,
        market_analysis: businessPlan.market_analysis,
        swot: businessPlan.swot,
        personas: businessPlan.personas,
        customer_journey: businessPlan.customer_journey,
        value_proposition: businessPlan.value_proposition,
        business_model: businessPlan.business_model,
        marketing_strategy: businessPlan.marketing_strategy,
        pricing: businessPlan.pricing,
        financial_projection: businessPlan.financial_projection,
        pitch: businessPlan.pitch,
        sales_script: businessPlan.sales_script,
      }, {
        onConflict: 'project_id'
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving to database:', saveError);
      throw new Error(`Database error: ${saveError.message}`);
    }

    console.log('Business plan saved successfully:', savedData);

    return new Response(JSON.stringify({ 
      success: true, 
      businessPlan: savedData,
      message: 'Plano de negócio robusto gerado e salvo com sucesso!'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-business-plan function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Erro interno do servidor',
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});