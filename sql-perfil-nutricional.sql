-- ============================================================
-- Fit Match · NUTRICION Fase A: Perfil Nutricional
-- ------------------------------------------------------------
-- Agrega las columnas del cuestionario nutricional al perfil.
-- COMO USAR: Supabase -> SQL Editor -> pega TODO -> Run.
-- Todas son opcionales (el usuario llena lo que quiera).
-- ============================================================

-- Patron y estilo dietetico
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS diet_pattern text;   -- omnivoro/vegetariano/vegano/pescetariano
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS diet_style text;     -- ninguno/keto/lowcarb/mediterraneo/ayuno
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS meals_per_day integer; -- 3/4/5
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nutrition_pace text;  -- lento/moderado/agresivo

-- Salud y seguridad (texto libre, separado por comas)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS allergies text;       -- nueces, mariscos, gluten...
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS intolerances text;    -- lactosa...
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS medical_flags text;   -- diabetes, hipertension, embarazo... (guia general, no tratamiento)

-- Preferencias
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS dislikes text;        -- alimentos que NO come
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS spice_level text;     -- nada/medio/picante
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cuisine text;         -- cocina favorita

-- Logistica de cocina
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cook_time text;       -- rapido/medio/gusta_cocinar
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cook_skill text;      -- principiante/intermedio/avanzado
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS kitchen_equipment text; -- estufa, horno, licuadora, airfryer

-- Contexto y presupuesto (en RANGO, no ingreso directo)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country text;         -- para ingredientes locales
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS budget_tier text;     -- bajo/medio/alto

-- Bandera de cuestionario nutricional completado
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nutrition_done boolean DEFAULT false;

-- Verificacion
SELECT apodo, diet_pattern, diet_style, budget_tier, country
FROM public.profiles
ORDER BY apodo;
