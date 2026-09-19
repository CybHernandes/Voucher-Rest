import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Preencha os dois campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas precisam coincidir.');
      return;
    }

    setSuccess(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Voucher Rest</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Nova senha</h1>
          <p className="mt-2 text-sm text-slate-600">Digite e confirme a nova senha.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Nova senha</Label>
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <Input id="confirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
          </div>

          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
          ) : null}

          {success ? (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              Senha redefinida com sucesso.
            </div>
          ) : null}

          <Button type="submit" className="w-full">
            Salvar nova senha
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          <Link to="/login" className="font-semibold text-slate-900 underline-offset-4 hover:underline">
            Voltar para login
          </Link>
        </p>
      </div>
    </div>
  );
}
