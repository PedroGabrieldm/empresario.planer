import React, { useEffect, useState } from 'react';
import { checkOpenAIStatus } from '../services/openaiService';
import { Alert, AlertDescription } from './ui/alert';
import { Spinner } from './ui/spinner';

export const OpenAIStatus = () => {
  const [status, setStatus] = useState<{
    isConfigured: boolean;
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const result = await checkOpenAIStatus();
        setStatus(result);
      } catch (error) {
        setStatus({
          isConfigured: false,
          message: 'Erro ao verificar status da OpenAI',
        });
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, []);

  if (loading) {
    return (
      <Alert>
        <div className="flex items-center gap-2">
          <Spinner size="sm" />
          <AlertDescription>Verificando status da OpenAI...</AlertDescription>
        </div>
      </Alert>
    );
  }

  if (!status) {
    return null;
  }

  return (
    <Alert variant={status.isConfigured ? "default" : "destructive"}>
      <AlertDescription>
        <span className="font-medium">Status OpenAI:</span> {status.message}
        {!status.isConfigured && (
          <div className="mt-2 text-sm">
            Configure a chave OpenAI nas variáveis de ambiente do Supabase para usar a geração de planos de negócio.
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}; 