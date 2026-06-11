import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { atualizarModelo, excluirModelo } from "../../actions";
import { ModeloForm } from "../../modelo-form";

export const dynamic = "force-dynamic";

export default async function ModeloDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: modelo } = await supabase
    .from("modelos")
    .select("*")
    .eq("id", id)
    .single();

  if (!modelo) notFound();

  const atualizar = atualizarModelo.bind(null, id);

  async function excluir() {
    "use server";
    await excluirModelo(id);
  }

  return (
    <main className="min-h-dvh bg-neutral-50">
      <header className="flex items-center gap-3 border-b border-neutral-200 bg-white px-6 py-4">
        <a
          href="/catalogo/modelos"
          className="text-sm text-neutral-500 transition hover:text-neutral-900"
        >
          Modelos
        </a>
        <span className="text-neutral-300">/</span>
        <h1 className="text-lg font-semibold tracking-tight text-neutral-900">
          {modelo.nome}
        </h1>
      </header>

      <section className="mx-auto max-w-2xl px-6 py-8">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <ModeloForm
            acao={atualizar}
            textoBotao="Salvar alteracoes"
            defaults={{
              nome: modelo.nome,
              descricao: modelo.descricao,
              foto_url: modelo.foto_url,
              preco_base: modelo.preco_base,
              ativo: modelo.ativo,
            }}
          />
        </div>
        <form action={excluir} className="mt-4">
          <button className="text-sm text-red-600 transition hover:text-red-700">
            Excluir modelo
          </button>
        </form>
      </section>
    </main>
  );
}
