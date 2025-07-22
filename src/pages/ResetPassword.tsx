import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthUtils } from '../hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Spinner } from '../components/ui/spinner';
import { Key, ArrowLeft, Mail } from 'lucide-react';

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);
  
  const { resetPassword, updatePassword } = useAuthUtils();

  useEffect(() => {
    // Check if this is a password reset link with access_token
    const accessToken = searchParams.get('access_token');
    const type = searchParams.get('type');
    
    if (accessToken && type === 'recovery') {
      setIsResetMode(true);
    }
  }, [searchParams]);

  const handleRequestReset = async () => {
    if (!email) {
      setError('Email é obrigatório');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await resetPassword(email);
      if (error) {
        setError(error.message);
      } else {
        setMessage('Email de recuperação enviado! Verifique sua caixa de entrada.');
      }
    } catch (error) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!password || !confirmPassword) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await updatePassword(password);
      if (error) {
        setError(error.message);
      } else {
        setMessage('Senha atualizada com sucesso!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {isResetMode ? (
            <Key className="mx-auto h-16 w-16 text-blue-600" />
          ) : (
            <Mail className="mx-auto h-16 w-16 text-blue-600" />
          )}
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isResetMode ? 'Nova Senha' : 'Recuperar Senha'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isResetMode 
              ? 'Digite sua nova senha' 
              : 'Digite seu email para receber o link de recuperação'
            }
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {isResetMode ? 'Definir Nova Senha' : 'Solicitar Recuperação'}
            </CardTitle>
            <CardDescription>
              {isResetMode 
                ? 'Crie uma senha segura para sua conta'
                : 'Enviaremos um link de recuperação por email'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isResetMode ? (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="password">Nova Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite sua nova senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Digite novamente sua nova senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </>
            )}
            
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
              onClick={isResetMode ? handleUpdatePassword : handleRequestReset}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <Spinner size="sm" />
              ) : isResetMode ? (
                'Atualizar Senha'
              ) : (
                'Enviar Link de Recuperação'
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link to="/auth" className="inline-flex items-center text-blue-600 hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar ao Login
          </Link>
        </div>
      </div>
    </div>
  );
}; 