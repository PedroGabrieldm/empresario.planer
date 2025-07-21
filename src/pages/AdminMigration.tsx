import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { fixSupabaseRLS, testSupabaseAccess } from "@/utils/fixSupabaseRLS";

const AdminMigration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const executeMigration = async () => {
    if (loading) return;

    setLoading(true);
    setResults([]);

    try {
      const result = await fixSupabaseRLS();
      
      // Adicionar todos os resultados
      result.results.forEach(message => {
        setResults(prev => [...prev, message]);
      });

      if (result.success) {
        toast({
          title: "✅ Sistema Funcionando",
          description: result.message,
        });
      } else {
        toast({
          title: "⚠️ Ação Necessária",
          description: result.message,
          variant: "destructive",
        });
      }

    } catch (error: any) {
      setResults(prev => [...prev, `❌ Erro geral: ${error.message}`]);
      toast({
        title: "Erro na Migração",
        description: "Verifique os logs e tente novamente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testDatabase = async () => {
    setLoading(true);
    setResults([]);

    try {
      const result = await testSupabaseAccess();
      
      // Adicionar todos os resultados
      result.results.forEach(message => {
        setResults(prev => [...prev, message]);
      });

      if (result.success) {
        toast({
          title: "✅ Sistema OK",
          description: result.message,
        });
      } else {
        toast({
          title: "❌ Problemas Detectados",
          description: result.message,
          variant: "destructive",
        });
      }

    } catch (error: any) {
      setResults(prev => [...prev, `❌ Erro no teste: ${error.message}`]);
      toast({
        title: "Erro no Teste",
        description: "Verifique os logs para mais detalhes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem',
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#1f2937'
          }}>
            🔧 Admin - Migração Supabase RLS
          </h1>
          
          <p style={{
            color: '#6b7280',
            marginBottom: '2rem',
            lineHeight: '1.5'
          }}>
            Esta página resolve os problemas de Row Level Security (RLS) que estão causando erro 406 
            ao acessar as tabelas do Supabase. Execute a migração para permitir acesso anônimo no modo demo.
          </p>

          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <button
              onClick={testDatabase}
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                background: loading ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '500'
              }}
                         >
               {loading ? '🔍 Testando...' : '🔍 Testar Sistema'}
             </button>

             <button
               onClick={executeMigration}
               disabled={loading}
               style={{
                 padding: '0.75rem 1.5rem',
                 background: loading ? '#9ca3af' : '#10b981',
                 color: 'white',
                 border: 'none',
                 borderRadius: '6px',
                 cursor: loading ? 'not-allowed' : 'pointer',
                 fontWeight: '500'
               }}
             >
               {loading ? '⏳ Diagnosticando...' : '🚀 Diagnosticar e Corrigir'}
             </button>
          </div>

          {results.length > 0 && (
            <div style={{
              background: '#1f2937',
              color: '#f9fafb',
              padding: '1rem',
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              <h3 style={{ 
                color: '#10b981', 
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 'bold'
              }}>
                📋 Log de Execução:
              </h3>
              {results.map((result, index) => (
                <div key={index} style={{ marginBottom: '0.25rem' }}>
                  {result}
                </div>
              ))}
            </div>
          )}

          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#fef3c7',
            borderRadius: '6px',
            border: '1px solid #f59e0b'
          }}>
            <h4 style={{ 
              color: '#92400e', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem' 
            }}>
              ⚠️ Importante:
            </h4>
            <ul style={{ 
              color: '#92400e', 
              margin: 0, 
              paddingLeft: '1.5rem',
              lineHeight: '1.5'
            }}>
              <li>Esta migração configura RLS para modo demo (acesso anônimo)</li>
              <li>Em produção, habilite políticas reais de autenticação</li>
              <li>Acesse /admin-migration apenas quando necessário</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMigration; 