-- ============================================================
-- Fit Match · NUTRICION: Plan personalizado (override del usuario)
-- Permite que el usuario use SU propio plan (de su nutriologo)
-- en lugar del calculado por el motor.
-- COMO USAR: Supabase -> SQL Editor -> pega -> Run.
-- ============================================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS use_custom_plan boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS custom_calories integer;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS custom_protein_g integer;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS custom_carbs_g integer;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS custom_fat_g integer;

SELECT apodo, use_custom_plan, custom_calories, custom_protein_g, custom_carbs_g, custom_fat_g
FROM public.profiles
WHERE use_custom_plan = true;
