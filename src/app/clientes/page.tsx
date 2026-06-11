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
          className="rounded-xl bg-brand px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-deep"
        >
          + Novo
        </a>
      }
    >
      <form>
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Buscar por nome..."
          className={input}
        />
      </form>

      {!clientes || clientes.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-edge px-6 py-12 text-center text-sm text-mute">
          {q
            ? "Nenhum cliente encontrado para essa busca."
            : "Nenhum cliente cadastrado ainda."}
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {clientes.map((c) => (
            <a
              key={c.id}
              href={`/clientes/${c.id}`}
              className="flex items-center justify-between rounded-2xl bg-light px-5 py-3.5 transition hover:bg-white"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-neutral-900">
                  {c.nome}
                </p>
                <p className="truncate text-xs text-neutral-500">
                  {c.cidade ?? "Sem cidade"}
                  {c.telefone ? ` · ${c.telefone}` : ""}
                </p>
              </div>
              <div className="ml-3 flex shrink-0 items-center gap-3">
                <span className="rounded-full bg-black/10 px-2.5 py-0.5 text-xs text-neutral-700">
                  {ORIGEM_LABEL[c.origem]}
                </span>
                <span className="text-neutral-400">›</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </AppShell>
  );
}
