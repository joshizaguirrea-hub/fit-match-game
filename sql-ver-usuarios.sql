-- ============================================================
-- Fit Match · ARREGLO: ver a otros usuarios (amigos / ranking)
-- ------------------------------------------------------------
-- PROBLEMA: el script original usaba "CREATE POLICY IF NOT EXISTS",
-- que NO es sintaxis valida en PostgreSQL, asi que la politica de
-- lectura publica de 'profiles' nunca se creo. Por eso solo te ves
-- a ti mismo y no aparecen otros atletas (ni online ni offline).
--
-- COMO USAR: Supabase -> SQL Editor -> pega TODO -> Run.
-- ============================================================

-- 1) PROFILES: que TODOS puedan LEER los perfiles (apodo, puntos, etc.)
--    (necesario para ranking, lista de atletas y hacer amigos)
DROP POLICY IF EXISTS "Perfiles públicos" ON public.profiles;
CREATE POLICY "Perfiles públicos"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Cada quien sigue pudiendo EDITAR/CREAR solo su propio perfil
DROP POLICY IF EXISTS "Actualizar propio perfil" ON public.profiles;
CREATE POLICY "Actualizar propio perfil"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Insertar propio perfil" ON public.profiles;
CREATE POLICY "Insertar propio perfil"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 2) WORKOUTS: lectura publica (para ver stats de otros en el ranking)
DROP POLICY IF EXISTS "Ver workouts públicos" ON public.workouts;
CREATE POLICY "Ver workouts públicos"
  ON public.workouts
  FOR SELECT
  USING (true);

-- 3) (Por si acaso) asegurar que el trigger crea el perfil al registrarse
--    Si un usuario se registro y NO tiene fila en profiles, esto la crea
--    para todos los que falten:
INSERT INTO public.profiles (id, apodo, nickname)
SELECT u.id, split_part(u.email, '@', 1), split_part(u.email, '@', 1)
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

-- 4) VERIFICACION: ver cuantos perfiles hay y las politicas activas
SELECT count(*) AS total_perfiles FROM public.profiles;

SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- ============================================================
-- FIN. Despues de correr esto, recarga el juego: ya deberias
-- ver a los demas atletas en la lista de registrados/offline.
-- ============================================================
