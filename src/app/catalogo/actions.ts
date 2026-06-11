"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ZodError } from "zod";

import { createClient } from "@/lib/supabase/server";
import { modeloSchema } from "@/lib/validations/catalogo";

export type CatalogoFormState = {
  erro?: string;
  campos?: Record<string, string>;
};

function camposDeErro(error: ZodError): Record<string, string> {
  const campos: Record<string, string> = {};
  for (const issue of error.issues) {
    const chave = String(issue.path[0] ?? "");
    if (chave && !campos[chave]) campos[chave] = issue.message;
  }
  return campos;
}

function parseModelo(formData: FormData) {
  return modeloSchema.safeParse({
    nome: formData.get("nome"),
    descricao: formData.get("descricao") ?? "",
    foto_url: formData.get("foto_url") ?? "",
    preco_base: formData.get("preco_base") ?? "0",
    ativo: formData.get("ativo") === "on",
  });
}

export async function criarModelo(
  _prev: CatalogoFormState,
  formData: FormData,
): Promise<CatalogoFormState> {
  const parsed = parseModelo(formData);
  if (!parsed.success) return { campos: camposDeErro(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase.from("modelos").insert({
    nome: parsed.data.nome,
    descricao: parsed.data.descricao || null,
    foto_url: parsed.data.foto_url || null,
    preco_base: parsed.data.preco_base,
    ativo: parsed.data.ativo,
  });

  if (error) return { erro: "Nao foi possivel salvar o modelo." };

  revalidatePath("/catalogo");
  redirect("/catalogo");
}

export async function atualizarModelo(
  id: string,
  _prev: CatalogoFormState,
  formData: FormData,
): Promise<CatalogoFormState> {
  const parsed = parseModelo(formData);
  if (!parsed.success) return { campos: camposDeErro(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase
    .from("modelos")
    .update({
      nome: parsed.data.nome,
      descricao: parsed.data.descricao || null,
      foto_url: parsed.data.foto_url || null,
      preco_base: parsed.data.preco_base,
      ativo: parsed.data.ativo,
    })
    .eq("id", id);

  if (error) return { erro: "Nao foi possivel atualizar o modelo." };

  revalidatePath("/catalogo");
  redirect("/catalogo");
}

export async function excluirModelo(id: string) {
  const supabase = await createClient();
  await supabase.from("modelos").delete().eq("id", id);
  revalidatePath("/catalogo");
  redirect("/catalogo");
}
