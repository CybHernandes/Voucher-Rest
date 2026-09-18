import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { formatCurrency, formatDate, daysUntilVencimento } from "@/lib/voucherUtils";

export default function ExpiringSoonBanner({ vouchers, onDismiss }) {
  if (!vouchers || vouchers.length === 0) return null;

  return (
    <div className="mb-4 rounded-[0.75rem] border border-amber-300 bg-amber-50 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-700" />
          </div>
          <div>
            <p className="font-display text-sm font-bold text-amber-900">
              {vouchers.length} {vouchers.length === 1 ? "voucher expira em breve" : "vouchers expiram em breve"}
            </p>
            <p className="mt-0.5 text-xs text-amber-700">
              Vouchers ativos com vencimento nos próximos 15 dias
            </p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="rounded-md p-1 text-amber-600 hover:bg-amber-100"
          aria-label="Fechar alerta"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {vouchers.map((v) => {
          const days = daysUntilVencimento(v);
          return (
            <span
              key={v.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-white px-2.5 py-1 text-xs font-medium text-amber-800"
            >
              <span className="font-semibold">{v.tipo}</span>
              <span className="text-amber-500">·</span>
              {formatCurrency(v.valor)}
              <span className="text-amber-500">·</span>
              <span className={days <= 3 ? "font-bold text-red-600" : "text-amber-700"}>
                {days === 0 ? "vence hoje" : days === 1 ? "vence amanhã" : `em ${days} dias`}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}