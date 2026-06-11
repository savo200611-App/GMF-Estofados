import { createClient } from "@/lib/supabase/server";
import { brl } from "@/lib/format";
import { AppShell } from "@/components/app-shell";

export default async function ModelosPage() {
  const supabase = await createClient();
  const { data: modelos } = await supabase
    .from("modelos")
    .select("id, nome, preco_base, foto_url, ativo")
    .order("nome", { ascending: true });

  return (
    <AppShell
      title="Modelos"
      action={
        <a
          href="/catalogo/modelos/novo"
          className="rounded-xl bg-brand px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-deep"
        >
          + Novo
        </a>
      }
    >
      <a
        href="/catalogo"
        className="text-sm text-mute transition hover:text-ink"
      >
        ‹ Catálogo
      </a>

      {!modelos || modelos.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-edge px-6 py-12 text-center text-sm text-mute">
          Nenhum modelo cadastrado ainda.
        </p>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {modelos.map((m) => (
            <li key={m.id}>
              <a
                href={`/catalogo/modelos/${m.id}`}
                className="flex items-center gap-4 rounded-2xl border border-edge bg-surface p-4 transition hover:border-brand"
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
