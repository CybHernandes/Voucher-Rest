import React from "react";
import { formatCurrency, getEffectiveStatus } from "@/lib/voucherUtils";

export default function MetricCards({ vouchers = [] }) {
  const cards = [
    {
      label: "Vouchers ativos",
      value: vouchers.filter((voucher) => getEffectiveStatus(voucher) === "ativo").length,
      tone: "amber",
    },
    {
      label: "Resgatados",
      value: vouchers.filter((voucher) => getEffectiveStatus(voucher) === "resgatado").length,
      tone: "emerald",
    },
    {
      label: "Expirando em 15 dias",
      value: vouchers.filter((voucher) => {
        const status = getEffectiveStatus(voucher);
        return status === "ativo" && voucher.data_vencimento;
      }).length,
      tone: "red",
    },
  ];

  const tones = {
    amber: "border-amber-200 bg-amber-50 text-amber-900",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-900",
    red: "border-red-200 bg-red-50 text-red-900",
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className={`rounded-[0.75rem] border p-5 shadow-sm ${tones[card.tone]}`}>
          <p className="text-sm text-current/80">{card.label}</p>
          <p className="mt-3 text-3xl font-bold text-current">{card.value}</p>
          <p className="mt-2 text-xs font-medium text-current/80">
            {card.label === "Vouchers ativos" ? formatCurrency(vouchers.filter((voucher) => getEffectiveStatus(voucher) === "ativo").reduce((sum, voucher) => sum + Number(voucher.valor || 0), 0)) : "Última atualização agora"}
          </p>
        </div>
      ))}
    </div>
  );
}