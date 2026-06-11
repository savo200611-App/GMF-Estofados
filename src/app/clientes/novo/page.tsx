import { AppShell } from "@/components/app-shell";
import { card } from "@/components/ui";
import { criarCliente } from "../actions";
import { ClienteForm } from "../cliente-form";

export default function NovoClientePage() {
  return (
    <AppShell title="Novo cliente">
      <a
        href="/clientes"
        className="text-sm text-mute transition hover:text-ink"
      >
        ‹ Clientes
      </a>
      <div className={`mt-4 ${card} p-6`}>
        <ClienteForm acao={criarCliente} textoBotao="Salvar cliente" />
      </div>
    </AppShell>
  );
}
