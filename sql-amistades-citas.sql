-- ============================================================
-- Fit Match · Permisos (RLS) para AMISTADES y CITAS
-- ------------------------------------------------------------
-- Asegura que enviar/recibir solicitudes de amistad y citas
-- funcione sin fallar por seguridad.
-- COMO USAR: SQL Editor -> pega TODO -> Run.
-- ============================================================

-- ========== AMISTADES (friendships) ==========
ALTER TABLE public.friendships
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pendiente';

ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "fr_insert" ON public.friendships;
CREATE POLICY "fr_insert" ON public.friendships
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "fr_select" ON public.friendships;
CREATE POLICY "fr_select" ON public.friendships
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);

DROP POLICY IF EXISTS "fr_update" ON public.friendships;
CREATE POLICY "fr_update" ON public.friendships
  FOR UPDATE USING (auth.uid() = friend_id OR auth.uid() = user_id);

-- ========== CITAS (appointments) ==========
ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pendiente';

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ap_insert" ON public.appointments;
CREATE POLICY "ap_insert" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "ap_select" ON public.appointments;
CREATE POLICY "ap_select" ON public.appointments
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "ap_update" ON public.appointments;
CREATE POLICY "ap_update" ON public.appointments
  FOR UPDATE USING (auth.uid() = receiver_id OR auth.uid() = sender_id);

-- ========== VERIFICACION ==========
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('friendships', 'appointments')
ORDER BY tablename, policyname;
