"use client";

import { useActionState } from "react";

import { btnGhost, btnPrimary, fieldError, input, label } from "@/components/ui";
import { ImageUpload } from "./image-upload";
import type { CatalogoFormState } from "./actions";

type Acao = (
  state: CatalogoFormState,
  formData: FormData,
) => Promise<CatalogoFormState>;

export function TecidoForm({
  acao,
  textoBotao,
  defaults,
}: {
  acao: Acao;
  textoBotao: string;
  defaults?: {
    nome?: string;
    cor?: string | null;
    foto_url?: string | null;
    acrescimo_preco?: number;
    ativo?: boolean;
  };
}) {
  const [state, formAction, pending] = useActionState<
    CatalogoFormState,
    FormData
  >(acao, {});
  const campos = state.campos ?? {};
  const acrescimoDefault =
    defaults?.acrescimo_preco != null
      ? defaults.acrescimo_preco.toFixed(2).replace(".", ",")
      : "";

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className={label}>Foto</label>
        <div className="mt-1">
          <ImageUpload pasta="tecidos" defaultUrl={defaults?.foto_url} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
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
          <label className={label}>Cor</label>
          <input
            name="cor"
            defaultValue={defaults?.cor ?? ""}
            className={input}
          />
        </div>
      </div>

      <div>
        <label className={label}>Acréscimo de preço (R$)</label>
        <input
          name="acrescimo_preco"
          inputMode="decimal"
          placeholder="0,00"
          defaultValue={acrescimoDefault}
          className={input}
        />
        {campos.acrescimo_preco && (
          <p className={fieldError}>{campos.acrescimo_preco}</p>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm text-mute">
        <input
          type="checkbox"
          name="ativo"
          defaultChecked={defaults?.ativo ?? true}
          className="accent-[#2f9e5f]"
        />
        <span>Ativo (disponível para escolha)</span>
      </label>

      {state.erro && <p className="text-sm text-danger">{state.erro}</p>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={pending} className={btnPrimary}>
          {pending ? "Salvando..." : textoBotao}
        </button>
        <a href="/catalogo/tecidos" className={btnGhost}>
          Cancelar
        </a>
      </div>
    </form>
  );
}
