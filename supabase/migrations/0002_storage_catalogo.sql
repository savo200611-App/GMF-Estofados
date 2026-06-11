-- =============================================================
-- GMF Estofados - Migration 0002: Storage do catalogo
-- Bucket publico para fotos de modelos e tecidos.
-- Leitura publica (necessaria para exibir as imagens / futuro site).
-- Escrita (upload/alterar/apagar) somente para staff autenticado.
-- =============================================================

insert into storage.buckets (id, name, public)
values ('catalogo', 'catalogo', true)
on conflict (id) do nothing;

-- Leitura publica das imagens do bucket.
drop policy if exists "catalogo_public_read" on storage.objects;
create policy "catalogo_public_read" on storage.objects for select
  using (bucket_id = 'catalogo');

-- Upload somente staff.
drop policy if exists "catalogo_staff_insert" on storage.objects;
create policy "catalogo_staff_insert" on storage.objects for insert
  with check (bucket_id = 'catalogo' and is_staff());

-- Atualizar somente staff.
drop policy if exists "catalogo_staff_update" on storage.objects;
create policy "catalogo_staff_update" on storage.objects for update
  using (bucket_id = 'catalogo' and is_staff())
  with check (bucket_id = 'catalogo' and is_staff());

-- Apagar somente staff.
drop policy if exists "catalogo_staff_delete" on storage.objects;
create policy "catalogo_staff_delete" on storage.objects for delete
  using (bucket_id = 'catalogo' and is_staff());
