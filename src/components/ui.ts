// Classes compartilhadas — Brand System GMF v1.0 (tema escuro · app).
// Verde para ação, ouro para o que é nobre, contorno para o secundário.
// Toque: opacidade .75, sem bounce. Raios: inputs 3 · botões 4 · cards 6.

export const input =
  "mt-1 w-full rounded-sm border-[1.5px] border-edge bg-raise px-3.5 py-2.5 text-[15px] text-ink placeholder:text-mute/60 outline-none transition focus:border-gold focus:shadow-[0_0_0_3px_rgba(198,162,78,0.18)]";

export const label =
  "block text-xs font-semibold tracking-wide text-mute";

export const btnPrimary =
  "rounded-md bg-brand px-5 py-2.5 text-[15px] font-semibold text-[#08130c] transition hover:opacity-75 disabled:opacity-45";

export const btnGold =
  "rounded-md bg-gold px-5 py-2.5 text-[15px] font-semibold text-[#1a130a] transition hover:opacity-75 disabled:opacity-45";

export const btnGhost =
  "rounded-md border-[1.5px] border-edge px-5 py-2.5 text-[15px] font-semibold text-ink transition hover:opacity-75";

export const card = "rounded-lg border border-edge bg-surface";

export const fieldError = "mt-1.5 text-sm text-[#e07a6e]";

export const STATUS_CHIP: Record<string, { label: string; cls: string }> = {
  novo: { label: "Novo", cls: "bg-raise text-mute border border-edge" },
  orcado: { label: "Orçado", cls: "bg-gold/15 text-gold" },
  fechado: { label: "Fechado", cls: "bg-brand/15 text-brand" },
  producao: { label: "Produção", cls: "bg-warn/20 text-[#dda53e]" },
  entregue: { label: "Entregue", cls: "bg-ok text-white" },
  cancelado: { label: "Cancelado", cls: "bg-danger/15 text-[#e07a6e]" },
};
