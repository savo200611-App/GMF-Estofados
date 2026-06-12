"use client";

import { useState, useTransition } from "react";

import { brl } from "@/lib/format";
import { moverPedido } from "./actions";

export type PedidoCard = {
  id: string;
  cliente_nome: string;
  valor_total: number;
  status: string;
};

const COLUNAS: { status: string; titulo: string }[] = [
  { status: "novo", titulo: "Novo" },
  { status: "orcado", titulo: "Orçado" },
  { status: "fechado", titulo: "Fechado" },
  { status: "producao", titulo: "Produção" },
  { status: "entregue", titulo: "Entregue" },
];

export function KanbanBoard({ inicial }: { inicial: PedidoCard[] }) {
  const [cards, setCards] = useState(inicial);
  const [arrastando, setArrastando] = useState<string | null>(null);
  const [sobre, setSobre] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function soltar(status: string) {
    setSobre(null);
    const id = arrastando;
    setArrastando(null);
    if (!id) return;

    const atual = cards.find((c) => c.id === id);
    if (!atual || atual.status === status) return;

    // Atualizacao otimista.
    setCards((cs) => cs.map((c) => (c.id === id ? { ...c, status } : c)));
    startTransition(() => {
      moverPedido(id, status as never);
    });
  }

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {COLUNAS.map((col) => {
        const lista = cards.filter((c) => c.status === col.status);
        const totalColuna = lista.reduce((a, c) => a + c.valor_total, 0);
        return (
          <div
            key={col.status}
            onDragOver={(e) => {
              e.preventDefault();
              setSobre(col.status);
            }}
            onDragLeave={() => setSobre((s) => (s === col.status ? null : s))}
            onDrop={() => soltar(col.status)}
            className={`flex min-h-64 flex-col rounded-2xl border p-3 transition ${
              sobre === col.status
                ? "border-brand bg-raise"
                : "border-edge bg-surface"
            }`}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <span className="text-sm font-bold text-ink">{col.titulo}</span>
              <span className="rounded-full bg-raise px-2 py-0.5 text-xs font-semibold text-mute">
                {lista.length}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-2">
              {lista.map((card) => (
                <a
                  key={card.id}
                  href={`/pedidos/${card.id}`}
                  draggable
                  onDragStart={() => setArrastando(card.id)}
                  onDragEnd={() => setArrastando(null)}
                  className={`block cursor-grab rounded-md border border-edge border-l-[3px] border-l-goldeep bg-raise p-3 transition active:cursor-grabbing ${
                    arrastando === card.id
                      ? "opacity-40"
                      : "hover:opacity-75"
                  }`}
                >
                  <p className="truncate text-sm font-bold text-ink">
                    {card.cliente_nome}
                  </p>
                  <p className="mt-1.5 text-[15px] font-bold text-brand">
                    {brl(card.valor_total)}
                  </p>
                </a>
              ))}
            </div>

            {lista.length > 0 && (
              <p className="mt-3 px-1 text-xs text-mute/70">
                {brl(totalColuna)}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
