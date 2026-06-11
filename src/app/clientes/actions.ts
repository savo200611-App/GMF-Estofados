"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { clienteSchema } from "@/lib/validations/cliente";

export type ClienteFormState = {
  erro?: string;
  campos?: Record<string, string>;
};

function parseForm(formData: FormData) {
  return clienteSchema.safeParse({
    nome: formData.get("nome"),
    telefone: formData.get("telefone") ?? "",
    email: formData.get("email") ?? "",
    cidade: formData.get("cidade") ?? "",
    endereco: formData.get("endereco") ?? "",
    origem: formData.get("origem"),
    observacoes: formData.get("observacoes") ?? "",
    consentimento_lgpd: formData.get("consentimento_lgpd") === "on",
  });
}

function camposDeErro(error: import("zod").ZodError): Record<string, string> {
  const campos: Record<string, string> = {};
  for (const issue of error.issues) {
    const chave = String(issue.path[0] ?? "");
    if (chave && !campos[chave]) campos[chave] = issue.message;
  }
  return campos;
}

// Converte strings vazias em null para o banco.
function limpar(input: ReturnType<typeof clienteSchema.parse>) {
  return {
    nome: input.nome,
    telefone: input.telefone || null,
    email: input.email || null,
    cidade: input.cidade || null,
    endereco: input.endereco || null,
    origem: input.origem,
    observacoes: input.observacoes || null,
    consentimento_lgpd: input.consentimento_lgpd,
  };
}

export async function criarCliente(
  _prev: ClienteFormState,
  formData: FormData,
): Promise<ClienteFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) return { campos: camposDeErro(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase.from("clientes").insert(limpar(parsed.data));

  if (error) return { erro: "Nao foi possivel salvar o cliente." };

  revalidatePath("/clientes");
  redirect("/clientes");
}

export async function atualizarCliente(
  id: string,
  _prev: ClienteFormState,
  formData: FormData,
): Promise<ClienteFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) return { campos: camposDeErro(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase
    .from("clientes")
    .update(limpar(parsed.data))
    .eq("id", id);

  if (error) return { erro: "Nao foi possivel atualizar o cliente." };

  revalidatePath("/clientes");
  revalidatePath(`/clientes/${id}`);
  redirect(`/clientes/${id}`);
}

export async function excluirCliente(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("clientes").delete().eq("id", id);

  if (error) {
    // Cliente com pedidos vinculados nao pode ser apagado (FK restrict).
    redirect(`/clientes/${id}?erro=vinculado`);
  }

  revalidatePath("/clientes");
  redirect("/clientes");
}
