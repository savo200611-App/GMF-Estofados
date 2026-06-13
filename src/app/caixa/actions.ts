"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { lancamentoSchema } from "@/lib/validations/lancamento";

export type LancamentoFormState = {
  erro?: string;
  campos?: Record<string, string>;
};

// Converte "1.234,56" (ou "1234.56") em numero. Vazio => 0.
function paraNumero(bruto: string): number {
  const limpo = bruto.trim();
  if (!limpo) return 0;
  const n = Number(limpo.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}

function camposDeErro(error: import("zod").ZodError): Record<string, string> {
  const campos: Record<string, string> = {};
  for (const issue of error.issues) {
    const chave = String(issue.path[0] ?? "");
    if (chave && !campos[chave]) campos[chave] = issue.message;
  }
  return campos;
}

function parseForm(formData: FormData) {
  return lancamentoSchema.safeParse({
    tipo: formData.get("tipo"),
    categoria: formData.get("categoria"),
    descricao: formData.get("descricao") ?? "",
    valor: paraNumero(String(formData.get("valor") ?? "")),
    data: formData.get("data"),
    forma_pagamento: formData.get("forma_pagamento") || "",
    observacoes: formData.get("observacoes") ?? "",
  });
}

export async function criarLancamento(
  _prev: LancamentoFormState,
  formData: FormData,
): Promise<LancamentoFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) return { campos: camposDeErro(parsed.error) };

  const d = parsed.data;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("lancamentos").insert({
    tipo: d.tipo,
    categoria: d.categoria,
    descricao: d.descricao || null,
    valor: d.valor,
    data: d.data,
    forma_pagamento: d.forma_pagamento || null,
    observacoes: d.observacoes || null,
    criado_por: user?.id ?? null,
  });

  if (error) return { erro: "Não foi possível salvar o lançamento." };

  revalidatePath("/caixa");
  redirect("/caixa");
}

export async function excluirLancamento(id: string) {
  const supabase = await createClient();
  await supabase.from("lancamentos").delete().eq("id", id);
  revalidatePath("/caixa");
}
