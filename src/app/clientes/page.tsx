import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { ORIGEM_LABEL } from "@/lib/validations/cliente";
import { AppShell } from "@/components/app-shell";
import { input } from "@/components/ui";

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("clientes")
    .select("id, nome, telefone, cidade, origem")
    .order("nome", { ascending: true });

  if (q && q.trim()) query = query.ilike("nome", `%${q.trim()}%`);

  const { data: clientes, error } = await query;
  if (error) redirect("/login");

  return (
    <AppShell
      title="Clientes"
      action={
        <a
          href="/clientes/novo"
          className="rounded-md bg-gold px-3.5 py-2 text-sm font-semibold text-[#1a130a] transition hover:opacity-75"
        >
          + Novo
        </a>
      }
    >
      <form>
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Buscar por nome…"
          className={input}
        />
      </form>

      {!clientes || clientes.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-edge px-6 py-12 text-center text-sm text-mute">
          {q
            ? "Nenhum cliente encontrado para essa busca."
            : "Nenhum cliente cadastrado ainda."}
        </p>
      ) : (
        <div className="mt-5 space-y-2.5">
          {clientes.map((c) => (
            <a
              key={c.id}
              href={`/clientes/${c.id}`}
              className="flex items-center gap-3.5 rounded-md border border-edge bg-surface px-4 py-3.5 transition hover:opacity-75"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bar font-serif text-base font-bold text-gold">
                {c.nome.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold text-ink">
                  {c.nome}
                </p>
                <p className="mt-0.5 truncate text-xs font-medium text-mute">
                  {c.cidade ?? "Sem cidade"}
                  {c.telefone ? ` · ${c.telefone}` : ""}
                </p>
              </div>
              <span className="shrink-0 rounded-md bg-raise px-2.5 py-1.5 text-xs font-semibold text-mute">
                {ORIGEM_LABEL[c.origem]}
              </span>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ddb85f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </a>
          ))}
        </div>
      )}
    </AppShell>
  );
}
