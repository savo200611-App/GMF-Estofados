"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

const STATUS_VALIDOS = [
  "novo",
  "orcado",
  "fechado",
  "producao",
  "entregue",
  "cancelado",
] as const;
type Status = (typeof STATUS_VALIDOS)[number];

export type ItemInput = {
  modelo_id: string | null;
  tecido_id: string | null;
  descricao_medida: string;
  extras: string;
  quantidade: number;
};

export type NovoPedidoPayload = {
  cliente_id: string;
  observacoes: string;
  data_entrega_prevista: string | null;
  itens: ItemInput[];
};

const VAZIO_UUID = "00000000-0000-0000-0000-000000000000";

export async function criarPedido(
  payload: NovoPedidoPayload,
): Promise<{ erro: string } | never> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!payload.cliente_id) return { erro: "Selecione um cliente." };
  const itens = payload.itens.filter((i) => i.modelo_id);
  if (itens.length === 0)
    return { erro: "Adicione ao menos um item com modelo." };

  // Precos autoritativos vindos do banco (nunca confiar no cliente).
  const modeloIds = [...new Set(itens.map((i) => i.modelo_id!))];
  const tecidoIds = [
    ...new Set(itens.map((i) => i.tecido_id).filter(Boolean) as string[]),
  ];

  const { data: modelos } = await supabase
    .from("modelos")
    .select("id, preco_base")
    .in("id", modeloIds);
  const { data: tecidos } = await supabase
    .from("tecidos")
    .select("id, acrescimo_preco")
    .in("id", tecidoIds.length ? tecidoIds : [VAZIO_UUID]);

  const precoModelo = new Map(modelos?.map((m) => [m.id, m.preco_base]) ?? []);
  const acrescimoTecido = new Map(
    tecidos?.map((t) => [t.id, t.acrescimo_preco]) ?? [],
  );

  const itensCalculados = itens.map((i) => {
    const base = precoModelo.get(i.modelo_id!) ?? 0;
    const acrescimo = i.tecido_id
      ? (acrescimoTecido.get(i.tecido_id) ?? 0)
      : 0;
    const quantidade = Math.max(1, Math.floor(i.quantidade) || 1);
    return {
      modelo_id: i.modelo_id,
      tecido_id: i.tecido_id,
      descricao_medida: i.descricao_medida || null,
      extras: i.extras || null,
      quantidade,
      preco_unitario: base + acrescimo,
    };
  });

  const valorTotal = itensCalculados.reduce(
    (acc, i) => acc + i.preco_unitario * i.quantidade,
    0,
  );

  const { data: pedido, error: erroPedido } = await supabase
    .from("pedidos")
    .insert({
      cliente_id: payload.cliente_id,
      observacoes: payload.observacoes || null,
      data_entrega_prevista: payload.data_entrega_prevista || null,
      valor_total: valorTotal,
      criado_por: user?.id ?? null,
      status: "novo",
    })
    .select("id")
    .single();

  if (erroPedido || !pedido)
    return { erro: "Nao foi possivel criar o pedido." };

  const { error: erroItens } = await supabase.from("pedido_itens").insert(
    itensCalculados.map((i) => ({ ...i, pedido_id: pedido.id })),
  );

  if (erroItens) {
    // Desfaz o pedido se os itens falharem (consistencia).
    await supabase.from("pedidos").delete().eq("id", pedido.id);
    return { erro: "Nao foi possivel salvar os itens do pedido." };
  }

  revalidatePath("/pedidos");
  redirect(`/pedidos/${pedido.id}`);
}

export async function moverPedido(id: string, status: Status) {
  if (!STATUS_VALIDOS.includes(status)) return;
  const supabase = await createClient();
  await supabase.from("pedidos").update({ status }).eq("id", id);
  revalidatePath("/pedidos");
}

export async function excluirPedido(id: string) {
  const supabase = await createClient();
  await supabase.from("pedidos").delete().eq("id", id);
  revalidatePath("/pedidos");
  redirect("/pedidos");
}
