# Arquitectura del Proyecto - Sistema de Gestión Procesal Judicial

**Fecha de documentación:** 2025-12-04
**Stack tecnológico:** Next.js 16.0.7, TypeScript 5.7.3, Prisma 6.4.0, Supabase, React 19.2.1

---

## Stack Tecnológico Validado

### Frontend
- **Framework:** Next.js 16.0.7 (App Router)
- **React:** 19.2.1
- **TypeScript:** 5.7.3
- **Styling:** Tailwind CSS 3.4.17
- **UI Components:** Radix UI (acordeones, diálogos, dropdowns, etc.)
- **Animaciones:** Framer Motion 12.4.7
- **Iconos:** Lucide React 0.475.0
- **Formularios:** React Hook Form 7.54.2 + Zod 3.24.2
- **State Management:** TanStack Query 5.66.7
- **Tablas:** TanStack Table 8.21.2
- **Gráficos:** Recharts 2.15.1

### Backend & Database
- **ORM:** Prisma 6.4.0
- **Database:** PostgreSQL (via Supabase)
- **Prisma Extensions:** @prisma/extension-accelerate 1.2.2
- **Backend as a Service:** Supabase 2.48.1
- **Autenticación:** NextAuth 4.24.11 + Supabase Auth Helpers 0.10.0

### Deployment & Tools
- **Deployment:** Vercel (configurado)
- **Bundle Analyzer:** @next/bundle-analyzer 15.1.7
- **Date Management:** date-fns 4.1.0
- **HTTP Client:** Axios 1.7.9

---

## Estructura de Carpetas Existente

```
abogadosjudicial/
├── prisma/
│   └── schema.prisma              # Schema de base de datos (Prisma)
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/               # Grupo de rutas de autenticación
│   │   │   ├── forgot-password/  # Recuperar contraseña
│   │   │   ├── magic-link/       # Login con magic link
│   │   │   ├── reset-password/   # Resetear contraseña
│   │   │   ├── sign-in/          # Iniciar sesión
│   │   │   └── sign-up/          # Registro de usuario
│   │   ├── (dashboard)/          # Grupo de rutas del dashboard (protegidas)
│   │   │   ├── dashboard/        # Página principal del dashboard
│   │   │   ├── settings/         # Configuraciones de usuario
│   │   │   └── test-page/        # Página de pruebas
│   │   ├── api/                  # API Routes
│   │   │   ├── auth/            # Endpoints de autenticación
│   │   │   ├── profile/         # Endpoints de perfil de usuario
│   │   │   ├── profiles/        # Endpoints de perfiles (CRUD)
│   │   │   └── user/            # Endpoints de usuario
│   │   ├── auth/                # Callback de autenticación
│   │   │   └── callback/        # Supabase auth callback
│   │   ├── pricing/             # Página de precios
│   │   ├── verify-email/        # Verificación de email
│   │   ├── favicon.ico
│   │   ├── globals.css          # Estilos globales (Tailwind)
│   │   ├── layout.tsx           # Layout raíz de la app
│   │   └── page.tsx             # Página de inicio (landing page)
│   │
│   ├── components/               # Componentes React
│   │   ├── auth/                # Componentes de autenticación
│   │   │   ├── forgot-password/
│   │   │   ├── magic-link/
│   │   │   ├── reset-password/
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── common/              # Componentes comunes reutilizables
│   │   ├── landing/             # Componentes del landing page
│   │   ├── layouts/             # Layouts compartidos
│   │   ├── magicui/             # Componentes UI especiales (animaciones)
│   │   ├── navigation/          # Navegación (header, footer)
│   │   ├── settings/            # Componentes de configuraciones
│   │   ├── sidebar/             # Sidebar del dashboard
│   │   │   └── data/           # Datos de configuración del sidebar
│   │   ├── ui/                  # Componentes UI base (shadcn/ui)
│   │   ├── utils/               # Utilidades de componentes
│   │   └── views/               # Vistas complejas
│   │       └── landing-page/    # Vista del landing page
│   │
│   ├── context/                  # Contexts de React
│   │
│   ├── data/                     # Datos estáticos o seeds
│   │
│   ├── hooks/                    # Custom hooks
│   │
│   ├── lib/                      # Librerías y configuraciones
│   │   ├── auth/                # Configuración de autenticación
│   │   │   └── password-crypto.ts
│   │   ├── providers/           # Providers de la app
│   │   ├── supabase/            # Configuración de Supabase
│   │   │   ├── utils/
│   │   │   ├── client.ts        # Cliente de Supabase
│   │   │   ├── password-hash-middleware.ts
│   │   │   └── upload-avatar.ts
│   │   ├── validations/         # Esquemas de validación (Zod)
│   │   │   └── profile.ts
│   │   ├── analytics.ts         # Configuración de analytics
│   │   ├── auth.ts              # Funciones de autenticación
│   │   ├── prisma.ts            # Cliente de Prisma
│   │   └── utils.ts             # Utilidades generales
│   │
│   ├── providers/                # React Providers
│   │
│   ├── types/                    # Tipos de TypeScript
│   │   └── auth/                # Tipos de autenticación
│   │
│   └── proxy.ts                  # Proxy configurations
│
├── .env.example                  # Ejemplo de variables de entorno
├── next.config.js                # Configuración de Next.js
├── package.json                  # Dependencias del proyecto
├── tsconfig.json                 # Configuración de TypeScript
├── tailwind.config.ts            # Configuración de Tailwind CSS
├── postcss.config.js             # Configuración de PostCSS
├── pnpm-lock.yaml                # Lock file de pnpm
└── README.md                     # Documentación del proyecto

```

---

## Configuraciones Importantes

### Next.js Configuration (next.config.js)
- ✅ Turbopack habilitado para dev
- ✅ Remote patterns configurados para imágenes de Supabase
- ✅ Security headers configurados (CSP, HSTS, X-Frame-Options, etc.)
- ✅ Webpack config para server-side
- ✅ Cache headers para service worker y API routes

### TypeScript Configuration (tsconfig.json)
- ✅ Target: ES2017
- ✅ Strict mode habilitado
- ✅ Path aliases: `@/*` → `./src/*`
- ✅ JSX: react-jsx
- ✅ Module resolution: bundler

### Prisma Configuration (prisma/schema.prisma)
- ✅ Provider: PostgreSQL
- ✅ Prisma Client generado
- ✅ Modelos existentes:
  - `Profile`: id, userId, avatarUrl, firstName, lastName, role (USER/SUPERADMIN), active, timestamps
- ✅ Enums: `UserRole` (USER, SUPERADMIN)

### Supabase Configuration
- ✅ Cliente configurado en `src/lib/supabase/client.ts`
- ✅ Auth helpers instalados: `@supabase/auth-helpers-nextjs`
- ✅ Storage configurado para avatares
- ✅ Password hash middleware implementado

### Environment Variables (.env.example)
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DATABASE_URL="postgresql://your-pooler-connection-string"
DIRECT_URL="postgresql://your-direct-connection-string"
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=your-storage-bucket-name
```

---

## Sistema de Rutas (App Router)

### Rutas Públicas
- `/` - Landing page
- `/pricing` - Página de precios
- `/sign-in` - Iniciar sesión
- `/sign-up` - Registro
- `/forgot-password` - Recuperar contraseña
- `/reset-password` - Resetear contraseña
- `/magic-link` - Login con magic link
- `/verify-email` - Verificar email

### Rutas Protegidas (Dashboard)
- `/dashboard` - Dashboard principal
- `/settings` - Configuraciones de usuario
- `/test-page` - Página de pruebas

### API Routes
- `/api/auth/*` - Endpoints de autenticación
- `/api/profile` - CRUD de perfil de usuario
- `/api/profiles` - Gestión de perfiles
- `/api/user` - Datos de usuario

---

## Componentes UI Base (shadcn/ui)

Componentes Radix UI instalados:
- Accordion
- Alert Dialog
- Avatar
- Collapsible
- Dialog
- Dropdown Menu
- Label
- Popover
- Progress
- Scroll Area
- Select
- Separator
- Slot
- Tabs
- Toast
- Tooltip

---

## Sistema de Autenticación

### Stack de Auth
- **NextAuth 4.24.11**: Gestión de sesiones y providers
- **Supabase Auth**: Backend de autenticación
- **Password Hashing**: Middleware personalizado para hash de contraseñas

### Flujos Implementados
1. ✅ Registro con email/password
2. ✅ Login con email/password
3. ✅ Magic link
4. ✅ Recuperación de contraseña
5. ✅ Verificación de email
6. ✅ Callback de Supabase

---

## Próximos Pasos para Módulo Judicial

### Estructura Propuesta para Nuevos Módulos

```
src/
├── app/
│   └── (dashboard)/
│       ├── dashboard/
│       │   ├── procesos/          # NUEVO: Gestión de procesos
│       │   ├── clientes/          # NUEVO: Gestión de clientes (ABOGADO)
│       │   ├── demandas/          # NUEVO: Presentación de demandas
│       │   ├── audiencias/        # NUEVO: Gestión de audiencias
│       │   ├── plazos/            # NUEVO: Dashboard de plazos
│       │   └── juez/              # NUEVO: Vista específica del JUEZ
│       │       ├── procesos/
│       │       ├── demandas/
│       │       ├── citaciones/
│       │       ├── audiencias/
│       │       └── reportes/
│
├── components/
│   ├── procesos/                  # NUEVO: Componentes de procesos
│   ├── clientes/                  # NUEVO: Componentes de clientes
│   ├── demandas/                  # NUEVO: Componentes de demandas
│   ├── citaciones/                # NUEVO: Componentes de citaciones
│   ├── audiencias/                # NUEVO: Componentes de audiencias
│   ├── resoluciones/              # NUEVO: Componentes de resoluciones
│   └── sentencias/                # NUEVO: Componentes de sentencias
│
├── lib/
│   ├── validations/
│   │   ├── proceso.ts             # NUEVO: Validaciones de proceso
│   │   ├── demanda.ts             # NUEVO: Validaciones Art. 110
│   │   ├── contestacion.ts        # NUEVO: Validaciones de contestación
│   │   └── sentencia.ts           # NUEVO: Validaciones Art. 213
│   ├── judicial/                  # NUEVO: Lógica de negocio judicial
│   │   ├── plazos.ts             # Cálculo de plazos legales
│   │   ├── notificaciones.ts     # Sistema de notificaciones
│   │   └── documentos.ts         # Gestión de documentos (hash SHA-256)
│
└── types/
    └── judicial/                  # NUEVO: Tipos del sistema judicial
        ├── proceso.ts
        ├── demanda.ts
        ├── audiencia.ts
        └── sentencia.ts
```

---

## Decisiones de Arquitectura para MVP

### Simplificación del Alcance

Para garantizar un MVP funcional y desplegable rápidamente, se han tomado las siguientes decisiones de simplificación:

#### ✅ Incluido en MVP v1.0

1. **Audiencias Virtuales**
   - ❌ NO integración con Jitsi o Daily.co API
   - ✅ SÍ: Botón simple que abre Google Meet (link manual ingresado por juez)
   - **Razón**: Evita complejidad de integración de APIs de videoconferencia. Google Meet es accesible y familiar para usuarios.

2. **Notificaciones**
   - ❌ NO: Email (SendGrid, Resend)
   - ❌ NO: SMS (Twilio)
   - ✅ SÍ: Notificaciones In-App únicamente (tabla en base de datos)
   - **Razón**: Reduce dependencias externas y costos. Notificaciones in-app son suficientes para MVP.

3. **Transcripción de Audiencias**
   - ❌ NO: OpenAI Whisper API para transcripción automática
   - ✅ SÍ: Acta manual redactada por juez
   - **Razón**: Transcripción automática es un nice-to-have, no crítico para MVP.

4. **Grabación de Audiencias**
   - ❌ NO: Grabación automática de video/audio en Supabase Storage
   - ✅ SÍ: Grabación opcional manejada por Google Meet
   - **Razón**: Google Meet ya ofrece grabación. No necesitamos duplicar funcionalidad.

5. **Cálculo de Plazos**
   - ❌ NO: API de feriados bolivianos
   - ✅ SÍ: Cálculo simple de días hábiles (lunes a viernes)
   - **Razón**: Feriados pueden agregarse manualmente en base de datos posteriormente.

#### 🚀 Para Versiones Futuras (Post-MVP)

- **v1.1**: Notificaciones por email (SendGrid/Resend)
- **v1.2**: Integración completa con Jitsi/Daily.co (salas automáticas)
- **v1.3**: Transcripción automática con OpenAI Whisper
- **v2.0**: Grabación automática de audiencias en Supabase
- **v2.1**: SMS para alertas críticas (Twilio)
- **v2.2**: API de feriados bolivianos para cálculo preciso de plazos

### Dependencias Externas del MVP

**Servicios Externos Requeridos:**
- ✅ Supabase (Auth + Database + Storage)
- ✅ Google Meet (sin integración API, solo links)
- ✅ Vercel (Deployment)

**Servicios NO Requeridos en MVP:**
- ❌ Jitsi/Daily.co
- ❌ OpenAI
- ❌ SendGrid/Resend
- ❌ Twilio
- ❌ API de feriados

---

## Notas Técnicas

- **Prisma Client**: Instanciado de forma singleton para evitar múltiples conexiones en desarrollo
- **Supabase Storage**: Configurado para subida de archivos (avatares actualmente, documentos judiciales próximamente)
- **Security Headers**: Implementados en next.config.js para seguridad básica
- **Turbopack**: Habilitado para desarrollo más rápido
- **Bundle Analyzer**: Disponible para análisis de tamaño de bundles
- **Audiencias**: Google Meet mediante links manuales (sin API)
- **Notificaciones**: Solo in-app para MVP (email/SMS en versiones futuras)

---

**Última actualización:** 2025-12-04
**Versión del MVP:** 1.0 Simplificado
**Mantenido por:** Sistema de Gestión Procesal Judicial - Equipo de Desarrollo
