# Authentication Setup Guide

Este template viene con autenticación completa usando Supabase. Aquí está lo que necesitas saber:

## ✅ Lo que ya está configurado

1. **Auth Provider** (`src/providers/auth-provider.tsx`)
   - Sign in con email/password
   - Sign up con email/password
   - Sign out
   - Manejo de sesión automático
   - Sincronización de perfil

2. **Componentes de Auth**
   - Sign In (`/sign-in`)
   - Sign Up (`/sign-up`)
   - Forgot Password (`/forgot-password`)
   - Reset Password (`/reset-password`)
   - Magic Link (`/magic-link`)

3. **Protección de rutas**
   - Proxy middleware (`src/proxy.ts`) configurado
   - Rutas protegidas: `/dashboard/*`, `/settings`

4. **Logout implementado**
   - ProfileDropdown (sidebar)
   - NavUser (sidebar)
   - Redirección automática a `/sign-in` después del logout

## 🔧 Setup requerido

### 1. Configurar variables de entorno

Copia `.env.example` a `.env` y configura:

```bash
cp .env.example .env
```

### 2. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. En Settings > API, copia:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Configurar base de datos

El schema de Prisma ya está configurado. Ejecuta:

```bash
pnpm prisma db push
```

### 4. Configurar tablas de Supabase

En el SQL Editor de Supabase, ejecuta:

```sql
-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

## 🔐 Cómo funciona

### Sign In Flow
1. Usuario ingresa email/password
2. Password se hashea con `saltAndHashPassword()`
3. Se llama `signIn()` del AuthProvider
4. AuthProvider usa Supabase para autenticar
5. Si es exitoso, se redirige a `/dashboard`
6. El perfil del usuario se carga automáticamente

### Sign Out Flow
1. Usuario hace clic en "Log out"
2. Se llama `signOut()` del AuthProvider
3. Supabase cierra la sesión
4. Se limpia el estado del perfil
5. Se redirige a `/sign-in`

### Protección de rutas
- El proxy middleware intercepta todas las peticiones a rutas protegidas
- Actualmente está deshabilitado para propósitos de diseño
- Para habilitarlo, modifica `src/proxy.ts`

## 🎨 Personalización

### Cambiar rutas después del login
En `src/providers/auth-provider.tsx`, línea 123:
```typescript
router.push("/dashboard"); // Cambia esto a tu ruta preferida
```

### Cambiar rutas después del logout
En `src/providers/auth-provider.tsx`, línea 144:
```typescript
router.push("/sign-in"); // Cambia esto a tu ruta preferida
```

### Habilitar OAuth providers
Los botones de GitHub y Facebook ya están en el UI. Para habilitarlos:

1. Configura los providers en Supabase Dashboard
2. Actualiza `user-auth-form.tsx` para conectar los botones

## 🧪 Testing sin Supabase

Si no tienes Supabase configurado:
- La app funcionará normalmente
- Los formularios de auth mostrarán errores apropiados
- El dashboard es accesible (proxy deshabilitado)
- Perfecto para desarrollo de UI

## 📝 Notas

- Las passwords se hashean en el cliente antes de enviar
- El email se usa como salt para el hash
- Las sesiones se persisten automáticamente
- El profile se sincroniza con Supabase Auth
