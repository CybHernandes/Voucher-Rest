import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.password) {
      setError('Preencha todos os campos para continuar.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || 'Não foi possível criar a conta.');
      }

      sessionStorage.setItem('voucher_rest_user', JSON.stringify(payload.user));
      sessionStorage.setItem('voucher_rest_token', payload.token);
      window.location.assign('/');
    } catch (err) {
      setError(err.message || 'Não foi possível criar a conta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Voucher Rest</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Criar conta</h1>
          <p className="mt-2 text-sm text-slate-600">Cadastre-se para começar a gestão.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" placeholder="Seu nome" value={form.name} onChange={handleChange('name')} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="seu@email.com" value={form.email} onChange={handleChange('email')} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange('password')} required />
          </div>

          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
          ) : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Criando conta...' : 'Cadastrar'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Já tem conta?{' '}
          <Link to="/login" className="font-semibold text-slate-900 underline-offset-4 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
