-- ============================================================
-- Fit Match · Campos de Perfil Fitness (onboarding inteligente)
-- Pega TODO esto en Supabase > SQL Editor > Run.
-- Es seguro: solo AGREGA columnas si no existen, no borra nada.
-- ============================================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS edad            INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS sexo            TEXT;     -- 'hombre' | 'mujer' | 'otro'
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS peso_kg         NUMERIC;  -- kilogramos
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS altura_cm       NUMERIC;  -- centimetros
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS experiencia     TEXT;     -- 'principiante' | 'intermedio' | 'avanzado'
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS objetivo        TEXT;     -- 'bajar_grasa' | 'musculo' | 'salud' | 'movilidad' | 'resistencia'
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS equipo          TEXT;     -- 'casa_sin' | 'casa_basico' | 'gimnasio'
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dias_semana     INTEGER;  -- 2,4,6...
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_done BOOLEAN DEFAULT FALSE;
