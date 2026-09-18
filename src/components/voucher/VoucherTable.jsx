import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import { formatCurrency, formatDate, getEffectiveStatus } from "@/lib/voucherUtils";

const FILTER_TABS = [
{ key: "todos", label: "Todos" },
{ key: "ativo", label: "Ativos" },
{ key: "resgatado", label: "Resgatados" },
{ key: "expirado", label: "Expirados" },
{ key: "cancelado", label: "Cancelados" }];


export default function VoucherTable({ vouchers, filter, onFilterChange, search, onSearchChange, onResgatar, onCancelar }) {
  return (
    <div className="flex flex-col rounded-[0.75rem] border border-stone-200 bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-stone-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <Input
            placeholder="Buscar por tipo ou valor..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="rounded-lg pl-9" />
          
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTER_TABS.map((tab) =>
          <button
            key={tab.key}
            onClick={() => onFilterChange(tab.key)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            filter === tab.key ?
            "bg-stone-900 text-white" :
            "bg-stone-100 text-stone-600 hover:bg-stone-200"}`
            }>
            
              {tab.label}
            </button>
          )}
        </div>
      </div>

      {/* Table - desktop */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 text-left text-xs uppercase tracking-wide text-stone-500">
              <th className="px-4 py-3 font-semibold">Nome</th>
              <th className="px-4 py-3 font-semibold text-left">Tipo</th>
              <th className="px-4 py-3 font-semibold">Valor</th>
              <th className="px-4 py-3 font-semibold">Emitida</th>
              <th className="px-4 py-3 font-semibold">Vencimento</th>
              <th className="px-4 py-3 font-semibold text-center">Status</th>
              <th className="px-4 py-3 font-semibold text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.length === 0 ?
            <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-stone-400">
                  Nenhum voucher encontrado.
                </td>
              </tr> :

            vouchers.map((v) => {
              const status = getEffectiveStatus(v);
              const canAct = status === "ativo";
              return (
                <tr key={v.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                    <td className="px-4 py-3 font-medium text-stone-900">{v.nome || "—"}</td>
                    <td className="px-4 py-3 text-stone-600">{v.tipo}</td>
                    <td className="px-4 py-3 font-semibold text-stone-900">{formatCurrency(v.valor)}</td>
                    <td className="px-4 py-3 text-stone-600">{formatDate(v.data_emitida)}</td>
                    <td className="px-4 py-3 text-stone-600">{formatDate(v.data_vencimento)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <Button
                        size="sm"
                        variant="outline"
                        disabled={!canAct}
                        onClick={() => onResgatar(v)}
                        className="h-7 rounded-md border-emerald-200 text-xs font-semibold text-emerald-700 hover:bg-emerald-50">
                        
                          Resgatar
                        </Button>
                        <Button
                        size="sm"
                        variant="outline"
                        disabled={!canAct}
                        onClick={() => onCancelar(v)}
                        className="h-7 rounded-md border-red-200 text-xs font-semibold text-red-700 hover:bg-red-50">
                        
                          Cancelar
                        </Button>
                      </div>
                    </td>
                  </tr>);

            })
            }
          </tbody>
        </table>
      </div>

      {/* Cards - mobile */}
      <div className="flex flex-col gap-3 p-4 lg:hidden">
        {vouchers.length === 0 ?
        <p className="py-8 text-center text-sm text-stone-400">Nenhum voucher encontrado.</p> :

        vouchers.map((v) => {
          const status = getEffectiveStatus(v);
          const canAct = status === "ativo";
          return (
            <div
              key={v.id}
              className="relative rounded-[0.75rem] border border-stone-200 bg-white p-4 shadow-sm">
              
                {/* Perforated edge */}
                <div className="absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[#F8F6F0]" style={{ boxShadow: "inset 0 0 0 1px #E7E5E4" }} />
                <div className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[#F8F6F0]" style={{ boxShadow: "inset 0 0 0 1px #E7E5E4" }} />
                <div className="border-b border-dashed border-stone-200 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">{v.tipo}</span>
                    <StatusBadge status={status} />
                  </div>
                  <p className="mt-1 font-display text-base font-bold text-stone-900">{v.nome || "Sem nome"}</p>
                  <p className="font-display text-2xl font-extrabold text-stone-900">{formatCurrency(v.valor)}</p>
                </div>
                <div className="flex items-center justify-between pt-3 text-xs text-stone-500">
                  <span>Emitido: {formatDate(v.data_emitida)}</span>
                  <span>Vence: {formatDate(v.data_vencimento)}</span>
                </div>
                {canAct &&
              <div className="mt-3 flex gap-2">
                    <Button
                  size="sm"
                  onClick={() => onResgatar(v)}
                  className="flex-1 rounded-md bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700">
                  
                      Resgatar
                    </Button>
                    <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCancelar(v)}
                  className="flex-1 rounded-md border-red-200 text-xs font-semibold text-red-700 hover:bg-red-50">
                  
                      Cancelar
                    </Button>
                  </div>
              }
              </div>);

        })
        }
      </div>
    </div>);

}