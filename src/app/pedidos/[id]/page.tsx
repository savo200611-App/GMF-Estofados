import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { brl } from "@/lib/format";
import { AppShell } from "@/components/app-shell";
import { card, STATUS_CHIP } from "@/components/ui";
import { excluirPedido } from "../actions";
import { AcoesPedido } from "./acoes-pedido";

export const dynamic = "force-dynamic";

export default async function PedidoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: pedido } = await supabase
    .from("pedidos")
    .select(
      "id, status, valor_total, observacoes, data_entrega_prevista, clientes(id, nome, telefone, email)",
    )
    .eq("id", id)
    .single();

  if (!pedido) notFound();

  const { data: itens } = await supabase
    .from("pedido_itens")
    .select(
      "id, descricao_medida, extras, quantidade, preco_unitario, modelos(nome)",
    )
    .eq("pedido_id", id);

  const cliente = pedido.clientes as {
    id: string;
    nome: string;
    telefone: string | null;
    email: string | null;
  } | null;

  const chip = STATUS_CHIP[pedido.status] ?? {
    label: pedido.status,
    cls: "bg-raise text-mute",
  };

  async function excluir() {
    "use server";
    await excluirPedido(id);
  }

  return (
    <AppShell title="Pedido">
      <div className="flex items-center justify-between">
        <a
          href="/pedidos"
          className="text-sm text-mute transition hover:text-ink"
        >
          ‹ Pedidos
        </a>
        <span className={`rounded-full px-3 py-1 text-xs ${chip.cls}`}>
          {chip.label}
        </span>
      </div>

      {cliente && (
        <a
          href={`/clientes/${cliente.id}`}
          className="mt-4 flex items-center gap-3.5 rounded-md border border-edge bg-surface px-4 py-3.5 transition hover:opacity-75"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bar font-serif text-base font-bold text-gold">
            {cliente.nome.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-bold text-ink">
              {cliente.nome}
            </p>
            {cliente.telefone && (
              <p className="mt-0.5 text-xs font-medium text-mute">
                {cliente.telefone}
              </p>
            )}
          </div>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ddb85f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </a>
      )}

      <div className={`mt-4 overflow-hidden ${card}`}>
        <table className="w-full text-sm">
          <thead className="border-b border-edge text-left text-mute">
            <tr>
              <th className="px-5 py-3 font-medium">Item</th>
              <th className="px-5 py-3 font-medium">Qtd</th>
              <th className="px-5 py-3 text-right font-medium">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-edge/60">
            {(itens ?? []).map((it) => {
              const modelo = it.modelos as { nome: string } | null;
              return (
                <tr key={it.id}>
                  <td className="px-5 py-3">
                    <p className="font-medium text-ink">
                      {modelo?.nome ?? "Modelo removido"}
                    </p>
                    <p className="text-xs text-mute">
                      {[it.descricao_medida, it.extras]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-mute">{it.quantidade}</td>
                  <td className="px-5 py-3 text-right text-ink">
                    {brl(it.preco_unitario * it.quantidade)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="border-t border-edge">
            <tr>
              <td colSpan={2} className="px-5 py-3 font-medium text-mute">
                Total
              </td>
              <td className="px-5 py-3 text-right text-lg font-semibold text-gold">
                {brl(pedido.valor_total)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {pedido.observacoes && (
        <div className={`mt-4 ${card} p-5`}>
          <p className="text-xs font-medium uppercase tracking-wide text-mute">
            Observações
          </p>
          <p className="mt-1 text-sm text-ink">{pedido.observacoes}</p>
        </div>
      )}

      <div className="mt-6">
        <AcoesPedido
          pedidoId={id}
          emailCliente={cliente?.email ?? null}
        />
      </div>

      <form action={excluir} className="mt-4">
        <button className="text-sm text-danger/80 transition hover:text-danger">
          Excluir pedido
        </button>
      </form>
    </AppShell>
  );
}
