import { supabase } from '../integrations/supabase/client';

export interface BusinessPlanData {
  companyName: string;
  businessIdea: string;
  targetMarket: string;
  mainGoal: string;
  budget: string;
  timeline: string;
}

export interface BusinessPlanResult {
  executiveSummary: string;
  marketAnalysis: string;
  competitiveAnalysis: string;
  financialProjections: string;
  marketingStrategy: string;
  operationalPlan: string;
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  personas: Array<{
    name: string;
    age: string;
    description: string;
    needs: string;
    behavior: string;
  }>;
}

export const generateBusinessPlan = async (data: BusinessPlanData): Promise<BusinessPlanResult> => {
  try {
    // Call the Supabase Edge Function that handles OpenAI integration
    const { data: result, error } = await supabase.functions.invoke('generate-business-plan', {
      body: {
        companyName: data.companyName,
        businessIdea: data.businessIdea,
        targetMarket: data.targetMarket,
        mainGoal: data.mainGoal,
        budget: data.budget,
        timeline: data.timeline,
      },
    });

    if (error) {
      console.error('Error calling business plan generation:', error);
      throw new Error('Falha ao gerar plano de negócio. Verifique sua conexão.');
    }

    if (!result || !result.success) {
      throw new Error(result?.error || 'Falha ao gerar plano de negócio.');
    }

    return result.data;
  } catch (error) {
    console.error('Business plan generation failed:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro inesperado ao gerar plano de negócio.');
  }
};

export const checkOpenAIStatus = async (): Promise<{ isConfigured: boolean; message: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-business-plan', {
      body: { test: true },
    });

    if (error) {
      return {
        isConfigured: false,
        message: 'OpenAI não configurada ou inacessível.',
      };
    }

    return {
      isConfigured: true,
      message: 'OpenAI configurada e funcionando.',
    };
  } catch (error) {
    return {
      isConfigured: false,
      message: 'Erro ao verificar status da OpenAI.',
    };
  }
}; 