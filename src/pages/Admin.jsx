import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency, formatDate, getEffectiveStatus, TIPOS } from '@/lib/voucherUtils';

const getToken = () => sessionStorage.getItem('voucher_rest_token');

const apiRequest = async (path, options = {}) => {
  const token = getToken();
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    const error = new Error(payload?.message || 'Request failed');
    error.status = response.status;
    throw error;
  }

  return payload;
};

const emptyForm = {
  nome: '',
  tipo: 'Comum',
  valor: '',
  data_emitida: new Date().toISOString().slice(0, 10),
  data_vencimento: new Date().toISOString().slice(0, 10),
  status: 'ativo',
};

export default function Admin() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const loadVouchers = async () => {
    try {
      setLoading(true);
      const payload = await apiRequest('/api/vouchers');
      setVouchers(payload.vouchers || []);
    } catch (err) {
      setError(err.message || 'Não foi possível carregar os vouchers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVouchers();
  }, []);

  const subtotal = useMemo(
    () => vouchers.reduce((sum, voucher) => sum + Number(voucher.valor || 0), 0),
    [vouchers]
  );

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.nome || !form.valor || Number(form.valor) <= 0) {
      setError('Preencha o nome e o valor corretamente.');
      return;
    }

    try {
      const payload = {
        ...form,
        valor: Number(form.valor),
      };

      if (editingId) {
        const response = await apiRequest(`/api/vouchers/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        setVouchers((current) => current.map((item) => item.id === editingId ? response.voucher : item));
      } else {
        const response = await apiRequest('/api/vouchers', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setVouchers((current) => [response.voucher, ...current]);
      }

      setForm(emptyForm);
      setEditingId(null);
    } catch (err) {
      setError(err.message || 'Não foi possível salvar o voucher.');
    }
  };

  const handleEdit = (voucher) => {
    setEditingId(voucher.id);
    setForm({
      nome: voucher.nome,
      tipo: voucher.tipo,
      valor: String(voucher.valor),
      data_emitida: voucher.data_emitida,
      data_vencimento: voucher.data_vencimento,
      status: voucher.status,
    });
  };

  const handleDelete = async (id) => {
    try {
      await apiRequest(`/api/vouchers/${id}`, { method: 'DELETE' });
      setVouchers((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message || 'Não foi possível excluir o voucher.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">Voucher Rest</p>
            <h1 className="mt-2 text-3xl font-bold text-stone-900">Administração</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => window.location.assign('/')}>
              Voltar ao menu
            </Button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Gerenciar</p>
              <h2 className="mt-2 text-xl font-bold text-stone-900">{editingId ? 'Editar voucher' : 'Novo voucher'}</h2>
            </div>

            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={form.nome} onChange={handleChange('nome')} placeholder="Nome do voucher" />
            </div>

            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={form.tipo} onValueChange={(value) => setForm((current) => ({ ...current, tipo: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Valor</Label>
              <Input type="number" min="0" step="0.01" value={form.valor} onChange={handleChange('valor')} />
            </div>

            <div className="space-y-2">
              <Label>Data emitida</Label>
              <Input type="date" value={form.data_emitida} onChange={handleChange('data_emitida')} />
            </div>

            <div className="space-y-2">
              <Label>Data vencimento</Label>
              <Input type="date" value={form.data_vencimento} onChange={handleChange('data_vencimento')} />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(value) => setForm((current) => ({ ...current, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="resgatado">Resgatado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                  <SelectItem value="expirado">Expirado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
            ) : null}

            <Button type="submit" className="w-full">
              {editingId ? 'Salvar alterações' : 'Adicionar voucher'}
            </Button>

            {editingId ? (
              <Button type="button" variant="outline" className="w-full" onClick={() => { setEditingId(null); setForm(emptyForm); setError(''); }}>
                Cancelar edição
              </Button>
            ) : null}
          </form>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Resumo</p>
                <h2 className="mt-2 text-xl font-bold text-stone-900">Lista de vouchers</h2>
              </div>
              <div className="rounded-lg bg-amber-50 px-3 py-2 text-right">
                <div className="text-xs uppercase tracking-wide text-stone-500">Total</div>
                <div className="text-lg font-bold text-stone-900">{formatCurrency(subtotal)}</div>
              </div>
            </div>

            {loading ? (
              <div className="py-10 text-center text-sm text-stone-500">Carregando vouchers...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs uppercase tracking-wide text-stone-500">
                      <th className="px-3 py-2">Nome</th>
                      <th className="px-3 py-2">Tipo</th>
                      <th className="px-3 py-2">Valor</th>
                      <th className="px-3 py-2">Venc.</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vouchers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-3 py-10 text-center text-stone-400">Nenhum voucher cadastrado.</td>
                      </tr>
                    ) : (
                      vouchers.map((voucher) => (
                        <tr key={voucher.id} className="border-b last:border-0">
                          <td className="px-3 py-3 font-medium text-stone-900">{voucher.nome}</td>
                          <td className="px-3 py-3 text-stone-600">{voucher.tipo}</td>
                          <td className="px-3 py-3">{formatCurrency(voucher.valor)}</td>
                          <td className="px-3 py-3 text-stone-600">{formatDate(voucher.data_vencimento)}</td>
                          <td className="px-3 py-3">
                            <span className="rounded-full bg-stone-100 px-2 py-1 text-xs font-semibold text-stone-700">
                              {getEffectiveStatus(voucher)}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleEdit(voucher)}>Editar</Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDelete(voucher.id)}>Excluir</Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
