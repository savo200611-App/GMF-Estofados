-- =============================================================
-- GMF Estofados - Migration 0001: coluna vertebral
-- Clientes (CRM) + Catalogo (modelos/tecidos) + Pedidos/Orcamentos + Documentos
-- RLS ativada em todas as tabelas. Acesso restrito a staff (dono/dev).
-- =============================================================

create extension if not exists "pgcrypto";

-- ---------- Enums ----------
do $$ begin
  create type papel_usuario as enum ('dono', 'dev');
exception when duplicate_object then null; end $$;

do $$ begin
  create type origem_cliente as enum ('instagram', 'indicacao', 'site', 'whatsapp', 'outro');
exception when duplicate_object then null; end $$;

do $$ begin
  create type status_pedido as enum ('novo', 'orcado', 'fechado', 'producao', 'entregue', 'cancelado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type tipo_documento as enum ('orcamento', 'pedido', 'recibo');
exception when duplicate_object then null; end $$;

-- ---------- Helper: updated_at ----------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------- profiles (espelha auth.users) ----------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  email text,
  papel papel_usuario not null default 'dono',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Helper de seguranca: o usuario logado e staff (existe em profiles)?
create or replace function is_staff()
returns boolean language sql security definer stable
set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid());
$$;

-- ---------- clientes ----------
create table if not exists clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  telefone text,
  email text,
  cidade text,
  endereco text,
  origem origem_cliente not null default 'whatsapp',
  observacoes text,
  consentimento_lgpd boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_clientes_nome on clientes (nome);

-- ---------- modelos (catalogo) ----------
create table if not exists modelos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  foto_url text,
  preco_base numeric(10,2) not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_modelos_ativo on modelos (ativo);

-- ---------- tecidos ----------
create table if not exists tecidos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cor text,
  foto_url text,
  acrescimo_preco numeric(10,2) not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- pedidos ----------
create table if not exists pedidos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete restrict,
  status status_pedido not null default 'novo',
  valor_total numeric(10,2) not null default 0,
  observacoes text,
  criado_por uuid references profiles(id),
  data_entrega_prevista date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_pedidos_status on pedidos (status);
create index if not exists idx_pedidos_cliente on pedidos (cliente_id);

-- ---------- pedido_itens ----------
create table if not exists pedido_itens (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references pedidos(id) on delete cascade,
  modelo_id uuid references modelos(id) on delete set null,
  tecido_id uuid references tecidos(id) on delete set null,
  descricao_medida text,
  extras text,
  quantidade int not null default 1 check (quantidade > 0),
  preco_unitario numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_itens_pedido on pedido_itens (pedido_id);

-- ---------- documentos (orcamento/pedido/recibo em PDF) ----------
create table if not exists documentos (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references pedidos(id) on delete cascade,
  tipo tipo_documento not null default 'orcamento',
  pdf_url text,
  enviado_email text,
  enviado_em timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists idx_documentos_pedido on documentos (pedido_id);

-- ---------- Triggers updated_at ----------
do $$
declare t text;
begin
  foreach t in array array['profiles','clientes','modelos','tecidos','pedidos']
  loop
    execute format(
      'drop trigger if exists trg_%1$s_updated on %1$s;
       create trigger trg_%1$s_updated before update on %1$s
       for each row execute function set_updated_at();', t);
  end loop;
end $$;

-- =============================================================
-- RLS: tudo restrito a staff autenticado (dono/dev sao internos confiaveis)
-- =============================================================
alter table profiles      enable row level security;
alter table clientes      enable row level security;
alter table modelos       enable row level security;
alter table tecidos       enable row level security;
alter table pedidos       enable row level security;
alter table pedido_itens  enable row level security;
alter table documentos    enable row level security;

-- profiles: cada um le/edita o proprio; staff le todos
drop policy if exists "profiles_self_select" on profiles;
create policy "profiles_self_select" on profiles for select
  using (auth.uid() = id or is_staff());
drop policy if exists "profiles_self_update" on profiles;
create policy "profiles_self_update" on profiles for update
  using (auth.uid() = id) with check (auth.uid() = id);

-- Demais tabelas: staff tem acesso total (select/insert/update/delete)
do $$
declare tbl text;
begin
  foreach tbl in array array['clientes','modelos','tecidos','pedidos','pedido_itens','documentos']
  loop
    execute format('drop policy if exists "%1$s_staff_all" on %1$s;', tbl);
    execute format(
      'create policy "%1$s_staff_all" on %1$s for all
       using (is_staff()) with check (is_staff());', tbl);
  end loop;
end $$;

-- Cria profile automaticamente ao criar usuario no Auth.
create or replace function handle_new_user()
returns trigger language plpgsql security definer
set search_path = public as $$
begin
  insert into public.profiles (id, nome, email, papel)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)),
    new.email,
    'dono'
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
