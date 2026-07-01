-- ============================================================
-- Fit Match - Dias de entreno personalizados
-- Agrega la columna train_days a profiles.
-- Guarda los dias elegidos como texto: "1,3,5"
-- Convencion: Domingo=0, Lunes=1, Martes=2, ... Sabado=6
-- Si esta vacio, el Plan del Mes usa el reparto automatico.
-- Corre esto UNA vez en el SQL Editor de Supabase.
-- ============================================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS train_days text;
