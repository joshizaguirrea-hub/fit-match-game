-- ============================================================
-- Fit Match · FASE 1: Economia de FitCoins
-- ------------------------------------------------------------
-- Agrega el monedero (coins) a cada perfil.
-- COMO USAR: Supabase -> SQL Editor -> pega TODO -> Run.
-- ============================================================

-- 1) Columna de monedas en profiles (arranca en 0)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS coins integer NOT NULL DEFAULT 0;

-- 2) (Opcional) Columnas para cosmeticos equipados (las usaremos en FASE 3)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS equipped_frame text;
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS equipped_title text;

-- 3) Verificacion
SELECT apodo, coins
FROM public.profiles
ORDER BY coins DESC;
