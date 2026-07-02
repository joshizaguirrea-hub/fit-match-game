-- ============================================================
-- sql-salas.sql - Salas de Entrenamiento programadas (Fit Match)
-- ------------------------------------------------------------
-- Corre esto UNA VEZ en Supabase -> SQL Editor.
-- Crea 2 tablas: training_rooms (la sala) y training_room_members
-- (quien esta dentro). Ambas con RLS y Realtime activado.
-- ============================================================

-- ---------- TABLA: training_rooms ----------
create table if not exists public.training_rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  host_id uuid not null references public.profiles(id) on delete cascade,
  host_apodo text,
  routine_id text,
  routine_name text,
  routine_category text default 'gods',
  scheduled_at timestamptz,
  status text not null default 'abierta',   -- 'abierta' | 'en_curso' | 'cerrada'
  guild_id uuid,
  created_at timestamptz default now()
);

create index if not exists idx_rooms_status on public.training_rooms (status, scheduled_at);
create index if not exists idx_rooms_code on public.training_rooms (code);

alter table public.training_rooms enable row level security;

drop policy if exists "rooms_select" on public.training_rooms;
create policy "rooms_select" on public.training_rooms
  for select using (true);   -- salas publicas: todos las ven

drop policy if exists "rooms_insert" on public.training_rooms;
create policy "rooms_insert" on public.training_rooms
  for insert with check (auth.uid() = host_id);

drop policy if exists "rooms_update" on public.training_rooms;
create policy "rooms_update" on public.training_rooms
  for update using (auth.uid() = host_id);

drop policy if exists "rooms_delete" on public.training_rooms;
create policy "rooms_delete" on public.training_rooms
  for delete using (auth.uid() = host_id);

-- ---------- TABLA: training_room_members ----------
create table if not exists public.training_room_members (
  room_id uuid not null references public.training_rooms(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  apodo text,
  joined_at timestamptz default now(),
  primary key (room_id, user_id)
);

create index if not exists idx_room_members_room on public.training_room_members (room_id);

alter table public.training_room_members enable row level security;

drop policy if exists "rm_select" on public.training_room_members;
create policy "rm_select" on public.training_room_members
  for select using (true);

drop policy if exists "rm_insert" on public.training_room_members;
create policy "rm_insert" on public.training_room_members
  for insert with check (auth.uid() = user_id);

drop policy if exists "rm_delete" on public.training_room_members;
create policy "rm_delete" on public.training_room_members
  for delete using (auth.uid() = user_id);

-- ---------- REALTIME (para ver salas y el arranque en vivo) ----------
-- Si alguna ya esta en la publicacion, ignora el error que salga.
alter publication supabase_realtime add table public.training_rooms;
alter publication supabase_realtime add table public.training_room_members;
