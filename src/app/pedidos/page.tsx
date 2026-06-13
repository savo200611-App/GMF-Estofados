import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app-shell";
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
    <AppShell
      title="Pedidos"
      action={
        <a
          href="/pedidos/novo"
          className="rounded-md bg-gold px-3.5 py-2 text-sm font-semibold text-[#1a130a] transition hover:opacity-75"
        >
          + Novo
        </a>
      }
    >
      {cards.length === 0 ? (
        <p className="mx-auto max-w-md rounded-2xl border border-dashed border-edge px-6 py-12 text-center text-sm text-mute">
          Nenhum pedido ainda. Crie o primeiro para começar o fluxo.
        </p>
      ) : (
        <KanbanBoard inicial={cards} />
      )}
    </AppShell>
  );
}
