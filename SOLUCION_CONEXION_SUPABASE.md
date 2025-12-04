# Solución: Error de Conexión a Supabase

## Problema
```
Error: P1001: Can't reach database server at `aws-0-us-west-2.pooler.supabase.com:5432`
```

## Soluciones (en orden de probabilidad)

### 1. **Base de Datos Pausada (Más Común en Plan Gratuito)**

Si estás en el plan gratuito de Supabase, la base de datos se pausa automáticamente después de 1 semana de inactividad.

**Solución:**
1. Ve a tu dashboard de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Si ves un botón "Restore" o "Resume", haz clic en él
4. Espera 1-2 minutos a que la base de datos se reactive
5. Intenta nuevamente: `pnpm prisma db push`

### 2. **Verificar URL de Conexión Correcta**

La URL debe tener el formato correcto según tu proyecto. Obtén las URLs correctas:

**Pasos:**
1. Ve a tu proyecto en Supabase Dashboard
2. Ve a **Settings** → **Database**
3. Busca la sección **Connection string** o **Connection pooling**
4. Copia las URLs correctas:

   **Para DATABASE_URL (con pooling):**
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

   **Para DIRECT_URL (sin pooling, para migraciones):**
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
   ```

5. Actualiza tu archivo `.env` o `.env.local` con estas URLs

### 3. **Verificar Región del Proyecto**

El error muestra `us-west-2` pero tu README menciona `us-west-1`. Verifica:

1. En Supabase Dashboard → **Settings** → **General**
2. Revisa la región de tu proyecto
3. Asegúrate de que la URL en `.env` use la región correcta

### 4. **Verificar Credenciales**

1. Ve a **Settings** → **Database** en Supabase
2. Si no recuerdas la contraseña, puedes resetearla:
   - Haz clic en "Reset database password"
   - Copia la nueva contraseña
   - Actualiza tu `.env` con la nueva contraseña

### 5. **Usar Connection Pooling Correctamente**

Para `prisma db push` y migraciones, usa `DIRECT_URL` (puerto 5432).
Para queries normales, usa `DATABASE_URL` (puerto 6543 con pgbouncer).

**Tu `schema.prisma` ya está configurado correctamente:**
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")      // Pooling (6543)
  directUrl = env("DIRECT_URL")        // Directo (5432)
}
```

### 6. **Verificar Firewall/Red**

Si estás en una red corporativa o con firewall:
- Verifica que los puertos 5432 y 6543 no estén bloqueados
- Intenta desde otra red (hotspot móvil) para descartar problemas de red

## Pasos Rápidos de Verificación

1. **Revisar estado del proyecto:**
   ```bash
   # Ve a: https://supabase.com/dashboard
   # Verifica que el proyecto esté activo (no pausado)
   ```

2. **Obtener URLs correctas:**
   - Dashboard → Settings → Database
   - Copia las Connection strings

3. **Actualizar .env:**
   ```env
   DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
   ```

4. **Probar conexión:**
   ```bash
   pnpm prisma db push
   ```

## Información de tu Proyecto (del README)

- **Project Reference:** `swfgvfhpmicwptupjyko`
- **Región:** `us-west-1` (verifica en dashboard)
- **Password:** `e9zKY_Km5HbkiiF` (verifica si sigue siendo válida)

## URLs Esperadas (ajusta según tu proyecto)

```env
DATABASE_URL="postgresql://postgres.swfgvfhpmicwptupjyko:e9zKY_Km5HbkiiF@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.swfgvfhpmicwptupjyko:e9zKY_Km5HbkiiF@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
```

**Nota:** Reemplaza `us-west-1` con la región correcta de tu proyecto si es diferente.

