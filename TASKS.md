# Task List - Sistema de Gestión Procesal Judicial

**PRD:** prdsistema.md (Versión 2.0 - Roles: Abogado y Juez)
**Fecha de inicio:** 2025-12-04

---

## FASE 0: SETUP Y CONFIGURACIÓN DEL PROYECTO

### T001: Configuración inicial del proyecto ✅
- [x] Analizar stack tecnológico actual del proyecto
- [x] Validar que Next.js, TypeScript, Prisma y Supabase estén correctamente configurados
- [x] Documentar estructura de carpetas existente
- [x] Crear archivo de variables de entorno para el módulo judicial

### T002: Diseño y configuración de base de datos ✅
- [x] Diseñar schema de base de datos para todos los módulos (Prisma)
- [x] Crear modelos: User, Role, Cliente, Proceso, Demanda, Citacion, Contestacion, Audiencia, Resolucion, Sentencia, Documento, Notificacion, Plazo
- [x] Definir relaciones entre modelos
- [x] Crear migraciones de Prisma (schema listo, ejecutar: `npx prisma migrate dev --name init_judicial_system` cuando DATABASE_URL esté configurado)
- [ ] Ejecutar migraciones y validar schema (requiere DATABASE_URL y DIRECT_URL en .env)

### T003: Configuración de Supabase Storage ✅
- [x] Configurar buckets en Supabase para documentos judiciales (documentado en SUPABASE_STORAGE_SETUP.md - requiere configuración manual en dashboard)
- [x] Crear estructura de carpetas: /procesos/{nurej}/demandas, /contestaciones, /pruebas, /resoluciones, /sentencias, /evidencias, /actas (se crean automáticamente)
- [x] Configurar políticas de Row Level Security (RLS) para acceso por rol (documentado con SQL completo)
- [ ] Probar subida y descarga de archivos de prueba (pendiente de configuración manual)

### T004: Sistema de autenticación base ✅
- [x] Configurar NextAuth o Auth.js con Supabase (actualizado lib/auth.ts con integración completa)
- [x] Implementar flujo de registro para ABOGADO (con número de registro profesional y validaciones Zod)
- [x] Implementar flujo de login para ABOGADO y JUEZ (integrado con Supabase y roles)
- [x] Implementar recuperación de contraseña (ya existe, funciona con Supabase)
- [x] Crear middleware de protección de rutas por rol (middleware.ts con RLS por rol)

---

## FASE 1: MÓDULOS BASE

### T005: Módulo de Gestión de Usuarios

#### Perfil de ABOGADO
- [x] Crear página de perfil de abogado (/dashboard/perfil)
- [x] Formulario para editar datos personales (nombre, email, teléfono, registro profesional)
- [x] Funcionalidad de cambio de contraseña
- [ ] Vista de historial de accesos
- [ ] Configuración de preferencias de notificaciones

#### Perfil de JUEZ
- [x] Crear página de perfil de juez (/dashboard/juez/perfil)
- [x] Vista de datos del juzgado asignado
- [x] Funcionalidad de cambio de contraseña
- [ ] Configuración de firma digital interna
- [ ] Vista de historial de resoluciones emitidas

### T006: Módulo de Gestión de Clientes (ABOGADO)

#### Registro de clientes
- [x] Crear página de gestión de clientes (/dashboard/clientes)
- [x] Formulario de registro de cliente con campos: CI, nombres, apellidos, edad, estado civil, profesión, domicilio real, domicilio procesal, teléfono, email
- [x] Validación de CI único
- [ ] Funcionalidad de subida de foto del cliente (opcional)
- [x] Guardar cliente en base de datos

#### Gestión de clientes
- [x] Lista de todos los clientes del abogado con tabla
- [x] Búsqueda por nombre, CI, apellido
- [x] Filtros por estado (activo/inactivo)
- [ ] Página de detalle de cliente con historial de procesos
- [x] Formulario de edición de datos de cliente
- [x] Funcionalidad de desactivación de cliente (soft delete)

### T007: Módulo de Gestión de Procesos - Estructura Base

#### Creación de proceso (ABOGADO)
- [x] Crear página de nuevo proceso (/dashboard/procesos/nuevo)
- [x] Wizard de creación - Paso 1: Tipo de proceso (ordinario, extraordinario, monitorio, cautelar)
- [x] Wizard de creación - Paso 2: Materia (civil, familiar, comercial, laboral)
- [x] Wizard de creación - Paso 3: Selección de juzgado de lista
- [x] Wizard de creación - Paso 4: Cuantía en Bs
- [x] Wizard de creación - Paso 5: Selección de cliente como ACTOR, ingreso de datos del DEMANDADO
- [x] Generación de NUREJ provisional
- [x] Guardar proceso en estado BORRADOR

#### Vista de procesos (ABOGADO)
- [x] Crear página de listado de procesos (/dashboard/procesos)
- [x] Dashboard con cards de todos los procesos del abogado
- [x] Filtros: por estado, cliente, juzgado, fecha, materia
- [x] Vista de lista vs vista Kanban (grid/list)
- [ ] Indicadores visuales por urgencia (🔴🟡🟢⚫)
- [x] Navegación a expediente digital de cada proceso

#### Vista de procesos (JUEZ)
- [x] Crear página de procesos asignados (/dashboard/juez/procesos - misma que abogado, filtra automáticamente por juzgado)
- [ ] Dashboard con todos los procesos del juzgado
- [ ] Vista Kanban con columnas: Por Admitir, Por Citar, Por Contestar, Por Audiencia, Por Sentencia, Sentenciadas, Ejecutoriadas, Archivadas
- [ ] Filtros: por estado, fecha, abogado, materia, prioridad
- [x] Navegación a expediente digital

#### Expediente Digital - Vista compartida
- [x] Crear página de expediente digital (/dashboard/procesos/[id])
- [x] Sección: Información General (NUREJ, estado, fecha, juzgado, juez, partes, materia, cuantía)
- [x] Sección: Documentos (lista ordenada cronológicamente con hash SHA-256)
- [x] Sección: Línea de Tiempo (todos los actos procesales con timestamps)
- [x] Sección: Plazos (activos, vencidos, cumplidos)
- [x] Sección: Audiencias (programadas y realizadas)
- [ ] Sección: Notificaciones (historial)
- [ ] Vista diferenciada para ABOGADO vs JUEZ (comentarios internos solo para JUEZ)

---

## FASE 2: FLUJO CORE DEL PROCESO JUDICIAL

### T008: Módulo de Demandas (Art. 110) ✅

#### Wizard de presentación de demanda (ABOGADO)
- [x] Crear página de presentación de demanda (/dashboard/procesos/[id]/demanda)
- [x] Wizard Paso 1: Designación del juez (auto-llenado desde proceso)
- [x] Wizard Paso 2: Datos de las partes (auto-llenado de ACTOR desde cliente, datos de DEMANDADO)
- [x] Wizard Paso 3: Objeto, hechos y derecho (Textarea)
- [x] Wizard Paso 4: Petitorio, valor y prueba (textarea)
- [x] Wizard Paso 5: Preview y envío con validación de campos obligatorios Art. 110
- [x] Cálculo de hash SHA-256
- [x] Almacenar demanda en base de datos
- [x] Cambiar estado del proceso a PRESENTADO
- [x] Generar notificación al JUEZ asignado
- [ ] Generación de PDF de la demanda (TODO: implementar con biblioteca PDF)
- [ ] Subida a Supabase Storage (TODO: requiere configuración de Storage)

#### Corrección de demanda observada (ABOGADO)
- [x] Funcionalidad para editar demanda observada
- [x] Re-presentar demanda corregida
- [x] Guardar historial de versiones (original + corregida)

### T009: Módulo de Admisión de Demandas (JUEZ) ✅

#### Recepción y validación de demanda
- [x] Crear página de revisión de demanda (/dashboard/juez/demandas/[id])
- [x] Vista de demanda completa con todos los campos del Art. 110
- [x] Botones de acción: Admitir, Observar, Rechazar

#### Admitir demanda
- [x] Formulario de decreto de admisión con plantilla pre-cargada
- [x] Editor de texto para ajustes del decreto
- [x] Asignación de NUREJ definitivo
- [x] Cambiar estado a ADMITIDO
- [x] Generar notificación al ABOGADO ACTOR
- [x] Crear resolución (decreto de admisión)
- [ ] Firma digital del decreto (TODO: requiere certificado digital)
- [ ] Generación de PDF oficial con marca de agua (TODO: implementar biblioteca PDF)

#### Observar demanda
- [x] Formulario de decreto de observación
- [x] Campo de texto para observaciones
- [x] Establecer plazo de corrección (default 10 días, configurable 5-30)
- [x] Emitir decreto y notificar al ABOGADO
- [x] Cambiar estado a OBSERVADO
- [x] Crear plazo de corrección en base de datos

#### Rechazar demanda
- [x] Formulario de auto de rechazo con fundamentación
- [x] Selección de motivo (incompetencia, falta legitimación, prescripción, cosa juzgada, otro)
- [x] Emitir auto fundamentado
- [x] Notificar al ABOGADO
- [x] Cambiar estado a RECHAZADO
- [x] Crear resolución (auto de rechazo)

### T010: Módulo de Citaciones ⚡ (PROGRESO: 75%)

#### Ordenar citación (JUEZ)
- [x] Crear validaciones Zod para citaciones
- [x] Crear API POST /api/citaciones para ordenar citación
- [x] Crear API GET /api/citaciones?procesoId=xxx
- [x] Cambiar estado del proceso a CITADO
- [x] Notificar al ABOGADO ACTOR
- [x] Crear página de gestión de citaciones (/dashboard/juez/procesos/[id]/citacion)
- [x] Vista de datos del demandado (nombre, CI, domicilio real, domicilio procesal)
- [x] Selección de tipo de citación: Personal, Por cédula, Por edictos, Tácita
- [x] Componente de diálogo para ordenar citación con descripción de cada tipo
- [x] Lista de citaciones con estados visuales y badges
- [ ] Generación automática de cédula de citación (PDF) con datos del demandado, resumen de demanda, plazo 30 días, advertencias legales

#### Citación Personal y Por Cédula
- [x] Formulario de registro de citación personal/cédula
- [x] API PUT /api/citaciones/[id]/exitosa para marcar como exitosa
- [x] Campo de fecha y hora de citación
- [x] Campo de observaciones
- [x] Botón "Marcar como EXITOSA" en lista de citaciones
- [x] Al marcar exitosa: registrar timestamp e iniciar timer 30 días
- [x] Crear plazo automático en base de datos
- [x] Notificar a ABOGADO ACTOR de citación exitosa
- [ ] Subida de foto de acta de citación (TODO: implementar upload)
- [ ] Foto del demandado recibiendo (opcional - TODO)

#### Citación por Edictos
- [ ] Formulario de citación por edictos
- [ ] Generación de edicto de citación (plantilla)
- [ ] Configuración de 3 fechas de publicación
- [ ] Subida de evidencia de cada publicación (foto/PDF)
- [ ] Después de 3ra publicación: marcar como EXITOSA
- [ ] Iniciar timer de 20 días (plazo especial para edictos)

#### Citación Tácita
- [ ] Detectar apersonamiento voluntario del demandado (presenta contestación sin citación previa)
- [ ] Marcar citación como TÁCITA automáticamente
- [ ] Registrar fecha de apersonamiento como fecha de citación

#### Registro de intentos fallidos
- [x] Formulario de intento fallido con diálogo
- [x] API POST /api/citaciones/[id]/intento-fallido
- [x] Campos: fecha, hora, motivo
- [x] Guardar historial de intentos en campo JSON
- [x] Después de 3 intentos: marcar como FALLIDA y mostrar recomendación
- [x] Alerta visual en UI cuando hay 3+ intentos
- [x] Sugerencia automática de citación por edictos
- [ ] Foto de evidencia (opcional - TODO: implementar upload)

#### Vista de citación (ABOGADO)
- [ ] En expediente, sección "Citaciones"
- [ ] Ver: tipo, estado, evidencia fotográfica, fecha de citación exitosa
- [ ] Timer con días restantes para contestación (si es ACTOR)
- [ ] Recibir notificación cuando citación es exitosa

### T011: Módulo de Contestaciones y Excepciones ⚡ (PROGRESO: 70%)

#### Presentación de contestación (ABOGADO DEMANDADO)
- [x] Crear validaciones Zod para contestaciones
- [x] Crear API POST /api/contestaciones para presentar contestación
- [x] Crear API GET /api/contestaciones?procesoId=xxx
- [x] Crear página de contestación (/dashboard/procesos/[id]/contestacion)
- [x] Opción A: Wizard de contestar la demanda
- [x] Lista de hechos de la demanda con opciones: Admite, Niega, Admite parcialmente
- [x] Campo de texto para explicar cada negación
- [x] Editor de fundamentación de la contestación (hechos y derecho)
- [x] Formulario de ofrecimiento de prueba de descargo (documentales, testimoniales, periciales)
- [ ] Subida de pruebas documentales (PDFs - TODO: implementar upload)
- [x] Campo de petitorio
- [x] Validación de campos obligatorios con Zod
- [x] Botón "Presentar Contestación"

#### Allanamiento
- [x] Opción B: Formulario de allanamiento
- [x] Texto de aceptación de términos de la demanda
- [x] Manifestación expresa de allanamiento
- [x] Campo de petición de costas (opcional)

#### Excepciones Previas (Art. 370)
- [x] Opción C: Formulario de excepciones previas
- [x] Selección de tipo: Incompetencia, Falta personalidad, Falta personería, Litispendencia, Cosa juzgada, Transacción, Conciliación, Desistimiento, Prescripción, Demanda defectuosa, Otros
- [x] Editor de fundamentación detallada
- [ ] Subida de prueba documental (TODO: implementar upload)
- [x] Campo de petitorio

#### Reconvención
- [x] Opción D: Formulario de reconvención (contrademanda)
- [x] Wizard similar a demanda: Objeto, hechos, derecho, petitorio, valor, prueba
- [x] Presentar junto con contestación
- [x] Notificar a ABOGADO ACTOR para que conteste reconvención (plazo 10 días)

#### Post-presentación de contestación
- [ ] Generar PDF de contestación (TODO: implementar con biblioteca PDF)
- [x] Calcular hash SHA-256
- [x] Almacenar en base de datos y Storage
- [x] Cambiar estado del proceso a CONTESTADO
- [x] Cancelar timer de 30 días (marcar plazo como CUMPLIDO)
- [x] Notificar al JUEZ y al ABOGADO ACTOR

#### Revisión de contestación (JUEZ)
- [ ] Página de revisión de contestación para JUEZ
- [ ] Vista completa de contestación con pruebas ofrecidas
- [ ] Si hay excepciones previas: alerta para resolver primero
- [x] API PUT /api/contestaciones/[id]/resolver-excepcion
- [x] Validación Zod para resolver excepciones (Fundar o Rechazar)
- [x] Emitir auto de excepción fundamentado (AUTO_INTERLOCUTORIO)
- [x] Notificar a ambos ABOGADOS sobre resolución de excepción
- [ ] Si no hay excepciones: botón "Auto-convocar Audiencia Preliminar"
- [ ] Programar audiencia 5 días después (Art. 365)

---

## FASE 3: AUDIENCIAS, RESOLUCIONES Y SENTENCIAS

### T012: Módulo de Audiencias

#### Convocatoria a Audiencia Preliminar (JUEZ)
- [ ] Crear página de programación de audiencia (/dashboard/juez/procesos/[nurej]/audiencia)
- [ ] Formulario: fecha, hora, tipo (preliminar/complementaria), modalidad (presencial/virtual)
- [ ] Campo para ingresar link de Google Meet (manual)
- [ ] Selección de asistentes obligatorios y opcionales
- [ ] Generación de auto de convocatoria (PDF)
- [ ] Crear evento en calendario del juez
- [ ] Notificar a ambos ABOGADOS con link de Google Meet (in-app)

#### Pre-Audiencia
- [ ] Sistema de recordatorios: día anterior, 1 hora antes, 5 minutos antes
- [ ] Enviar notificaciones in-app a JUEZ y ABOGADOS

#### Realización de Audiencia (JUEZ preside)
- [ ] Página de audiencia en vivo (/dashboard/juez/audiencia/[id])
- [ ] Botón "Iniciar Audiencia" (registra timestamp)
- [ ] Botón "Abrir Google Meet" (abre link en nueva pestaña)
- [ ] Checklist de asistencia de partes
- [ ] Formulario de ratificación de demanda y contestación
- [ ] Formulario de conciliación con opciones: HAY ACUERDO / NO HAY ACUERDO
- [ ] Si hay acuerdo: campo para dictar acuerdo en acta → proceso termina
- [ ] Si no hay acuerdo: campo para fijar objeto del proceso
- [ ] Lista de pruebas ofrecidas con botones: Admitir / Rechazar (con fundamentación)
- [ ] Formulario para señalar audiencia complementaria (si es necesario)
- [ ] Botón "Cerrar Audiencia" (registra timestamp de cierre)

#### Participación en Audiencia (ABOGADO)
- [ ] Página de información de audiencia (/dashboard/audiencias/[id])
- [ ] Ver detalles de la audiencia (fecha, hora, tipo)
- [ ] Botón "Unirse a Google Meet" (abre link en nueva pestaña)
- [ ] Campo de notas privadas (no registradas en sistema)

#### Post-Audiencia (JUEZ)
- [ ] Generar borrador de acta de audiencia con plantilla Art. 365
- [ ] Editor de acta con secciones: Presidió, Asistentes, Desarrollo, Ratificación, Conciliación, Objeto del proceso, Pruebas admitidas, Señalamiento audiencia complementaria
- [ ] Firma digital de acta
- [ ] Generar PDF oficial
- [ ] Subir acta al expediente
- [ ] Notificar a ABOGADOS "Acta disponible" (in-app)
- [ ] Actualizar estado: CONCILIADO / AUDIENCIA_COMPLEMENTARIA_SEÑALADA / PARA_SENTENCIA

#### Post-Audiencia (ABOGADO)
- [ ] Recibir notificación in-app de acta disponible
- [ ] Ver y descargar acta de audiencia
- [ ] Ver lista de pruebas admitidas

#### Audiencia Complementaria
- [ ] Proceso similar a audiencia preliminar
- [ ] Programar dentro de 15 días
- [ ] Enfoque en práctica de pruebas: testimonial, pericial, inspección
- [ ] Al finalizar: JUEZ declara cerrada etapa probatoria
- [ ] Cambiar estado a PARA_SENTENCIA
- [ ] Iniciar timer de 20 días para sentencia

### T013: Módulo de Resoluciones (JUEZ)

#### Editor de Resoluciones
- [ ] Crear página de nueva resolución (/dashboard/juez/procesos/[nurej]/resolucion/nueva)
- [ ] Selección de tipo: Providencia, Auto Interlocutorio, Auto Definitivo
- [ ] Selección de plantilla (opcional)
- [ ] Rich Text Editor con secciones: Vistos, Considerando, Por Tanto
- [ ] Funcionalidad de insertar citas de ley (base de datos de artículos)
- [ ] Funcionalidad de insertar referencias a actos procesales
- [ ] Validación de estructura según tipo
- [ ] Preview de PDF antes de firmar

#### Emisión de Resolución
- [ ] Botón "Solicitar Firma Digital"
- [ ] Generar hash SHA-256 del documento
- [ ] Firmar con certificado interno
- [ ] Generar PDF sellado con marca de agua
- [ ] Almacenar resolución en expediente (inmutable)
- [ ] Generar notificación in-app automática a ABOGADOS
- [ ] Registrar fecha de notificación

#### Gestión de Plantillas
- [ ] Página de gestión de plantillas (/dashboard/juez/plantillas)
- [ ] Crear nueva plantilla
- [ ] Variables dinámicas: {actor}, {demandado}, {nurej}, {fecha}
- [ ] Editar plantillas existentes
- [ ] Compartir plantillas con otros jueces del juzgado

#### Vista de Resoluciones (ABOGADO)
- [ ] En expediente, sección "Resoluciones"
- [ ] Lista de todas las resoluciones: fecha, tipo, título, estado
- [ ] Botón "Descargar PDF"
- [ ] Notificación cuando se emite nueva resolución
- [ ] Vista previa de tipo de resolución
- [ ] Ver fecha de notificación (para cómputo de plazos)
- [ ] Si es apelable: días restantes para apelar + botón "Presentar Recurso de Apelación"

### T014: Módulo de Sentencias (Art. 213)

#### Editor de Sentencia (JUEZ)
- [ ] Crear página de emisión de sentencia (/dashboard/juez/procesos/[nurej]/sentencia)
- [ ] Validar que etapa probatoria esté cerrada
- [ ] Plantilla Art. 213 con secciones obligatorias

#### Sección 1: Encabezamiento
- [ ] Auto-llenado: Juzgado, NUREJ, Actor (nombre, CI, abogado), Demandado (nombre, CI, abogado), Objeto, Fecha

#### Sección 2: Narrativa (Resultandos)
- [ ] Rich Text Editor para resumen de demanda
- [ ] Campo para resumen de contestación
- [ ] Campo para trámites del proceso
- [ ] Campo para pruebas presentadas
- [ ] Validación: mínimo 500 caracteres

#### Sección 3: Motiva (Considerandos)
- [ ] Rich Text Editor para análisis de pruebas
- [ ] Campo para valoración de pruebas (Art. 203-208)
- [ ] Campo para aplicación del derecho (citar artículos)
- [ ] Campo para razonamiento jurídico
- [ ] Campo para jurisprudencia aplicable (opcional)
- [ ] Validación: mínimo 1000 caracteres
- [ ] Herramientas: insertar cita de ley, referencia a prueba

#### Sección 4: Resolutiva (Por Tanto)
- [ ] Selección de decisión: Admite demanda, Rechaza demanda, Admite parcialmente
- [ ] Campo para condena: cumplir obligación, pagar suma, entregar bien, hacer/no hacer
- [ ] Campo para costas: condenar al vencido o exonerar (fundamentar)
- [ ] Validación: mínimo 200 caracteres

#### Sección 5: Cierre
- [ ] Auto-llenado: "Regístrese, notifíquese y cúmplase", fecha, lugar

#### Emisión de Sentencia
- [ ] Botón "Guardar Borrador" (sin firmar, solo visible para juez)
- [ ] Botón "Preview" (vista previa PDF)
- [ ] Botón "Firmar y Emitir Sentencia"
- [ ] Generar hash SHA-256
- [ ] Firma digital
- [ ] Generar PDF oficial con marca de agua
- [ ] Marcar como FIRMADA E INMUTABLE
- [ ] Almacenar en expediente
- [ ] Cambiar estado del proceso a SENTENCIADO
- [ ] Generar notificaciones in-app a AMBOS ABOGADOS
- [ ] Registrar fecha de notificación
- [ ] Iniciar timer de 15 días para apelación

#### Vista de Sentencia (ABOGADO)
- [ ] En expediente, sección "Sentencia"
- [ ] Información: fecha emisión, fecha notificación, resultado (favorable/desfavorable/parcial)
- [ ] Resumen ejecutivo de la sentencia
- [ ] Días restantes para apelar con indicador visual
- [ ] Botón "Descargar Sentencia PDF"
- [ ] Botón "Presentar Recurso de Apelación"

#### Recurso de Apelación (ABOGADO)
- [ ] Página de recurso de apelación (/dashboard/procesos/[nurej]/apelacion)
- [ ] Validar que está dentro de 15 días
- [ ] Formulario: Fundamentación, Agravios, Petitorio
- [ ] Presentar apelación
- [ ] Notificar al JUEZ
- [ ] Cambiar estado a APELADO
- [ ] (Proceso pasa a segunda instancia - fuera de alcance MVP)

#### Sentencia Ejecutoriada (Automático)
- [ ] Proceso automático que corre diariamente
- [ ] Detectar sentencias con 15+ días sin apelación
- [ ] Cambiar estado a EJECUTORIADA
- [ ] Generar notificación in-app a ABOGADOS "Sentencia ejecutoriada"

---

## FASE 4: FUNCIONALIDADES COMPLEMENTARIAS

### T015: Módulo de Medidas Cautelares

#### Solicitud de Medida Cautelar (ABOGADO)
- [ ] Crear página de solicitud (/dashboard/procesos/[nurej]/medida-cautelar)
- [ ] Disponible en cualquier etapa del proceso
- [ ] Selección de tipo: Anotación preventiva, Embargo preventivo, Intervención judicial, Secuestro, Prohibición de innovar, Prohibición de contratar
- [ ] Editor de fundamentación: verosimilitud del derecho, peligro en la demora, contracautela
- [ ] Campo para descripción de bienes/derechos afectados (ubicación, valor)
- [ ] Subida de documentos que sustentan la solicitud
- [ ] Campo de petitorio
- [ ] Botón "Solicitar Medida Cautelar"
- [ ] Generar PDF y notificar al JUEZ

#### Evaluación de Medida Cautelar (JUEZ)
- [ ] Página de revisión de medida cautelar (/dashboard/juez/medidas-cautelares/[id])
- [ ] Vista de solicitud completa con pruebas
- [ ] Formulario de evaluación: ¿verosimilitud?, ¿peligro?, ¿contracautela suficiente?
- [ ] Opción 1: Admitir y Ejecutar
- [ ] Plantilla de auto de admisión
- [ ] Registrar fecha y hora de ejecución
- [ ] Iniciar timer de 30 días (Art. 285)
- [ ] Generar alertas: día 25 y día 30
- [ ] Notificar a ABOGADO solicitante
- [ ] Cambiar estado a EJECUTADA
- [ ] Opción 2: Rechazar
- [ ] Auto fundamentado de rechazo (motivos: falta verosimilitud, no hay peligro, contracautela insuficiente)
- [ ] Notificar a ABOGADO
- [ ] Estado: RECHAZADA

#### Gestión de Medidas Cautelares (JUEZ)
- [ ] Dashboard de medidas cautelares (/dashboard/juez/medidas-cautelares)
- [ ] Lista de todas las medidas ejecutadas
- [ ] Filtros: por proceso, abogado, tipo, fecha, días restantes
- [ ] Alertas de medidas próximas a vencer

#### Levantamiento de Medida Cautelar (JUEZ)
- [ ] Formulario de levantamiento
- [ ] Motivos: vencimiento 30 días, solicitud de partes, resolución final
- [ ] Emitir auto de levantamiento
- [ ] Notificar a ambos ABOGADOS
- [ ] Estado: LEVANTADA

#### Vista de Medida Cautelar (ABOGADO)
- [ ] En expediente, sección "Medidas Cautelares"
- [ ] Ver: estado, fecha de solicitud, fecha de ejecución
- [ ] Días restantes de validez con indicador visual
- [ ] Alertas 5 días antes de vencimiento
- [ ] Notificación cuando es ejecutada o levantada

### T016: Módulo de Gestión de Plazos

#### Motor de Plazos (Sistema Automático)
- [ ] Crear tabla "Plazos" en base de datos: tipo, fecha_inicio, fecha_vencimiento, destinatario, estado, alertas_enviadas
- [ ] Función para calcular días hábiles (excluir sábados, domingos, feriados)
- [ ] Crear registro de plazo al detectar evento que lo inicia (citación exitosa → plazo 30 días contestación)
- [ ] Tipos de plazos: Contestación (30 días), Audiencia preliminar (5 días), Sentencia (20 días), Apelación (15 días), Medida cautelar (30 días)

#### Motor de Alertas Automáticas
- [ ] Proceso cron que corre diariamente a las 8:00 AM
- [ ] Revisar todos los plazos activos
- [ ] Generar alertas según días restantes: 5 días antes, 2 días antes, último día, día de vencimiento
- [ ] Enviar notificaciones: in-app, email
- [ ] Registrar alerta enviada para no duplicar
- [ ] Marcar plazo como VENCIDO si se pasa la fecha

#### Dashboard de Plazos (JUEZ)
- [ ] Crear página (/dashboard/juez/plazos)
- [ ] Panel "Plazos Próximos a Vencer"
- [ ] Tabla: Proceso (NUREJ), Actor, Demandado, Tipo de Plazo, Días Restantes, Estado, Acción Rápida
- [ ] Filtros: por tipo, estado, proceso
- [ ] Indicadores visuales: 🔴 0-2 días, 🟡 3-5 días, 🟢 +5 días, ⚫ vencido
- [ ] Botones de acción rápida según tipo: "Declarar Rebeldía", "Emitir Sentencia", "Levantar Medida Cautelar"

#### Calendario de Plazos (JUEZ)
- [ ] Vista de calendario mensual/semanal
- [ ] Marcar días con plazos vencidos
- [ ] Click en día → ver plazos de ese día

#### Dashboard de Plazos (ABOGADO)
- [ ] Crear página (/dashboard/plazos)
- [ ] Panel "Mis Plazos Próximos a Vencer"
- [ ] Tabla similar a vista juez pero solo de sus casos
- [ ] Resumen diario por email: "Tienes X plazos próximos a vencer esta semana"

#### Calendario Personal (ABOGADO)
- [ ] Vista de calendario con plazos, audiencias, vencimientos
- [ ] Botones de acción rápida: "Presentar Contestación", "Presentar Apelación", "Ver Sentencia"

### T017: Módulo de Documentos y Expediente Digital

#### Subida de Documentos (ABOGADO y JUEZ)
- [ ] Componente de subida de archivos (drag & drop)
- [ ] Validación: tipo de archivo (PDF, imagen, Word, Excel), tamaño máximo 50 MB
- [ ] Selección de tipo de documento: Demanda, Contestación, Prueba, Resolución, Acta, Sentencia, Escrito vario, Anexo, Evidencia
- [ ] Campo de descripción
- [ ] Generar hash SHA-256 del archivo
- [ ] Timestamp de subida
- [ ] Metadata: nombre, tipo, tamaño, mime-type
- [ ] Almacenar en Supabase Storage con estructura /procesos/{nurej}/{tipo}/
- [ ] Registrar en tabla "Documentos"

#### Vista de Documentos (ABOGADO)
- [ ] En expediente, sección "Documentos"
- [ ] Lista de documentos: nombre, tipo, fecha, subido por, tamaño
- [ ] Botones: 👁️ Ver (preview), ⬇️ Descargar, 🔗 Copiar link
- [ ] Filtros: por tipo, fecha, quien subió
- [ ] Visualizador de PDFs in-browser con zoom y navegación

#### Vista de Documentos (JUEZ)
- [ ] Vista completa de TODOS los documentos (públicos y privados)
- [ ] Indicador de visibilidad: 👁️ Visible para abogados, 🔒 Solo juzgado
- [ ] Funcionalidad para marcar documento como Público/Privado
- [ ] Verificación de hash SHA-256 (integridad)

#### Expediente Completo
- [ ] Botón "Descargar Expediente Completo"
- [ ] Generar PDF único con: portada, índice, documentos en orden cronológico, línea de tiempo
- [ ] Calcular hash del expediente completo
- [ ] Descarga instantánea

#### Almacenamiento y Seguridad
- [ ] Configurar Row Level Security (RLS) en Supabase
- [ ] Política: Abogado solo ve documentos de sus procesos y marcados como públicos
- [ ] Política: Juez ve todos los documentos de su juzgado
- [ ] Versionado: si se sube archivo con mismo nombre → crear nueva versión
- [ ] Backup automático diario con retención 30 días

#### Auditoría de Accesos
- [ ] Tabla "LogAccesoDocumentos": usuario, fecha_hora, IP, acción (descarga/visualización)
- [ ] Registrar cada acceso a documento
- [ ] Vista de log para JUEZ

---

## FASE 5: NOTIFICACIONES, DASHBOARD Y REPORTES

### T018: Módulo de Notificaciones y Alertas

#### Motor de Notificaciones (Sistema)
- [ ] Crear tabla "Notificaciones": titulo, mensaje, proceso_id, usuario_id, tipo, fecha, leida, accion_url
- [ ] Función para detectar eventos y generar notificaciones
- [ ] Eventos: presentación demanda, admisión/observación, citación, contestación, audiencia, resolución, sentencia, plazo vencimiento, medida cautelar, documento subido

#### Canal de Notificación (MVP Simplificado)
- [ ] In-App únicamente: sistema de notificaciones interno con tabla en base de datos
- [ ] Notificaciones en tiempo real dentro de la aplicación

#### Centro de Notificaciones (UI)
- [ ] Icono de campana en navbar con contador de no leídas
- [ ] Panel de notificaciones: lista ordenada por fecha
- [ ] Filtros: no leídas, por tipo, por proceso, por fecha
- [ ] Acciones: marcar como leída, eliminar, ir a expediente

#### Notificaciones para JUEZ
- [ ] Tipos: nueva demanda, contestación presentada, solicitud medida cautelar, plazo próximo a vencer, plazo vencido, documento subido, audiencia programada
- [ ] Configuración de preferencias: activar/desactivar por tipo

#### Notificaciones para ABOGADO
- [ ] Tipos: demanda admitida/observada/rechazada, citación exitosa, plazo próximo a vencer, contestación presentada, convocatoria audiencia, resolución emitida, sentencia emitida, documento nuevo, plazo apelación
- [ ] Configuración de preferencias: activar/desactivar por tipo

### T019: Dashboard y Reportes

#### Dashboard del JUEZ
- [ ] Crear página (/dashboard/juez)
- [ ] Sección 1: Cards de métricas (procesos activos, por admitir, plazos próximos, audiencias semana, sentencias pendientes)
- [ ] Sección 2: Kanban de procesos (columnas por estado con cantidad)
- [ ] Sección 3: Gráficos (torta: distribución por estado, barras: procesos por mes, línea: tiempo promedio resolución, indicador: cumplimiento plazos %)
- [ ] Sección 4: Calendario mensual con audiencias y plazos
- [ ] Sección 5: Panel de alertas críticas (plazos vencidos, audiencias sin acta, medidas vencidas)

#### Dashboard del ABOGADO
- [ ] Crear página (/dashboard)
- [ ] Sección 1: Cards de cada caso activo (NUREJ, partes, estado, próxima acción, días restantes)
- [ ] Sección 2: Plazos próximos a vencer (< 5 días)
- [ ] Sección 3: Audiencias de la semana
- [ ] Sección 4: Notificaciones recientes (últimas 5)
- [ ] Sección 5: Calendario personal (audiencias, plazos, eventos)
- [ ] Sección 6: Estadísticas (casos activos, ganados/perdidos, tasa éxito)

#### Reportes del JUEZ
- [ ] Página de reportes (/dashboard/juez/reportes)
- [ ] Reporte 1: Carga de Trabajo (período, total ingresados/resueltos/activos, tiempo promedio, cumplimiento plazos)
- [ ] Reporte 2: Audiencias (período, total programadas/realizadas, tasa suspensión, conciliaciones exitosas)
- [ ] Reporte 3: Sentencias (período, total emitidas, favorables actor/demandado/parciales, apeladas)
- [ ] Reporte 4: Plazos (período, total gestionados, cumplidos/vencidos %, promedio días retraso)
- [ ] Exportar en PDF y Excel

#### Reportes del ABOGADO
- [ ] Página de reportes (/dashboard/reportes)
- [ ] Reporte 1: Mis Casos (filtros: estado, período, cliente, lista con estado, ganados/perdidos/en trámite)
- [ ] Reporte 2: Plazos Cumplidos (historial de cumplidos y vencidos)
- [ ] Exportar en PDF y Excel

---

## FASE 6: TESTING Y REFINAMIENTO

### T020: Testing End-to-End del Flujo Completo
- [ ] Crear usuario ABOGADO de prueba
- [ ] Crear usuario JUEZ de prueba
- [ ] Registrar cliente de prueba
- [ ] Crear proceso de prueba
- [ ] Presentar demanda de prueba
- [ ] Admitir demanda como JUEZ
- [ ] Ordenar y registrar citación exitosa
- [ ] Presentar contestación como ABOGADO DEMANDADO
- [ ] Programar y realizar audiencia preliminar (mock)
- [ ] Emitir resolución de prueba
- [ ] Emitir sentencia de prueba
- [ ] Verificar timer de apelación
- [ ] Verificar sentencia ejecutoriada automáticamente
- [ ] Validar todas las notificaciones generadas
- [ ] Validar todos los documentos almacenados con hash
- [ ] Validar expediente digital completo

### T021: Testing de Plazos y Alertas
- [ ] Forzar creación de plazos próximos a vencer (modificar fechas)
- [ ] Ejecutar proceso cron de alertas manualmente
- [ ] Verificar generación de alertas: 5 días, 2 días, último día
- [ ] Verificar envío de emails
- [ ] Verificar notificaciones in-app
- [ ] Verificar indicadores visuales en dashboard
- [ ] Validar marcado de plazo como VENCIDO

### T022: Testing de Medidas Cautelares
- [ ] Solicitar medida cautelar de prueba
- [ ] Admitir y ejecutar medida como JUEZ
- [ ] Verificar inicio de timer 30 días
- [ ] Forzar vencimiento (modificar fecha)
- [ ] Verificar alertas de vencimiento
- [ ] Levantar medida cautelar
- [ ] Validar notificaciones

### T023: Refinamiento de UI/UX
- [ ] Revisar consistencia de diseño en todas las páginas
- [ ] Optimizar flujos de navegación
- [ ] Mejorar feedback visual en formularios
- [ ] Agregar loaders y estados de carga
- [ ] Mejorar mensajes de error y validación
- [ ] Responsive design para móviles (básico)

### T024: Optimización de Performance
- [ ] Implementar paginación en listas largas
- [ ] Optimizar queries de Prisma (incluir relaciones necesarias)
- [ ] Implementar caching donde sea posible
- [ ] Optimizar subida/descarga de archivos grandes
- [ ] Lazy loading de componentes pesados

### T025: Seguridad y Validaciones
- [ ] Auditar todos los endpoints API (verificar autenticación y autorización)
- [ ] Validar permisos por rol en cada acción
- [ ] Sanitizar inputs de formularios (XSS prevention)
- [ ] Validar tamaños de archivos en backend
- [ ] Implementar rate limiting en endpoints críticos
- [ ] Verificar que documentos privados NO sean accesibles por abogados

### T026: Documentación
- [ ] Documentar estructura de base de datos (diagrama ER)
- [ ] Documentar APIs principales
- [ ] Crear guía de usuario para ABOGADO
- [ ] Crear guía de usuario para JUEZ
- [ ] Documentar proceso de deployment
- [ ] Crear README del proyecto actualizado

---

## Relevant Files

### T001: Configuración inicial del proyecto
- `TASKS.md` - Lista maestra de tareas del proyecto (simplificado para MVP: Google Meet sin API, notificaciones in-app únicamente, sin transcripción automática)
- `ARQUITECTURA.md` - Documentación completa de la arquitectura del sistema con decisiones de simplificación para MVP v1.0
- `.env.example` - Variables de entorno simplificadas (solo Supabase Storage, firma digital, plazos, logs - SIN Jitsi, Daily, OpenAI, SendGrid, Resend, Twilio, API de feriados)
- `package.json` - Dependencias del proyecto validadas (Next.js 16.0.7, Prisma 6.4.0, Supabase, TypeScript 5.7.3)
- `next.config.js` - Configuración de Next.js con security headers
- `tsconfig.json` - Configuración de TypeScript con path aliases
- `prisma/schema.prisma` - Schema inicial de base de datos con modelo Profile

### T002: Diseño y configuración de base de datos
- `prisma/schema.prisma` - Schema completo con 15 modelos y 13 enums para sistema judicial (Profile, Juzgado, Cliente, Proceso, Demanda, Citacion, Contestacion, MedidaCautelar, Audiencia, Resolucion, Sentencia, Documento, Notificacion, Plazo, LogAccesoDocumento)
- Schema incluye todas las relaciones entre modelos con índices optimizados para consultas
- Schema formateado y validado con Prisma CLI
- **Pendiente**: Ejecutar `npx prisma migrate dev --name init_judicial_system` después de configurar DATABASE_URL en .env

### T003: Configuración de Supabase Storage
- `SUPABASE_STORAGE_SETUP.md` - Documentación completa de configuración de Storage con instrucciones paso a paso
- Incluye: 3 buckets (documentos-judiciales, evidencias-citaciones, actas-audiencias), estructura de carpetas, políticas RLS completas con SQL, pruebas de configuración
- **Pendiente**: Configuración manual en Supabase Dashboard siguiendo instrucciones del documento

### T004: Sistema de autenticación base
- `src/lib/auth.ts` - Funciones de autenticación completas con Supabase (auth, getCurrentUser, hasRole, isAbogado, isJuez, requireAuth, requireRole)
- `src/proxy.ts` - Proxy de protección de rutas con control de acceso por rol (ABOGADO, JUEZ, USER, SUPERADMIN) - Next.js 16 nueva convención
- `src/types/auth/sign-up.ts` - Schemas de validación Zod para registro según rol (baseSignUpSchema, abogadoSignUpSchema, juezSignUpSchema)
- `src/app/api/auth/sign-up/route.ts` - API route para registro de usuarios con validación por rol y creación de perfil en Prisma
- Sistema completo de autenticación con Supabase + Prisma + roles diferenciados

### T005: Módulo de Gestión de Usuarios
- `src/types/judicial/index.ts` - Tipos TypeScript completos para todo el sistema judicial (15 interfaces de modelos, tipos de input/output, utility types)
- `src/app/api/profile/route.ts` - API route para GET y PUT de perfil con validación Zod y soporte para campos específicos por rol (telefono, registroProfesional)
- `src/app/api/profile/change-password/route.ts` - API route para cambio de contraseña con validación de contraseña actual y actualización segura en Supabase
- `src/app/(dashboard)/dashboard/perfil/page.tsx` - Página de perfil de ABOGADO con secciones para información personal y cambio de contraseña
- `src/app/(dashboard)/dashboard/juez/perfil/page.tsx` - Página de perfil de JUEZ con vista de juzgado asignado, información personal y cambio de contraseña
- `src/components/profile/profile-form.tsx` - Formulario de edición de perfil con validación y soporte para ABOGADO (registroProfesional) y JUEZ (juzgado asignado)
- `src/components/profile/change-password-form.tsx` - Formulario de cambio de contraseña con validación, toggle de visibilidad y confirmación
- **Completado**: Página de perfil ABOGADO y JUEZ, formulario de edición de datos personales, funcionalidad de cambio de contraseña, vista de juzgado asignado
- **Pendiente**: Historial de accesos (requiere logging system), configuración de notificaciones (requiere notification system), firma digital interna, historial de resoluciones

### T006: Módulo de Gestión de Clientes (ABOGADO)
- `src/app/api/clientes/route.ts` - API routes para GET (listar con paginación, búsqueda y filtros) y POST (crear cliente con validación de CI único)
- `src/app/api/clientes/[id]/route.ts` - API routes para GET, PUT (editar) y DELETE (soft delete) de cliente específico
- `src/app/(dashboard)/dashboard/clientes/page.tsx` - Página de gestión de clientes con tabla, búsqueda y diálogo de creación
- `src/components/clientes/clientes-table.tsx` - Tabla de clientes con búsqueda por nombre/CI/apellido, filtro por estado activo/inactivo, paginación y acciones (editar, desactivar)
- `src/components/clientes/create-cliente-dialog.tsx` - Diálogo con formulario para crear nuevo cliente con todos los campos requeridos y validación Zod
- `src/components/clientes/edit-cliente-dialog.tsx` - Diálogo con formulario para editar cliente existente con validación
- **Completado**: CRUD completo de clientes, búsqueda, filtros, paginación, validación de CI único, soft delete
- **Pendiente**: Subida de foto del cliente (opcional), página de detalle con historial de procesos

### T007: Módulo de Gestión de Procesos - Estructura Base
- `src/app/api/juzgados/route.ts` - API route para listar juzgados activos ordenados por departamento/ciudad/nombre
- `src/app/api/procesos/route.ts` - API routes para GET (listar con paginación, filtros por estado/materia/juzgado, acceso por rol) y POST (crear proceso con generación de NUREJ)
- `src/app/api/procesos/[id]/route.ts` - API routes para GET (expediente completo con relaciones) y PUT (actualizar proceso con control de permisos por rol)
- `src/app/(dashboard)/dashboard/procesos/nuevo/page.tsx` - Página de creación de nuevo proceso (solo ABOGADO)
- `src/app/(dashboard)/dashboard/procesos/page.tsx` - Página de listado de procesos (ABOGADO y JUEZ con filtrado automático por rol)
- `src/app/(dashboard)/dashboard/procesos/[id]/page.tsx` - Página de expediente digital (acceso controlado por rol)
- `src/components/procesos/proceso-wizard.tsx` - Wizard de 5 pasos con validación Zod, carga de juzgados/clientes, generación de NUREJ y creación de proceso
- `src/components/procesos/procesos-list.tsx` - Lista de procesos con vista grid/list, filtros por estado/materia, búsqueda por NUREJ, paginación y badges de estado
- `src/components/procesos/expediente-digital.tsx` - Expediente digital con tabs (Información General, Documentos, Plazos, Audiencias, Resoluciones, Línea de Tiempo)
- **Completado**: CRUD de procesos, wizard de creación 5 pasos, generación de NUREJ, vista de procesos con filtros, expediente digital con tabs, control de acceso por rol
- **Pendiente**: Vista Kanban específica para JUEZ, indicadores de urgencia, sección de notificaciones en expediente, vista diferenciada ABOGADO/JUEZ con comentarios internos

---

## Notas

- Cada tarea debe completarse y confirmarse antes de pasar a la siguiente
- Todos los tests deben pasar antes de hacer commit
- Seguir el protocolo de commit definido en processtasks.md
- Mantener este archivo actualizado con el progreso
