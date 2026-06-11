import { createClient } from "@/lib/supabase/server";
import { PedidoBuilder } from "../pedido-builder";

export const dynamic = "force-dynamic";

export default async function NovoPedidoPage() {
  const supabase = await createClient();
  const [{ data: clientes }, { data: modelos }, { data: tecidos }] =
    await Promise.all([
      supabase.from("clientes").select("id, nome").order("nome"),
      supabase
        .from("modelos")
        .select("id, nome, preco_base")
        .eq("ativo", true)
        .order("nome"),
      supabase
        .from("tecidos")
        .select("id, nome, acrescimo_preco")
        .eq("ativo", true)
        .order("nome"),
    ]);

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
          Novo pedido
        </h1>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-8">
        {!clientes || clientes.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-neutral-300 px-6 py-12 text-center text-sm text-neutral-500">
            Cadastre um cliente antes de criar um pedido.
          </p>
        ) : (
          <PedidoBuilder
            clientes={clientes}
            modelos={modelos ?? []}
            tecidos={tecidos ?? []}
          />
        )}
      </section>
    </main>
  );
}
