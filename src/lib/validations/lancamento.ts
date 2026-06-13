import { z } from "zod";

export const TIPOS = ["receita", "despesa"] as const;
export type TipoLancamento = (typeof TIPOS)[number];

export const TIPO_LABEL: Record<TipoLancamento, string> = {
  receita: "Entrada",
  despesa: "Saída",
};

// Categorias controladas por tipo — mantem o relatorio limpo.
export const CATEGORIAS_RECEITA = ["venda", "sinal", "outro"] as const;
export const CATEGORIAS_DESPESA = [
  "materia_prima",
  "mao_de_obra",
  "aluguel",
  "utilidades",
  "marketing",
  "transporte",
  "ferramentas",
  "impostos",
  "outro",
] as const;

export const CATEGORIA_LABEL: Record<string, string> = {
  venda: "Venda",
  sinal: "Sinal / Entrada",
  materia_prima: "Matéria-prima",
  mao_de_obra: "Mão de obra",
  aluguel: "Aluguel",
  utilidades: "Água / Luz / Internet",
  marketing: "Marketing",
  transporte: "Transporte / Entrega",
  ferramentas: "Ferramentas / Equipamentos",
  impostos: "Impostos / Taxas",
  outro: "Outro",
};

export const FORMAS = [
  "pix",
  "dinheiro",
  "cartao",
  "boleto",
  "transferencia",
  "outro",
] as const;

export const FORMA_LABEL: Record<(typeof FORMAS)[number], string> = {
  pix: "Pix",
  dinheiro: "Dinheiro",
  cartao: "Cartão",
  boleto: "Boleto",
  transferencia: "Transferência",
  outro: "Outro",
};

const CATEGORIAS_VALIDAS = [
  ...CATEGORIAS_RECEITA,
  ...CATEGORIAS_DESPESA,
] as const;

export const lancamentoSchema = z.object({
  tipo: z.enum(TIPOS),
  categoria: z.enum(CATEGORIAS_VALIDAS as unknown as [string, ...string[]]),
  descricao: z.string().trim().max(200).optional().or(z.literal("")),
  // Valor em centavos inteiros, vindo do form ja convertido para numero.
  valor: z.number().positive("Informe um valor maior que zero."),
  data: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida."),
  forma_pagamento: z.enum(FORMAS).optional().or(z.literal("")),
  observacoes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type LancamentoInput = z.infer<typeof lancamentoSchema>;
