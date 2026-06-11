import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { brl } from "@/lib/format";
import { excluirPedido } from "../actions";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  novo: "Novo",
  orcado: "Orcado",
  fechado: "Fechado",
  producao: "Producao",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

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
      "id, status, valor_total, observacoes, data_entrega_prevista, clientes(id, nome, telefone)",
    )
    .eq("id", id)
    .single();

  if (!pedido) notFound();

  const { data: itens } = await supabase
    .from("pedido_itens")
    .select(
      "id, descricao_medida, extras, quantidade, preco_unitario, modelos(nome), tecidos(nome)",
    )
    .eq("pedido_id", id);

  const cliente = pedido.clientes as {
    id: string;
    nome: string;
    telefone: string | null;
  } | null;

  async function excluir() {
    "use server";
    await excluirPedido(id);
  }

  return (
    <main className="min-h-dvh bg-neutral-50">
      <header className="flex items-center gap-3 border-b border-neutral-200 bg-white px-6 py-4">
        <a
          href="/pedidos"
          className="text-sm text-neutral-500 transition hover:text-neutral-900"
        >
          Pedidos
        </a>
        <span className="text-neutral-300">/</span>
        <h1 className="text-lg font-semibold tracking-tight text-neutral-900">
          {cliente?.nome ?? "Pedido"}
        </h1>
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600">
          {STATUS_LABEL[pedido.status] ?? pedido.status}
        </span>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-8">
        {cliente && (
          <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-5">
            <p className="font-medium text-neutral-900">{cliente.nome}</p>
            {cliente.telefone && (
              <p className="text-sm text-neutral-500">{cliente.telefone}</p>
            )}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-200 text-left text-neutral-500">
              <tr>
                <th className="px-5 py-3 font-medium">Item</th>
                <th className="px-5 py-3 font-medium">Qtd</th>
                <th className="px-5 py-3 text-right font-medium">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {(itens ?? []).map((it) => {
                const modelo = it.modelos as { nome: string } | null;
                const tecido = it.tecidos as { nome: string } | null;
                return (
                  <tr key={it.id}>
                    <td className="px-5 py-3">
                      <p className="font-medium text-neutral-900">
                        {modelo?.nome ?? "Modelo removido"}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {[
                          tecido?.nome,
                          it.descricao_medida,
                          it.extras,
                        ]
                          .filter(Boolean)
                          .join(" - ")}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-neutral-700">
                      {it.quantidade}
                    </td>
                    <td className="px-5 py-3 text-right text-neutral-900">
                      {brl(it.preco_unitario * it.quantidade)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="border-t border-neutral-200">
              <tr>
                <td colSpan={2} className="px-5 py-3 font-medium text-neutral-700">
                  Total
                </td>
                <td className="px-5 py-3 text-right text-lg font-semibold text-neutral-900">
                  {brl(pedido.valor_total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {pedido.observacoes && (
          <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-5">
            <p className="text-sm font-medium text-neutral-700">Observacoes</p>
            <p className="mt-1 text-sm text-neutral-600">{pedido.observacoes}</p>
          </div>
        )}

        <form action={excluir} className="mt-4">
          <button className="text-sm text-red-600 transition hover:text-red-700">
            Excluir pedido
          </button>
        </form>
      </section>
    </main>
  );
}
