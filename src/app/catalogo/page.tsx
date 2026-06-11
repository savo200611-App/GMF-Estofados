import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app-shell";

export default async function CatalogoPage() {
  const supabase = await createClient();
  const [{ count: nModelos }, { count: nTecidos }] = await Promise.all([
    supabase.from("modelos").select("*", { count: "exact", head: true }),
    supabase.from("tecidos").select("*", { count: "exact", head: true }),
  ]);

  const cards = [
    {
      nome: "Modelos",
      descricao: "Sofás e poltronas do catálogo",
      total: nModelos ?? 0,
      href: "/catalogo/modelos",
    },
    {
      nome: "Tecidos",
      descricao: "Tecidos e acréscimos de preço",
      total: nTecidos ?? 0,
      href: "/catalogo/tecidos",
    },
  ];

  return (
    <AppShell title="Catálogo">
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <a
            key={c.href}
            href={c.href}
            className="rounded-2xl bg-gradient-to-br from-deep to-brand p-6 transition hover:opacity-95"
          >
            <p className="text-3xl font-semibold text-white">{c.total}</p>
            <p className="mt-2 font-medium text-white">{c.nome}</p>
            <p className="text-sm text-white/75">{c.descricao}</p>
          </a>
        ))}
      </div>
    </AppShell>
  );
}
