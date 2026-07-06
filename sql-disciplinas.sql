-- ============================================================
-- Fit Match - Disciplinas favoritas + recuperacion activa
-- Permite que el Plan del Mes se arme con las disciplinas que
-- le gustan al usuario (yoga, gym, correr, etc.) y llene los
-- dias de descanso con recuperacion activa opcional.
-- COMO USAR: Supabase -> SQL Editor -> pega -> Run.
-- Es seguro: solo AGREGA columnas si no existen, no borra nada.
-- ============================================================

-- Disciplinas elegidas, separadas por coma.
-- Valores posibles: gym,casa,crossfit,yoga,pilates,hipopresivos,cardio,caminar,correr,dioses
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS disciplinas TEXT;

-- Recuperacion activa en dias de descanso (yoga suave / caminata / movilidad).
-- Encendido por defecto; el usuario lo puede apagar desde el Plan del Mes.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS descanso_activo BOOLEAN DEFAULT TRUE;

SELECT apodo, disciplinas, descanso_activo
FROM public.profiles
WHERE disciplinas IS NOT NULL;
