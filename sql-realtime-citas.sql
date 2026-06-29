-- ============================================================
-- Fit Match · Activar Realtime para avisos de citas
-- Necesario para que la notificacion de "nueva cita" llegue al instante.
-- COMO USAR: Supabase -> SQL Editor -> pega -> Run.
-- (Si una tabla ya estaba en la publicacion, marcara error inofensivo;
--  puedes correr cada linea por separado.)
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE friendships;

-- Verificar que tablas estan en Realtime:
SELECT tablename FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
