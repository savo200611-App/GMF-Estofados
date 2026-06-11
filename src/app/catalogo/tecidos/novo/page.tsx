import { AppShell } from "@/components/app-shell";
import { card } from "@/components/ui";
import { criarTecido } from "../../actions";
import { TecidoForm } from "../../tecido-form";

export default function NovoTecidoPage() {
  return (
    <AppShell title="Novo tecido">
      <a
        href="/catalogo/tecidos"
        className="text-sm text-mute transition hover:text-ink"
      >
        ‹ Tecidos
      </a>
      <div className={`mt-4 ${card} p-6`}>
        <TecidoForm acao={criarTecido} textoBotao="Salvar tecido" />
      </div>
    </AppShell>
  );
}
