import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app-shell";
import { brl } from "@/lib/format";

export const dynamic = "force-dynamic";

function Chevron() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ddb85f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

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

  const atalhos = [
    { nome: "Clientes", href: "/clientes" },
    { nome: "Quadro de pedidos", href: "/pedidos" },
    { nome: "Catálogo", href: "/catalogo" },
  ];

  return (
    <AppShell
      title="Painel"
      avatarLetter={inicial}
      action={
        <form action={sair}>
          <button className="text-sm font-medium text-mute transition hover:opacity-75">
            Sair
          </button>
        </form>
      }
    >
      <p className="text-[15px] text-mute">
        Bem-vindo ao seu painel,{" "}
        <span className="font-semibold text-ink">{primeiroNome}</span>
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-[10px] bg-gradient-to-br from-[#e3c878] via-goldeep to-[#8c6b29] p-4.5 text-center">
          <p className="text-3xl font-extrabold text-[#1a130a]">
            {clientesRes.count ?? 0}
          </p>
          <p className="mt-2 text-[13px] font-semibold text-[#3a2a0e]">
            Clientes
          </p>
        </div>
        <div className="rounded-[10px] bg-gradient-to-br from-[#e3c878] via-goldeep to-[#8c6b29] p-4.5 text-center">
          <p className="text-3xl font-extrabold text-[#1a130a]">
            {ativosRes.count ?? 0}
          </p>
          <p className="mt-2 text-[13px] font-semibold text-[#3a2a0e]">
            Pedidos ativos
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-[10px] border border-edge bg-surface p-4">
          <p className="text-xs font-semibold text-mute">Em aberto</p>
          <p className="mt-2 text-[21px] font-extrabold text-gold">
            {brl(valorAberto)}
          </p>
        </div>
        <div className="rounded-[10px] border border-edge bg-surface p-4">
          <p className="text-xs font-semibold text-mute">Entregues</p>
          <p className="mt-2 text-[21px] font-extrabold text-ink">
            {entreguesRes.count ?? 0}
          </p>
        </div>
      </div>

      <a
        href="/pedidos/novo"
        className="mt-5 flex items-center justify-center rounded-md bg-gold py-4 text-[15px] font-bold text-[#1a130a] transition hover:opacity-75"
      >
        + Novo pedido
      </a>

      <div className="mt-3.5 space-y-2.5">
        {atalhos.map((a) => (
          <a
            key={a.href}
            href={a.href}
            className="flex items-center justify-between rounded-md border border-edge bg-surface px-4.5 py-4 transition hover:opacity-75"
          >
            <span className="text-[15px] font-semibold text-ink">
              {a.nome}
            </span>
            <Chevron />
          </a>
        ))}
      </div>
    </AppShell>
  );
}
