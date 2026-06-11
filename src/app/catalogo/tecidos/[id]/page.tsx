import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app-shell";
import { card } from "@/components/ui";
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
    <AppShell title={tecido.nome}>
      <a
        href="/catalogo/tecidos"
        className="text-sm text-mute transition hover:text-ink"
      >
        ‹ Tecidos
      </a>
      <div className={`mt-4 ${card} p-6`}>
        <TecidoForm
          acao={atualizar}
          textoBotao="Salvar alterações"
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
        <button className="text-sm text-danger/80 transition hover:text-danger">
          Excluir tecido
        </button>
      </form>
    </AppShell>
  );
}
