import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { brl } from "@/lib/format";
import { AppShell } from "@/components/app-shell";
import { card, STATUS_CHIP } from "@/components/ui";
import { atualizarCliente, excluirCliente } from "../actions";
import { ClienteForm } from "../cliente-form";

export const dynamic = "force-dynamic";

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
    <AppShell title={cliente.nome}>
      <a
        href="/clientes"
        className="text-sm text-mute transition hover:text-ink"
      >
        ‹ Clientes
      </a>

      <div className="mt-4 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className={`${card} p-6`}>
            <h2 className="mb-4 text-xs font-medium uppercase tracking-wide text-mute">
              Dados do cliente
            </h2>
            {erro === "vinculado" && (
              <p className="mb-4 rounded-xl bg-danger/15 px-3 py-2 text-sm text-danger">
                Este cliente tem pedidos vinculados e não pode ser excluído.
              </p>
            )}
            <ClienteForm
              acao={atualizar}
              textoBotao="Salvar alterações"
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
            <button className="text-sm text-danger/80 transition hover:text-danger">
              Excluir cliente
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className={`${card} p-6`}>
            <h2 className="mb-4 text-xs font-medium uppercase tracking-wide text-mute">
              Pedidos
            </h2>
            {!pedidos || pedidos.length === 0 ? (
              <p className="text-sm text-mute">
                Nenhum pedido para este cliente ainda.
              </p>
            ) : (
              <ul className="space-y-3">
                {pedidos.map((p) => {
                  const chip = STATUS_CHIP[p.status] ?? {
                    label: p.status,
                    cls: "bg-raise text-mute",
                  };
                  return (
                    <li key={p.id}>
                      <a
                        href={`/pedidos/${p.id}`}
                        className="flex items-center justify-between rounded-xl border border-edge bg-raise px-3 py-2.5 transition hover:border-brand"
                      >
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs ${chip.cls}`}
                        >
                          {chip.label}
                        </span>
                        <span className="text-sm font-medium text-ink">
                          {brl(p.valor_total)}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
