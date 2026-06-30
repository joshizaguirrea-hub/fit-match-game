-- ============================================================
-- Fit Match · Perfil de Salud (PAR-Q) - columnas en profiles
-- Pegar y ejecutar en Supabase: SQL Editor -> New query -> Run
-- Seguro de re-ejecutar (IF NOT EXISTS).
-- ============================================================

alter table public.profiles add column if not exists med_done boolean default false;
-- Tamiz cardiovascular (PAR-Q)
alter table public.profiles add column if not exists med_corazon boolean default false;       -- condicion cardiaca / presion / supervision medica
alter table public.profiles add column if not exists med_dolor_pecho boolean default false;   -- dolor de pecho / mareo / desmayo al esforzarse
alter table public.profiles add column if not exists med_medicamentos boolean default false;  -- medicamentos para corazon o presion
-- Lesiones (lista separada por comas: rodilla,hombro,espalda,cuello,otra)
alter table public.profiles add column if not exists med_lesiones text;
-- Estado: 'no' | 'embarazada' | 'posparto'
alter table public.profiles add column if not exists med_estado text;
-- Notas libres del usuario
alter table public.profiles add column if not exists med_notas text;

-- Listo. Estos campos los llena el cuestionario de Perfil de Salud (paso 5).
