import { createClient } from "@/lib/supabase/server";
import { brl } from "@/lib/format";
import { AppShell } from "@/components/app-shell";
import { card } from "@/components/ui";
import {
  CATEGORIA_LABEL,
  FORMA_LABEL,
} from "@/lib/validations/lancamento";
import { excluirLancamento } from "./actions";

export const dynamic = "force-dynamic";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function mesAtual() {
  return new Date().toLocaleDateString("sv-SE").slice(0, 7); // YYYY-MM
}

// Soma um mes (delta = +1 ou -1) a "YYYY-MM".
function deslocarMes(mes: string, delta: number) {
  const [ano, m] = mes.split("-").map(Number);
  const d = new Date(ano, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function rotuloMes(mes: string) {
  const [ano, m] = mes.split("-").map(Number);
  return `${MESES[m - 1]} de ${ano}`;
}

function ChevronMes({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}

export default async function CaixaPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>;
}) {
  const { mes: mesParam } = await searchParams;
  const mes = /^\d{4}-\d{2}$/.test(mesParam ?? "")
    ? (mesParam as string)
    : mesAtual();

  const inicio = `${mes}-01`;
  const proximo = `${deslocarMes(mes, 1)}-01`;

  const supabase = await createClient();
  const { data: lancamentos } = await supabase
    .from("lancamentos")
    .select(
      "id, tipo, categoria, descricao, valor, data, forma_pagamento",
    )
    .gte("data", inicio)
    .lt("data", proximo)
    .order("data", { ascending: false })
    .order("created_at", { ascending: false });

  const lista = lancamentos ?? [];
  const entradas = lista
    .filter((l) => l.tipo === "receita")
    .reduce((a, l) => a + l.valor, 0);
  const saidas = lista
    .filter((l) => l.tipo === "despesa")
    .reduce((a, l) => a + l.valor, 0);
  const saldo = entradas - saidas;

  async function excluir(formData: FormData) {
    "use server";
    await excluirLancamento(String(formData.get("id")));
  }

  return (
    <AppShell title="Caixa">
      {/* Navegacao de mes */}
      <div className="flex items-center justify-between">
        <a
          href={`/caixa?mes=${deslocarMes(mes, -1)}`}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-edge text-mute transition hover:text-ink hover:opacity-75"
        >
          <ChevronMes dir="left" />
        </a>
        <span className="text-[15px] font-bold text-ink">
          {rotuloMes(mes)}
        </span>
        <a
          href={`/caixa?mes=${deslocarMes(mes, 1)}`}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-edge text-mute transition hover:text-ink hover:opacity-75"
        >
          <ChevronMes dir="right" />
        </a>
      </div>

      {/* Saldo do mes */}
      <div
        className={`mt-4 rounded-[10px] border p-5 ${
          saldo >= 0
            ? "border-edge bg-surface"
            : "border-danger/40 bg-danger/5"
        }`}
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-mute">
          Saldo do mês
        </p>
        <p
          className={`mt-1.5 text-3xl font-extrabold ${
            saldo >= 0 ? "text-gold" : "text-[#e07a6e]"
          }`}
        >
          {brl(saldo)}
        </p>
      </div>

      {/* Entradas / Saidas */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className={`${card} p-4`}>
          <p className="text-xs font-semibold text-mute">Entradas</p>
          <p className="mt-1.5 text-[21px] font-extrabold text-ok">
            {brl(entradas)}
          </p>
        </div>
        <div className={`${card} p-4`}>
          <p className="text-xs font-semibold text-mute">Saídas</p>
          <p className="mt-1.5 text-[21px] font-extrabold text-[#e07a6e]">
            {brl(saidas)}
          </p>
        </div>
      </div>

      {/* Acoes rapidas */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <a
          href="/caixa/novo?tipo=receita"
          className="flex items-center justify-center rounded-md border-[1.5px] border-ok/50 bg-ok/10 py-3 text-[15px] font-semibold text-ok transition hover:opacity-75"
        >
          + Entrada
        </a>
        <a
          href="/caixa/novo?tipo=despesa"
          className="flex items-center justify-center rounded-md border-[1.5px] border-danger/40 bg-danger/10 py-3 text-[15px] font-semibold text-[#e07a6e] transition hover:opacity-75"
        >
          + Saída
        </a>
      </div>

      {/* Lista */}
      <div className="mt-6">
        {lista.length === 0 ? (
          <p className="rounded-lg border border-dashed border-edge px-6 py-12 text-center text-sm text-mute">
            Nenhum lançamento neste mês.
          </p>
        ) : (
          <ul className="space-y-2.5">
            {lista.map((l) => {
              const receita = l.tipo === "receita";
              const dia = new Date(
                l.data + "T12:00:00",
              ).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
              });
              const subtitulo = [
                CATEGORIA_LABEL[l.categoria] ?? l.categoria,
                l.forma_pagamento ? FORMA_LABEL[l.forma_pagamento] : null,
              ]
                .filter(Boolean)
                .join(" · ");
              return (
                <li
                  key={l.id}
                  className="flex items-center gap-3 rounded-md border border-edge bg-surface px-4 py-3"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-bold ${
                      receita
                        ? "bg-ok/15 text-ok"
                        : "bg-danger/15 text-[#e07a6e]"
                    }`}
                  >
                    {receita ? "+" : "−"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold text-ink">
                      {l.descricao || (CATEGORIA_LABEL[l.categoria] ?? l.categoria)}
                    </p>
                    <p className="mt-0.5 truncate text-xs font-medium text-mute">
                      {dia} · {subtitulo}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-[15px] font-bold ${
                      receita ? "text-ok" : "text-[#e07a6e]"
                    }`}
                  >
                    {receita ? "+" : "−"} {brl(l.valor)}
                  </span>
                  <form action={excluir} className="shrink-0">
                    <input type="hidden" name="id" value={l.id} />
                    <button
                      className="flex h-7 w-7 items-center justify-center rounded-md text-mute/60 transition hover:text-danger"
                      title="Excluir lançamento"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
