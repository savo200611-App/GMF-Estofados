-- =============================================================
-- GMF Estofados - Migration 0004: Caixa / Financeiro
-- Lancamentos (receitas e despesas), com vinculo opcional a pedidos.
-- RLS restrita a staff, mesmo padrao da coluna vertebral.
-- =============================================================

-- ---------- Enums ----------
do $$ begin
  create type tipo_lancamento as enum ('receita', 'despesa');
exception when duplicate_object then null; end $$;

do $$ begin
  create type forma_pagamento as enum ('pix', 'dinheiro', 'cartao', 'boleto', 'transferencia', 'outro');
exception when duplicate_object then null; end $$;

-- ---------- lancamentos ----------
create table if not exists lancamentos (
  id uuid primary key default gen_random_uuid(),
  tipo tipo_lancamento not null,
  categoria text not null,
  descricao text,
  valor numeric(10,2) not null check (valor >= 0),
  data date not null default current_date,
  forma_pagamento forma_pagamento,
  pedido_id uuid references pedidos(id) on delete set null,
  observacoes text,
  criado_por uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_lancamentos_data on lancamentos (data desc);
create index if not exists idx_lancamentos_tipo on lancamentos (tipo);
create index if not exists idx_lancamentos_pedido on lancamentos (pedido_id);

-- ---------- Trigger updated_at ----------
drop trigger if exists trg_lancamentos_updated on lancamentos;
create trigger trg_lancamentos_updated before update on lancamentos
  for each row execute function set_updated_at();

-- ---------- RLS: staff tem acesso total ----------
alter table lancamentos enable row level security;

drop policy if exists "lancamentos_staff_all" on lancamentos;
create policy "lancamentos_staff_all" on lancamentos for all
  using (is_staff()) with check (is_staff());
