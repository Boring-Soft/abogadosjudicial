# Configuración de Supabase Storage - Sistema Judicial

**Fecha:** 2025-12-04
**Responsable:** Administrador del proyecto

---

## Instrucciones para Configurar Storage en Supabase Dashboard

### 1. Crear Buckets

Accede a tu proyecto en Supabase Dashboard → Storage y crea los siguientes buckets:

#### Bucket 1: `documentos-judiciales`
- **Nombre:** `documentos-judiciales`
- **Público:** No (privado)
- **Descripción:** Almacena demandas, contestaciones, escritos, pruebas documentales, resoluciones y sentencias

#### Bucket 2: `evidencias-citaciones`
- **Nombre:** `evidencias-citaciones`
- **Público:** No (privado)
- **Descripción:** Almacena fotos y evidencias de citaciones realizadas

#### Bucket 3: `actas-audiencias`
- **Nombre:** `actas-audiencias`
- **Público:** No (privado)
- **Descripción:** Almacena actas de audiencias firmadas digitalmente

---

## 2. Estructura de Carpetas (se creará automáticamente al subir archivos)

### Bucket: `documentos-judiciales`
```
/procesos/{nurej}/
├── demandas/
│   ├── demanda_v1.pdf
│   └── demanda_v2_corregida.pdf
├── contestaciones/
│   └── contestacion.pdf
├── pruebas/
│   ├── prueba_001.pdf
│   ├── prueba_002.jpg
│   └── prueba_003.pdf
├── resoluciones/
│   ├── decreto_admision.pdf
│   ├── auto_interlocutorio_001.pdf
│   └── auto_definitivo.pdf
└── sentencias/
    └── sentencia_final.pdf
```

### Bucket: `evidencias-citaciones`
```
/procesos/{nurej}/
└── citaciones/
    ├── acta_citacion_personal.pdf
    ├── foto_demandado_recibiendo.jpg
    ├── acta_citacion_cedula.pdf
    └── edicto_publicacion_001.jpg
```

### Bucket: `actas-audiencias`
```
/procesos/{nurej}/
└── audiencias/
    ├── acta_preliminar_{fecha}.pdf
    └── acta_complementaria_{fecha}.pdf
```

---

## 3. Configurar Políticas de Row Level Security (RLS)

### 3.1. Política para Bucket `documentos-judiciales`

#### Política 1: Abogados pueden subir documentos de sus propios procesos
```sql
-- Nombre: Abogados - Upload en sus procesos
-- Operación: INSERT
CREATE POLICY "Abogados pueden subir documentos de sus procesos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documentos-judiciales'
  AND (
    -- Verificar que el usuario es abogado del proceso
    EXISTS (
      SELECT 1 FROM public.procesos p
      INNER JOIN public.profiles prof ON (p.abogado_actor_id = prof.id OR p.abogado_demandado_id = prof.id)
      WHERE prof.user_id = auth.uid()
      AND (storage.foldername(name))[1] = 'procesos'
      AND (storage.foldername(name))[2] = p.nurej
    )
  )
);
```

#### Política 2: Abogados pueden ver documentos públicos de sus procesos
```sql
-- Nombre: Abogados - Select documentos públicos de sus procesos
-- Operación: SELECT
CREATE POLICY "Abogados pueden ver documentos de sus procesos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documentos-judiciales'
  AND (
    EXISTS (
      SELECT 1 FROM public.procesos p
      INNER JOIN public.profiles prof ON (p.abogado_actor_id = prof.id OR p.abogado_demandado_id = prof.id)
      WHERE prof.user_id = auth.uid()
      AND (storage.foldername(name))[1] = 'procesos'
      AND (storage.foldername(name))[2] = p.nurej
    )
  )
);
```

#### Política 3: Jueces pueden acceder a todos los documentos de su juzgado
```sql
-- Nombre: Jueces - Full access a documentos de su juzgado
-- Operación: ALL
CREATE POLICY "Jueces pueden acceder a todos los documentos de su juzgado"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'documentos-judiciales'
  AND (
    EXISTS (
      SELECT 1 FROM public.procesos p
      INNER JOIN public.profiles prof ON p.juez_id = prof.id
      WHERE prof.user_id = auth.uid()
      AND prof.role = 'JUEZ'
      AND (storage.foldername(name))[1] = 'procesos'
      AND (storage.foldername(name))[2] = p.nurej
    )
  )
);
```

### 3.2. Política para Bucket `evidencias-citaciones`

#### Política: Solo jueces pueden subir y ver evidencias
```sql
-- Nombre: Jueces - Full access a evidencias de citación
-- Operación: ALL
CREATE POLICY "Jueces pueden gestionar evidencias de citación"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'evidencias-citaciones'
  AND (
    EXISTS (
      SELECT 1 FROM public.profiles prof
      WHERE prof.user_id = auth.uid()
      AND prof.role = 'JUEZ'
    )
  )
);
```

### 3.3. Política para Bucket `actas-audiencias`

#### Política 1: Jueces pueden subir actas
```sql
-- Nombre: Jueces - Upload actas
-- Operación: INSERT
CREATE POLICY "Jueces pueden subir actas de audiencia"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'actas-audiencias'
  AND (
    EXISTS (
      SELECT 1 FROM public.profiles prof
      WHERE prof.user_id = auth.uid()
      AND prof.role = 'JUEZ'
    )
  )
);
```

#### Política 2: Abogados y jueces pueden ver actas de sus procesos
```sql
-- Nombre: Ver actas de audiencias
-- Operación: SELECT
CREATE POLICY "Ver actas de audiencias de procesos asignados"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'actas-audiencias'
  AND (
    EXISTS (
      SELECT 1 FROM public.procesos p
      INNER JOIN public.profiles prof ON (
        p.abogado_actor_id = prof.id
        OR p.abogado_demandado_id = prof.id
        OR p.juez_id = prof.id
      )
      WHERE prof.user_id = auth.uid()
      AND (storage.foldername(name))[1] = 'procesos'
      AND (storage.foldername(name))[2] = p.nurej
    )
  )
);
```

---

## 4. Variables de Entorno

Agrega estas variables a tu archivo `.env`:

```bash
# Storage Buckets
NEXT_PUBLIC_JUDICIAL_STORAGE_BUCKET=documentos-judiciales
NEXT_PUBLIC_JUDICIAL_EVIDENCIAS_BUCKET=evidencias-citaciones
NEXT_PUBLIC_JUDICIAL_ACTAS_BUCKET=actas-audiencias
```

---

## 5. Pruebas de Configuración

### Prueba 1: Subir archivo de prueba
1. Crea un archivo test.pdf
2. Intenta subirlo a `documentos-judiciales/test/test.pdf`
3. Verifica que se suba correctamente

### Prueba 2: Verificar políticas
1. Intenta acceder al archivo con un usuario de rol ABOGADO
2. Intenta acceder al archivo con un usuario de rol JUEZ
3. Verifica que las políticas funcionen según lo esperado

### Prueba 3: Descargar archivo
1. Obtén la URL pública del archivo
2. Intenta descargarlo
3. Verifica que se descargue correctamente

---

## 6. Tamaño Máximo de Archivos

Por defecto, Supabase permite archivos de hasta **50 MB**. Si necesitas subir archivos más grandes:

1. Ve a Settings → Storage
2. Ajusta el límite de tamaño de archivo según tus necesidades
3. Considera implementar paginación/streaming para archivos muy grandes

---

## 7. Consideraciones de Seguridad

✅ **Implementado:**
- Buckets privados (no públicos)
- Row Level Security (RLS) habilitado
- Políticas por rol (ABOGADO, JUEZ)
- Acceso basado en procesos asignados

⚠️ **Recomendaciones adicionales:**
- Implementar escaneo de virus en archivos subidos (servicio externo)
- Monitorear uso de storage para prevenir abuso
- Implementar rate limiting en endpoints de subida
- Encriptar archivos sensibles antes de subirlos (opcional)
- Mantener backup regular de storage

---

## 8. Checklist de Configuración

- [ ] Crear bucket `documentos-judiciales`
- [ ] Crear bucket `evidencias-citaciones`
- [ ] Crear bucket `actas-audiencias`
- [ ] Configurar políticas RLS para cada bucket
- [ ] Agregar variables de entorno al `.env`
- [ ] Probar subida de archivo de prueba
- [ ] Verificar que políticas funcionen correctamente
- [ ] Documentar accesos y permisos en arquitectura

---

**Última actualización:** 2025-12-04
**Estado:** Pendiente de configuración manual en Supabase Dashboard
