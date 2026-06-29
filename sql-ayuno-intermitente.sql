-- ============================================================
-- Fit Match · NUTRICION: soporte de Ayuno Intermitente
-- COMO USAR: Supabase -> SQL Editor -> pega -> Run.
-- ============================================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS fasting_protocol text; -- 16_8 / 18_6 / 20_4 / omad / 5_2
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS eating_window text;     -- "12:00 - 20:00"

SELECT apodo, diet_style, fasting_protocol, eating_window
FROM public.profiles
WHERE diet_style = 'ayuno';
