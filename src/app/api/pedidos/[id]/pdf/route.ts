import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { gerarOrcamento, type DadosPedido } from "@/lib/pdf/gerar-orcamento";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: pedido } = await supabase
    .from("pedidos")
    .select(
      "id, valor_total, observacoes, data_entrega_prevista, clientes(nome, telefone, email)",
    )
    .eq("id", id)
    .single();

  if (!pedido) {
    return new NextResponse("Pedido não encontrado", { status: 404 });
  }

  const { data: itens } = await supabase
    .from("pedido_itens")
    .select("descricao_medida, extras, quantidade, preco_unitario, modelos(nome)")
    .eq("pedido_id", id);

  const dados: DadosPedido = {
    id: pedido.id,
    valor_total: pedido.valor_total,
    observacoes: pedido.observacoes,
    data_entrega_prevista: pedido.data_entrega_prevista,
    clientes: pedido.clientes as DadosPedido["clientes"],
    itens: (itens ?? []).map((it) => ({
      descricao_medida: it.descricao_medida,
      extras: it.extras,
      quantidade: it.quantidade,
      preco_unitario: it.preco_unitario,
      modelos: it.modelos as { nome: string } | null,
    })),
  };

  const buffer = await gerarOrcamento(dados);
  const filename = `orcamento-${pedido.id.replace(/-/g, "").slice(0, 8)}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
    },
  });
}
