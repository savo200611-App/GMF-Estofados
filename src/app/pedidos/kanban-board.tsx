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
  { status: "orcado", titulo: "Orcado" },
  { status: "fechado", titulo: "Fechado" },
  { status: "producao", titulo: "Producao" },
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
    setCards((cs) =>
      cs.map((c) => (c.id === id ? { ...c, status } : c)),
    );
    startTransition(() => {
      moverPedido(id, status as never);
    });
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
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
            className={`flex min-h-64 flex-col rounded-2xl border bg-neutral-100/60 p-3 transition ${
              sobre === col.status
                ? "border-neutral-900 bg-neutral-100"
                : "border-neutral-200"
            }`}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <span className="text-sm font-medium text-neutral-700">
                {col.titulo}
              </span>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs text-neutral-500">
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
                  className={`block cursor-grab rounded-xl border border-neutral-200 bg-white p-3 shadow-sm transition active:cursor-grabbing ${
                    arrastando === card.id ? "opacity-40" : "hover:border-neutral-400"
                  }`}
                >
                  <p className="truncate text-sm font-medium text-neutral-900">
                    {card.cliente_nome}
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">
                    {brl(card.valor_total)}
                  </p>
                </a>
              ))}
            </div>

            {lista.length > 0 && (
              <p className="mt-3 px-1 text-xs text-neutral-400">
                {brl(totalColuna)}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
