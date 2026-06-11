"use client";

import { useActionState } from "react";

import { btnGhost, btnPrimary, fieldError, input, label } from "@/components/ui";
import { ImageUpload } from "./image-upload";
import type { CatalogoFormState } from "./actions";

type Acao = (
  state: CatalogoFormState,
  formData: FormData,
) => Promise<CatalogoFormState>;

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
        <label className={label}>Foto</label>
        <div className="mt-1">
          <ImageUpload pasta="modelos" defaultUrl={defaults?.foto_url} />
        </div>
      </div>

      <div>
        <label className={label}>Nome *</label>
        <input
          name="nome"
          defaultValue={defaults?.nome ?? ""}
          className={input}
        />
        {campos.nome && <p className={fieldError}>{campos.nome}</p>}
      </div>

      <div>
        <label className={label}>Preço base (R$)</label>
        <input
          name="preco_base"
          inputMode="decimal"
          placeholder="0,00"
          defaultValue={precoDefault}
          className={input}
        />
        {campos.preco_base && <p className={fieldError}>{campos.preco_base}</p>}
      </div>

      <div>
        <label className={label}>Descrição</label>
        <textarea
          name="descricao"
          rows={3}
          defaultValue={defaults?.descricao ?? ""}
          className={input}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-mute">
        <input
          type="checkbox"
          name="ativo"
          defaultChecked={defaults?.ativo ?? true}
          className="accent-[#2f9e5f]"
        />
        <span>Ativo (aparece no catálogo)</span>
      </label>

      {state.erro && <p className="text-sm text-danger">{state.erro}</p>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={pending} className={btnPrimary}>
          {pending ? "Salvando..." : textoBotao}
        </button>
        <a href="/catalogo/modelos" className={btnGhost}>
          Cancelar
        </a>
      </div>
    </form>
  );
}
