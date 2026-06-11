import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { ORIGEM_LABEL } from "@/lib/validations/cliente";

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
            Clientes
          </h1>
        </div>
        <a
          href="/clientes/novo"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          Novo cliente
        </a>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-8">
        <form className="mb-6">
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Buscar por nome..."
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
          />
        </form>

        {!clientes || clientes.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-neutral-300 px-6 py-12 text-center text-sm text-neutral-500">
            {q
              ? "Nenhum cliente encontrado para essa busca."
              : "Nenhum cliente cadastrado ainda."}
          </p>
        ) : (
          <ul className="divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            {clientes.map((c) => (
              <li key={c.id}>
                <a
                  href={`/clientes/${c.id}`}
                  className="flex items-center justify-between px-5 py-4 transition hover:bg-neutral-50"
                >
                  <div>
                    <p className="font-medium text-neutral-900">{c.nome}</p>
                    <p className="text-sm text-neutral-500">
                      {c.cidade ?? "Sem cidade"}
                      {c.telefone ? ` - ${c.telefone}` : ""}
                    </p>
                  </div>
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600">
                    {ORIGEM_LABEL[c.origem]}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
