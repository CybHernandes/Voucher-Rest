import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';
import { safeReturnTo } from '@/lib/authReturnTo';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await base44.auth.loginViaEmailPassword(email, password);
      if (result?.access_token) {
        const target = safeReturnTo();
        window.location.assign(target || '/');
        return;
      }

      setError('Não foi possível concluir o login. Verifique suas credenciais.');
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Erro ao fazer login.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProviderLogin = (provider) => {
    const returnTo = safeReturnTo();
    const nextUrl = new URL(returnTo, window.location.origin).toString();
    base44.auth.loginWithProvider(provider, nextUrl);
  };

  const handleGoToRegister = () => {
    const returnTo = safeReturnTo();
    navigate(`/register${location.search || ''}`);
    if (returnTo && returnTo !== '/') {
      const search = new URLSearchParams(location.search);
      search.set('returnTo', returnTo);
      navigate(`/register?${search.toString()}`, { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Voucher Rest</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Entrar</h1>
          <p className="mt-2 text-sm text-slate-600">Acesse sua conta para continuar.</p>
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full justify-center"
            onClick={() => handleProviderLogin('google')}
          >
            Continuar com Google
          </Button>
        </div>

        <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-400">
          <div className="h-px flex-1 bg-slate-200" />
          ou
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Link to="/forgot-password" className="text-xs font-medium text-slate-600 hover:text-slate-900">
                Esqueci minha senha
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Ainda não tem conta?{' '}
          <button
            type="button"
            onClick={handleGoToRegister}
            className="font-semibold text-slate-900 underline-offset-4 hover:underline"
          >
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
}
