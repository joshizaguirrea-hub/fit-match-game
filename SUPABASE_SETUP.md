# Configuración de Supabase para Fit Match

## 📋 Requisitos Previos

1. Tener un proyecto de Supabase creado
2. Tener las credenciales (URL y ANON KEY) configuradas en `fm-supabase.js`

## 🗄️ Configuración de la Base de Datos

### Tablas Necesarias

#### 1. Tabla `profiles` (ya debería existir)
```sql
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

-- Política para que los usuarios puedan ver todos los perfiles
CREATE POLICY "Perfiles públicos" ON profiles
  FOR SELECT USING (true);

-- Política para que los usuarios actualicen su propio perfil
CREATE POLICY "Actualizar propio perfil" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Política para que los usuarios inserten su propio perfil
CREATE POLICY "Insertar propio perfil" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

#### 2. Tabla `workouts` (ya debería existir)
```sql
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

-- Política para que los usuarios vean sus propios workouts
CREATE POLICY "Ver propios workouts" ON workouts
  FOR SELECT USING (auth.uid() = user_id);

-- Política para que los usuarios inserten sus propios workouts
CREATE POLICY "Insertar propios workouts" ON workouts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

#### 3. Tabla `progress_photos` (NUEVA - para fotos de avance)
```sql
CREATE TABLE IF NOT EXISTS progress_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios vean sus propias fotos
CREATE POLICY "Ver propias fotos" ON progress_photos
  FOR SELECT USING (auth.uid() = user_id);

-- Política para que los usuarios inserten sus propias fotos
CREATE POLICY "Insertar propias fotos" ON progress_photos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para que los usuarios eliminen sus propias fotos
CREATE POLICY "Eliminar propias fotos" ON progress_photos
  FOR DELETE USING (auth.uid() = user_id);
```

## 📁 Configuración de Supabase Storage

### Crear el Bucket de Fotos de Avance

1. Ve a tu proyecto de Supabase
2. Navega a **Storage** en el menú lateral
3. Crea un nuevo bucket llamado `progress-photos`
4. Configura el bucket como **público** (para que las fotos sean accesibles)

### Configurar Políticas del Bucket

En el bucket `progress-photos`, crea las siguientes políticas:

#### Política de Lectura (para ver fotos propias)
```sql
-- En la pestaña Policies del bucket
CREATE POLICY "Ver propias fotos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'progress-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

#### Política de Insert (para subir fotos)
```sql
CREATE POLICY "Subir propias fotos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'progress-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

#### Política de Delete (para eliminar fotos)
```sql
CREATE POLICY "Eliminar propias fotos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'progress-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

## 🔧 Configuración Adicional

### Trigger Automático para Crear Perfil

Opcional: Crea un trigger que automáticamente cree un perfil cuando un usuario se registre:

```sql
-- Función para crear perfil automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, apodo, nickname)
  VALUES (new.id, split_part(new.email, '@', 1), split_part(new.email, '@', 1));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## ✅ Verificación

Después de la configuración, verifica:

1. **Storage Bucket**: El bucket `progress-photos` existe y es público
2. **Tablas**: Las tablas `profiles`, `workouts` y `progress_photos` existen
3. **Políticas RLS**: Las políticas de seguridad están configuradas correctamente
4. **Permisos**: Los usuarios pueden subir y ver sus propias fotos

## 🚀 Uso

Una vez configurado, el sistema de perfil funcionará automáticamente:

- **Estadísticas**: Se calculan automáticamente desde la tabla `workouts`
- **Logros**: Se calculan usando las funciones de `fm-badges.js` y `fm-achievements.js`
- **Fotos**: Se suben al bucket `progress-photos` y se guardan en la tabla `progress_photos`
- **Mejor FIT-BRO**: Se calcula comparando perfiles de la tabla `profiles`
- **Personalización**: Se guarda en localStorage del navegador

## 📝 Notas Importantes

- Las fotos se organizan por carpetas: `user_id/timestamp_filename`
- El sistema usa Storage de Supabase para las imágenes
- Las políticas RLS aseguran que cada usuario solo vea sus propias fotos
- El bucket debe ser público para que las imágenes sean accesibles vía URL
