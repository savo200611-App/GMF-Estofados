import { criarCliente } from "../actions";
import { ClienteForm } from "../cliente-form";

export default function NovoClientePage() {
  return (
    <main className="min-h-dvh bg-neutral-50">
      <header className="flex items-center gap-3 border-b border-neutral-200 bg-white px-6 py-4">
        <a
          href="/clientes"
          className="text-sm text-neutral-500 transition hover:text-neutral-900"
        >
          Clientes
        </a>
        <span className="text-neutral-300">/</span>
        <h1 className="text-lg font-semibold tracking-tight text-neutral-900">
          Novo cliente
        </h1>
      </header>

      <section className="mx-auto max-w-2xl px-6 py-8">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <ClienteForm acao={criarCliente} textoBotao="Salvar cliente" />
        </div>
      </section>
    </main>
  );
}
