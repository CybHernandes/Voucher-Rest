import { format, addDays, isPast, parseISO, differenceInCalendarDays } from "date-fns";
import { ptBR } from "date-fns/locale";

export const TIPOS = ["Comum", "Evento", "Serviço"];

export const STATUS_LABELS = {
  ativo: "Ativo",
  resgatado: "Resgatado",
  cancelado: "Cancelado",
  expirado: "Expirado",
};

export const STATUS_STYLES = {
  ativo: "bg-amber-100 text-amber-800 border-amber-200",
  resgatado: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelado: "bg-stone-200 text-stone-600 border-stone-300",
  expirado: "bg-red-100 text-red-700 border-red-200",
};

export function calcVencimento(dataEmitida) {
  if (!dataEmitida) return "";
  return format(addDays(parseISO(dataEmitida), 90), "yyyy-MM-dd");
}

export function getEffectiveStatus(voucher) {
  if (voucher.status !== "ativo") return voucher.status;
  if (voucher.data_vencimento && isPast(parseISO(voucher.data_vencimento))) {
    return "expirado";
  }
  return "ativo";
}

export function formatCurrency(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor || 0);
}

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return format(parseISO(dateStr), "dd/MM/yyyy", { locale: ptBR });
  } catch {
    return dateStr;
  }
}

export function todayISO() {
  return format(new Date(), "yyyy-MM-dd");
}

export function daysUntilVencimento(voucher) {
  if (!voucher.data_vencimento) return Infinity;
  const diff = differenceInCalendarDays(parseISO(voucher.data_vencimento), new Date());
  return diff;
}

export const EXPIRING_SOON_DAYS = 15;

export function isExpiringSoon(voucher) {
  if (getEffectiveStatus(voucher) !== "ativo") return false;
  const days = daysUntilVencimento(voucher);
  return days >= 0 && days <= EXPIRING_SOON_DAYS;
}