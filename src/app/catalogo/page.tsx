import { createClient } from "@/lib/supabase/server";
import { brl } from "@/lib/format";
import { AppShell } from "@/components/app-shell";

export const dynamic = "force-dynamic";

export default async function CatalogoPage() {
  const supabase = await createClient();
  const { data: modelos } = await supabase
    .from("modelos")
    .select("id, nome, preco_base, foto_url, ativo")
    .order("nome", { ascending: true });

  return (
    <AppShell
      title="Catálogo"
      action={
        <a
          href="/catalogo/modelos/novo"
          className="rounded-md bg-gold px-3.5 py-2 text-sm font-semibold text-[#1a130a] transition hover:opacity-75"
        >
          + Novo
        </a>
      }
    >
      {!modelos || modelos.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-edge px-6 py-12 text-center text-sm text-mute">
          Nenhum modelo cadastrado ainda.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {modelos.map((m) => (
            <li key={m.id}>
              <a
                href={`/catalogo/modelos/${m.id}`}
                className="flex items-center gap-4 rounded-lg border border-edge bg-surface p-4 transition hover:opacity-75"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-edge bg-raise">
                  {m.foto_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={m.foto_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-mute">sem foto</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{m.nome}</p>
                  <p className="text-sm text-mute">{brl(m.preco_base)}</p>
                </div>
                {!m.ativo && (
                  <span className="rounded-full bg-raise px-2.5 py-0.5 text-xs text-mute">
                    Inativo
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
