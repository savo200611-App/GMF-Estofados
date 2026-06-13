"use client";

import { useActionState, useState } from "react";

import {
  CATEGORIAS_DESPESA,
  CATEGORIAS_RECEITA,
  CATEGORIA_LABEL,
  FORMAS,
  FORMA_LABEL,
  TIPOS,
  TIPO_LABEL,
  type TipoLancamento,
} from "@/lib/validations/lancamento";
import { btnGhost, btnPrimary, fieldError, input, label } from "@/components/ui";
import { criarLancamento, type LancamentoFormState } from "./actions";

function hoje() {
  return new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD local
}

export function LancamentoForm({
  tipoInicial = "receita",
}: {
  tipoInicial?: TipoLancamento;
}) {
  const [state, formAction, pending] = useActionState<
    LancamentoFormState,
    FormData
  >(criarLancamento, {});
  const [tipo, setTipo] = useState<TipoLancamento>(tipoInicial);
  const campos = state.campos ?? {};

  const categorias =
    tipo === "receita" ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA;

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className={label}>Tipo *</label>
        <div className="mt-1 grid grid-cols-2 gap-2">
          {TIPOS.map((t) => {
            const ativo = tipo === t;
            const cor =
              t === "receita"
                ? ativo
                  ? "border-ok bg-ok/15 text-ok"
                  : "border-edge text-mute"
                : ativo
                  ? "border-danger bg-danger/15 text-[#e07a6e]"
                  : "border-edge text-mute";
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTipo(t)}
                className={`rounded-md border-[1.5px] py-2.5 text-[15px] font-semibold transition hover:opacity-75 ${cor}`}
              >
                {TIPO_LABEL[t]}
              </button>
            );
          })}
        </div>
        <input type="hidden" name="tipo" value={tipo} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Categoria *</label>
          <select name="categoria" className={input} defaultValue="">
            <option value="" disabled>
              Selecione…
            </option>
            {categorias.map((c) => (
              <option key={c} value={c}>
                {CATEGORIA_LABEL[c]}
              </option>
            ))}
          </select>
          {campos.categoria && (
            <p className={fieldError}>{campos.categoria}</p>
          )}
        </div>
        <div>
          <label className={label}>Valor (R$) *</label>
          <input
            name="valor"
            inputMode="decimal"
            placeholder="0,00"
            className={input}
          />
          {campos.valor && <p className={fieldError}>{campos.valor}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Data *</label>
          <input
            name="data"
            type="date"
            defaultValue={hoje()}
            className={input}
          />
          {campos.data && <p className={fieldError}>{campos.data}</p>}
        </div>
        <div>
          <label className={label}>Forma de pagamento</label>
          <select name="forma_pagamento" className={input} defaultValue="">
            <option value="">—</option>
            {FORMAS.map((f) => (
              <option key={f} value={f}>
                {FORMA_LABEL[f]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={label}>Descrição</label>
        <input
          name="descricao"
          placeholder="ex: sinal do sofá 3 lugares — cliente Maria"
          className={input}
        />
      </div>

      <div>
        <label className={label}>Observações</label>
        <textarea name="observacoes" rows={2} className={input} />
      </div>

      {state.erro && <p className="text-sm text-danger">{state.erro}</p>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={pending} className={btnPrimary}>
          {pending ? "Salvando..." : "Salvar lançamento"}
        </button>
        <a href="/caixa" className={btnGhost}>
          Cancelar
        </a>
      </div>
    </form>
  );
}
