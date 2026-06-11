import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { atualizarTecido, excluirTecido } from "../../actions";
import { TecidoForm } from "../../tecido-form";

export const dynamic = "force-dynamic";

export default async function TecidoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: tecido } = await supabase
    .from("tecidos")
    .select("*")
    .eq("id", id)
    .single();

  if (!tecido) notFound();

  const atualizar = atualizarTecido.bind(null, id);

  async function excluir() {
    "use server";
    await excluirTecido(id);
  }

  return (
    <main className="min-h-dvh bg-neutral-50">
      <header className="flex items-center gap-3 border-b border-neutral-200 bg-white px-6 py-4">
        <a
          href="/catalogo/tecidos"
          className="text-sm text-neutral-500 transition hover:text-neutral-900"
        >
          Tecidos
        </a>
        <span className="text-neutral-300">/</span>
        <h1 className="text-lg font-semibold tracking-tight text-neutral-900">
          {tecido.nome}
        </h1>
      </header>

      <section className="mx-auto max-w-2xl px-6 py-8">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <TecidoForm
            acao={atualizar}
            textoBotao="Salvar alteracoes"
            defaults={{
              nome: tecido.nome,
              cor: tecido.cor,
              foto_url: tecido.foto_url,
              acrescimo_preco: tecido.acrescimo_preco,
              ativo: tecido.ativo,
            }}
          />
        </div>
        <form action={excluir} className="mt-4">
          <button className="text-sm text-red-600 transition hover:text-red-700">
            Excluir tecido
          </button>
        </form>
      </section>
    </main>
  );
}
