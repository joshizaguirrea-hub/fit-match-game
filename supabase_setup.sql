-- ============================================================
-- Fit Match - Script de Configuración de Supabase
-- ============================================================
-- Ejecuta este script en el SQL Editor de Supabase
-- Copia todo el contenido y pégalo en: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new
-- ============================================================

-- ============================================================
-- 1. CREAR TABLA progress_photos (Fotos de Avance)
-- ============================================================
CREATE TABLE IF NOT EXISTS progress_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios vean sus propias fotos
CREATE POLICY IF NOT EXISTS "Ver propias fotos" ON progress_photos
  FOR SELECT USING (auth.uid() = user_id);

-- Política para que los usuarios inserten sus propias fotos
CREATE POLICY IF NOT EXISTS "Insertar propias fotos" ON progress_photos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para que los usuarios eliminen sus propias fotos
CREATE POLICY IF NOT EXISTS "Eliminar propias fotos" ON progress_photos
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 2. VERIFICAR/ACTUALIZAR TABLA profiles
-- ============================================================
-- Si la tabla no existe, crearla
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  apodo TEXT,
  nickname TEXT,
  total_points INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  last_seen TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY IF NOT EXISTS "Perfiles públicos" ON profiles
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Actualizar propio perfil" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Insertar propio perfil" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================
-- 3. VERIFICAR/ACTUALIZAR TABLA workouts
-- ============================================================
-- Si la tabla no existe, crearla
CREATE TABLE IF NOT EXISTS workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  routine_id TEXT,
  puntos INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

-- Políticas para workouts
CREATE POLICY IF NOT EXISTS "Ver propios workouts" ON workouts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Insertar propios workouts" ON workouts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- (Opcional pero recomendado) Permitir VER los workouts de otros usuarios
-- para que se puedan ver los perfiles/estadísticas de los amigos en el ranking.
-- Si NO quieres que las estadísticas sean públicas, no ejecutes esta política.
CREATE POLICY IF NOT EXISTS "Ver workouts públicos" ON workouts
  FOR SELECT USING (true);

-- ============================================================
-- 4. CREAR TRIGGER AUTOMÁTICO PARA PERFIL
-- ============================================================
-- Función para crear perfil automáticamente cuando un usuario se registre
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, apodo, nickname)
  VALUES (new.id, split_part(new.email, '@', 1), split_part(new.email, '@', 1));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar trigger si existe para evitar errores
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Crear trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- 5. CONFIGURACIÓN DE STORAGE (MANUAL)
-- ============================================================
-- NOTA: La configuración del bucket de Storage debe hacerse manualmente en el dashboard
-- Sigue estos pasos:
--
-- 1. Ve a tu proyecto de Supabase
-- 2. Navega a "Storage" en el menú lateral
-- 3. Crea un nuevo bucket llamado "progress-photos"
-- 4. Configura el bucket como "público"
-- 5. En el bucket, crea las siguientes políticas en la pestaña "Policies":
--
-- POLÍTICA DE LECTURA:
-- CREATE POLICY "Ver propias fotos storage" ON storage.objects
--   FOR SELECT USING (
--     bucket_id = 'progress-photos' AND 
--     auth.uid()::text = (storage.foldername(name))[1]
--   );
--
-- POLÍTICA DE INSERT:
-- CREATE POLICY "Subir propias fotos storage" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'progress-photos' AND 
--     auth.uid()::text = (storage.foldername(name))[1]
--   );
--
-- POLÍTICA DE DELETE:
-- CREATE POLICY "Eliminar propias fotos storage" ON storage.objects
--   FOR DELETE USING (
--     bucket_id = 'progress-photos' AND 
--     auth.uid()::text = (storage.foldername(name))[1]
--   );

-- ============================================================
-- 6. VERIFICACIÓN
-- ============================================================
-- Verificar que las tablas existen
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name IN ('profiles', 'workouts', 'progress_photos')
ORDER BY table_name, ordinal_position;

-- Verificar políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('profiles', 'workouts', 'progress_photos')
ORDER BY tablename, policyname;

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
