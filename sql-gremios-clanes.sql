-- ============================================================
-- sql-gremios-clanes.sql - Gremios / Clanes (Fit Match)
-- ------------------------------------------------------------
-- Corre esto UNA VEZ en Supabase -> SQL Editor.
-- Crea la tabla 'guilds' (el clan) y agrega la columna
-- 'guild_id' a 'profiles' (a que clan pertenece cada usuario).
-- Requisito de la app para FUNDAR: ser rango Cabo (>=50 pts).
-- Limite: 30 miembros por clan (validado en el frontend).
-- ============================================================

-- ---------- TABLA: guilds (el clan/gremio) ----------
create table if not exists public.guilds (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,                 -- nombre unico del clan
  description text,
  leader_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now()
);

create index if not exists idx_guilds_leader on public.guilds (leader_id);

alter table public.guilds enable row level security;

-- Todos pueden VER la lista de gremios publicos.
drop policy if exists "guilds_select" on public.guilds;
create policy "guilds_select" on public.guilds
  for select using (true);

-- Solo puedes fundar un gremio donde TU seas el lider.
drop policy if exists "guilds_insert" on public.guilds;
create policy "guilds_insert" on public.guilds
  for insert with check (auth.uid() = leader_id);

-- Solo el lider puede editar su gremio.
drop policy if exists "guilds_update" on public.guilds;
create policy "guilds_update" on public.guilds
  for update using (auth.uid() = leader_id);

-- Solo el lider puede borrar su gremio.
drop policy if exists "guilds_delete" on public.guilds;
create policy "guilds_delete" on public.guilds
  for delete using (auth.uid() = leader_id);

-- ---------- COLUMNA: profiles.guild_id (a que clan perteneces) ----------
alter table public.profiles
  add column if not exists guild_id uuid references public.guilds(id) on delete set null;

create index if not exists idx_profiles_guild on public.profiles (guild_id);

-- ---------- REALTIME (para ver clanes/miembros en vivo) ----------
-- Idempotente: no falla si la tabla YA estaba en la publicacion.
do $$
begin
  alter publication supabase_realtime add table public.guilds;
exception
  when duplicate_object then null;  -- ya estaba agregada, ignorar
end $$;

-- ---------- Verificacion ----------
-- select id, name, leader_id, created_at from public.guilds;
-- select id, apodo, guild_id from public.profiles where guild_id is not null;
