"use client";

import { useState, useTransition } from "react";

import { brl } from "@/lib/format";
import { btnGhost, btnPrimary, input, label } from "@/components/ui";
import { criarPedido, type ItemInput } from "./actions";

type Cliente = { id: string; nome: string };
type Modelo = { id: string; nome: string; preco_base: number };
type Tecido = { id: string; nome: string; acrescimo_preco: number };

type Linha = ItemInput & { uid: string };

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
    return (
      (m.preco_base + (t?.acrescimo_preco ?? 0)) *
      Math.max(1, linha.quantidade)
    );
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
    <div className="space-y-5">
      <div className="rounded-2xl border border-edge bg-surface p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Cliente *</label>
            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className={input}
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
            <label className={label}>Entrega prevista</label>
            <input
              type="date"
              value={entrega}
              onChange={(e) => setEntrega(e.target.value)}
              className={input}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-edge bg-surface p-6">
        <h2 className="mb-4 text-xs font-medium uppercase tracking-wide text-mute">
          Itens
        </h2>
        <div className="space-y-4">
          {linhas.map((linha) => (
            <div
              key={linha.uid}
              className="rounded-xl border border-edge bg-raise/50 p-4"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs text-mute">Modelo</label>
                  <select
                    value={linha.modelo_id ?? ""}
                    onChange={(e) =>
                      atualizar(linha.uid, {
                        modelo_id: e.target.value || null,
                      })
                    }
                    className={input}
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
                  <label className="block text-xs text-mute">Tecido</label>
                  <select
                    value={linha.tecido_id ?? ""}
                    onChange={(e) =>
                      atualizar(linha.uid, {
                        tecido_id: e.target.value || null,
                      })
                    }
                    className={input}
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
                  <label className="block text-xs text-mute">Medida</label>
                  <input
                    value={linha.descricao_medida}
                    onChange={(e) =>
                      atualizar(linha.uid, {
                        descricao_medida: e.target.value,
                      })
                    }
                    placeholder="ex: 2,20m"
                    className={input}
                  />
                </div>
                <div>
                  <label className="block text-xs text-mute">Extras</label>
                  <input
                    value={linha.extras}
                    onChange={(e) =>
                      atualizar(linha.uid, { extras: e.target.value })
                    }
                    placeholder="ex: almofadas"
                    className={input}
                  />
                </div>
                <div>
                  <label className="block text-xs text-mute">Qtd</label>
                  <input
                    type="number"
                    min={1}
                    value={linha.quantidade}
                    onChange={(e) =>
                      atualizar(linha.uid, {
                        quantidade: Number(e.target.value) || 1,
                      })
                    }
                    className={input}
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => removerLinha(linha.uid)}
                  className="text-sm text-mute transition hover:text-danger"
                >
                  Remover item
                </button>
                <span className="text-sm font-medium text-ink">
                  {brl(precoLinha(linha))}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={novaLinhaState}
          className={`mt-4 ${btnGhost}`}
        >
          + Adicionar item
        </button>
      </div>

      <div className="rounded-2xl border border-edge bg-surface p-6">
        <label className={label}>Observações</label>
        <textarea
          rows={2}
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          className={input}
        />
      </div>

      {erro && <p className="text-sm text-danger">{erro}</p>}

      <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-deep to-brand px-6 py-4">
        <span className="text-xs uppercase tracking-wide text-white/75">
          Total
        </span>
        <span className="text-xl font-semibold text-white">{brl(total)}</span>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={salvar}
          disabled={pending}
          className={btnPrimary}
        >
          {pending ? "Salvando..." : "Criar pedido"}
        </button>
        <a href="/pedidos" className={btnGhost}>
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
