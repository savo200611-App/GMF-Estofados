-- =============================================================
-- GMF Estofados - Migration 0003: remove tecidos
-- O fluxo real: catalogo e vitrine, negociacao acontece no WhatsApp.
-- O preco do item passa a ser definido no pedido (negociado),
-- pre-preenchido com o preco base do modelo.
-- =============================================================

alter table pedido_itens drop column if exists tecido_id;

drop table if exists tecidos;
