import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app-shell";
import { PedidoBuilder } from "../pedido-builder";

export const dynamic = "force-dynamic";

export default async function NovoPedidoPage() {
  const supabase = await createClient();
  const [{ data: clientes }, { data: modelos }] = await Promise.all([
    supabase.from("clientes").select("id, nome").order("nome"),
    supabase
      .from("modelos")
      .select("id, nome, preco_base")
      .eq("ativo", true)
      .order("nome"),
  ]);

  return (
    <AppShell title="Novo pedido">
      <a
        href="/pedidos"
        className="text-sm text-mute transition hover:text-ink"
      >
        ‹ Pedidos
      </a>
      <div className="mt-4">
        {!clientes || clientes.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-edge px-6 py-12 text-center text-sm text-mute">
            Cadastre um cliente antes de criar um pedido.
          </p>
        ) : (
          <PedidoBuilder clientes={clientes} modelos={modelos ?? []} />
        )}
      </div>
    </AppShell>
  );
}
