"use client";

import { useState, useTransition } from "react";

import { btnGhost, btnPrimary } from "@/components/ui";
import { enviarOrcamentoPorEmail } from "./email-action";

export function AcoesPedido({
  pedidoId,
  emailCliente,
}: {
  pedidoId: string;
  emailCliente: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    tipo: "ok" | "erro";
    texto: string;
  } | null>(null);

  function enviar() {
    setFeedback(null);
    startTransition(async () => {
      const res = await enviarOrcamentoPorEmail(pedidoId);
      if (res.erro) setFeedback({ tipo: "erro", texto: res.erro });
      else setFeedback({ tipo: "ok", texto: "Orçamento enviado por e-mail." });
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={`/api/pedidos/${pedidoId}/pdf`}
        target="_blank"
        rel="noopener noreferrer"
        className={btnGhost}
      >
        Baixar PDF
      </a>

      {emailCliente && (
        <button onClick={enviar} disabled={pending} className={btnPrimary}>
          {pending ? "Enviando..." : "Enviar por e-mail"}
        </button>
      )}

      {feedback && (
        <span
          className={`text-sm ${feedback.tipo === "ok" ? "text-ok" : "text-danger"}`}
        >
          {feedback.texto}
        </span>
      )}
    </div>
  );
}
