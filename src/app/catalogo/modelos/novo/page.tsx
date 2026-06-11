import { criarModelo } from "../../actions";
import { ModeloForm } from "../../modelo-form";

export default function NovoModeloPage() {
  return (
    <main className="min-h-dvh bg-neutral-50">
      <header className="flex items-center gap-3 border-b border-neutral-200 bg-white px-6 py-4">
        <a
          href="/catalogo/modelos"
          className="text-sm text-neutral-500 transition hover:text-neutral-900"
        >
          Modelos
        </a>
        <span className="text-neutral-300">/</span>
        <h1 className="text-lg font-semibold tracking-tight text-neutral-900">
          Novo modelo
        </h1>
      </header>

      <section className="mx-auto max-w-2xl px-6 py-8">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <ModeloForm acao={criarModelo} textoBotao="Salvar modelo" />
        </div>
      </section>
    </main>
  );
}
