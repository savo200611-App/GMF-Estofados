import { createClient } from "@/lib/supabase/server";
import { brl } from "@/lib/format";

export default async function TecidosPage() {
  const supabase = await createClient();
  const { data: tecidos } = await supabase
    .from("tecidos")
    .select("id, nome, cor, acrescimo_preco, foto_url, ativo")
    .order("nome", { ascending: true });

  return (
    <main className="min-h-dvh bg-neutral-50">
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <a
            href="/catalogo"
            className="text-sm text-neutral-500 transition hover:text-neutral-900"
          >
            Catalogo
          </a>
          <span className="text-neutral-300">/</span>
          <h1 className="text-lg font-semibold tracking-tight text-neutral-900">
            Tecidos
          </h1>
        </div>
        <a
          href="/catalogo/tecidos/novo"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          Novo tecido
        </a>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-8">
        {!tecidos || tecidos.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-neutral-300 px-6 py-12 text-center text-sm text-neutral-500">
            Nenhum tecido cadastrado ainda.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {tecidos.map((t) => (
              <li key={t.id}>
                <a
                  href={`/catalogo/tecidos/${t.id}`}
                  className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-900"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50">
                    {t.foto_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={t.foto_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-neutral-400">sem foto</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-neutral-900">
                      {t.nome}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {t.cor ? `${t.cor} - ` : ""}
                      {t.acrescimo_preco > 0
                        ? `+ ${brl(t.acrescimo_preco)}`
                        : "sem acrescimo"}
                    </p>
                  </div>
                  {!t.ativo && (
                    <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-500">
                      Inativo
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
