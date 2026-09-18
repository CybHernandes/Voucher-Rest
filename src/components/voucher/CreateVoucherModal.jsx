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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { TIPOS, calcVencimento, formatDate, todayISO, formatCurrency } from "@/lib/voucherUtils";
import { Ticket } from "lucide-react";

export default function CreateVoucherModal({ open, onOpenChange, onCreate }) {
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
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-display">
            <Ticket className="h-5 w-5 text-amber-600" />
            Gerar Novo Voucher
          </SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 pb-4">
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
                  <SelectItem key={t} value={t}>{t}</SelectItem>
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
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
            {nome || "Sem nome"} · {tipo} · Vence em {formatDate(vencimento)} · {formatCurrency(Number(valor) || 0)}
          </div>
          <SheetFooter>
            <Button
              type="submit"
              disabled={submitting || !nome || !valor || Number(valor) <= 0}
              className="w-full rounded-lg bg-amber-600 font-semibold text-white hover:bg-amber-700"
            >
              {submitting ? "Gerando..." : "Gerar Voucher"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}