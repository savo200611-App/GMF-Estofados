import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

async function sair() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // O middleware ja redireciona, mas garantimos no servidor.
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("profiles")
    .select("nome, papel")
    .eq("id", user.id)
    .single();
  const perfil = data as { nome: string; papel: string } | null;

  const modulos = [
    { nome: "Clientes", descricao: "Cadastro e historico", href: "/clientes" },
    { nome: "Catalogo", descricao: "Modelos e tecidos", href: "/catalogo" },
    { nome: "Pedidos", descricao: "Orcamentos e producao", href: "/pedidos" },
  ];

  return (
    <main className="min-h-dvh bg-neutral-50">
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-neutral-900">
            GMF Estofados
          </h1>
          <p className="text-sm text-neutral-500">
            {perfil?.nome ?? user.email}
            {perfil?.papel ? ` - ${perfil.papel}` : ""}
          </p>
        </div>
        <form action={sair}>
          <button className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 transition hover:bg-neutral-100">
            Sair
          </button>
        </form>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-400">
          Modulos
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {modulos.map((m) => (
            <a
              key={m.href}
              href={m.href}
              className="rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-900"
            >
              <p className="font-medium text-neutral-900">{m.nome}</p>
              <p className="mt-1 text-sm text-neutral-500">{m.descricao}</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
