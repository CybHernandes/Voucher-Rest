import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, LogOut } from "lucide-react";
import VoucherForm from "@/components/voucher/VoucherForm";
import VoucherTable from "@/components/voucher/VoucherTable";
import ExpiringSoonBanner from "@/components/voucher/ExpiringSoonBanner";
import MetricCards from "@/components/voucher/MetricCards";
import { getEffectiveStatus, isExpiringSoon, todayISO } from "@/lib/voucherUtils";

const STORAGE_KEY = "voucher-rest-vouchers";

const createInitialVouchers = () => [
  {
    id: "v-1",
    nome: "Voucher Aniversário",
    tipo: "Comum",
    valor: 150,
    data_emitida: todayISO(),
    data_vencimento: "2026-10-20",
    status: "ativo",
  },
  {
    id: "v-2",
    nome: "Desconto de Boas-vindas",
    tipo: "Evento",
    valor: 80,
    data_emitida: "2026-09-01",
    data_vencimento: "2026-09-25",
    status: "ativo",
  },
  {
    id: "v-3",
    nome: "Cliente VIP",
    tipo: "Serviço",
    valor: 320,
    data_emitida: "2026-08-10",
    data_vencimento: "2026-09-15",
    status: "resgatado",
  },
  {
    id: "v-4",
    nome: "Promoção de encerramento",
    tipo: "Comum",
    valor: 200,
    data_emitida: "2026-07-01",
    data_vencimento: "2026-07-20",
    status: "cancelado",
  },
];

export default function Home() {
  const [vouchers, setVouchers] = useState(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) return JSON.parse(cached);
    } catch {
      // ignored
    }
    return createInitialVouchers();
  });
  const [filter, setFilter] = useState("todos");
  const [search, setSearch] = useState("");
  const [dismissedBanner, setDismissedBanner] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vouchers));
  }, [vouchers]);

  const filteredVouchers = useMemo(() => {
    const normalized = search.toLowerCase();

    return vouchers.filter((voucher) => {
      const status = getEffectiveStatus(voucher);
      const matchesFilter = filter === "todos" ? true : status === filter;
      const matchesSearch =
        !normalized ||
        voucher.nome?.toLowerCase().includes(normalized) ||
        voucher.tipo?.toLowerCase().includes(normalized) ||
        String(voucher.valor).includes(normalized);

      return matchesFilter && matchesSearch;
    });
  }, [filter, search, vouchers]);

  const expiringSoon = useMemo(
    () => vouchers.filter((voucher) => isExpiringSoon(voucher)),
    [vouchers]
  );

  const handleCreate = (payload) => {
    const newVoucher = {
      ...payload,
      id: `voucher-${Date.now()}`,
      status: "ativo",
    };

    setVouchers((current) => [newVoucher, ...current]);
  };

  const handleResgatar = (voucher) => {
    setVouchers((current) =>
      current.map((item) =>
        item.id === voucher.id ? { ...item, status: "resgatado" } : item
      )
    );
  };

  const handleCancelar = (voucher) => {
    setVouchers((current) =>
      current.map((item) =>
        item.id === voucher.id ? { ...item, status: "cancelado" } : item
      )
    );
  };

  const handleLogout = () => {
    sessionStorage.removeItem("voucher_rest_user");
    sessionStorage.removeItem("voucher_rest_token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-[1rem] border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">Voucher Rest</p>
              <h1 className="mt-3 text-3xl font-bold text-stone-900">Dashboard</h1>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={() => window.location.assign('/credenciais')} variant="outline" className="rounded-lg">
                Credenciais
              </Button>
              <Button onClick={handleLogout} variant="outline" className="rounded-lg border-stone-300 text-stone-700">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </header>

        {!dismissedBanner && expiringSoon.length > 0 && (
          <ExpiringSoonBanner vouchers={expiringSoon} onDismiss={() => setDismissedBanner(true)} />
        )}

        <MetricCards vouchers={vouchers} />

        <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
          <VoucherForm onCreate={handleCreate} />

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">Fluxo</p>
                <h2 className="mt-1 text-2xl font-bold text-stone-900">Vouchers</h2>
              </div>

              <Button onClick={() => window.location.assign('/')} className="rounded-lg bg-amber-600 text-white hover:bg-amber-700">
                <Plus className="mr-2 h-4 w-4" />
                Novo voucher
              </Button>
            </div>

            <VoucherTable
              vouchers={filteredVouchers}
              filter={filter}
              onFilterChange={setFilter}
              search={search}
              onSearchChange={setSearch}
              onResgatar={handleResgatar}
              onCancelar={handleCancelar}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
