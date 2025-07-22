import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthUtils } from '../hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Spinner } from '../components/ui/spinner';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export const ConfirmationHelp = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const { signUp } = useAuthUtils();

  const handleResendConfirmation = async () => {
    if (!email) {
      setError('Email é obrigatório');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Try to sign up again with the same email to resend confirmation
      const { error } = await signUp(email, 'temp_password_for_resend');
      
      if (error && error.message.includes('already registered')) {
        setMessage('Email de confirmação reenviado! Verifique sua caixa de entrada.');
      } else if (error) {
        setError('Erro ao reenviar confirmação. Tente novamente.');
      } else {
        setMessage('Email de confirmação enviado! Verifique sua caixa de entrada.');
      }
    } catch (error) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center">
          <Mail className="mx-auto h-16 w-16 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Ajuda com Confirmação de Email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Não recebeu o email de confirmação? Vamos ajudar você!
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Problemas Comuns</CardTitle>
            <CardDescription>
              Verifique estas possibilidades antes de reenviar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Verifique sua caixa de entrada</p>
                  <p className="text-sm text-gray-600">O email pode levar alguns minutos para chegar</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Confira a pasta de spam</p>
                  <p className="text-sm text-gray-600">Emails automáticos às vezes vão para spam</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Verifique o email digitado</p>
                  <p className="text-sm text-gray-600">Certifique-se de que digitou corretamente</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reenviar Confirmação</CardTitle>
            <CardDescription>
              Se ainda não recebeu, podemos reenviar o email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resend-email">Email</Label>
              <Input
                id="resend-email"
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {message && (
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              onClick={handleResendConfirmation}
              disabled={loading}
              className="w-full"
            >
              {loading ? <Spinner size="sm" /> : 'Reenviar Email de Confirmação'}
            </Button>
          </CardContent>
        </Card>

        <div className="text-center space-y-2">
          <Link to="/auth" className="inline-flex items-center text-blue-600 hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar ao Login
          </Link>
        </div>
      </div>
    </div>
  );
}; 