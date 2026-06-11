import { createClient } from "@/lib/supabase/server";
import { KanbanBoard, type PedidoCard } from "./kanban-board";

export const dynamic = "force-dynamic";

export default async function PedidosPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pedidos")
    .select("id, valor_total, status, clientes(nome)")
    .order("created_at", { ascending: false });

  const cards: PedidoCard[] = (data ?? []).map((p) => {
    const cliente = p.clientes as { nome: string } | null;
    return {
      id: p.id,
      valor_total: p.valor_total,
      status: p.status,
      cliente_nome: cliente?.nome ?? "Sem cliente",
    };
  });

  return (
    <main className="min-h-dvh bg-neutral-50">
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="text-sm text-neutral-500 transition hover:text-neutral-900"
          >
            Inicio
          </a>
          <span className="text-neutral-300">/</span>
          <h1 className="text-lg font-semibold tracking-tight text-neutral-900">
            Pedidos
          </h1>
        </div>
        <a
          href="/pedidos/novo"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          Novo pedido
        </a>
      </header>

      <section className="px-6 py-8">
        {cards.length === 0 ? (
          <p className="mx-auto max-w-md rounded-2xl border border-dashed border-neutral-300 px-6 py-12 text-center text-sm text-neutral-500">
            Nenhum pedido ainda. Crie o primeiro para comecar o fluxo.
          </p>
        ) : (
          <KanbanBoard inicial={cards} />
        )}
      </section>
    </main>
  );
}
