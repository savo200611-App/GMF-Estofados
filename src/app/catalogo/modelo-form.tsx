"use client";

import { useActionState } from "react";

import { ImageUpload } from "./image-upload";
import type { CatalogoFormState } from "./actions";

type Acao = (
  state: CatalogoFormState,
  formData: FormData,
) => Promise<CatalogoFormState>;

const inputClass =
  "mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900";

export function ModeloForm({
  acao,
  textoBotao,
  defaults,
}: {
  acao: Acao;
  textoBotao: string;
  defaults?: {
    nome?: string;
    descricao?: string | null;
    foto_url?: string | null;
    preco_base?: number;
    ativo?: boolean;
  };
}) {
  const [state, formAction, pending] = useActionState<
    CatalogoFormState,
    FormData
  >(acao, {});
  const campos = state.campos ?? {};
  const precoDefault =
    defaults?.preco_base != null
      ? defaults.preco_base.toFixed(2).replace(".", ",")
      : "";

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          Foto
        </label>
        <div className="mt-1">
          <ImageUpload pasta="modelos" defaultUrl={defaults?.foto_url} />
        </div>
      </div>

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

      <div>
        <label className="block text-sm font-medium text-neutral-700">
          Preco base (R$)
        </label>
        <input
          name="preco_base"
          inputMode="decimal"
          placeholder="0,00"
          defaultValue={precoDefault}
          className={inputClass}
        />
        {campos.preco_base && (
          <p className="mt-1 text-sm text-red-600">{campos.preco_base}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700">
          Descricao
        </label>
        <textarea
          name="descricao"
          rows={3}
          defaultValue={defaults?.descricao ?? ""}
          className={inputClass}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          name="ativo"
          defaultChecked={defaults?.ativo ?? true}
        />
        <span>Ativo (aparece no catalogo)</span>
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
          href="/catalogo/modelos"
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition hover:bg-neutral-100"
        >
          Cancelar
        </a>
      </div>
    </form>
  );
}
