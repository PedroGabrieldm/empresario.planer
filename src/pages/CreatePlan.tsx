import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface PlanFormData {
  title: string;
  idea_text: string;
}

const CreatePlan: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PlanFormData>({
    title: "",
    idea_text: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoBack = useCallback(() => {
    window.location.href = '/';
  }, []);

  const updateFormData = useCallback((field: keyof PlanFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const validateForm = useCallback((): boolean => {
    if (!formData.title.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, preencha o título do projeto",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.idea_text.trim()) {
      toast({
        title: "Campo obrigatório", 
        description: "Por favor, descreva sua ideia de negócio",
        variant: "destructive",
      });
      return false;
    }

    if (formData.idea_text.trim().length < 10) {
      toast({
        title: "Descrição muito curta",
        description: "Por favor, forneça mais detalhes sobre sua ideia",
        variant: "destructive",
      });
      return false;
    }

    return true;
  }, [formData]);

  const createProject = useCallback(async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);

      const projectId = crypto.randomUUID();
      
      // Try to create in Supabase first
      const { data: project, error } = await supabase
        .from('projects')
        .insert({
          id: projectId,
          title: formData.title.trim(),
          idea_text: formData.idea_text.trim(),
          is_premium: false,
          user_id: null
        })
        .select()
        .single();

      if (error) {
        console.log('Supabase error, creating local project:', error);
        
        // Fallback to local storage
        const localProject = {
          id: projectId,
          title: formData.title.trim(),
          idea_text: formData.idea_text.trim(),
          is_premium: false,
          created_at: new Date().toISOString()
        };
        
        localStorage.setItem(`project_${projectId}`, JSON.stringify(localProject));
        
        toast({
          title: "Projeto criado!",
          description: "Plano salvo localmente. Redirecionando...",
        });
        
        // Navigate after short delay
        setTimeout(() => {
          window.location.href = `/project/${projectId}`;
        }, 1500);
        
        return;
      }

      // Success - project created in Supabase
      toast({
        title: "Sucesso!",
        description: "Projeto criado com sucesso! Redirecionando...",
      });

      setTimeout(() => {
        if (project?.id) {
          window.location.href = `/project/${project.id}`;
        }
      }, 1500);

    } catch (err) {
      console.error('Error creating project:', err);
      toast({
        title: "Erro",
        description: "Não foi possível criar o projeto. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm]);

  const isFormValid = formData.title.trim().length > 0 && formData.idea_text.trim().length > 0;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eff6ff 0%, #f3e8ff 50%, #fdf2f8 100%)',
      padding: '2rem 1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '768px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button
            onClick={handleGoBack}
            disabled={isSubmitting}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#6b7280',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '1.5rem',
              padding: '0.5rem',
              borderRadius: '0.375rem',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#111827';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            ← Voltar ao início
          </button>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem'
            }}>
              💡
            </div>
            <h1 style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: '#111827',
              margin: 0
            }}>
              Criar Plano de Negócio
            </h1>
          </div>
          
          <p style={{
            color: '#6b7280',
            maxWidth: '28rem',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Descreva sua ideia e nossa IA irá gerar um plano de negócio completo para você
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          background: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden'
        }}>
          {/* Card Header */}
          <div style={{
            padding: '1.5rem 1.5rem 0 1.5rem'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827',
              margin: '0 0 0.5rem 0'
            }}>
              Conte-nos sobre sua ideia
            </h2>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              margin: '0 0 1.5rem 0'
            }}>
              Forneça detalhes sobre seu projeto para gerar o melhor plano possível
            </p>
          </div>
          
          {/* Card Content */}
          <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
            {/* Title Input */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label 
                htmlFor="project-title"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.75rem'
                }}
              >
                Título do Projeto *
              </label>
              <input
                id="project-title"
                type="text"
                placeholder="Ex: Aplicativo de delivery sustentável"
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                disabled={isSubmitting}
                maxLength={100}
                style={{
                  width: '100%',
                  height: '2.75rem',
                  padding: '0 0.75rem',
                  fontSize: '1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <p style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                margin: '0.5rem 0 0 0'
              }}>
                {formData.title.length}/100 caracteres
              </p>
            </div>

            {/* Idea Description */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label 
                htmlFor="project-idea"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.75rem'
                }}
              >
                Descrição da Ideia *
              </label>
              <textarea
                id="project-idea"
                placeholder="Descreva detalhadamente sua ideia: qual problema resolve, quem é seu público-alvo, como funcionará, seus diferenciais competitivos..."
                value={formData.idea_text}
                onChange={(e) => updateFormData('idea_text', e.target.value)}
                disabled={isSubmitting}
                rows={6}
                maxLength={2000}
                style={{
                  width: '100%',
                  minHeight: '8rem',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  outline: 'none',
                  resize: 'vertical',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                color: '#6b7280',
                marginTop: '0.5rem'
              }}>
                <span>Mínimo recomendado: 50 caracteres</span>
                <span>{formData.idea_text.length}/2000</span>
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ paddingTop: '1rem' }}>
              <button 
                onClick={createProject}
                disabled={isSubmitting || !isFormValid}
                style={{
                  width: '100%',
                  height: '3rem',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: 'white',
                  background: isSubmitting || !isFormValid 
                    ? '#9ca3af' 
                    : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: isSubmitting || !isFormValid ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.2s',
                  outline: 'none'
                }}
                onMouseOver={(e) => {
                  if (!isSubmitting && isFormValid) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb, #7c3aed)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isSubmitting && isFormValid) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6, #8b5cf6)';
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <div style={{
                      width: '1.25rem',
                      height: '1.25rem',
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Criando seu plano...
                  </>
                ) : (
                  <>
                    🚀 Criar Meu Plano de Negócio
                  </>
                )}
              </button>
            </div>

            {/* Help Text */}
            <div style={{ 
              textAlign: 'center', 
              paddingTop: '0.5rem' 
            }}>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0
              }}>
                🚀 Seu plano será gerado automaticamente em segundos
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS Animation for spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CreatePlan; 