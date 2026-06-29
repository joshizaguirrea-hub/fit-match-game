-- ============================================================
-- Fit Match · Activar TIEMPO REAL (chat en vivo) + diagnostico
-- ------------------------------------------------------------
-- Supabase NO activa el realtime en las tablas por defecto. Sin esto,
-- los mensajes nuevos no aparecen en vivo (solo al recargar).
-- COMO USAR: SQL Editor -> pega TODO -> Run.
-- ============================================================

-- 1) Asegurar RLS y politicas de la tabla messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leer mensajes" ON public.messages;
CREATE POLICY "Leer mensajes"
  ON public.messages
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Enviar mensajes" ON public.messages;
CREATE POLICY "Enviar mensajes"
  ON public.messages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 2) Agregar la tabla messages a la publicacion de tiempo real
--    (solo si no esta ya agregada, para no dar error)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  END IF;
END $$;

-- ============================================================
-- 3) DIAGNOSTICO: cuantas cuentas hay y sus apodos
--    (si solo sale 1, tu amigo de pruebas NO tiene cuenta todavia)
-- ============================================================
SELECT apodo, created_at
FROM public.profiles
ORDER BY created_at;

-- 4) Confirmar que messages quedo en tiempo real (debe salir 1 fila)
SELECT schemaname, tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime' AND tablename = 'messages';

-- ============================================================
-- FIN. Tras correrlo: recarga el juego. El chat ya sera en vivo.
-- ============================================================
