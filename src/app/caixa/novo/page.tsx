import { AppShell } from "@/components/app-shell";
import { card } from "@/components/ui";
import { TIPOS, type TipoLancamento } from "@/lib/validations/lancamento";
import { LancamentoForm } from "../lancamento-form";

export default async function NovoLancamentoPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const { tipo } = await searchParams;
  const tipoInicial: TipoLancamento = TIPOS.includes(
    tipo as TipoLancamento,
  )
    ? (tipo as TipoLancamento)
    : "receita";

  return (
    <AppShell title="Novo lançamento">
      <a href="/caixa" className="text-sm text-mute transition hover:text-ink">
        ‹ Caixa
      </a>
      <div className={`mt-4 ${card} p-6`}>
        <LancamentoForm tipoInicial={tipoInicial} />
      </div>
    </AppShell>
  );
}
