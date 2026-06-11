import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app-shell";
import { brl } from "@/lib/format";

export const dynamic = "force-dynamic";

async function sair() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data } = await supabase
    .from("profiles")
    .select("nome, papel")
    .eq("id", user.id)
    .single();
  const perfil = data as { nome: string; papel: string } | null;

  const [clientesRes, ativosRes, entreguesRes, abertoRes] = await Promise.all([
    supabase.from("clientes").select("*", { count: "exact", head: true }),
    supabase
      .from("pedidos")
      .select("*", { count: "exact", head: true })
      .in("status", ["novo", "orcado", "fechado", "producao"]),
    supabase
      .from("pedidos")
      .select("*", { count: "exact", head: true })
      .eq("status", "entregue"),
    supabase
      .from("pedidos")
      .select("valor_total")
      .in("status", ["novo", "orcado", "fechado", "producao"]),
  ]);

  const valorAberto = (abertoRes.data ?? []).reduce(
    (acc, p) => acc + p.valor_total,
    0,
  );

  const primeiroNome = (perfil?.nome ?? "").split(" ")[0] || "GMF";
  const inicial = primeiroNome.charAt(0).toUpperCase();

  return (
    <AppShell
      title="Painel"
      avatarLetter={inicial}
      action={
        <form action={sair}>
          <button className="text-xs text-mute transition hover:text-ink">
            Sair
          </button>
        </form>
      }
    >
      <p className="text-sm text-mute">
        Bem-vindo ao seu painel, {primeiroNome}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-gradient-to-br from-deep to-brand p-5 text-center">
          <p className="text-3xl font-semibold text-white">
            {clientesRes.count ?? 0}
          </p>
          <p className="mt-1 text-xs text-white/80">Clientes</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-deep to-brand p-5 text-center">
          <p className="text-3xl font-semibold text-white">
            {ativosRes.count ?? 0}
          </p>
          <p className="mt-1 text-xs text-white/80">Pedidos ativos</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-edge bg-surface p-5">
          <p className="text-xs text-mute">Em aberto</p>
          <p className="mt-1 text-lg font-semibold text-gold">
            {brl(valorAberto)}
          </p>
        </div>
        <div className="rounded-2xl border border-edge bg-surface p-5">
          <p className="text-xs text-mute">Entregues</p>
          <p className="mt-1 text-lg font-semibold text-ok">
            {entreguesRes.count ?? 0}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <a
          href="/pedidos/novo"
          className="flex items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3.5 text-sm font-medium text-white transition hover:bg-deep"
        >
          + Novo pedido
        </a>
        <a
          href="/clientes"
          className="flex items-center justify-between rounded-2xl bg-light px-5 py-3.5 text-sm font-medium text-neutral-900 transition hover:bg-white"
        >
          <span>Clientes</span>
          <span className="text-neutral-400">›</span>
        </a>
        <a
          href="/pedidos"
          className="flex items-center justify-between rounded-2xl bg-light px-5 py-3.5 text-sm font-medium text-neutral-900 transition hover:bg-white"
        >
          <span>Quadro de pedidos</span>
          <span className="text-neutral-400">›</span>
        </a>
        <a
          href="/catalogo"
          className="flex items-center justify-between rounded-2xl bg-light px-5 py-3.5 text-sm font-medium text-neutral-900 transition hover:bg-white"
        >
          <span>Catálogo</span>
          <span className="text-neutral-400">›</span>
        </a>
      </div>
    </AppShell>
  );
}
