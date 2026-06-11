import { createClient } from "@/lib/supabase/server";
import { brl } from "@/lib/format";
import { AppShell } from "@/components/app-shell";

export default async function TecidosPage() {
  const supabase = await createClient();
  const { data: tecidos } = await supabase
    .from("tecidos")
    .select("id, nome, cor, acrescimo_preco, foto_url, ativo")
    .order("nome", { ascending: true });

  return (
    <AppShell
      title="Tecidos"
      action={
        <a
          href="/catalogo/tecidos/novo"
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

      {!tecidos || tecidos.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-edge px-6 py-12 text-center text-sm text-mute">
          Nenhum tecido cadastrado ainda.
        </p>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {tecidos.map((t) => (
            <li key={t.id}>
              <a
                href={`/catalogo/tecidos/${t.id}`}
                className="flex items-center gap-4 rounded-2xl border border-edge bg-surface p-4 transition hover:border-brand"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-edge bg-raise">
                  {t.foto_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.foto_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-mute">sem foto</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{t.nome}</p>
                  <p className="text-sm text-mute">
                    {t.cor ? `${t.cor} · ` : ""}
                    {t.acrescimo_preco > 0
                      ? `+ ${brl(t.acrescimo_preco)}`
                      : "sem acréscimo"}
                  </p>
                </div>
                {!t.ativo && (
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
