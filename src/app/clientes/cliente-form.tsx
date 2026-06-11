"use client";

import { useActionState } from "react";

import { ORIGENS, ORIGEM_LABEL } from "@/lib/validations/cliente";
import { btnGhost, btnPrimary, fieldError, input, label } from "@/components/ui";
import type { ClienteFormState } from "./actions";

type Acao = (
  state: ClienteFormState,
  formData: FormData,
) => Promise<ClienteFormState>;

type Defaults = {
  nome?: string;
  telefone?: string | null;
  email?: string | null;
  cidade?: string | null;
  endereco?: string | null;
  origem?: (typeof ORIGENS)[number];
  observacoes?: string | null;
  consentimento_lgpd?: boolean;
};

export function ClienteForm({
  acao,
  defaults,
  textoBotao,
}: {
  acao: Acao;
  defaults?: Defaults;
  textoBotao: string;
}) {
  const [state, formAction, pending] = useActionState<
    ClienteFormState,
    FormData
  >(acao, {});
  const campos = state.campos ?? {};

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className={label}>Nome *</label>
        <input
          name="nome"
          defaultValue={defaults?.nome ?? ""}
          className={input}
        />
        {campos.nome && <p className={fieldError}>{campos.nome}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Telefone</label>
          <input
            name="telefone"
            defaultValue={defaults?.telefone ?? ""}
            className={input}
          />
          {campos.telefone && <p className={fieldError}>{campos.telefone}</p>}
        </div>
        <div>
          <label className={label}>E-mail</label>
          <input
            name="email"
            type="email"
            defaultValue={defaults?.email ?? ""}
            className={input}
          />
          {campos.email && <p className={fieldError}>{campos.email}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Cidade</label>
          <input
            name="cidade"
            defaultValue={defaults?.cidade ?? ""}
            className={input}
          />
        </div>
        <div>
          <label className={label}>Origem</label>
          <select
            name="origem"
            defaultValue={defaults?.origem ?? "whatsapp"}
            className={input}
          >
            {ORIGENS.map((o) => (
              <option key={o} value={o}>
                {ORIGEM_LABEL[o]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={label}>Endereço</label>
        <input
          name="endereco"
          defaultValue={defaults?.endereco ?? ""}
          className={input}
        />
      </div>

      <div>
        <label className={label}>Observações</label>
        <textarea
          name="observacoes"
          rows={3}
          defaultValue={defaults?.observacoes ?? ""}
          className={input}
        />
      </div>

      <label className="flex items-start gap-2 text-sm text-mute">
        <input
          type="checkbox"
          name="consentimento_lgpd"
          defaultChecked={defaults?.consentimento_lgpd ?? false}
          className="mt-0.5 accent-[#2f9e5f]"
        />
        <span>Cliente autorizou o contato e o uso dos dados (LGPD).</span>
      </label>

      {state.erro && <p className="text-sm text-danger">{state.erro}</p>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={pending} className={btnPrimary}>
          {pending ? "Salvando..." : textoBotao}
        </button>
        <a href="/clientes" className={btnGhost}>
          Cancelar
        </a>
      </div>
    </form>
  );
}
