-- ============================================================
-- Fit Match · Objetivos multiples
-- Permite que el usuario elija VARIOS objetivos (bajar grasa,
-- musculo, resistencia, etc.). Se guardan separados por coma.
-- La columna 'objetivo' (singular) se conserva como objetivo
-- PRINCIPAL para los calculos de nutricion.
-- COMO USAR: Supabase -> SQL Editor -> pega -> Run.
-- ============================================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS objetivos TEXT; -- ej: 'musculo,resistencia'
