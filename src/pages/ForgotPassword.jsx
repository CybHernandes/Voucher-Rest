import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Voucher Rest</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Recuperar senha</h1>
          <p className="mt-2 text-sm text-slate-600">Informe seu e-mail para receber instruções.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>

          {submitted ? (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              Enviamos as instruções para {email || 'seu e-mail'}.
            </div>
          ) : null}

          <Button type="submit" className="w-full">
            Enviar link
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
