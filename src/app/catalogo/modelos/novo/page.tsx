import { AppShell } from "@/components/app-shell";
import { card } from "@/components/ui";
import { criarModelo } from "../../actions";
import { ModeloForm } from "../../modelo-form";

export default function NovoModeloPage() {
  return (
    <AppShell title="Novo modelo">
      <a
        href="/catalogo/modelos"
        className="text-sm text-mute transition hover:text-ink"
      >
        ‹ Modelos
      </a>
      <div className={`mt-4 ${card} p-6`}>
        <ModeloForm acao={criarModelo} textoBotao="Salvar modelo" />
      </div>
    </AppShell>
  );
}
