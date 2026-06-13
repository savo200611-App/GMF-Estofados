"use server";

import { Resend } from "resend";

import { createClient } from "@/lib/supabase/server";
import { gerarOrcamento, type DadosPedido } from "@/lib/pdf/gerar-orcamento";

function brl(v: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(v);
}

export async function enviarOrcamentoPorEmail(
  pedidoId: string,
): Promise<{ erro?: string; ok?: true }> {
  if (!process.env.RESEND_API_KEY) {
    return { erro: "Serviço de e-mail não configurado." };
  }

  const supabase = await createClient();

  const { data: pedido } = await supabase
    .from("pedidos")
    .select(
      "id, valor_total, observacoes, data_entrega_prevista, clientes(nome, telefone, email)",
    )
    .eq("id", pedidoId)
    .single();

  if (!pedido) return { erro: "Pedido não encontrado." };

  const cliente = pedido.clientes as DadosPedido["clientes"];
  if (!cliente?.email) return { erro: "Cliente sem e-mail cadastrado." };

  const { data: itens } = await supabase
    .from("pedido_itens")
    .select("descricao_medida, extras, quantidade, preco_unitario, modelos(nome)")
    .eq("pedido_id", pedidoId);

  const dados: DadosPedido = {
    id: pedido.id,
    valor_total: pedido.valor_total,
    observacoes: pedido.observacoes,
    data_entrega_prevista: pedido.data_entrega_prevista,
    clientes: cliente,
    itens: (itens ?? []).map((it) => ({
      descricao_medida: it.descricao_medida,
      extras: it.extras,
      quantidade: it.quantidade,
      preco_unitario: it.preco_unitario,
      modelos: it.modelos as { nome: string } | null,
    })),
  };

  const pdfBuffer = await gerarOrcamento(dados);
  const numDoc = pedidoId.replace(/-/g, "").slice(0, 8).toUpperCase();
  const filename = `orcamento-${numDoc}.pdf`;

  const from =
    process.env.RESEND_FROM_EMAIL ?? "GMF Estofados <onboarding@resend.dev>";

  const resend = new Resend(process.env.RESEND_API_KEY);

  const entregaTexto = pedido.data_entrega_prevista
    ? new Date(
        pedido.data_entrega_prevista + "T12:00:00",
      ).toLocaleDateString("pt-BR")
    : null;

  const { error } = await resend.emails.send({
    from,
    to: [cliente.email],
    subject: `Orçamento GMF Estofados – ${cliente.nome}`,
    html: `
      <div style="font-family:Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <div style="background:#0e1611;padding:28px 36px">
          <span style="color:#c6a24e;font-size:22px;font-weight:700">GMF</span>
          <span style="color:#9fa89f;font-size:10px;letter-spacing:2px;margin-left:6px">ESTOFADOS</span>
        </div>
        <div style="padding:36px">
          <p style="margin:0 0 8px;font-size:15px">Olá, <strong>${cliente.nome}</strong>.</p>
          <p style="margin:0 0 24px;color:#6b7280;font-size:14px">
            Segue em anexo o orçamento <strong style="color:#1a1a1a">Nº ${numDoc}</strong>
            no valor de <strong style="color:#1a1a1a">${brl(pedido.valor_total)}</strong>.${entregaTexto ? ` Entrega prevista para <strong>${entregaTexto}</strong>.` : ""}
          </p>
          ${pedido.observacoes ? `<div style="background:#f3f4f6;border-radius:4px;padding:12px 16px;font-size:13px;color:#4b5563;margin-bottom:24px">${pedido.observacoes}</div>` : ""}
          <p style="font-size:13px;color:#6b7280;margin:0">
            Para confirmar o pedido ou tirar dúvidas, entre em contato via WhatsApp.
          </p>
        </div>
        <div style="background:#0e1611;padding:16px 36px;font-size:11px;color:#6b7280;text-align:center">
          GMF Estofados · Rua Santa Catarina 148, Goiânia GO · @gmfestofados
        </div>
      </div>
    `,
    attachments: [
      {
        filename,
        content: pdfBuffer,
      },
    ],
  });

  if (error) return { erro: "Falha ao enviar o e-mail. Tente novamente." };

  return { ok: true };
}
