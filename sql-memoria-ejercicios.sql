-- ============================================================
-- sql-memoria-ejercicios.sql - Memoria en la nube (Fit Match)
-- ------------------------------------------------------------
-- Corre esto UNA VEZ en Supabase -> SQL Editor -> pega TODO -> Run.
-- Crea la tabla user_memory: guarda, por usuario, un unico blob JSON
-- con TODO lo que el "cerebro" (fm-memory.js) recuerda:
--   - peso y reps por ejercicio (por maquina de gimnasio)
--   - veces que hiciste cada ejercicio
--   - rutinas favoritas y recientes
-- Un solo renglon por usuario (user_id). RLS: cada quien ve/edita SOLO lo suyo.
-- ============================================================

create table if not exists public.user_memory (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table public.user_memory enable row level security;

-- Cada usuario SOLO puede ver su propia memoria
drop policy if exists "um_select" on public.user_memory;
create policy "um_select" on public.user_memory
  for select using (auth.uid() = user_id);

-- Cada usuario SOLO puede crear su propia fila
drop policy if exists "um_insert" on public.user_memory;
create policy "um_insert" on public.user_memory
  for insert with check (auth.uid() = user_id);

-- Cada usuario SOLO puede actualizar su propia fila
drop policy if exists "um_update" on public.user_memory;
create policy "um_update" on public.user_memory
  for update using (auth.uid() = user_id);

-- (Opcional) borrar la propia memoria
drop policy if exists "um_delete" on public.user_memory;
create policy "um_delete" on public.user_memory
  for delete using (auth.uid() = user_id);

-- Verificacion
-- select user_id, jsonb_pretty(data), updated_at from public.user_memory;
