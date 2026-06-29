-- ============================================================
-- Fit Match · Auto-limpieza del chat grupal
-- ------------------------------------------------------------
-- El frontend ya solo MUESTRA mensajes de las ultimas 12 horas
-- (constante CHAT_VISIBLE_HOURS en jugar.html). Este script BORRA
-- de verdad los mensajes viejos para que la tabla no crezca infinito.
--
-- Como ejecutarlo: Supabase -> SQL Editor -> pega y corre.
-- ============================================================

-- 0) (Por si acaso) asegurar que messages tiene created_at
ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

-- ============================================================
-- OPCION A (RECOMENDADA): Borrado automatico cada hora con pg_cron
-- ============================================================
-- 1) Habilita la extension pg_cron (solo una vez)
create extension if not exists pg_cron;

-- 2) Programa el borrado: cada hora elimina mensajes con mas de 12 horas
--    (si ya existe un job con este nombre, primero lo quita)
select cron.unschedule('fitmatch_limpiar_chat')
where exists (select 1 from cron.job where jobname = 'fitmatch_limpiar_chat');

select cron.schedule(
  'fitmatch_limpiar_chat',
  '0 * * * *',  -- al minuto 0 de cada hora
  $$ delete from public.messages where created_at < now() - interval '12 hours'; $$
);

-- Para ver los jobs programados:
--   select * from cron.job;
-- Para borrar el job:
--   select cron.unschedule('fitmatch_limpiar_chat');

-- ============================================================
-- OPCION B (MANUAL): Si no quieres pg_cron, corre esto cuando
-- quieras vaciar mensajes viejos a mano.
-- ============================================================
-- delete from public.messages where created_at < now() - interval '12 hours';

-- Para vaciar TODO el chat de golpe (cuidado, borra todo):
-- delete from public.messages;
