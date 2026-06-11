"use client";

import { useState, useTransition } from "react";

import { brl } from "@/lib/format";
import { criarPedido, type ItemInput } from "./actions";

type Cliente = { id: string; nome: string };
type Modelo = { id: string; nome: string; preco_base: number };
type Tecido = { id: string; nome: string; acrescimo_preco: number };

type Linha = ItemInput & { uid: string };

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900";

export function PedidoBuilder({
  clientes,
  modelos,
  tecidos,
}: {
  clientes: Cliente[];
  modelos: Modelo[];
  tecidos: Tecido[];
}) {
  const [clienteId, setClienteId] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [entrega, setEntrega] = useState("");
  const [linhas, setLinhas] = useState<Linha[]>([novaLinha()]);
  const [erro, setErro] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function novaLinhaState() {
    setLinhas((l) => [...l, novaLinha()]);
  }
  function removerLinha(uid: string) {
    setLinhas((l) => (l.length > 1 ? l.filter((x) => x.uid !== uid) : l));
  }
  function atualizar(uid: string, patch: Partial<Linha>) {
    setLinhas((l) => l.map((x) => (x.uid === uid ? { ...x, ...patch } : x)));
  }

  function precoLinha(linha: Linha) {
    const m = modelos.find((x) => x.id === linha.modelo_id);
    const t = tecidos.find((x) => x.id === linha.tecido_id);
    if (!m) return 0;
    return (m.preco_base + (t?.acrescimo_preco ?? 0)) * Math.max(1, linha.quantidade);
  }

  const total = linhas.reduce((acc, l) => acc + precoLinha(l), 0);

  function salvar() {
    setErro(null);
    startTransition(async () => {
      const res = await criarPedido({
        cliente_id: clienteId,
        observacoes,
        data_entrega_prevista: entrega || null,
        itens: linhas.map(({ uid: _uid, ...resto }) => resto),
      });
      if (res?.erro) setErro(res.erro);
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Cliente *
            </label>
            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className={`mt-1 ${inputClass}`}
            >
              <option value="">Selecione...</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Entrega prevista
            </label>
            <input
              type="date"
              value={entrega}
              onChange={(e) => setEntrega(e.target.value)}
              className={`mt-1 ${inputClass}`}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-neutral-400">
          Itens
        </h2>
        <div className="space-y-4">
          {linhas.map((linha) => (
            <div
              key={linha.uid}
              className="rounded-xl border border-neutral-200 p-4"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs text-neutral-500">
                    Modelo
                  </label>
                  <select
                    value={linha.modelo_id ?? ""}
                    onChange={(e) =>
                      atualizar(linha.uid, {
                        modelo_id: e.target.value || null,
                      })
                    }
                    className={`mt-1 ${inputClass}`}
                  >
                    <option value="">Selecione...</option>
                    {modelos.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nome} ({brl(m.preco_base)})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-neutral-500">
                    Tecido
                  </label>
                  <select
                    value={linha.tecido_id ?? ""}
                    onChange={(e) =>
                      atualizar(linha.uid, {
                        tecido_id: e.target.value || null,
                      })
                    }
                    className={`mt-1 ${inputClass}`}
                  >
                    <option value="">Sem tecido</option>
                    {tecidos.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nome}
                        {t.acrescimo_preco > 0
                          ? ` (+${brl(t.acrescimo_preco)})`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-xs text-neutral-500">
                    Medida
                  </label>
                  <input
                    value={linha.descricao_medida}
                    onChange={(e) =>
                      atualizar(linha.uid, { descricao_medida: e.target.value })
                    }
                    placeholder="ex: 2,20m"
                    className={`mt-1 ${inputClass}`}
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500">
                    Extras
                  </label>
                  <input
                    value={linha.extras}
                    onChange={(e) =>
                      atualizar(linha.uid, { extras: e.target.value })
                    }
                    placeholder="ex: almofadas"
                    className={`mt-1 ${inputClass}`}
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500">
                    Qtd
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={linha.quantidade}
                    onChange={(e) =>
                      atualizar(linha.uid, {
                        quantidade: Number(e.target.value) || 1,
                      })
                    }
                    className={`mt-1 ${inputClass}`}
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => removerLinha(linha.uid)}
                  className="text-sm text-neutral-500 transition hover:text-red-600"
                >
                  Remover item
                </button>
                <span className="text-sm font-medium text-neutral-900">
                  {brl(precoLinha(linha))}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={novaLinhaState}
          className="mt-4 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 transition hover:bg-neutral-100"
        >
          + Adicionar item
        </button>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <label className="block text-sm font-medium text-neutral-700">
          Observacoes
        </label>
        <textarea
          rows={2}
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          className={`mt-1 ${inputClass}`}
        />
      </div>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <div className="flex items-center justify-between rounded-2xl border border-neutral-900 bg-neutral-900 px-6 py-4 text-white">
        <span className="text-sm uppercase tracking-wide text-neutral-300">
          Total
        </span>
        <span className="text-xl font-semibold">{brl(total)}</span>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={salvar}
          disabled={pending}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
        >
          {pending ? "Salvando..." : "Criar pedido"}
        </button>
        <a
          href="/pedidos"
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition hover:bg-neutral-100"
        >
          Cancelar
        </a>
      </div>
    </div>
  );
}

function novaLinha(): Linha {
  return {
    uid: crypto.randomUUID(),
    modelo_id: null,
    tecido_id: null,
    descricao_medida: "",
    extras: "",
    quantidade: 1,
  };
}
