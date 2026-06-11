import { z } from "zod";

export const ORIGENS = [
  "whatsapp",
  "instagram",
  "indicacao",
  "site",
  "outro",
] as const;

export const ORIGEM_LABEL: Record<(typeof ORIGENS)[number], string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  indicacao: "Indicacao",
  site: "Site",
  outro: "Outro",
};

export const clienteSchema = z.object({
  nome: z.string().trim().min(2, "Informe o nome do cliente."),
  telefone: z
    .string()
    .trim()
    .max(20, "Telefone muito longo.")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .trim()
    .email("E-mail invalido.")
    .optional()
    .or(z.literal("")),
  cidade: z.string().trim().max(80).optional().or(z.literal("")),
  endereco: z.string().trim().max(200).optional().or(z.literal("")),
  origem: z.enum(ORIGENS),
  observacoes: z.string().trim().max(1000).optional().or(z.literal("")),
  consentimento_lgpd: z.boolean(),
});

export type ClienteInput = z.infer<typeof clienteSchema>;
