import PDFDocument from "pdfkit";

const DARK = "#0e1611";
const GOLD = "#c6a24e";
const INK = "#1a1a1a";
const MUTE = "#6b7280";
const BORDER = "#d1d5db";
const LIGHT_BG = "#f3f4f6";

const W = 595.28;
const H = 841.89;
const M = 44;
const CW = W - M * 2;

function brl(v: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(v);
}

export type DadosPedido = {
  id: string;
  valor_total: number;
  observacoes: string | null;
  data_entrega_prevista: string | null;
  clientes: {
    nome: string;
    telefone: string | null;
    email: string | null;
  } | null;
  itens: Array<{
    descricao_medida: string | null;
    extras: string | null;
    quantidade: number;
    preco_unitario: number;
    modelos: { nome: string } | null;
  }>;
};

export function gerarOrcamento(pedido: DadosPedido): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 0, autoFirstPage: true });
    const chunks: Buffer[] = [];

    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // ── Header ────────────────────────────────────────────────
    doc.rect(0, 0, W, 80).fill(DARK);

    doc.font("Helvetica-Bold").fontSize(22).fillColor(GOLD).text("GMF", M, 20);
    doc.font("Helvetica").fontSize(8).fillColor("#9fa89f").text("ESTOFADOS", M, 46);

    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor(GOLD)
      .text("ORÇAMENTO", 0, 22, { align: "right", width: W - M });

    const numDoc = pedido.id.replace(/-/g, "").slice(0, 8).toUpperCase();
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#9fa89f")
      .text(`Nº ${numDoc}`, 0, 37, { align: "right", width: W - M });

    const hoje = new Date().toLocaleDateString("pt-BR");
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#9fa89f")
      .text(hoje, 0, 51, { align: "right", width: W - M });

    // ── Client + delivery info ─────────────────────────────────
    let y = 104;

    const cliente = pedido.clientes;
    if (cliente) {
      doc.font("Helvetica").fontSize(7).fillColor(MUTE).text("PARA", M, y);
      y += 13;
      doc
        .font("Helvetica-Bold")
        .fontSize(13)
        .fillColor(INK)
        .text(cliente.nome, M, y, { width: CW / 2 - 8 });
      y += 18;
      if (cliente.telefone) {
        doc
          .font("Helvetica")
          .fontSize(8.5)
          .fillColor(MUTE)
          .text(cliente.telefone, M, y);
        y += 13;
      }
      if (cliente.email) {
        doc
          .font("Helvetica")
          .fontSize(8.5)
          .fillColor(MUTE)
          .text(cliente.email, M, y);
        y += 13;
      }
    }

    if (pedido.data_entrega_prevista) {
      const colX = W / 2 + 8;
      const colW = W - M - colX;
      const entrega = new Date(
        pedido.data_entrega_prevista + "T12:00:00",
      ).toLocaleDateString("pt-BR");
      doc
        .font("Helvetica")
        .fontSize(7)
        .fillColor(MUTE)
        .text("ENTREGA PREVISTA", colX, 104, { width: colW });
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor(INK)
        .text(entrega, colX, 117, { width: colW });
    }

    y = Math.max(y, 148) + 12;

    // ── Divider ───────────────────────────────────────────────
    doc.moveTo(M, y).lineTo(W - M, y).strokeColor(BORDER).strokeOpacity(0.6).stroke();
    y += 14;

    // ── Items table ───────────────────────────────────────────
    doc.rect(M, y, CW, 26).fill(LIGHT_BG);
    doc.font("Helvetica-Bold").fontSize(7).fillColor(MUTE).text("ITEM", M + 8, y + 9);
    doc
      .font("Helvetica-Bold")
      .fontSize(7)
      .fillColor(MUTE)
      .text("QTD", M + CW - 148, y + 9, { width: 40, align: "right" });
    doc
      .font("Helvetica-Bold")
      .fontSize(7)
      .fillColor(MUTE)
      .text("VALOR UNIT.", M + CW - 108, y + 9, { width: 100, align: "right" });
    y += 26;

    for (const item of pedido.itens) {
      const nome = item.modelos?.nome ?? "Item avulso";
      const detalhe = [item.descricao_medida, item.extras]
        .filter(Boolean)
        .join(" · ");
      const rowH = detalhe ? 44 : 32;

      doc
        .rect(M, y, CW, rowH)
        .strokeColor(BORDER)
        .strokeOpacity(0.4)
        .stroke();

      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor(INK)
        .text(nome, M + 8, y + 9, { width: CW - 160 });

      if (detalhe) {
        doc
          .font("Helvetica")
          .fontSize(7.5)
          .fillColor(MUTE)
          .text(detalhe, M + 8, y + 23, { width: CW - 160 });
      }

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(MUTE)
        .text(String(item.quantidade), M + CW - 148, y + 9, {
          width: 40,
          align: "right",
        });

      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor(INK)
        .text(brl(item.preco_unitario), M + CW - 108, y + 9, {
          width: 100,
          align: "right",
        });

      y += rowH;
    }

    // ── Total bar ─────────────────────────────────────────────
    y += 2;
    doc.rect(M, y, CW, 38).fill(DARK);
    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor("#9fa89f")
      .text("TOTAL DO ORÇAMENTO", M + 8, y + 13);
    doc
      .font("Helvetica-Bold")
      .fontSize(15)
      .fillColor(GOLD)
      .text(brl(pedido.valor_total), 0, y + 12, {
        align: "right",
        width: W - M - 8,
      });
    y += 54;

    // ── Observations ──────────────────────────────────────────
    if (pedido.observacoes) {
      doc
        .font("Helvetica")
        .fontSize(7)
        .fillColor(MUTE)
        .text("OBSERVAÇÕES", M, y);
      y += 12;
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(INK)
        .text(pedido.observacoes, M, y, { width: CW });
    }

    // ── Footer ────────────────────────────────────────────────
    const footerY = H - 44;
    doc.rect(0, footerY, W, 44).fill(DARK);
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#6b7280")
      .text(
        "GMF Estofados · Rua Santa Catarina 148, Goiânia GO · @gmfestofados · Desde 2014",
        0,
        footerY + 16,
        { align: "center", width: W },
      );

    doc.end();
  });
}
