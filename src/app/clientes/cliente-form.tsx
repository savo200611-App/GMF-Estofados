"use client";

import { useActionState } from "react";

import { ORIGENS, ORIGEM_LABEL } from "@/lib/validations/cliente";
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

const inputClass =
  "mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900";

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
        <label className="block text-sm font-medium text-neutral-700">
          Nome *
        </label>
        <input
          name="nome"
          defaultValue={defaults?.nome ?? ""}
          className={inputClass}
        />
        {campos.nome && (
          <p className="mt-1 text-sm text-red-600">{campos.nome}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Telefone
          </label>
          <input
            name="telefone"
            defaultValue={defaults?.telefone ?? ""}
            className={inputClass}
          />
          {campos.telefone && (
            <p className="mt-1 text-sm text-red-600">{campos.telefone}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700">
            E-mail
          </label>
          <input
            name="email"
            type="email"
            defaultValue={defaults?.email ?? ""}
            className={inputClass}
          />
          {campos.email && (
            <p className="mt-1 text-sm text-red-600">{campos.email}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Cidade
          </label>
          <input
            name="cidade"
            defaultValue={defaults?.cidade ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Origem
          </label>
          <select
            name="origem"
            defaultValue={defaults?.origem ?? "whatsapp"}
            className={inputClass}
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
        <label className="block text-sm font-medium text-neutral-700">
          Endereco
        </label>
        <input
          name="endereco"
          defaultValue={defaults?.endereco ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700">
          Observacoes
        </label>
        <textarea
          name="observacoes"
          rows={3}
          defaultValue={defaults?.observacoes ?? ""}
          className={inputClass}
        />
      </div>

      <label className="flex items-start gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          name="consentimento_lgpd"
          defaultChecked={defaults?.consentimento_lgpd ?? false}
          className="mt-0.5"
        />
        <span>
          Cliente autorizou o contato e o uso dos dados (LGPD).
        </span>
      </label>

      {state.erro && <p className="text-sm text-red-600">{state.erro}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
        >
          {pending ? "Salvando..." : textoBotao}
        </button>
        <a
          href="/clientes"
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition hover:bg-neutral-100"
        >
          Cancelar
        </a>
      </div>
    </form>
  );
}
