import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app-shell";
import { card } from "@/components/ui";
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
    <AppShell title={modelo.nome}>
      <a
        href="/catalogo"
        className="text-sm text-mute transition hover:text-ink"
      >
        ‹ Catálogo
      </a>
      <div className={`mt-4 ${card} p-6`}>
        <ModeloForm
          acao={atualizar}
          textoBotao="Salvar alterações"
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
        <button className="text-sm text-danger/80 transition hover:text-danger">
          Excluir modelo
        </button>
      </form>
    </AppShell>
  );
}
