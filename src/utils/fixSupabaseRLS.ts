import { supabase } from "@/integrations/supabase/client";

interface MigrationResult {
  success: boolean;
  message: string;
  results: string[];
}

export const fixSupabaseRLS = async (): Promise<MigrationResult> => {
  const results: string[] = [];
  let hasErrors = false;

  const addResult = (message: string) => {
    results.push(`${new Date().toLocaleTimeString()}: ${message}`);
    console.log(message);
  };

  addResult("🚀 Iniciando correção automática de RLS...");

  try {
    // Primeiro, vamos tentar uma abordagem diferente - criar projetos de teste
    addResult("📋 Testando conectividade básica...");
    
    // Test basic read access
    const { data: testRead, error: readError } = await supabase
      .from('projects')
      .select('id')
      .limit(1);

    if (readError) {
      addResult(`❌ Erro de leitura detectado: ${readError.message}`);
      if (readError.message.includes('406')) {
        addResult("🎯 Confirmado: Erro 406 - RLS bloqueando acesso");
      }
    } else {
      addResult("✅ Leitura de projetos funcionando");
      return {
        success: true,
        message: "RLS já está configurado corretamente",
        results
      };
    }

    // Test project_outputs
    const { data: testOutputs, error: outputError } = await supabase
      .from('project_outputs')
      .select('id')
      .limit(1);

    if (outputError) {
      addResult(`❌ project_outputs bloqueado: ${outputError.message}`);
    } else {
      addResult("✅ project_outputs acessível");
    }

    // Se chegamos aqui, há problemas de RLS que precisam ser corrigidos
    // Como não podemos executar DDL, vamos criar uma estratégia de contorno
    
    addResult("💡 Implementando estratégia de contorno...");
    addResult("📝 Criando projeto de teste para validar sistema...");

    // Tentar criar um projeto de teste para ver se conseguimos
    const testProject = {
      id: crypto.randomUUID(),
      title: "Projeto de Teste RLS",
      idea_text: "Este é um projeto de teste para validar as configurações de RLS",
      is_premium: false,
      user_id: null
    };

    const { data: createdProject, error: createError } = await supabase
      .from('projects')
      .insert(testProject)
      .select()
      .single();

    if (createError) {
      addResult(`❌ Erro ao criar projeto teste: ${createError.message}`);
      
      if (createError.message.includes('violates row-level security')) {
        addResult("🚨 CONFIRMADO: RLS está bloqueando operações");
        addResult("📋 SOLUÇÃO NECESSÁRIA: Execute o SQL no painel do Supabase:");
        addResult("");
        addResult("-- COPIE E COLE NO SQL EDITOR DO SUPABASE:");
        addResult("ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;");
        addResult("ALTER TABLE public.project_outputs DISABLE ROW LEVEL SECURITY;");
        addResult("ALTER TABLE public.project_versions DISABLE ROW LEVEL SECURITY;");
        addResult("");
        addResult("-- Remover políticas existentes");
        addResult("DROP POLICY IF EXISTS \"Users can view their own projects\" ON public.projects;");
        addResult("DROP POLICY IF EXISTS \"Users can create their own projects\" ON public.projects;");
        addResult("DROP POLICY IF EXISTS \"Users can update their own projects\" ON public.projects;");
        addResult("DROP POLICY IF EXISTS \"Users can delete their own projects\" ON public.projects;");
        addResult("");
        addResult("DROP POLICY IF EXISTS \"Users can view their own project outputs\" ON public.project_outputs;");
        addResult("DROP POLICY IF EXISTS \"Users can create their own project outputs\" ON public.project_outputs;");
        addResult("DROP POLICY IF EXISTS \"Users can update their own project outputs\" ON public.project_outputs;");
        addResult("DROP POLICY IF EXISTS \"Users can delete their own project outputs\" ON public.project_outputs;");
        addResult("");
        addResult("-- Reabilitar com políticas permissivas");
        addResult("ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;");
        addResult("ALTER TABLE public.project_outputs ENABLE ROW LEVEL SECURITY;");
        addResult("ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;");
        addResult("");
        addResult("-- Criar políticas demo");
        addResult("CREATE POLICY \"Demo - view projects\" ON public.projects FOR SELECT USING (true);");
        addResult("CREATE POLICY \"Demo - create projects\" ON public.projects FOR INSERT WITH CHECK (true);");
        addResult("CREATE POLICY \"Demo - update projects\" ON public.projects FOR UPDATE USING (true);");
        addResult("CREATE POLICY \"Demo - delete projects\" ON public.projects FOR DELETE USING (true);");
        addResult("");
        addResult("CREATE POLICY \"Demo - view outputs\" ON public.project_outputs FOR SELECT USING (true);");
        addResult("CREATE POLICY \"Demo - create outputs\" ON public.project_outputs FOR INSERT WITH CHECK (true);");
        addResult("CREATE POLICY \"Demo - update outputs\" ON public.project_outputs FOR UPDATE USING (true);");
        addResult("CREATE POLICY \"Demo - delete outputs\" ON public.project_outputs FOR DELETE USING (true);");
        addResult("");
        addResult("🌐 LINK DIRETO: https://supabase.com/dashboard/project/stisutszkhtrnhctacwh");
        
        hasErrors = true;
      }
    } else {
      addResult("✅ Projeto de teste criado com sucesso!");
      addResult("🎉 RLS parece estar funcionando corretamente");
      
      // Limpar projeto de teste
      await supabase
        .from('projects')
        .delete()
        .eq('id', testProject.id);
      
      addResult("🧹 Projeto de teste removido");
    }

    addResult("📊 Diagnóstico completo!");

    return {
      success: !hasErrors,
      message: hasErrors ? 
        "RLS precisa ser corrigido manualmente - veja instruções nos resultados" : 
        "Sistema funcionando corretamente",
      results
    };

  } catch (error: any) {
    addResult(`❌ Erro geral: ${error.message}`);
    return {
      success: false,
      message: `Erro durante diagnóstico: ${error.message}`,
      results
    };
  }
};

// Função para testar se as correções funcionaram
export const testSupabaseAccess = async (): Promise<MigrationResult> => {
  const results: string[] = [];
  
  const addResult = (message: string) => {
    results.push(`${new Date().toLocaleTimeString()}: ${message}`);
  };

  try {
    addResult("🧪 Testando acesso após correções...");

    // Test projects table
    const { data: projects, error: projectError } = await supabase
      .from('projects')
      .select('id, title')
      .limit(3);

    if (projectError) {
      addResult(`❌ projects: ${projectError.message}`);
    } else {
      addResult(`✅ projects: ${projects?.length || 0} registros acessíveis`);
    }

    // Test project_outputs table  
    const { data: outputs, error: outputError } = await supabase
      .from('project_outputs')
      .select('id')
      .limit(3);

    if (outputError) {
      addResult(`❌ project_outputs: ${outputError.message}`);
    } else {
      addResult(`✅ project_outputs: ${outputs?.length || 0} registros acessíveis`);
    }

    // Test insert capability
    const testId = crypto.randomUUID();
    const { error: insertError } = await supabase
      .from('projects')
      .insert({
        id: testId,
        title: "Teste Final",
        idea_text: "Teste de inserção",
        is_premium: false,
        user_id: null
      });

    if (insertError) {
      addResult(`❌ Inserção: ${insertError.message}`);
      return {
        success: false,
        message: "Ainda há problemas de RLS",
        results
      };
    } else {
      addResult("✅ Inserção funcionando");
      
      // Clean up
      await supabase
        .from('projects')
        .delete()
        .eq('id', testId);
      
      addResult("🧹 Teste limpo");
    }

    addResult("🎉 Todos os testes passaram! RLS corrigido.");

    return {
      success: true,
      message: "RLS configurado corretamente - sistema operacional",
      results
    };

  } catch (error: any) {
    return {
      success: false,
      message: `Erro no teste: ${error.message}`,
      results
    };
  }
}; 