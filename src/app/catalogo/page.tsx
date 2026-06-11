import { createClient } from "@/lib/supabase/server";

export default async function CatalogoPage() {
  const supabase = await createClient();
  const [{ count: nModelos }, { count: nTecidos }] = await Promise.all([
    supabase.from("modelos").select("*", { count: "exact", head: true }),
    supabase.from("tecidos").select("*", { count: "exact", head: true }),
  ]);

  const cards = [
    {
      nome: "Modelos",
      descricao: "Sofas e poltronas do catalogo",
      total: nModelos ?? 0,
      href: "/catalogo/modelos",
    },
    {
      nome: "Tecidos",
      descricao: "Tecidos e acrescimos de preco",
      total: nTecidos ?? 0,
      href: "/catalogo/tecidos",
    },
  ];

  return (
    <main className="min-h-dvh bg-neutral-50">
      <header className="flex items-center gap-3 border-b border-neutral-200 bg-white px-6 py-4">
        <a
          href="/"
          className="text-sm text-neutral-500 transition hover:text-neutral-900"
        >
          Inicio
        </a>
        <span className="text-neutral-300">/</span>
        <h1 className="text-lg font-semibold tracking-tight text-neutral-900">
          Catalogo
        </h1>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {cards.map((c) => (
            <a
              key={c.href}
              href={c.href}
              className="rounded-2xl border border-neutral-200 bg-white p-6 transition hover:border-neutral-900"
            >
              <p className="text-3xl font-semibold tracking-tight text-neutral-900">
                {c.total}
              </p>
              <p className="mt-2 font-medium text-neutral-900">{c.nome}</p>
              <p className="text-sm text-neutral-500">{c.descricao}</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
