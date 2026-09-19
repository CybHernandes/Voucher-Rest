import React, { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const initialCredentials = [
  { id: 1, label: 'API Key', value: 'voucher_rest_dev_key_01', status: 'Ativa' },
  { id: 2, label: 'Token de integração', value: 'vrest_int_8492', status: 'Ativa' },
  { id: 3, label: 'Webhook secret', value: 'whsec_73afca94e3', status: 'Rotativa' },
];

export default function Credentials() {
  const [items, setItems] = useState(initialCredentials);
  const [selectedId, setSelectedId] = useState(initialCredentials[0].id);
  const [revealedIds, setRevealedIds] = useState([]);

  const selected = useMemo(
    () => items.find((item) => item.id === selectedId) || items[0],
    [items, selectedId]
  );

  const rotateSecret = () => {
    setItems((current) =>
      current.map((item) =>
        item.id === selectedId
          ? { ...item, value: `${item.value.slice(0, 8)}_${Date.now().toString().slice(-4)}`, status: 'Rotativa' }
          : item
      )
    );
  };

  const toggleReveal = (itemId) => {
    setRevealedIds((current) =>
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId]
    );
  };

  const isRevealed = (itemId) => revealedIds.includes(itemId);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">Voucher Rest</p>
              <h1 className="mt-3 text-3xl font-bold text-slate-900">Credenciais</h1>
              <p className="mt-2 text-sm text-slate-600">Gerencie as chaves e tokens do sistema.</p>
            </div>

            <button
              type="button"
              onClick={() => window.location.assign('/')}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao menu
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Itens</p>
            <div className="space-y-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left transition ${
                    selectedId === item.id
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="font-medium">{item.label}</span>
                  <span className="text-xs opacity-80">{item.status}</span>
                </button>
              ))}
            </div>
          </aside>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <p className="text-sm text-slate-500">Selecionado</p>
                <h2 className="text-2xl font-semibold text-slate-900">{selected.label}</h2>
              </div>
              <button
                type="button"
                onClick={rotateSecret}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Rotacionar
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-700">Valor</p>
                  <button
                    type="button"
                    onClick={() => toggleReveal(selected.id)}
                    className="text-xs font-medium text-slate-600 underline-offset-4 hover:underline"
                  >
                    {isRevealed(selected.id) ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-700">
                  {isRevealed(selected.id) ? selected.value : '••••••••••••••••••'}
                </div>
              </div>

              <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
                Mantenha este valor em segredo e rotacione periodicamente para maior segurança.
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
