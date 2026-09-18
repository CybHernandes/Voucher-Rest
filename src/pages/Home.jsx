import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">VoucherRest</p>
          <h1 className="mt-3 text-3xl font-bold text-stone-900">Dashboard</h1>
          <p className="mt-2 text-sm text-stone-600">
            A página inicial do app foi adicionada para completar o roteamento do projeto.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-stone-500">Vouchers ativos</p>
            <p className="mt-3 text-3xl font-bold text-stone-900">0</p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-stone-500">Resgatados</p>
            <p className="mt-3 text-3xl font-bold text-stone-900">0</p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-stone-500">Expirando em 15 dias</p>
            <p className="mt-3 text-3xl font-bold text-stone-900">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
