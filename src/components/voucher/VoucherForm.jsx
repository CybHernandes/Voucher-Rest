import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TIPOS, calcVencimento, formatDate, todayISO, formatCurrency } from "@/lib/voucherUtils";
import { Ticket, Calendar, CalendarClock } from "lucide-react";

export default function VoucherForm({ onCreate }) {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("Comum");
  const [valor, setValor] = useState("");
  const [dataEmitida, setDataEmitida] = useState(todayISO());
  const [submitting, setSubmitting] = useState(false);

  const vencimento = calcVencimento(dataEmitida);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nome || !valor || Number(valor) <= 0) return;
    setSubmitting(true);
    try {
      await onCreate({
        nome,
        tipo,
        valor: Number(valor),
        data_emitida: dataEmitida,
        data_vencimento: vencimento,
        status: "ativo",
      });
      setNome("");
      setValor("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-[0.75rem] border border-stone-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <Ticket className="h-5 w-5 text-amber-600" />
        <h2 className="font-display text-lg font-bold text-stone-900">Novo Voucher</h2>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-stone-500">Nome</Label>
        <Input
          placeholder="Ex.: Voucher Aniversário Maria"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="rounded-lg"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-stone-500">Tipo</Label>
        <Select value={tipo} onValueChange={setTipo}>
          <SelectTrigger className="rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIPOS.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-stone-500">Valor (R$)</Label>
        <Input
          type="number"
          min="0"
          step="0.01"
          placeholder="0,00"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="rounded-lg"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-stone-500">Data Emitida</Label>
        <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-700">
          <Calendar className="h-4 w-4 text-stone-400" />
          {formatDate(dataEmitida)}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-stone-500">Vencimento (+90 dias)</Label>
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
          <CalendarClock className="h-4 w-4 text-amber-600" />
          {formatDate(vencimento)}
        </div>
      </div>

      {/* Preview */}
      <div className="relative mt-1 overflow-hidden rounded-lg border border-dashed border-amber-300 bg-gradient-to-br from-amber-50 to-white p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-amber-700">Prévia</span>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">Ativo</span>
        </div>
        <p className="mt-2 font-display text-2xl font-extrabold text-stone-900">{formatCurrency(Number(valor) || 0)}</p>
        <p className="text-xs font-medium text-stone-500">{nome || "Sem nome"} · {tipo} · válido até {formatDate(vencimento)}</p>
      </div>

      <Button
        type="submit"
        disabled={submitting || !nome || !valor || Number(valor) <= 0}
        className="w-full rounded-lg bg-amber-600 text-sm font-semibold text-white hover:bg-amber-700"
      >
        {submitting ? "Gerando..." : "Gerar Voucher"}
      </Button>
    </form>
  );
}