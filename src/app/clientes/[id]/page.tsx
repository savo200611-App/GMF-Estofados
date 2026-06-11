import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { atualizarCliente, excluirCliente } from "../actions";
import { ClienteForm } from "../cliente-form";

const STATUS_LABEL: Record<string, string> = {
  novo: "Novo",
  orcado: "Orcado",
  fechado: "Fechado",
  producao: "Producao",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

function brl(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function ClienteDetalhePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const { id } = await params;
  const { erro } = await searchParams;
  const supabase = await createClient();

  const { data: cliente } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", id)
    .single();

  if (!cliente) notFound();

  const { data: pedidos } = await supabase
    .from("pedidos")
    .select("id, status, valor_total, created_at")
    .eq("cliente_id", id)
    .order("created_at", { ascending: false });

  const atualizar = atualizarCliente.bind(null, id);

  async function excluir() {
    "use server";
    await excluirCliente(id);
  }

  return (
    <main className="min-h-dvh bg-neutral-50">
      <header className="flex items-center gap-3 border-b border-neutral-200 bg-white px-6 py-4">
        <a
          href="/clientes"
          className="text-sm text-neutral-500 transition hover:text-neutral-900"
        >
          Clientes
        </a>
        <span className="text-neutral-300">/</span>
        <h1 className="text-lg font-semibold tracking-tight text-neutral-900">
          {cliente.nome}
        </h1>
      </header>

      <section className="mx-auto grid max-w-4xl gap-6 px-6 py-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-neutral-400">
              Dados do cliente
            </h2>
            {erro === "vinculado" && (
              <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                Este cliente tem pedidos vinculados e nao pode ser excluido.
              </p>
            )}
            <ClienteForm
              acao={atualizar}
              textoBotao="Salvar alteracoes"
              defaults={{
                nome: cliente.nome,
                telefone: cliente.telefone,
                email: cliente.email,
                cidade: cliente.cidade,
                endereco: cliente.endereco,
                origem: cliente.origem,
                observacoes: cliente.observacoes,
                consentimento_lgpd: cliente.consentimento_lgpd,
              }}
            />
          </div>

          <form action={excluir} className="mt-4">
            <button className="text-sm text-red-600 transition hover:text-red-700">
              Excluir cliente
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-neutral-400">
              Pedidos
            </h2>
            {!pedidos || pedidos.length === 0 ? (
              <p className="text-sm text-neutral-500">
                Nenhum pedido para este cliente ainda.
              </p>
            ) : (
              <ul className="space-y-3">
                {pedidos.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2"
                  >
                    <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-600">
                      {STATUS_LABEL[p.status] ?? p.status}
                    </span>
                    <span className="text-sm font-medium text-neutral-900">
                      {brl(p.valor_total)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export const dynamic = "force-dynamic";
