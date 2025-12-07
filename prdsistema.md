PRD - Sistema de Gestión Procesal Judicial
## VERSIÓN 2 ROLES: ABOGADO Y JUEZ (ÓRGANO JUDICIAL)

**Fecha:** Diciembre 2025  
**Versión:** 2.0  
**Enfoque:** Digitalización del proceso ordinario civil (Ley 439) con interacción Abogado ↔ Juez

---

## 1. INTRODUCCIÓN Y CONTEXTO

### 1.1 Problema
El proceso ordinario civil boliviano (Ley 439) actualmente opera con:
- Expedientes físicos propensos a pérdida y deterioro
- Presentación de escritos en papel que generan demoras
- Falta de trazabilidad de actos procesales
- Citaciones físicas costosas e ineficientes
- Plazos procesales sin monitoreo automático
- Audiencias presenciales con alta tasa de reprogramación
- Tiempo promedio de resolución: 300+ días
- Falta de digitalización en la relación abogado-juzgado

### 1.2 Solución Propuesta
Sistema digital que gestiona el **proceso ordinario completo** desde la presentación de demanda hasta la sentencia ejecutoriada, con **2 roles principales**:

1. **ABOGADO**: Representa a sus clientes (ciudadanos), gestiona sus datos, presenta escritos, pruebas y participa en audiencias
2. **JUEZ (Órgano Judicial)**: Administra el proceso, emite resoluciones, dirige audiencias y dicta sentencia

**Alcance:** Digitalización completa del flujo: Demanda → Admisión → Citación → Contestación → Audiencia Preliminar → Audiencia Complementaria → Sentencia → Ejecutoria

### 1.3 Principios del Sistema
- **Trazabilidad total:** Registro inmutable de todos los actos procesales
- **Cumplimiento legal:** Validación automática de requisitos (Art. 110, Art. 213, etc.)
- **Automatización de plazos:** Alertas y vencimientos automáticos
- **Expediente único digital:** Acceso centralizado para abogados y jueces
- **Transparencia procesal:** Historial completo de actos con timestamps
- **Seguridad jurídica:** Hash SHA-256 de documentos, firmado digital

---

## 2. OBJETIVOS DEL PROYECTO

### 2.1 Objetivos Estratégicos
1. **Digitalizar 95% de documentos** del proceso ordinario
2. **Reducir tiempos procesales** de 300 a 180 días (40%)
3. **Automatizar citaciones** con registro digital de evidencia
4. **Eliminar pérdida de expedientes** con almacenamiento en la nube
5. **Optimizar audiencias** con participación virtual y transcripción automática
6. **Garantizar cumplimiento de plazos** con alertas automáticas

### 2.2 Métricas de Éxito
- 100% de demandas presentadas digitalmente
- 90% de citaciones efectivas en primer intento
- 80%+ cumplimiento de plazos procesales
- 100% de audiencias con acta digital
- 100% de sentencias digitalizadas
- Reducción de 40% en tiempo promedio de proceso

---

## 3. ROLES Y USUARIOS DEL SISTEMA

### 3.1 ROL 1: ABOGADO

#### Descripción
Profesional del derecho que representa a uno o más ciudadanos (clientes) en procesos judiciales. Es el intermediario entre sus clientes y el órgano judicial.

#### Perfil
- **Edad:** 25-60 años
- **Tech-savvy:** Medio-Alto
- **Cantidad de clientes:** Variable (1-100+)
- **Casos activos:** Variable (1-50+)

#### Dolor Principal
- Gestionar múltiples clientes y casos sin herramientas digitales
- Incertidumbre sobre estado del caso y plazos
- Viajes constantes al juzgado para presentar escritos
- Falta de alertas sobre vencimientos de plazos
- Dificultad para organizar información de todos sus clientes

#### Necesidades
- Registro centralizado de todos mis clientes (ciudadanos)
- Vista consolidada de todos mis casos activos
- Presentación digital de demandas y escritos
- Acceso remoto a expedientes digitales completos
- Alertas automáticas de plazos próximos a vencer
- Calendario de audiencias de todos mis casos
- Comunicación formal con el juzgado dentro del sistema
- Historial completo de cada caso

#### Funcionalidades del ABOGADO

##### ✅ PUEDE HACER:

**1. Gestión de Clientes**
- Registrar nuevos clientes con datos completos (CI, nombres, apellidos, edad, estado civil, profesión, domicilio real, domicilio procesal)
- Ver listado de todos sus clientes
- Editar información de sus clientes
- Buscar y filtrar clientes por nombre, CI
- Ver historial de procesos de cada cliente

**2. Gestión de Procesos**
- Crear nuevo proceso judicial
- Asignar cliente(s) a un proceso (como actor o demandado)
- Ver todos sus procesos activos
- Filtrar procesos por estado, cliente, juzgado, fecha
- Acceder al expediente digital completo de cada proceso
- Ver línea de tiempo del proceso con todos los actos
- Descargar expediente completo en PDF

**3. Presentación de Demandas**
- Presentar demanda digital con wizard guiado (5 pasos Art. 110)
- Validación automática de requisitos obligatorios
- Subir anexos (pruebas documentales)
- Recibir notificación de admisión o rechazo de demanda
- Ver observaciones del juez si la demanda fue rechazada
- Corregir y re-presentar demanda observada

**4. Gestión de Citaciones**
- Ver estado de citación del demandado
- Recibir notificación cuando citación es exitosa
- Ver evidencia fotográfica de citación (subida por juez)
- Consultar días restantes del plazo de contestación (30 días Art. 247-I)

**5. Presentación de Escritos**
- Presentar contestación (si representa al demandado)
- Presentar excepciones previas
- Presentar reconvención
- Presentar réplica
- Presentar escritos varios (alegatos, recursos, etc.)
- Adjuntar pruebas documentales a cada escrito

**6. Gestión de Medidas Cautelares**
- Solicitar medida cautelar con fundamentación
- Seleccionar tipo (anotación, embargo, intervención, secuestro, prohibición)
- Ver estado de solicitud de medida cautelar
- Recibir notificación de ejecución de medida
- Ver fecha límite de validez (30 días desde ejecución)
- Recibir alerta automática antes de vencimiento

**7. Gestión de Audiencias**
- Ver calendario de todas sus audiencias
- Recibir notificación de convocatoria a audiencia
- Acceder a sala virtual (Jitsi/Daily)
- Participar en audiencia virtual con video/audio
- Ver grabación de audiencia después de realizada
- Descargar transcripción automática de audiencia
- Ver y descargar acta de audiencia

**8. Gestión de Pruebas**
- Ofrecer prueba documental en demanda/contestación
- Subir documentos con información de hash SHA-256
- Ver lista de pruebas admitidas por el juez
- Presentar pruebas adicionales en audiencia complementaria
- Ver catálogo de todas las pruebas del caso

**9. Alertas y Notificaciones**
- Recibir alertas de plazos próximos a vencer (5 días antes, 1 día antes, día de vencimiento)
- Notificación de admisión/observación de demanda
- Notificación de citación exitosa
- Notificación de contestación presentada (si es actor)
- Notificación de convocatoria a audiencia
- Notificación de resoluciones emitidas
- Notificación de sentencia
- Dashboard con resumen de notificaciones pendientes

**10. Consulta de Resoluciones**
- Ver todas las resoluciones del caso
- Filtrar por tipo (providencia, auto interlocutorio, auto definitivo, sentencia)
- Descargar resoluciones en PDF
- Ver fecha de notificación de cada resolución

**11. Acceso a Sentencia**
- Ver sentencia completa (estructura Art. 213)
- Descargar sentencia en PDF con firma digital del juez
- Ver fecha de ejecutoria (15 días después si no hay apelación)
- Presentar recurso de apelación (dentro de 15 días)

**12. Reportes y Estadísticas (Vista Abogado)**
- Ver resumen de todos sus casos (activos, archivados, ganados, perdidos)
- Ver plazos próximos a vencer de todos sus casos
- Ver calendario consolidado de audiencias
- Exportar reportes en Excel/PDF

##### ❌ NO PUEDE HACER:

- Emitir resoluciones judiciales
- Admitir o rechazar demandas
- Emitir decretos o autos
- Modificar documentos firmados por el juez
- Acceder a expedientes de otros abogados (salvo que sea parte en el proceso)
- Ver comentarios internos del juzgado
- Modificar estados del proceso (solo el juez puede)
- Acceder a procesos donde no es parte

---

### 3.2 ROL 2: JUEZ (ÓRGANO JUDICIAL)

#### Descripción
Autoridad judicial que dirige el proceso, emite resoluciones, preside audiencias y dicta sentencia. Representa al órgano judicial en el sistema.

**Nota:** En este rol también se incluyen funciones del **Secretario Judicial** (citaciones, notificaciones, agenda) para simplificar el sistema a 2 roles.

#### Perfil
- **Edad:** 35-55 años
- **Tech-savvy:** Medio
- **Casos asignados:** Variable (30-100+)

#### Dolor Principal
- Sobrecarga de casos sin priorización clara
- Expedientes físicos desorganizados
- Plazos vencidos por falta de alertas
- Dificultad para coordinar audiencias
- Falta de información consolidada de cada caso

#### Necesidades
- Dashboard con todos los casos asignados
- Vista clara de plazos próximos a vencer
- Emisión rápida de resoluciones con plantillas
- Control de citaciones con evidencia digital
- Gestión de calendario de audiencias
- Acceso completo a expedientes digitales
- Herramientas para presidir audiencias virtuales

#### Funcionalidades del JUEZ

##### ✅ PUEDE HACER:

**1. Gestión de Procesos Asignados**
- Ver todos los procesos asignados a su juzgado
- Vista Kanban por estado (Admisión, Citación, Contestación, Audiencia, Sentencia)
- Filtrar procesos por estado, fecha de ingreso, materia, actor, demandado
- Acceder al expediente digital completo de cualquier proceso asignado
- Ver línea de tiempo de cada proceso
- Asignar prioridad a procesos (urgente, normal, baja)
- Archivar procesos finalizados

**2. Admisión de Demandas**
- Ver demandas presentadas pendientes de admisión
- Validar cumplimiento de requisitos Art. 110
- Emitir decreto de admisión (Art. 363)
- Emitir decreto de observación con motivos específicos
- Generar auto de rechazo de demanda (con fundamentación)
- Asignar NUREJ al proceso admitido
- Notificar al abogado actor sobre admisión/observación

**3. Gestión de Citaciones**
- Ordenar citación del demandado
- Seleccionar tipo de citación (personal, cédula, edicto, tácita)
- Registrar intento de citación con evidencia
- Subir foto de acta de citación (como evidencia)
- Validar citación exitosa
- Iniciar timer automático de 30 días para contestación (Art. 247-I)
- Ver días transcurridos y días restantes del plazo
- Declarar citación tácita si corresponde
- Notificar a abogado actor cuando citación es exitosa

**4. Gestión de Contestaciones y Escritos**
- Ver contestaciones presentadas por abogado demandado
- Ver excepciones previas presentadas
- Ver reconvenciones presentadas
- Admitir o rechazar excepciones previas
- Emitir auto sobre reconvención
- Ver todos los escritos presentados por ambas partes
- Emitir providencias sobre escritos

**5. Gestión de Medidas Cautelares**
- Ver solicitudes de medidas cautelares
- Analizar fundamentación
- Admitir o rechazar solicitud de medida cautelar
- Emitir auto de ejecución de medida cautelar
- Registrar fecha de ejecución (inicia timer de 30 días)
- Ver alertas de medidas cautelares próximas a vencer
- Emitir auto de levantamiento de medida cautelar

**6. Gestión de Audiencias**
- Auto-convocar audiencia preliminar (5 días después de contestación Art. 365)
- Programar fecha y hora específica de audiencia
- Notificar a ambos abogados (actor y demandado) sobre audiencia
- Crear sala virtual de audiencia (Jitsi/Daily)
- Iniciar audiencia virtual (preside)
- Controlar asistencia de participantes
- Proponer conciliación entre partes
- Registrar acuerdo de conciliación (si hay)
- Fijar objeto del proceso si no hay conciliación
- Admitir o rechazar pruebas ofrecidas
- Programar audiencia complementaria (si es necesario)
- Ordenar grabación automática de audiencia
- Revisar transcripción automática (Whisper)
- Generar y firmar acta de audiencia
- Subir acta al expediente

**7. Gestión de Pruebas**
- Ver pruebas ofrecidas por ambas partes
- Admitir o rechazar pruebas
- Ordenar práctica de pruebas en audiencia
- Ordenar peritaje (si corresponde)
- Valorar pruebas

**8. Emisión de Resoluciones**
- Emitir providencias (decretos simples)
- Emitir autos interlocutorios (con fundamentación)
- Emitir autos definitivos (resuelven incidentes)
- Seleccionar plantilla de resolución según tipo
- Redactar contenido de resolución
- Firmar digitalmente resolución
- Generar PDF con marca de agua oficial
- Notificar automáticamente a abogados

**9. Emisión de Sentencia**
- Acceder a editor de sentencia con plantilla Art. 213:
  1. Encabezamiento
  2. Narrativa (hechos)
  3. Motiva (análisis de pruebas y derecho aplicable)
  4. Resolutiva (decisión)
- Redactar cada sección de la sentencia
- Validación automática de campos obligatorios
- Firmar digitalmente sentencia
- Generar hash SHA-256 del documento
- Generar PDF oficial con marca de agua
- Notificar a ambos abogados
- Registrar fecha de emisión (inicia plazo de 15 días para apelación)

**10. Gestión de Plazos**
- Ver dashboard de plazos próximos a vencer de todos los casos
- Filtrar por tipo de plazo (contestación, audiencia, sentencia)
- Ver alertas de plazos vencidos
- Programar recordatorios personalizados
- Ver estadísticas de cumplimiento de plazos

**11. Control de Accesos al Expediente (Auditoría)**
- Ver log de accesos al expediente (quién, cuándo, qué)
- Ver historial de modificaciones
- Ver IP y dispositivo de acceso
- Exportar log de auditoría

**12. Reportes y Estadísticas (Vista Juez)**
- Ver carga de trabajo (procesos activos por estado)
- Ver estadísticas de resolución de casos (tiempo promedio)
- Ver cumplimiento de plazos por tipo
- Ver cantidad de audiencias realizadas vs. programadas
- Ver sentencias emitidas en el mes/año
- Exportar reportes para administración judicial

**13. Administración del Juzgado**
- Configurar datos del juzgado
- Gestionar calendario de días hábiles
- Configurar plantillas de resoluciones
- Gestionar usuarios del juzgado (si hay secretarios)
- Ver historial de acciones del juzgado

##### ❌ NO PUEDE HACER:

- Presentar demandas (eso es del abogado)
- Presentar escritos en nombre de las partes
- Modificar escritos presentados por abogados
- Chatear informalmente con abogados (todo debe ser formal vía resoluciones)
- Eliminar actos procesales (inmutabilidad)
- Acceder a expedientes de otros juzgados (salvo casos de competencia)

---

## 4. MÓDULOS FUNCIONALES DEL SISTEMA

### MÓDULO 1: GESTIÓN DE USUARIOS Y AUTENTICACIÓN

#### Objetivo
Permitir registro seguro, autenticación y gestión de perfiles diferenciados para abogados y jueces.

#### Funcionalidades por Rol

##### ABOGADO:
- **Registro:**
  - Formulario con: número de registro profesional, CI, nombres completos, email, teléfono
  - Validación de formato de registro profesional (ej. LP-12345)
  - Carga opcional de certificado de vigencia (PDF)
  - Email de verificación
- **Login:**
  - Email + contraseña
  - Recuperación de contraseña vía email
  - 2FA opcional (SMS/email)
- **Perfil:**
  - Ver y editar datos personales
  - Cambiar contraseña
  - Ver historial de accesos
  - Configurar preferencias de notificaciones

##### JUEZ:
- **Asignación de cuenta (por administrador del sistema):**
  - Datos: CI, nombres, juzgado asignado, email institucional
  - Contraseña temporal (cambio obligatorio en primer acceso)
- **Login:**
  - Email institucional + contraseña
  - 2FA obligatorio para jueces
- **Perfil:**
  - Ver datos del juzgado asignado
  - Cambiar contraseña
  - Configurar firma digital interna
  - Ver historial de resoluciones emitidas

#### Conexión entre Roles:
- Abogados y jueces comparten el sistema pero con vistas completamente diferenciadas
- Un abogado puede ver procesos asignados a diferentes jueces (si es parte)
- Un juez puede ver casos con diferentes abogados

---

### MÓDULO 2: GESTIÓN DE CLIENTES (Solo ABOGADO)

#### Objetivo
Permitir al abogado registrar y administrar la información de todos sus clientes (ciudadanos) de forma centralizada.

#### Funcionalidades del ABOGADO:

**Registro de Cliente:**
- Formulario completo:
  - CI
  - Nombres completos
  - Apellidos completos
  - Edad
  - Estado civil
  - Profesión
  - Domicilio real (dirección completa)
  - Domicilio procesal (puede ser diferente)
  - Teléfono
  - Email (opcional)
- Validación de CI único por cliente
- Foto opcional del cliente
- Campos personalizados (notas internas del abogado)

**Gestión de Clientes:**
- Vista de lista de todos los clientes
- Búsqueda por nombre, CI, apellido
- Filtros por estado (activo, inactivo)
- Edición de datos de cliente
- Desactivación de cliente (sin eliminación)
- Vista de detalle de cliente:
  - Datos completos
  - Historial de procesos donde es parte
  - Documentos asociados

**Asignación de Clientes a Procesos:**
- Al crear un proceso, el abogado selecciona de su lista de clientes
- Puede asignar un cliente como:
  - Actor (demandante)
  - Demandado (si representa al demandado)
  - Tercero interesado
- Un cliente puede estar en múltiples procesos

#### Conexión con ROL JUEZ:
- El juez NO gestiona clientes directamente
- El juez VE la información de los ciudadanos (clientes del abogado) en el expediente del proceso
- La información del ciudadano que ve el juez es la que cargó el abogado
- El juez puede solicitar corrección de datos si detecta errores

---

### MÓDULO 3: GESTIÓN DE PROCESOS

#### Objetivo
Crear, administrar y consultar procesos judiciales con expediente digital único.

#### Funcionalidades del ABOGADO:

**Creación de Proceso:**
- Wizard de creación:
  1. **Tipo de proceso:** Ordinario, extraordinario, monitorio, cautelar
  2. **Materia:** Civil, familiar, comercial, laboral
  3. **Juzgado:** Seleccionar de lista de juzgados disponibles
  4. **Cuantía:** Monto económico en Bs (Art. 5 Ley 439)
  5. **Partes del proceso:**
     - Seleccionar cliente(s) de su lista como ACTOR
     - Ingresar datos del DEMANDADO (puede ser cliente suyo o de otro abogado)
     - Agregar terceros si aplica
- Sistema genera NUREJ único (pendiente de validación por juez)
- Estado inicial: BORRADOR (hasta presentar demanda)

**Vista de Procesos:**
- Dashboard con cards de todos sus procesos
- Filtros:
  - Por estado (borrador, presentado, admitido, en audiencia, sentenciado, etc.)
  - Por cliente
  - Por juzgado
  - Por fecha de inicio
  - Por materia
- Vista de lista vs. vista Kanban
- Indicadores visuales:
  - 🔴 Urgente (plazo próximo a vencer)
  - 🟡 Normal
  - 🟢 Al día
  - ⚫ Archivado

**Expediente Digital (Vista Abogado):**
- Secciones:
  1. **Información General:**
     - NUREJ
     - Estado actual
     - Fecha de inicio
     - Juzgado asignado
     - Juez asignado
     - Partes del proceso (actor, demandado, terceros)
     - Materia y cuantía
  
  2. **Documentos:**
     - Demanda
     - Contestación
     - Pruebas
     - Resoluciones
     - Sentencia
     - Anexos varios
     - Ordenados cronológicamente
     - Con indicador de hash SHA-256
  
  3. **Línea de Tiempo:**
     - Todos los actos procesales ordenados cronológicamente
     - Cada acto con: fecha, hora, descripción, responsable, documento asociado
     - Iconos diferenciados por tipo de acto
  
  4. **Plazos:**
     - Plazos activos con días restantes
     - Plazos vencidos
     - Plazos cumplidos
  
  5. **Audiencias:**
     - Audiencias programadas
     - Audiencias realizadas (con link a grabación)
  
  6. **Notificaciones:**
     - Historial de notificaciones del proceso

**Acciones sobre Proceso:**
- Presentar demanda (si está en borrador)
- Presentar escritos varios
- Subir documentos
- Solicitar medida cautelar
- Ver resoluciones
- Acceder a audiencias
- Descargar expediente completo en PDF

#### Funcionalidades del JUEZ:

**Vista de Procesos Asignados:**
- Dashboard con todos los procesos de su juzgado
- Vista Kanban por estado:
  - **Columna 1: Por Admitir** (demandas presentadas)
  - **Columna 2: Por Citar** (admitidas, pendientes de citación)
  - **Columna 3: Por Contestar** (citadas, esperando contestación)
  - **Columna 4: Por Audiencia** (contestadas, pendiente de audiencia)
  - **Columna 5: Por Sentencia** (audiencia realizada, pendiente de sentencia)
  - **Columna 6: Sentenciadas** (con sentencia emitida)
  - **Columna 7: Ejecutoriadas** (15 días después sin apelación)
  - **Columna 8: Archivadas**

- Filtros:
  - Por estado
  - Por fecha de ingreso
  - Por abogado actor
  - Por abogado demandado
  - Por materia
  - Por prioridad

**Expediente Digital (Vista Juez):**
- Secciones iguales que vista abogado, PERO con información adicional:
  - **Comentarios Internos:** Solo visible para el juez y secretarios del juzgado
  - **Log de Auditoría:** Quién accedió al expediente y cuándo
  - **Indicadores de Gestión:**
    - Días transcurridos desde inicio
    - Promedio de días para este tipo de proceso
    - Cumplimiento de plazos (%)
    - Alertas de incumplimiento

**Acciones sobre Proceso:**
- Admitir o rechazar demanda
- Ordenar citación
- Registrar citación exitosa
- Emitir resoluciones
- Convocar a audiencia
- Emitir sentencia
- Archivar proceso
- Agregar comentarios internos

#### Conexión entre Roles:
- **Abogado** crea el proceso → **Juez** lo ve en su bandeja de "Por Admitir"
- **Juez** admite demanda → **Abogado** recibe notificación y el proceso cambia de estado
- **Juez** ordena citación → **Abogado** ve estado "En citación"
- **Abogado** presenta contestación → **Juez** ve contestación en expediente y proceso pasa a "Por Audiencia"
- **Juez** emite resolución → **Abogado** recibe notificación y puede ver/descargar resolución

---

### MÓDULO 4: DEMANDAS (Art. 110 Ley 439)

#### Objetivo
Permitir la presentación digital de demandas con validación automática de requisitos legales.

#### Funcionalidades del ABOGADO:

**Wizard de Presentación de Demanda (5 Pasos):**

**PASO 1: Designación del Juez**
- Campo: Nombre del juez o tribunal
- Juzgado (pre-llenado si se seleccionó en creación de proceso)
- Materia del proceso

**PASO 2: Datos de las Partes**
- **Actor (Demandante):**
  - Seleccionar de lista de clientes del abogado
  - Se auto-completan: CI, nombres, apellidos, edad, estado civil, profesión, domicilio real, domicilio procesal
  - Datos del abogado representante (auto-llenado)
  
- **Demandado:**
  - Opción 1: Seleccionar de lista de clientes (si representa a ambas partes en caso especial)
  - Opción 2: Ingresar datos manualmente del demandado:
    - CI
    - Nombres completos
    - Apellidos completos
    - Edad
    - Estado civil
    - Profesión
    - Domicilio real
    - Domicilio procesal
  - Datos del abogado del demandado (si se conoce, opcional)

**PASO 3: Objeto, Hechos y Derecho**
- **Objeto de la demanda:** Campo de texto enriquecido (Rich Text Editor)
- **Hechos:** Editor de texto con formato
  - Posibilidad de agregar hechos numerados
  - Fecha de cada hecho
- **Derecho:** Editor de texto con formato
  - Citación de artículos de ley aplicables
  - Base legal de la demanda

**PASO 4: Petitorio, Valor y Prueba**
- **Petitorio:** Editor de texto
  - Lo que se solicita al juez (condena, declaración, etc.)
  - Petitorios subsidiarios
- **Valor de la demanda:** Monto en Bs (para determinar procedimiento)
- **Ofrecimiento de prueba:** Editor de texto
  - Lista de pruebas que se ofrecen
  - Descripción de cada prueba
  - Prueba documental (subir PDFs)
  - Prueba testimonial (nombres de testigos)
  - Pericial (indicar tipo de peritaje)

**PASO 5: Preview y Envío**
- Vista previa de toda la demanda en formato legal
- Check de validación de campos obligatorios:
  - ✅ Designación de juez
  - ✅ Datos completos de actor
  - ✅ Datos completos de demandado
  - ✅ Objeto de demanda
  - ✅ Hechos
  - ✅ Derecho
  - ✅ Petitorio
  - ✅ Valor
  - ✅ Prueba ofrecida
- Botón "Presentar Demanda"
- Timestamp de presentación
- Generación de código de seguimiento

**Post-Presentación:**
- Sistema genera PDF de la demanda
- Genera hash SHA-256
- Almacena en expediente digital
- Cambia estado del proceso a "PRESENTADO"
- Notifica al juez asignado
- Abogado recibe confirmación con código de seguimiento

**Corrección de Demanda Observada:**
- Si el juez observa la demanda, abogado recibe notificación con motivos
- Abogado puede editar demanda
- Re-presentar demanda corregida
- Sistema registra versión anterior + versión corregida

#### Funcionalidades del JUEZ:

**Recepción de Demanda:**
- Notificación de nueva demanda presentada
- Demanda aparece en bandeja "Por Admitir"
- Acceso a demanda completa en formato PDF
- Vista de checklist de validación Art. 110

**Validación y Admisión:**
- Revisar demanda completa
- Verificar cumplimiento de requisitos Art. 110:
  - ✅ Designación de juez
  - ✅ Individualización de partes
  - ✅ Objeto claro
  - ✅ Hechos narrados
  - ✅ Derecho aplicable
  - ✅ Petitorio concreto
  - ✅ Valor de la demanda
  - ✅ Prueba ofrecida

**Opciones del Juez:**

**OPCIÓN 1: Admitir Demanda (Art. 363)**
- Emitir decreto de admisión
- Plantilla pre-cargada:
  ```
  DECRETO DE ADMISIÓN
  Juzgado: [Nombre del juzgado]
  Proceso: [NUREJ]
  Actor: [Nombre del actor]
  Demandado: [Nombre del demandado]
  
  Vistos: La demanda presentada por [nombre del abogado actor] en representación de [nombre del actor]...
  
  CONSIDERANDO: Que la demanda cumple con los requisitos establecidos en el Art. 110 de la Ley 439...
  
  POR TANTO: Se admite la demanda y se ordena la citación del demandado con copia de la demanda y sus anexos, otorgándole el plazo de treinta días para contestar, conforme al Art. 247-I de la Ley 439.
  
  Regístrese, notifíquese y cítese.
  ```
- Firmar digitalmente decreto
- Generar PDF oficial
- Sistema asigna NUREJ definitivo
- Cambia estado a "ADMITIDO"
- Notifica a abogado actor
- Pasa automáticamente a bandeja "Por Citar"

**OPCIÓN 2: Observar Demanda**
- Seleccionar motivo de observación:
  - Falta designación correcta del juez
  - Datos incompletos de partes
  - Objeto de demanda no claro
  - Falta fundamentación de hechos
  - Falta fundamentación jurídica
  - Petitorio impreciso
  - Falta valor de la demanda
  - Falta ofrecimiento de prueba
  - Otro (especificar)
- Redactar observaciones específicas
- Emitir decreto de observación
- Notificar a abogado actor
- Establecer plazo de corrección (generalmente 10 días)
- Proceso queda en estado "OBSERVADO"

**OPCIÓN 3: Rechazar Demanda (casos excepcionales)**
- Fundamentar motivo de rechazo:
  - Incompetencia del juzgado
  - Falta de legitimación activa o pasiva
  - Prescripción evidente
  - Cosa juzgada
  - Otro fundamento legal
- Emitir auto fundamentado de rechazo
- Notificar a abogado actor
- Proceso pasa a estado "RECHAZADO"

#### Conexión entre Roles:
1. **ABOGADO presenta demanda** → Sistema valida campos → Genera PDF → Notifica a **JUEZ**
2. **JUEZ revisa demanda** → Valida Art. 110 → Decide: Admitir/Observar/Rechazar
3. Si **ADMITE** → Sistema notifica a **ABOGADO** → Proceso avanza a etapa de citación
4. Si **OBSERVA** → **ABOGADO** recibe observaciones → Corrige demanda → Re-presenta
5. Si **RECHAZA** → **ABOGADO** recibe auto de rechazo → Puede apelar o cerrar caso

---

### MÓDULO 5: CITACIONES

#### Objetivo
Gestionar el proceso de citación del demandado con evidencia digital y control de plazos.

#### Funcionalidades del JUEZ:

**Ordenar Citación (Post-Admisión):**
- Una vez admitida la demanda, sistema muestra acción "Ordenar Citación"
- Juez revisa datos del demandado:
  - Nombre completo
  - CI
  - Domicilio real (dirección de citación)
  - Domicilio procesal

**Tipos de Citación (Art. 127-131 Ley 439):**

**OPCIÓN 1: Citación Personal**
- Descripción: Entrega en mano al demandado
- Procedimiento en el sistema:
  1. Juez ordena citación personal
  2. Sistema genera cédula de citación (PDF) con:
     - Datos del demandado
     - Resumen de la demanda
     - Plazo de 30 días para contestar
     - Advertencias legales
  3. Juez (o secretario asignado) realiza citación física
  4. Juez sube evidencia:
     - Foto de acta de citación firmada
     - Fecha y hora de citación
     - Foto del demandado recibiendo (opcional)
  5. Juez marca citación como "EXITOSA"
  6. Sistema registra timestamp y activa timer de 30 días

**OPCIÓN 2: Citación por Cédula (Art. 128)**
- Descripción: Entrega a familiar o persona en domicilio
- Procedimiento:
  1. Juez ordena citación por cédula
  2. Genera cédula de citación
  3. Realiza citación dejando cédula con familiar/persona
  4. Sube evidencia:
     - Foto de acta de entrega
     - Datos de persona que recibe
     - Parentesco o relación con demandado
     - Firma de recepción
  5. Marca citación como "EXITOSA"
  6. Sistema activa timer de 30 días

**OPCIÓN 3: Citación por Edictos (Art. 129)**
- Descripción: Publicación en medios cuando no se encuentra al demandado
- Procedimiento:
  1. Juez ordena citación por edictos
  2. Sistema genera edicto de citación (plantilla)
  3. Juez configura:
     - Medio de publicación (periódico local)
     - Fecha de primera publicación
     - Fecha de segunda publicación
     - Fecha de tercera publicación (mínimo 3 publicaciones Art. 129)
  4. Sube evidencia de cada publicación (foto de periódico o PDF)
  5. Después de 3ra publicación, marca citación como "EXITOSA"
  6. Sistema activa timer de 20 días (plazo especial para edictos)

**OPCIÓN 4: Citación Tácita (Art. 130)**
- Descripción: Se da por citado cuando el demandado se apersona voluntariamente
- Procedimiento:
  1. Si abogado del demandado presenta contestación sin citación previa
  2. Juez marca citación como "TÁCITA"
  3. Sistema registra fecha de apersonamiento como fecha de citación
  4. No aplica plazo de 30 días (ya contestó)

**Gestión de Citaciones:**
- Ver lista de citaciones pendientes de su juzgado
- Ver citaciones en proceso (evidencia parcial)
- Ver citaciones exitosas
- Ver citaciones fallidas (con motivo)

**Registro de Intentos Fallidos:**
- Si citación personal/cédula falla:
  1. Juez registra intento con:
     - Fecha y hora de intento
     - Motivo de falla (domicilio cerrado, demandado no encontrado, se negó a recibir, etc.)
     - Foto de evidencia (opcional)
  2. Sistema guarda historial de intentos
  3. Después de 3 intentos fallidos, sistema sugiere citación por edictos

**Post-Citación Exitosa:**
- Sistema automáticamente:
  - Cambia estado del proceso a "CITADO"
  - Inicia timer de 30 días para contestación (Art. 247-I)
  - Notifica a abogado actor que citación fue exitosa
  - Muestra días restantes en dashboard
  - Genera alertas de vencimiento (día 25, día 28, día 30)

#### Funcionalidades del ABOGADO (Solo Vista):

**Vista de Estado de Citación:**
- En expediente del proceso, sección "Citaciones"
- Ver:
  - Tipo de citación ordenada
  - Estado (pendiente, en proceso, exitosa, fallida)
  - Evidencia fotográfica (si juez la subió)
  - Fecha de citación exitosa
  - Timer de días restantes para contestación (si es actor)

**Notificaciones:**
- Abogado ACTOR recibe:
  - Notificación cuando juez ordena citación
  - Notificación cuando citación es exitosa
  - Alerta cuando quedan 5 días para vencimiento de plazo de contestación
  - Alerta cuando plazo de contestación vence

- Abogado DEMANDADO recibe (si ya está asignado al caso):
  - Notificación de citación exitosa
  - Acceso a copia de demanda y anexos
  - Timer de días restantes para contestar

#### Conexión entre Roles:
1. **JUEZ admite demanda** → Sistema activa opción "Ordenar Citación"
2. **JUEZ ordena citación** y selecciona tipo → Sistema genera cédula/edicto
3. **JUEZ realiza citación física** → Sube evidencia → Marca como exitosa
4. **Sistema inicia timer de 30 días** → Notifica a **ABOGADO ACTOR**
5. **ABOGADO DEMANDADO** (si existe) recibe notificación → Ve copia de demanda
6. **Sistema alerta vencimiento de plazo** → Notifica a **JUEZ** y **ABOGADOS**
7. Si vence plazo sin contestación → **JUEZ** puede declarar rebeldía

---

### MÓDULO 6: CONTESTACIONES Y EXCEPCIONES

#### Objetivo
Permitir al abogado del demandado responder a la demanda y plantear excepciones o reconvención.

#### Funcionalidades del ABOGADO (Demandado):

**Presentación de Contestación:**

Una vez citado el demandado (su abogado recibe notificación), tiene 30 días para contestar.

**Wizard de Contestación:**

**OPCIÓN A: CONTESTAR LA DEMANDA**
- Formulario con campos:
  1. **Admisión o Negación de Hechos:**
     - Lista de hechos de la demanda (extraídos automáticamente)
     - Para cada hecho:
       - ✅ Admite (lo acepta como cierto)
       - ❌ Niega (lo contradice)
       - ⚠️ Admite parcialmente (acepta parte, niega parte)
     - Campo de texto para explicar cada negación
  
  2. **Fundamentación de la Contestación:**
     - Editor de texto enriquecido
     - Argumentos de hecho (lo que realmente ocurrió según el demandado)
     - Argumentos de derecho (base legal de su defensa)
  
  3. **Prueba de Descargo:**
     - Ofrecer pruebas documentales (subir PDFs)
     - Prueba testimonial (nombres de testigos)
     - Prueba pericial
  
  4. **Petitorio:**
     - Lo que solicita al juez (rechazar demanda, declarar improcedente, etc.)
  
  5. **Preview y Envío:**
     - Vista previa de contestación completa
     - Validación de campos obligatorios
     - Botón "Presentar Contestación"
     - Timestamp de presentación

**OPCIÓN B: ALLANARSE A LA DEMANDA**
- Aceptar todos los términos de la demanda
- Manifestación expresa de allanamiento
- Texto de reconocimiento de pretensiones del actor
- Petición de costas (opcional)

**OPCIÓN C: EXCEPCIONES PREVIAS (Art. 370 Ley 439)**
- Seleccionar tipo de excepción:
  - **Incompetencia:** El juzgado no es competente
  - **Falta de personalidad:** El demandante no tiene legitimación activa
  - **Falta de personería:** El abogado no acredita representación
  - **Litispendencia:** Ya existe otro proceso entre las mismas partes sobre el mismo objeto
  - **Cosa juzgada:** Ya hay sentencia firme sobre el mismo asunto
  - **Transacción:** Ya hubo acuerdo transaccional
  - **Conciliación:** Ya hubo conciliación previa
  - **Desistimiento:** Ya hubo desistimiento anterior
  - **Prescripción:** La acción está prescrita
  - **Demanda defectuosa:** Falta algún requisito del Art. 110
  - **Otros:** Especificar
- Fundamentación detallada de la excepción
- Prueba documental que sustenta la excepción
- Petitorio (que se declare fundada la excepción)

**OPCIÓN D: RECONVENCIÓN (Contrademanda)**
- Presentar demanda contra el actor original
- Formulario similar al wizard de demanda:
  - Objeto de la reconvención
  - Hechos
  - Derecho
  - Petitorio
  - Valor
  - Prueba
- Se presenta JUNTO con la contestación

**Post-Presentación:**
- Sistema genera PDF de la contestación
- Hash SHA-256
- Almacena en expediente
- Cambia estado del proceso a "CONTESTADO"
- Notifica al juez
- Notifica al abogado actor
- Cancela timer de 30 días

**Si NO contesta en plazo:**
- Sistema genera alerta de vencimiento
- Notifica al juez
- Juez puede declarar al demandado en **REBELDÍA**
- Proceso continúa sin contestación

#### Funcionalidades del JUEZ:

**Recepción de Contestación:**
- Notificación de contestación presentada
- Acceso a contestación completa
- Ver en expediente digital

**Revisión de Contestación:**
- Leer contestación completa
- Ver pruebas ofrecidas
- Verificar que cumple requisitos formales

**Si hay EXCEPCIONES PREVIAS:**
- Sistema alerta sobre excepción presentada
- Juez debe resolver ANTES de continuar proceso (Art. 371)
- Acciones del juez:
  - **Opción 1: Fundar Excepción**
    - Emitir auto fundamentado declarando fundada la excepción
    - Puede dar plazo para subsanar (si es subsanable)
    - Puede rechazar demanda si excepción es definitiva
  - **Opción 2: Rechazar Excepción**
    - Emitir auto fundamentado rechazando excepción
    - Ordenar continuar con el proceso
    - Convocar a audiencia preliminar

**Si hay RECONVENCIÓN:**
- Sistema alerta sobre reconvención presentada
- Juez notifica a abogado actor
- Abogado actor tiene plazo para contestar reconvención (10 días Art. 376)
- Proceso se complica (ahora hay 2 demandas: original + reconvención)

**Acciones Post-Contestación:**
- Si NO hay excepciones ni reconvención:
  - Auto-convocar audiencia preliminar (5 días después Art. 365)
  - Notificar a ambos abogados
  - Cambiar estado a "CONVOCADO A AUDIENCIA"

#### Conexión entre Roles:
1. **JUEZ cita al demandado** → **ABOGADO DEMANDADO** tiene 30 días para contestar
2. **ABOGADO DEMANDADO presenta contestación** → Sistema valida → Notifica a **JUEZ**
3. **JUEZ revisa contestación** → Si hay excepciones, las resuelve primero
4. **JUEZ resuelve excepciones** (funda o rechaza) → Notifica a **ABOGADOS**
5. Si contestación sin excepciones → **JUEZ auto-convoca audiencia preliminar**
6. **Sistema notifica a ambos ABOGADOS** fecha de audiencia

---

### MÓDULO 7: MEDIDAS CAUTELARES

#### Objetivo
Permitir solicitar, tramitar y ejecutar medidas cautelares con control de plazos de validez.

#### Funcionalidades del ABOGADO:

**Solicitud de Medida Cautelar:**
- Disponible en cualquier etapa del proceso (incluso antes de demanda Art. 283)
- Formulario de solicitud:
  
  1. **Tipo de Medida Cautelar:**
     - Anotación preventiva de demanda
     - Embargo preventivo
     - Intervención judicial
     - Secuestro
     - Prohibición de innovar
     - Prohibición de contratar
  
  2. **Fundamentación:**
     - Verosimilitud del derecho (apariencia de buen derecho)
     - Peligro en la demora (riesgo de que se pierda el derecho)
     - Contracautela (garantía que ofrece el solicitante)
  
  3. **Bienes o Derechos afectados:**
     - Descripción detallada
     - Ubicación
     - Valor aproximado
     - Documentos que acreditan existencia
  
  4. **Prueba:**
     - Documentos que sustentan la solicitud
     - Justificativos de urgencia
  
  5. **Petitorio:**
     - Solicitud concreta de la medida

- Botón "Solicitar Medida Cautelar"
- Sistema genera PDF y notifica al juez

**Vista de Estado de Medida Cautelar:**
- En expediente, sección "Medidas Cautelares"
- Ver:
  - Estado (solicitada, admitida, ejecutada, rechazada, levantada)
  - Fecha de solicitud
  - Fecha de ejecución (si aplica)
  - Días restantes de validez (30 días desde ejecución Art. 285)
  - Alertas de vencimiento

**Notificaciones:**
- Cuando juez admite medida cautelar
- Cuando juez ejecuta medida cautelar
- Alerta 5 días antes de vencimiento de los 30 días
- Cuando medida cautelar es levantada

#### Funcionalidades del JUEZ:

**Recepción de Solicitud:**
- Notificación de solicitud de medida cautelar
- Acceso a solicitud completa con pruebas

**Evaluación de Medida Cautelar:**
- Revisar fundamentación:
  - ¿Hay verosimilitud del derecho?
  - ¿Hay peligro en la demora?
  - ¿Hay contracautela suficiente?
- Ver pruebas documentales

**Opciones del Juez:**

**OPCIÓN 1: ADMITIR Y EJECUTAR**
- Emitir auto fundamentado admitiendo medida
- Plantilla de auto de admisión:
  ```
  AUTO DE ADMISIÓN DE MEDIDA CAUTELAR
  
  Vistos: La solicitud de medida cautelar de [tipo] presentada por [abogado]...
  
  CONSIDERANDO:
  I. Que concurren los requisitos de verosimilitud del derecho y peligro en la demora...
  II. Que se ofrece contracautela suficiente...
  
  POR TANTO: Se admite la medida cautelar de [tipo] sobre [bienes] y se ordena su ejecución inmediata.
  ```
- Registrar fecha y hora de ejecución
- Sistema inicia timer de 30 días (Art. 285)
- Generar alertas:
  - Día 25: "Quedan 5 días para vencimiento de medida cautelar"
  - Día 30: "Medida cautelar vencida, debe presentar demanda"
- Notificar a abogado solicitante
- Cambiar estado a "EJECUTADA"

**OPCIÓN 2: RECHAZAR**
- Emitir auto fundamentado rechazando medida
- Motivos:
  - Falta de verosimilitud del derecho
  - No hay peligro en la demora
  - Contracautela insuficiente
- Notificar a abogado solicitante
- Estado: "RECHAZADA"

**Gestión de Medidas Cautelares:**
- Dashboard con todas las medidas cautelares ejecutadas
- Filtro por:
  - Proceso
  - Abogado solicitante
  - Tipo de medida
  - Fecha de ejecución
  - Días restantes
- Alertas de medidas próximas a vencer

**Levantamiento de Medida Cautelar:**
- Motivos:
  - Vencimiento del plazo de 30 días sin presentación de demanda (Art. 285)
  - Solicitud de las partes
  - Auto-levantamiento por resolución final del proceso
- Emitir auto de levantamiento
- Notificar a ambos abogados
- Estado: "LEVANTADA"

#### Conexión entre Roles:
1. **ABOGADO solicita medida cautelar** → Sistema valida → Notifica a **JUEZ**
2. **JUEZ evalúa solicitud** → Decide admitir o rechazar
3. Si **ADMITE** → **JUEZ** registra ejecución → Sistema inicia timer 30 días
4. **Sistema alerta vencimiento** → Día 25 notifica a **ABOGADO** y **JUEZ**
5. Si vence plazo sin demanda → **JUEZ** levanta medida → Notifica a **ABOGADO**
6. Si proceso avanza → **JUEZ** puede levantar medida → Notifica a **ABOGADO**

---

### MÓDULO 8: AUDIENCIAS

#### Objetivo
Gestionar convocatoria, realización y registro de audiencias (preliminar y complementaria) con participación virtual.

#### Funcionalidades del JUEZ:

**Convocatoria a Audiencia Preliminar (Art. 365):**
- Después de contestación sin excepciones, sistema sugiere auto-convocatoria
- Juez programa audiencia:
  
  1. **Fecha:** Dentro de los 5 días siguientes a la contestación
  2. **Hora:** Horario hábil (8:00 AM - 6:00 PM)
  3. **Tipo:** Audiencia Preliminar
  4. **Modalidad:**
     - Presencial
     - Virtual (genera sala Jitsi/Daily automáticamente)
     - Mixta
  
  5. **Asistentes:**
     - Abogado actor (obligatorio)
     - Abogado demandado (obligatorio)
     - Peritos (opcional)
     - Testigos (opcional)

- Sistema genera:
  - Auto de convocatoria (PDF)
  - Link de sala virtual (si es virtual)
  - Evento en calendario del juez
  - Notificaciones a ambos abogados

**Realización de Audiencia:**

**Pre-Audiencia (5 minutos antes):**
- Sistema envía recordatorio a juez y abogados
- Activa sala virtual (si aplica)
- Muestra checklist de asistencia

**Durante la Audiencia:**

1. **Apertura:**
   - Juez inicia audiencia (preside)
   - Sistema registra timestamp de inicio
   - Verifica asistencia de partes
   - Si falta alguna parte sin justificación → puede declarar abandono o multa

2. **Ratificación de Demanda y Contestación:**
   - Juez pide a abogado actor que ratifique demanda
   - Juez pide a abogado demandado que ratifique contestación
   - Sistema registra ratificación

3. **Conciliación (Art. 366):**
   - Juez propone a las partes intentar conciliación
   - Si hay acuerdo:
     - Juez dicta acuerdo en acta
     - Sistema genera acta de conciliación
     - Proceso termina (se emite sentencia homologatoria)
   - Si NO hay acuerdo:
     - Se continúa con audiencia

4. **Fijación del Objeto del Proceso:**
   - Juez define claramente qué se va a discutir
   - Sistema registra objeto fijado

5. **Admisión de Pruebas:**
   - Juez revisa pruebas ofrecidas por ambas partes
   - Decide:
     - ✅ Admite
     - ❌ Rechaza (con fundamentación)
   - Sistema registra pruebas admitidas

6. **Señalamiento de Audiencia Complementaria (si es necesario):**
   - Si no se puede practicar toda la prueba en audiencia preliminar
   - Juez señala fecha de audiencia complementaria (dentro de 15 días Art. 368)
   - Sistema genera nueva convocatoria

**Grabación Automática:**
- Si audiencia es virtual:
  - Sistema graba video completo (Supabase Storage)
  - Graba audio separado para transcripción
  - Genera timestamps de inicio/fin

**Transcripción con IA (Opcional en MVP, Fase 2):**
- Enviar audio a OpenAI Whisper
- Generar transcripción identificando hablantes
- Almacenar transcripción en expediente

**Cierre de Audiencia:**
- Juez declara cerrada la audiencia
- Sistema registra timestamp de cierre
- Duración total registrada

**Post-Audiencia:**

1. **Generación de Acta:**
   - Sistema genera borrador de acta con plantilla:
     ```
     ACTA DE AUDIENCIA PRELIMINAR
     
     Proceso: [NUREJ]
     Actor: [Nombre]
     Demandado: [Nombre]
     Fecha: [Fecha y hora]
     Lugar: [Presencial/Virtual]
     
     Presidió: [Nombre del juez]
     Asistentes: [Lista de asistentes]
     
     DESARROLLO:
     1. Ratificación de demanda y contestación
     2. Conciliación: [Resultado]
     3. Objeto del proceso: [Texto]
     4. Pruebas admitidas: [Lista]
     5. Señalamiento audiencia complementaria: [Fecha]
     
     Firma del Juez: [Firma digital]
     ```
   
   - Juez revisa y edita acta si es necesario
   - Juez firma digitalmente acta
   - Sistema genera PDF oficial
   - Sube acta al expediente
   - Notifica a ambos abogados

2. **Actualización de Estado:**
   - Si hubo conciliación → Estado: "CONCILIADO"
   - Si se señaló audiencia complementaria → Estado: "AUDIENCIA_COMPLEMENTARIA_SEÑALADA"
   - Si se cerró etapa probatoria → Estado: "PARA_SENTENCIA"

**Convocatoria a Audiencia Complementaria (Art. 368):**
- Proceso similar a audiencia preliminar
- Programar dentro de 15 días
- Modalidad presencial o virtual
- Objetivo: Practicar pruebas pendientes

**Realización de Audiencia Complementaria:**
- Similar a preliminar
- Enfoque en:
  - Prueba testimonial
  - Prueba pericial
  - Inspección judicial
  - Otras pruebas admitidas
- Al finalizar:
  - Juez declara cerrada etapa probatoria
  - Sistema cambia estado a "PARA_SENTENCIA"
  - Inicia plazo de 20 días para emitir sentencia (Art. 216)

#### Funcionalidades del ABOGADO:

**Notificación de Audiencia:**
- Recibe notificación de convocatoria
- Ve fecha, hora y modalidad
- Descarga auto de convocatoria
- Agrega evento a su calendario personal

**Pre-Audiencia:**
- Revisar expediente
- Preparar argumentos
- Organizar pruebas
- Revisar jurisprudencia

**Acceso a Sala Virtual:**
- Si audiencia es virtual:
  - Acceder a link de sala (Jitsi/Daily)
  - Probar audio/video 10 minutos antes
  - Ingresar con nombre completo + rol

**Durante Audiencia:**
- Participar con video/audio
- Compartir pantalla si presenta pruebas documentales digitales
- Tomar notas (el sistema NO registra las notas del abogado)
- Presentar alegatos orales
- Interrogar testigos (si aplica)

**Post-Audiencia:**
- Recibir notificación de acta disponible
- Descargar acta de audiencia
- Ver grabación de audiencia (si fue virtual)
- Ver transcripción (si está disponible)
- Ver lista de pruebas admitidas

#### Conexión entre Roles:
1. **JUEZ programa audiencia** → Sistema genera convocatoria → Notifica a **ABOGADOS**
2. **ABOGADOS reciben notificación** → Preparan audiencia → Agregan a calendario
3. **Sistema recuerda audiencia** (día anterior + 1 hora antes) → Notifica a **JUEZ** y **ABOGADOS**
4. **JUEZ inicia audiencia** → **ABOGADOS** participan → Sistema graba
5. **JUEZ cierra audiencia** → Sistema genera acta → **JUEZ** firma → **ABOGADOS** reciben acta
6. **Sistema actualiza estado del proceso** → **ABOGADOS** ven expediente actualizado

---

### MÓDULO 9: RESOLUCIONES

#### Objetivo
Permitir al juez emitir diferentes tipos de resoluciones judiciales (providencias, autos, sentencias) con firma digital.

#### Funcionalidades del JUEZ:

**Tipos de Resoluciones:**

**1. PROVIDENCIAS (Decretos):**
- Resoluciones de mero trámite
- Ejemplos:
  - "Téngase presente"
  - "Agréguese a los antecedentes"
  - "Notifíquese"
  - "Cúmplase"
- Formulario simple:
  - Seleccionar plantilla o escribir texto libre
  - Firmar
  - Notificar

**2. AUTOS INTERLOCUTORIOS:**
- Resoluciones que resuelven incidentes del proceso
- Ejemplos:
  - Auto resolviendo excepción previa
  - Auto admitiendo medida cautelar
  - Auto admitiendo/rechazando pruebas
  - Auto señalando audiencia
- Estructura:
  - **Vistos:** Antecedentes del caso
  - **Considerando:** Fundamentación legal
  - **Por Tanto:** Decisión
  - **Firma digital**

**3. AUTOS DEFINITIVOS:**
- Resoluciones que resuelven el proceso sin ser sentencia
- Ejemplos:
  - Auto declarando abandono del proceso
  - Auto declarando prescripción
  - Auto homologando conciliación
- Estructura similar a autos interlocutorios pero con mayor fundamentación

**4. SENTENCIAS:**
- Ver Módulo 10 (Sentencias) para detalle completo

**Editor de Resoluciones:**

**Funcionalidades del Editor:**
- Seleccionar tipo de resolución
- Seleccionar plantilla (opcional)
- Editor de texto enriquecido (Rich Text Editor)
- Insertar citas de ley (base de datos de artículos)
- Insertar referencias a actos procesales del expediente
- Validación de estructura según tipo
- Preview de PDF antes de firmar
- Firma digital interna
- Generación de hash SHA-256

**Workflow de Emisión:**

1. **Crear Resolución:**
   - Juez accede a expediente
   - Botón "Nueva Resolución"
   - Selecciona tipo
   - Redacta contenido

2. **Revisión:**
   - Preview de PDF
   - Verificar formato y contenido
   - Editar si es necesario

3. **Firma:**
   - Juez solicita firma digital
   - Sistema genera hash SHA-256
   - Firma con certificado interno
   - PDF sellado y con marca de agua

4. **Notificación:**
   - Sistema almacena resolución en expediente
   - Genera notificación automática a abogados
   - Envía email con link a resolución
   - Registra fecha de notificación

5. **Post-Notificación:**
   - Resolución queda firmada e inmutable
   - Disponible para descarga
   - Registrada en línea de tiempo del proceso

**Gestión de Plantillas:**
- Juez puede crear sus propias plantillas
- Plantillas pre-cargadas por tipo de resolución
- Variables dinámicas: {actor}, {demandado}, {nurej}, {fecha}, etc.
- Editar plantillas existentes
- Compartir plantillas con otros jueces del juzgado

#### Funcionalidades del ABOGADO:

**Vista de Resoluciones:**
- En expediente, sección "Resoluciones"
- Lista de todas las resoluciones del caso:
  - Fecha de emisión
  - Tipo (providencia, auto, sentencia)
  - Título/Resumen
  - Estado (notificado, pendiente de notificación)
  - Botón "Descargar PDF"

**Notificaciones:**
- Recibir notificación cuando se emite nueva resolución
- Email con link directo a resolución
- Notificación in-app
- Vista previa de tipo de resolución

**Acciones sobre Resoluciones:**
- Descargar PDF
- Imprimir
- Ver fecha de notificación (importante para cómputo de plazos)
- Marcar como leída

**Plazos de Impugnación:**
- Si resolución es apelable:
  - Sistema muestra días restantes para apelar (generalmente 15 días)
  - Alerta 5 días antes de vencimiento
  - Botón "Presentar Recurso de Apelación"

#### Conexión entre Roles:
1. **JUEZ redacta resolución** → Revisa → Firma digitalmente
2. **Sistema genera PDF** → Hash SHA-256 → Almacena en expediente
3. **Sistema notifica a ABOGADOS** → Email + notificación in-app
4. **ABOGADOS acceden a resolución** → Descargan PDF → Leen contenido
5. **Sistema registra fecha de notificación** → Inicia cómputo de plazos de impugnación
6. **ABOGADO puede apelar** (si aplica) → Presenta recurso dentro del plazo

---

### MÓDULO 10: SENTENCIAS (Art. 213 Ley 439)

#### Objetivo
Permitir al juez emitir sentencias con estructura legal obligatoria, firma digital y notificación a partes.

#### Funcionalidades del JUEZ:

**Momento de Emisión:**
- Después de cerrada la etapa probatoria (audiencia complementaria)
- Sistema muestra alerta "Pendiente de Sentencia"
- Plazo: 20 días desde cierre de audiencia (Art. 216)
- Sistema alerta vencimiento:
  - Día 15: "Quedan 5 días para emitir sentencia"
  - Día 20: "Plazo vencido para sentencia"

**Editor de Sentencia (Plantilla Art. 213):**

La sentencia DEBE cumplir con la estructura del Art. 213 Ley 439:

**1. ENCABEZAMIENTO**
- Auto-llenado con datos del proceso:
  - Juzgado
  - NUREJ
  - Actor (nombre completo, CI, abogado)
  - Demandado (nombre completo, CI, abogado)
  - Objeto de la demanda
  - Fecha de emisión

**2. NARRATIVA (Resultandos)**
- Editor de texto para que juez redacte:
  - Resumen de la demanda
  - Resumen de la contestación
  - Trámites del proceso (citación, audiencias)
  - Pruebas presentadas por ambas partes
- Validación: mínimo 500 caracteres

**3. MOTIVA (Considerandos)**
- Editor de texto para fundamentación:
  - Análisis de las pruebas aportadas
  - Valoración de las pruebas (Art. 203-208)
  - Aplicación del derecho (citar artículos de ley)
  - Razonamiento jurídico
  - Jurisprudencia aplicable (opcional)
- Validación: mínimo 1000 caracteres
- Herramientas:
  - Insertar cita de ley
  - Referencia a prueba del expediente
  - Plantillas de razonamiento

**4. RESOLUTIVA (Por Tanto)**
- Editor de texto para decisión:
  - Declarar:
    - ✅ "Se admite la demanda" (el actor gana)
    - ❌ "Se rechaza la demanda" (el demandado gana)
    - ⚖️ "Se admite parcialmente" (ambos ganan/pierden en parte)
  - Condenar a:
    - Cumplir obligación
    - Pagar suma de dinero
    - Entregar bien
    - Hacer o no hacer algo
  - Costas:
    - Condenar al vencido al pago de costas
    - Exonerar de costas (fundamentar)
  - Otras declaraciones
- Validación: mínimo 200 caracteres

**5. CIERRE**
- Auto-llenado:
  - "Regístrese, notifíquese y cúmplase"
  - Fecha
  - Lugar
  - Firma digital del juez

**Workflow de Emisión de Sentencia:**

1. **Acceder a Editor:**
   - Desde expediente → Botón "Emitir Sentencia"
   - Sistema valida que etapa probatoria está cerrada
   - Carga plantilla Art. 213

2. **Redacción:**
   - Juez completa cada sección
   - Sistema valida que ninguna sección esté vacía
   - Juez puede guardar borrador (sin firmar)
   - Juez puede revisar expediente mientras redacta

3. **Preview:**
   - Vista previa de sentencia completa en formato PDF
   - Verificar formato legal
   - Editar si es necesario

4. **Firma Digital:**
   - Juez solicita firma
   - Sistema:
     - Genera hash SHA-256 del documento
     - Firma con certificado digital interno
     - Genera PDF oficial con marca de agua
     - Marca como "FIRMADA E INMUTABLE"

5. **Notificación:**
   - Sistema automáticamente:
     - Almacena sentencia en expediente
     - Cambia estado del proceso a "SENTENCIADO"
     - Genera notificaciones:
       - **A Abogado Actor:** "Se emitió sentencia en tu caso"
       - **A Abogado Demandado:** "Se emitió sentencia en tu caso"
     - Envía email a ambos abogados con link a sentencia
     - Registra fecha de notificación
     - Inicia timer de 15 días para apelación

6. **Post-Sentencia:**
   - Si NO hay apelación en 15 días:
     - Sistema cambia estado a "EJECUTORIADA"
     - Sentencia queda firme
     - Puede ejecutarse
   - Si HAY apelación:
     - Proceso pasa a segunda instancia (Fase 2)

**Gestión de Borradores:**
- Juez puede guardar sentencia sin firmar (borrador)
- Solo visible para el juez
- Puede editar/eliminar borrador
- No genera notificaciones

#### Funcionalidades del ABOGADO:

**Notificación de Sentencia:**
- Recibir notificación inmediata:
  - **Email** con asunto: "Sentencia emitida en proceso [NUREJ]"
  - **Notificación in-app** con resumen:
    - Fecha de sentencia
    - Resultado (favorable/desfavorable/parcial)
    - Plazo para apelar (15 días)
- Link directo para descargar sentencia

**Vista de Sentencia:**
- En expediente, sección dedicada "Sentencia"
- Información visible:
  - Fecha de emisión
  - Fecha de notificación
  - Resultado de la sentencia:
    - ✅ "Favorable" (si representa al ganador)
    - ❌ "Desfavorable" (si representa al perdedor)
    - ⚖️ "Parcial" (ambos ganan algo)
  - Resumen ejecutivo (puede ser generado por IA en Fase 2)
  - Días restantes para apelar
  - Botón "Descargar Sentencia PDF"
  - Botón "Presentar Recurso de Apelación"

**Acciones sobre Sentencia:**
- **Descargar PDF** completo de sentencia
- **Imprimir** para archivo físico
- **Compartir** con cliente (enviar por email desde sistema)
- **Apelar:** Si no está conforme (dentro de 15 días)
- **Ejecutar:** Si es favorable y quedó ejecutoriada

**Recurso de Apelación:**
- Dentro de 15 días desde notificación
- Formulario de apelación:
  - Fundamentación (por qué apela)
  - Agravios (qué le causa perjuicio)
  - Petitorio (qué solicita al tribunal superior)
- Sistema registra apelación
- Notifica al juez
- Proceso pasa a segunda instancia (fuera del alcance de MVP)

#### Conexión entre Roles:
1. **Sistema alerta a JUEZ** → "Pendiente de sentencia, plazo: 20 días"
2. **JUEZ accede a editor de sentencia** → Redacta siguiendo Art. 213
3. **JUEZ firma digitalmente** → Sistema genera PDF + hash
4. **Sistema almacena sentencia** → Cambia estado a "SENTENCIADO"
5. **Sistema notifica a ABOGADOS** → Email + in-app
6. **ABOGADOS descargan sentencia** → Leen contenido → Informan a clientes
7. **Sistema inicia timer 15 días** → Alerta de plazo de apelación
8. Si **ABOGADO apela** → Sistema notifica a **JUEZ** → Proceso sube a tribunal superior
9. Si **NO hay apelación en 15 días** → Sistema marca como "EJECUTORIADA" → Fin del proceso

---

### MÓDULO 11: GESTIÓN DE PLAZOS

#### Objetivo
Automatizar el control de plazos procesales con alertas y seguimiento de vencimientos.

#### Funcionalidades del SISTEMA (Automatizadas):

**Tipos de Plazos Controlados:**

1. **Plazo de Contestación (30 días - Art. 247-I):**
   - Se inicia: Cuando juez valida citación exitosa
   - Destinatario: Abogado demandado
   - Alertas:
     - Día 25: "Quedan 5 días para contestar"
     - Día 28: "Quedan 2 días para contestar"
     - Día 30: "Último día para contestar"
     - Día 31: "Plazo vencido - Posible declaración de rebeldía"

2. **Plazo de Audiencia Preliminar (5 días - Art. 365):**
   - Se inicia: Cuando se presenta contestación sin excepciones
   - Destinatario: Juez
   - Sistema auto-sugiere fecha de audiencia dentro de 5 días

3. **Plazo de Sentencia (20 días - Art. 216):**
   - Se inicia: Cuando se cierra etapa probatoria
   - Destinatario: Juez
   - Alertas:
     - Día 15: "Quedan 5 días para emitir sentencia"
     - Día 18: "Quedan 2 días para emitir sentencia"
     - Día 20: "Último día para emitir sentencia"
     - Día 21: "Plazo vencido para sentencia"

4. **Plazo de Apelación (15 días):**
   - Se inicia: Cuando se notifica sentencia
   - Destinatario: Abogados
   - Alertas:
     - Día 10: "Quedan 5 días para apelar"
     - Día 13: "Quedan 2 días para apelar"
     - Día 15: "Último día para apelar"
   - Si vence sin apelación → Sistema marca sentencia como "EJECUTORIADA"

5. **Plazo de Medida Cautelar (30 días - Art. 285):**
   - Se inicia: Cuando juez registra ejecución de medida
   - Destinatario: Abogado solicitante y juez
   - Alertas:
     - Día 25: "Quedan 5 días de validez de medida cautelar"
     - Día 30: "Medida cautelar vencida, debe presentar demanda"

**Gestión Automática de Plazos:**
- Sistema calcula días hábiles (excluye sábados, domingos, feriados)
- Sistema registra cada plazo en tabla "Plazos" con:
  - Tipo de plazo
  - Fecha de inicio
  - Fecha de vencimiento
  - Destinatario (rol usuario)
  - Estado (ACTIVO, CUMPLIDO, VENCIDO)
  - Alertas enviadas

**Motor de Alertas:**
- Proceso automático que corre cada día a las 8:00 AM
- Revisa todos los plazos activos
- Genera alertas según días restantes
- Envía notificaciones:
  - In-app (notificación interna)
  - Email
  - SMS (opcional, Fase 2)
- Registra alerta enviada para no duplicar

#### Funcionalidades del JUEZ:

**Dashboard de Plazos (Vista Juez):**
- Panel dedicado: "Plazos Próximos a Vencer"
- Columnas:
  - Proceso (NUREJ)
  - Actor
  - Demandado
  - Tipo de Plazo
  - Días Restantes
  - Estado
  - Acción Rápida

- Filtros:
  - Por tipo de plazo
  - Por estado (activo, próximo a vencer, vencido)
  - Por proceso
  
- Indicadores visuales:
  - 🔴 Rojo: 0-2 días restantes
  - 🟡 Amarillo: 3-5 días restantes
  - 🟢 Verde: +5 días restantes
  - ⚫ Negro: Vencido

**Acciones desde Dashboard:**
- Click en proceso → Abre expediente
- Botón de acción rápida según tipo de plazo:
  - "Declarar Rebeldía" (si plazo de contestación venció)
  - "Emitir Sentencia" (si plazo de sentencia está próximo)
  - "Levantar Medida Cautelar" (si plazo de medida venció)

**Calendario de Plazos:**
- Vista de calendario con todos los plazos
- Vista mensual / semanal
- Marcar días con plazos vencidos
- Click en día → Ver plazos de ese día

#### Funcionalidades del ABOGADO:

**Dashboard de Plazos (Vista Abogado):**
- Panel: "Mis Plazos Próximos a Vencer"
- Columnas similares a vista juez, pero solo de sus casos
- Ver plazos de todos sus procesos en un solo lugar

**Notificaciones de Plazos:**
- Recibir alertas automáticas:
  - In-app
  - Email
  - Resumen diario: "Tienes 3 plazos próximos a vencer esta semana"

**Calendario Personal:**
- Vista de calendario con:
  - Plazos de sus procesos
  - Audiencias programadas
  - Vencimientos de medidas cautelares

**Acciones desde Dashboard:**
- Click en plazo → Abre expediente del proceso
- Botón de acción rápida:
  - "Presentar Contestación" (si plazo de contestación)
  - "Presentar Apelación" (si plazo de apelación)
  - "Ver Sentencia" (si plazo de apelación está corriendo)

#### Conexión entre Roles:
1. **Sistema detecta evento que inicia plazo** (ej: citación exitosa)
2. **Sistema crea registro de plazo** con fecha inicio y vencimiento
3. **Motor de alertas revisa plazos** cada día
4. **Sistema genera alertas** según días restantes
5. **JUEZ y/o ABOGADO reciben notificaciones** según corresponda
6. **Usuario accede a dashboard de plazos** → Ve todos sus plazos
7. **Usuario toma acción** antes de vencimiento → Sistema marca plazo como "CUMPLIDO"
8. Si **plazo vence sin acción** → Sistema marca como "VENCIDO" → Alerta crítica

---

### MÓDULO 12: DOCUMENTOS Y EXPEDIENTE DIGITAL

#### Objetivo
Gestionar el almacenamiento, acceso y trazabilidad de todos los documentos del proceso.

#### Funcionalidades del ABOGADO:

**Subida de Documentos:**
- Disponible en diferentes secciones:
  - Al presentar demanda (anexos)
  - Al presentar contestación (pruebas)
  - Al solicitar medida cautelar (justificativos)
  - En cualquier momento del proceso (escritos varios)

**Formulario de Subida:**
- Seleccionar archivo (PDF, imagen, Word, Excel)
- Tipo de documento:
  - Demanda
  - Contestación
  - Prueba documental
  - Resolución
  - Acta
  - Sentencia
  - Escrito vario
  - Anexo
- Descripción del documento
- Botón "Subir"

**Proceso de Subida:**
- Sistema valida:
  - Tipo de archivo permitido
  - Tamaño máximo (ej. 50 MB)
  - Formato
- Sistema genera:
  - Hash SHA-256 del archivo (integridad)
  - Timestamp de subida
  - Metadata (nombre, tipo, tamaño, mime-type)
- Almacena en Supabase Storage
- Registra en tabla "Documentos"

**Vista de Documentos:**
- En expediente, sección "Documentos"
- Lista de todos los documentos del proceso:
  - Nombre
  - Tipo
  - Fecha de subida
  - Subido por (abogado o juez)
  - Tamaño
  - Botones:
    - 👁️ Ver (preview in-browser si es PDF)
    - ⬇️ Descargar
    - 🔗 Copiar link
  
- Filtros:
  - Por tipo de documento
  - Por fecha
  - Por quien subió

**Visualizador de Documentos:**
- Preview de PDFs dentro del sistema
- Zoom, navegación de páginas
- Descarga desde visualizador

**Expediente Digital Completo:**
- Botón "Descargar Expediente Completo"
- Sistema genera PDF único con:
  - Portada (datos del proceso)
  - Índice de documentos
  - Todos los documentos en orden cronológico
  - Línea de tiempo de actos procesales
- Genera hash del expediente completo
- Descarga instantánea

#### Funcionalidades del JUEZ:

**Subida de Documentos:**
- Similar a abogado
- Tipos adicionales:
  - Evidencia de citación (fotos)
  - Resoluciones oficiales
  - Actas de audiencia
  - Sentencias
  - Documentos internos del juzgado

**Vista de Documentos (Completa):**
- Ve TODOS los documentos del proceso
- Incluyendo documentos internos no visibles para abogados
- Indicador de visibilidad:
  - 👁️ Visible para abogados
  - 🔒 Solo visible para juzgado

**Gestión de Visibilidad:**
- Puede marcar documentos como:
  - Públicos (visibles para abogados)
  - Privados (solo juzgado)
- Ej: Comentarios internos, borradores de resolución, comunicaciones internas

**Validación de Integridad:**
- Verificar hash SHA-256 de cualquier documento
- Detectar si documento fue alterado
- Log de auditoría de accesos a documentos

**Acceso a Expediente Completo:**
- Similar a abogado
- Incluye documentos internos
- Opción de generar expediente completo:
  - Solo documentos públicos (para entregar a partes)
  - Todos los documentos (para archivo judicial)

#### Funcionalidades del SISTEMA:

**Almacenamiento:**
- Supabase Storage como repositorio
- Estructura de carpetas:
  ```
  /procesos/
    /{nurej}/
      /demandas/
      /contestaciones/
      /pruebas/
      /resoluciones/
      /sentencias/
      /evidencias/
      /actas/
  ```

**Políticas de Acceso (Row Level Security):**
- Abogado solo ve documentos de sus procesos
- Abogado solo ve documentos marcados como "públicos"
- Juez ve todos los documentos de su juzgado
- Documentos privados NO accesibles por abogados

**Versionado:**
- Si se sube documento con mismo nombre → Se crea nueva versión
- Historial de versiones disponible
- Se mantienen todas las versiones (no se elimina)

**Backup Automático:**
- Backup diario de todos los documentos
- Retención de 30 días
- Recuperación de documentos en caso de incidente

**Auditoría de Accesos:**
- Cada descarga/vista de documento se registra en log:
  - Usuario que accedió
  - Fecha y hora
  - IP
  - Acción (descarga/visualización)
- Juez puede ver log de auditoría de cualquier documento

#### Conexión entre Roles:
1. **ABOGADO sube documento** → Sistema valida → Genera hash → Almacena
2. **Sistema notifica a JUEZ** → "Nuevo documento en proceso [NUREJ]"
3. **JUEZ accede a documento** → Revisa → Marca como público/privado
4. **JUEZ sube resolución** → Sistema almacena → Marca como público
5. **Sistema notifica a ABOGADO** → "Nueva resolución disponible"
6. **ABOGADO descarga documento** → Sistema registra acceso en log
7. **Cualquier usuario genera expediente completo** → Sistema compila PDFs → Descarga

---

### MÓDULO 13: NOTIFICACIONES Y ALERTAS

#### Objetivo
Mantener a todos los usuarios informados de eventos importantes del proceso.

#### Funcionalidades del SISTEMA:

**Motor de Notificaciones:**
- Sistema automático que detecta eventos y genera notificaciones
- Tipos de eventos que generan notificaciones:
  - Presentación de demanda
  - Admisión/observación de demanda
  - Citación exitosa
  - Presentación de contestación
  - Convocatoria a audiencia
  - Resolución emitida
  - Sentencia emitida
  - Plazo próximo a vencer
  - Plazo vencido
  - Medida cautelar ejecutada
  - Medida cautelar próxima a vencer
  - Documento subido por otra parte
  - Mensaje del juzgado

**Canales de Notificación:**
- **In-App:** Notificaciones dentro del sistema (siempre activo)
- **Email:** Notificaciones por correo electrónico (configurable)
- **SMS:** Notificaciones por mensaje de texto (opcional, Fase 2)

**Estructura de Notificación:**
- Título (resumen del evento)
- Mensaje (detalle)
- Proceso asociado (link a expediente)
- Fecha y hora
- Estado (leída/no leída)
- Botón de acción (opcional):
  - "Ver Expediente"
  - "Descargar Documento"
  - "Tomar Acción"

#### Funcionalidades del JUEZ:

**Centro de Notificaciones:**
- Icono de campana en navbar con contador de no leídas
- Click en campana → Abre panel de notificaciones
- Lista de notificaciones ordenadas por fecha (más reciente primero)
- Filtros:
  - No leídas
  - Por tipo (demanda, resolución, plazo, etc.)
  - Por proceso
  - Por fecha

**Tipos de Notificaciones para Juez:**
- 📋 "Nueva demanda presentada en proceso [NUREJ]"
- 📨 "Contestación presentada en proceso [NUREJ]"
- ⚖️ "Solicitud de medida cautelar en proceso [NUREJ]"
- ⏰ "Plazo de sentencia próximo a vencer (5 días) - [NUREJ]"
- 🔴 "Plazo de contestación vencido - [NUREJ]"
- 📄 "Nuevo documento subido en proceso [NUREJ]"
- 📅 "Audiencia programada para mañana - [NUREJ]"

**Acciones desde Notificación:**
- Marcar como leída
- Eliminar notificación
- Ir a expediente (link directo)
- Tomar acción (botón específico según tipo)

**Configuración de Notificaciones:**
- Preferencias de notificaciones:
  - Email: Activar/desactivar por tipo de evento
  - Resumen diario: Recibir resumen de notificaciones del día
  - Horario de notificaciones: No molestar fuera de horario hábil

#### Funcionalidades del ABOGADO:

**Centro de Notificaciones:**
- Igual que juez, icono de campana con contador
- Panel de notificaciones

**Tipos de Notificaciones para Abogado:**
- ✅ "Demanda admitida - [NUREJ]"
- ❌ "Demanda observada - [NUREJ]" (con motivos)
- 📨 "Citación exitosa del demandado - [NUREJ]"
- ⏰ "Plazo de contestación próximo a vencer (5 días) - [NUREJ]"
- 📋 "Contestación presentada por otra parte - [NUREJ]"
- 📅 "Convocatoria a audiencia - [NUREJ]" (con fecha y hora)
- ⚖️ "Resolución emitida - [NUREJ]"
- 🏛️ "Sentencia emitida - [NUREJ]"
- 📄 "Nuevo documento en expediente - [NUREJ]"
- ⏱️ "Plazo de apelación próximo a vencer (5 días) - [NUREJ]"

**Acciones desde Notificación:**
- Igual que juez: marcar leída, eliminar, ir a expediente

**Configuración de Notificaciones:**
- Similar a juez
- Adicional:
  - Notificaciones push (si usa app móvil, Fase 2)
  - WhatsApp (opcional, Fase 2)

#### Conexión entre Roles:
1. **Evento ocurre en sistema** (ej: juez emite resolución)
2. **Sistema detecta evento** → Identifica usuarios a notificar
3. **Sistema genera notificación** para cada usuario
4. **Sistema envía notificación por canales activos** (in-app + email)
5. **Usuario recibe notificación** → Ve contador actualizado
6. **Usuario abre notificación** → Ve detalle → Puede tomar acción
7. **Usuario marca como leída** → Contador disminuye
8. **Usuario accede a expediente** desde notificación → Link directo

---

### MÓDULO 14: DASHBOARD Y REPORTES

#### Objetivo
Proveer vistas consolidadas de información y estadísticas para toma de decisiones.

#### Dashboard del JUEZ:

**Vista Principal (Home):**

**1. Resumen de Carga de Trabajo:**
- Cards con métricas:
  - Total de procesos activos
  - Procesos por admitir (demandas nuevas)
  - Plazos próximos a vencer (< 5 días)
  - Audiencias programadas esta semana
  - Sentencias pendientes

**2. Kanban de Procesos:**
- Vista de columnas por estado:
  - Por Admitir (X procesos)
  - Por Citar (X procesos)
  - Por Contestar (X procesos)
  - Por Audiencia (X procesos)
  - Por Sentencia (X procesos)
  - Sentenciados (X procesos)
- Drag & drop entre columnas (opcional)
- Click en proceso → Abre expediente

**3. Gráficos y Estadísticas:**
- **Gráfico de torta:** Distribución de procesos por estado
- **Gráfico de barras:** Procesos ingresados por mes (últimos 6 meses)
- **Gráfico de línea:** Tiempo promedio de resolución por mes
- **Indicador:** Cumplimiento de plazos (%)

**4. Calendario:**
- Vista de calendario mensual
- Marcas en días con:
  - Audiencias programadas
  - Plazos que vencen
  - Fechas de sentencia

**5. Alertas Críticas:**
- Panel de alertas rojas:
  - Plazos vencidos (requieren acción inmediata)
  - Audiencias sin acta (realizadas pero sin acta subida)
  - Medidas cautelares vencidas

#### Dashboard del ABOGADO:

**Vista Principal (Home):**

**1. Mis Casos:**
- Cards de cada caso activo:
  - NUREJ
  - Actor vs. Demandado
  - Estado actual
  - Próxima acción esperada
  - Días restantes de plazo (si aplica)
  - Botones: Ver Expediente, Tomar Acción

**2. Plazos Próximos a Vencer:**
- Lista de plazos urgentes (< 5 días)
- Por cada plazo:
  - Proceso
  - Tipo de plazo
  - Días restantes
  - Botón de acción

**3. Audiencias de la Semana:**
- Lista de audiencias programadas
- Fecha, hora, modalidad
- Link a sala virtual (si aplica)
- Botón "Preparar Audiencia"

**4. Notificaciones Recientes:**
- Últimas 5 notificaciones
- Ver todas las notificaciones

**5. Calendario Personal:**
- Calendario con:
  - Audiencias
  - Plazos
  - Eventos importantes del caso

**6. Estadísticas (Opcional):**
- Total de casos activos
- Casos ganados / perdidos (histórico)
- Tasa de éxito (%)

#### Reportes del JUEZ:

**Reportes Disponibles:**

**1. Reporte de Carga de Trabajo:**
- Filtros: Período (mes, trimestre, año)
- Contenido:
  - Total de procesos ingresados
  - Total de procesos resueltos
  - Procesos activos al cierre del período
  - Tiempo promedio de resolución
  - Cumplimiento de plazos (%)
- Formato: PDF / Excel

**2. Reporte de Audiencias:**
- Filtros: Período, tipo de audiencia
- Contenido:
  - Total de audiencias programadas
  - Total de audiencias realizadas
  - Tasa de suspensión (%)
  - Audiencias con conciliación exitosa
- Formato: PDF / Excel

**3. Reporte de Sentencias:**
- Filtros: Período, materia
- Contenido:
  - Total de sentencias emitidas
  - Sentencias favorables al actor (%)
  - Sentencias favorables al demandado (%)
  - Sentencias parciales (%)
  - Sentencias apeladas (%)
- Formato: PDF / Excel

**4. Reporte de Plazos:**
- Filtros: Período, tipo de plazo
- Contenido:
  - Total de plazos gestionados
  - Plazos cumplidos (%)
  - Plazos vencidos (%)
  - Promedio de días de retraso
- Formato: PDF / Excel

#### Reportes del ABOGADO:

**1. Reporte de Mis Casos:**
- Filtros: Estado, período, cliente
- Contenido:
  - Lista de casos con estado
  - Casos ganados/perdidos
  - Casos en trámite
- Formato: PDF / Excel

**2. Reporte de Plazos Cumplidos:**
- Ver historial de plazos cumplidos
- Ver plazos vencidos (si los hay)

#### Conexión entre Roles:
- Ambos roles tienen acceso a dashboards diferenciados
- Juez ve información global de su juzgado
- Abogado ve información solo de sus casos
- Ambos pueden exportar reportes
- Reportes se generan en tiempo real con datos actuales del sistema

---

## 5. FLUJO COMPLETO DEL PROCESO ORDINARIO (INTERACCIÓN ABOGADO ↔ JUEZ)

### ETAPA 1: REGISTRO Y PREPARACIÓN

**ABOGADO:**
1. Se registra en el sistema con registro profesional
2. Registra a sus clientes (ciudadanos) con datos completos
3. Crea nuevo proceso judicial:
   - Selecciona cliente como ACTOR
   - Ingresa datos del DEMANDADO
   - Selecciona juzgado y materia

**JUEZ:**
- (No participa aún)

### ETAPA 2: PRESENTACIÓN DE DEMANDA

**ABOGADO:**
1. Accede a wizard de demanda (5 pasos Art. 110)
2. Completa cada sección:
   - Designación de juez
   - Datos de partes (auto-llenados desde clientes)
   - Objeto, hechos, derecho
   - Petitorio, valor, prueba
3. Sube anexos (pruebas documentales)
4. Revisa preview
5. Presenta demanda
6. Recibe código de seguimiento

**SISTEMA:**
- Valida campos obligatorios
- Genera PDF de demanda
- Crea hash SHA-256
- Asigna NUREJ provisional
- Notifica a JUEZ: "Nueva demanda presentada"

**JUEZ:**
1. Recibe notificación de nueva demanda
2. Accede a expediente
3. Revisa demanda completa
4. Verifica cumplimiento Art. 110

### ETAPA 3: ADMISIÓN DE DEMANDA

**JUEZ:**
1. Opciones:
   
   **OPCIÓN A: ADMITIR**
   - Emite decreto de admisión
   - Firma digitalmente
   - Asigna NUREJ definitivo
   - Proceso pasa a estado "ADMITIDO"
   
   **OPCIÓN B: OBSERVAR**
   - Emite decreto de observación con motivos
   - Establece plazo de corrección (10 días)
   - Proceso queda en estado "OBSERVADO"
   
   **OPCIÓN C: RECHAZAR**
   - Emite auto de rechazo con fundamentación
   - Proceso pasa a estado "RECHAZADO"

**SISTEMA:**
- Notifica a ABOGADO la decisión

**ABOGADO:**
- Recibe notificación
- Si fue OBSERVADA: corrige y re-presenta
- Si fue ADMITIDA: espera citación del demandado
- Si fue RECHAZADA: puede apelar o cerrar caso

### ETAPA 4: CITACIÓN DEL DEMANDADO

**JUEZ:**
1. Ordena citación del demandado
2. Selecciona tipo:
   - Personal
   - Por cédula
   - Por edictos (si no se encuentra)
   - Tácita (si se apersona voluntariamente)
3. Realiza citación física
4. Sube evidencia fotográfica de citación
5. Marca citación como EXITOSA

**SISTEMA:**
- Registra fecha de citación
- Inicia timer de 30 días para contestación
- Notifica a ABOGADO ACTOR: "Demandado citado exitosamente"
- Si existe ABOGADO DEMANDADO en el sistema: notifica también

**ABOGADO (Actor):**
- Recibe notificación de citación exitosa
- Ve timer de 30 días en expediente
- Espera contestación del demandado

**ABOGADO (Demandado):**
- Recibe notificación de citación (si está en el sistema)
- Accede a copia de demanda y anexos
- Ve timer de 30 días para contestar

### ETAPA 5: CONTESTACIÓN

**ABOGADO (Demandado):**
1. Dentro de 30 días, presenta contestación
2. Opciones:
   
   **OPCIÓN A: CONTESTAR**
   - Admite/niega hechos de la demanda
   - Fundamenta su defensa
   - Ofrece pruebas de descargo
   
   **OPCIÓN B: ALLANARSE**
   - Acepta todos los términos de la demanda
   
   **OPCIÓN C: EXCEPCIONES PREVIAS**
   - Plantea excepción (incompetencia, cosa juzgada, etc.)
   
   **OPCIÓN D: RECONVENCIÓN**
   - Presenta contrademanda contra el actor

3. Presenta contestación

**SISTEMA:**
- Valida contestación
- Genera PDF
- Registra timestamp
- Cancela timer de 30 días
- Notifica a JUEZ: "Contestación presentada"
- Notifica a ABOGADO ACTOR: "El demandado contestó"

**JUEZ:**
1. Recibe notificación de contestación
2. Revisa contestación

**Si hay EXCEPCIONES PREVIAS:**
- Juez resuelve PRIMERO las excepciones
- Emite auto fundando o rechazando excepción
- Si funda excepción: puede dar plazo para subsanar o rechazar demanda
- Si rechaza excepción: continúa proceso

**Si NO hay excepciones:**
- Juez auto-convoca audiencia preliminar (5 días después)

**SISTEMA:**
- Programa audiencia
- Notifica a ambos ABOGADOS: "Convocados a audiencia preliminar"

### ETAPA 6: AUDIENCIA PRELIMINAR

**Preparación (Ambos Roles):**

**ABOGADO (Actor y Demandado):**
- Reciben notificación de audiencia con fecha, hora y link de sala virtual
- Preparan alegatos y pruebas
- Agregan evento a calendario

**JUEZ:**
- Revisa expediente completo
- Prepara audiencia

**Realización de Audiencia:**

**JUEZ (Preside):**
1. Inicia audiencia puntualmente
2. Verifica asistencia de ambos abogados
3. Pide ratificación de demanda y contestación
4. Propone conciliación:
   
   **Si HAY ACUERDO:**
   - Juez dicta acuerdo en acta
   - Proceso termina
   - Juez emite sentencia homologatoria (15 días)
   
   **Si NO HAY ACUERDO:**
   - Juez fija objeto del proceso
   - Juez admite o rechaza pruebas ofrecidas
   - Si falta práctica de pruebas:
     - Juez señala audiencia complementaria (15 días)
   - Si toda la prueba se practicó:
     - Juez declara cerrada etapa probatoria

**SISTEMA:**
- Graba audiencia completa (video + audio)
- Genera transcripción automática (Whisper)
- Registra timestamps de inicio/fin

**Post-Audiencia:**

**JUEZ:**
1. Revisa transcripción automática
2. Genera y firma acta de audiencia
3. Sube acta al expediente

**SISTEMA:**
- Almacena grabación y acta
- Notifica a ABOGADOS: "Acta de audiencia disponible"

**ABOGADOS:**
- Reciben acta
- Descargan para archivo

### ETAPA 7: AUDIENCIA COMPLEMENTARIA (si aplica)

**JUEZ:**
1. Programa audiencia complementaria (15 días después)
2. Notifica a ABOGADOS

**Durante Audiencia Complementaria:**
- Se practica prueba pendiente:
  - Testimonial
  - Pericial
  - Inspección
- Juez valora pruebas
- Juez declara CERRADA la etapa probatoria

**SISTEMA:**
- Cambia estado a "PARA SENTENCIA"
- Inicia timer de 20 días para sentencia
- Notifica a JUEZ: "Pendiente de sentencia, plazo: 20 días"

### ETAPA 8: SENTENCIA

**JUEZ:**
1. Dentro de 20 días, accede a editor de sentencia
2. Redacta sentencia siguiendo Art. 213:
   - Encabezamiento
   - Narrativa
   - Motiva
   - Resolutiva
3. Revisa preview
4. Firma digitalmente sentencia

**SISTEMA:**
- Genera PDF oficial con marca de agua
- Crea hash SHA-256
- Almacena en expediente
- Cambia estado a "SENTENCIADO"
- Inicia timer de 15 días para apelación
- Notifica a AMBOS ABOGADOS: "Sentencia emitida"

**ABOGADOS:**
1. Reciben notificación de sentencia
2. Descargan PDF de sentencia
3. Leen sentencia
4. Informan a sus clientes (ciudadanos)
5. Deciden:
   
   **OPCIÓN A: ACEPTAR SENTENCIA**
   - No hacer nada
   - Esperar 15 días
   - Sentencia queda ejecutoriada
   
   **OPCIÓN B: APELAR**
   - Dentro de 15 días, presentar recurso de apelación
   - Fundamentar agravios
   - Proceso sube a tribunal superior (fuera de alcance de MVP)

**SISTEMA (después de 15 días si no hay apelación):**
- Marca sentencia como "EJECUTORIADA"
- Proceso queda FIRME
- Notifica a ABOGADOS: "Sentencia ejecutoriada"

### FIN DEL PROCESO (en primera instancia)

---

## 6. MATRIZ DE INTERACCIONES ENTRE ROLES

| Módulo / Acción | ABOGADO hace... | Esto genera... | JUEZ recibe/hace... | Esto genera... |
|------------------|-----------------|----------------|---------------------|----------------|
| **Registro** | Se registra con registro profesional | Cuenta de abogado creada | - | - |
| **Clientes** | Registra datos de sus clientes (ciudadanos) | Base de clientes del abogado | - | - |
| **Proceso** | Crea nuevo proceso y asigna clientes | Proceso en borrador | - | - |
| **Demanda** | Presenta demanda con wizard 5 pasos | PDF + Notificación | Recibe notificación → Revisa demanda | Admite/Observa/Rechaza → Notificación |
| **Admisión** | Recibe notificación de admisión | Espera citación | Emite decreto admisión → Ordena citación | Sistema inicia proceso de citación |
| **Citación** | Ve estado de citación | - | Realiza citación → Sube evidencia → Valida | Sistema inicia timer 30 días → Notificación |
| **Contestación** | (Demandado) Presenta contestación | PDF + Notificación | Recibe contestación → Revisa | Si no hay excepciones → Convoca audiencia |
| **Audiencia** | Recibe convocatoria → Prepara → Participa | Alegatos en audiencia | Preside audiencia → Propone conciliación → Admite pruebas | Genera acta → Notificación |
| **Sentencia** | - | - | Redacta sentencia Art. 213 → Firma | PDF + Notificación → Timer 15 días |
| **Sentencia (lectura)** | Recibe sentencia → Descarga → Lee | Decide apelar o aceptar | - | - |
| **Apelación** | (Opcional) Presenta apelación | Recurso + Notificación | Recibe apelación → Eleva a tribunal superior | Proceso sale del sistema (Fase 2) |
| **Ejecutoria** | - | - | (Automático) Si pasan 15 días sin apelación → Sentencia ejecutoriada | Notificación final |
| **Medidas Cautelares** | Solicita medida cautelar | PDF + Notificación | Evalúa → Admite/Rechaza → Si admite: ejecuta | Timer 30 días → Notificación |
| **Documentos** | Sube documentos al expediente | Archivo + Hash SHA-256 + Notificación | Ve documento en expediente | (Opcional) Marca visibilidad |
| **Plazos** | Ve alertas de plazos próximos | - | Ve dashboard de plazos de todos los casos | Sistema genera alertas automáticas |
| **Notificaciones** | Recibe notificaciones in-app y email | - | Recibe notificaciones in-app y email | - |

---

## 7. CONCLUSIÓN

Este PRD define un **sistema simplificado de 2 roles (Abogado y Juez)** que digitaliza el proceso ordinario civil boliviano completo, desde la presentación de demanda hasta la sentencia ejecutoriada.

**Ventajas del enfoque de 2 roles:**
- ✅ Simplificación de permisos y accesos
- ✅ Menor complejidad de desarrollo
- ✅ Enfoque directo en la interacción clave: Abogado ↔ Juez
- ✅ El Juez asume funciones de secretaría (citaciones, notificaciones)
- ✅ El Abogado gestiona a sus clientes sin que ellos accedan al sistema
- ✅ Más rápido de implementar y validar en piloto

**Cobertura funcional:**
- ✅ 100% de las etapas del proceso ordinario
- ✅ Validación de requisitos legales (Art. 110, Art. 213, etc.)
- ✅ Automatización de plazos con alertas
- ✅ Citaciones con evidencia digital
- ✅ Audiencias virtuales con grabación y transcripción
- ✅ Sentencias con estructura legal obligatoria
- ✅ Expediente digital único y trazable
- ✅ Documentos con hash SHA-256 (integridad)
- ✅ Notificaciones automáticas a ambos roles

**Próximos pasos sugeridos:**
1. Validar este PRD con stakeholders (abogados y jueces)
2. Diseñar mockups de UI/UX para ambos roles
3. Definir arquitectura técnica y stack
4. Estimar cronograma y presupuesto
5. Desarrollar MVP con 1-2 juzgados piloto

---

**Documento válido hasta:** 15 días desde la fecha de envío  
**Contacto:** [Tu información de contacto]