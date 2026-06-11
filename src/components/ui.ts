// Classes compartilhadas do design system GMF (tema escuro).

export const input =
  "mt-1 w-full rounded-xl border border-edge bg-raise px-3 py-2 text-sm text-ink placeholder:text-mute/60 outline-none transition focus:border-brand";

export const label = "block text-sm font-medium text-mute";

export const btnPrimary =
  "rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-deep disabled:opacity-60";

export const btnGhost =
  "rounded-xl border border-edge px-4 py-2 text-sm text-mute transition hover:bg-raise hover:text-ink";

export const card = "rounded-2xl border border-edge bg-surface";

export const fieldError = "mt-1 text-sm text-danger";

export const STATUS_CHIP: Record<string, { label: string; cls: string }> = {
  novo: { label: "Novo", cls: "bg-warn/15 text-warn" },
  orcado: { label: "Orçado", cls: "bg-info/15 text-info" },
  fechado: { label: "Fechado", cls: "bg-brand/15 text-brand" },
  producao: { label: "Produção", cls: "bg-gold/15 text-gold" },
  entregue: { label: "Entregue", cls: "bg-ok/15 text-ok" },
  cancelado: { label: "Cancelado", cls: "bg-danger/15 text-danger" },
};
