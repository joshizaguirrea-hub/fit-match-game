-- ============================================================
-- Fit Match · "En linea ahora" (presencia de usuarios)
-- Agrega la columna last_seen a profiles. Cada usuario la actualiza
-- mientras tiene el juego abierto; se considera "en linea" a quien
-- tuvo actividad en los ultimos 3 minutos.
-- COMO USAR: Supabase -> SQL Editor -> pega -> Run.
-- ============================================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_seen timestamptz;

-- Indice para consultar rapido a los activos recientes
CREATE INDEX IF NOT EXISTS idx_profiles_last_seen ON public.profiles (last_seen);

-- NOTA sobre permisos (RLS):
-- Para que CADA usuario pueda marcar SU propio last_seen, ya deberia existir
-- una politica de UPDATE de su propia fila (auth.uid() = id). Si tu update
-- de perfil ya funciona (apodo, peso, etc.), esto funcionara igual.
