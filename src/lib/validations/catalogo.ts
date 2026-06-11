import { z } from "zod";

const precoBR = z
  .string()
  .trim()
  .transform((v) => Number(v.replace(/\./g, "").replace(",", ".")))
  .refine((n) => Number.isFinite(n) && n >= 0, "Preco invalido.");

export const modeloSchema = z.object({
  nome: z.string().trim().min(2, "Informe o nome do modelo."),
  descricao: z.string().trim().max(1000).optional().or(z.literal("")),
  foto_url: z.string().trim().url().optional().or(z.literal("")),
  preco_base: precoBR,
  ativo: z.boolean(),
});

export type ModeloInput = z.infer<typeof modeloSchema>;
