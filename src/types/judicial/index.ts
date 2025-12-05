/**
 * Tipos centralizados para el Sistema de Gestión Procesal Judicial
 * Estos tipos se basan en el schema de Prisma pero están optimizados para el frontend
 */

import {
  UserRole,
  EstadoProceso,
  TipoProceso,
  MateriaProceso,
  TipoCitacion,
  EstadoCitacion,
  TipoMedidaCautelar,
  EstadoMedidaCautelar,
  TipoAudiencia,
  ModalidadAudiencia,
  EstadoAudiencia,
  TipoResolucion,
  TipoDocumento,
  VisibilidadDocumento,
  TipoNotificacion,
  EstadoPlazo,
  TipoPlazo,
} from "@prisma/client";

// Re-export enums from Prisma for convenience
export {
  UserRole,
  EstadoProceso,
  TipoProceso,
  MateriaProceso,
  TipoCitacion,
  EstadoCitacion,
  TipoMedidaCautelar,
  EstadoMedidaCautelar,
  TipoAudiencia,
  ModalidadAudiencia,
  EstadoAudiencia,
  TipoResolucion,
  TipoDocumento,
  VisibilidadDocumento,
  TipoNotificacion,
  EstadoPlazo,
  TipoPlazo,
};

// ============================================
// Profile & User Types
// ============================================

export interface ProfileData {
  id: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  role: UserRole;
  registroProfesional: string | null;
  telefono: string | null;
  juzgadoId: string | null;
  avatarUrl: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface JuzgadoData {
  id: string;
  nombre: string;
  ciudad: string;
  departamento: string;
  direccion: string | null;
  telefono: string | null;
  email: string | null;
  activo: boolean;
}

// ============================================
// Cliente Types
// ============================================

export interface ClienteData {
  id: string;
  ci: string;
  nombres: string;
  apellidos: string;
  edad: number | null;
  estadoCivil: string | null;
  profesion: string | null;
  domicilioReal: string;
  domicilioProcesal: string;
  telefono: string | null;
  email: string | null;
  fotoUrl: string | null;
  activo: boolean;
  abogadoId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClienteInput {
  ci: string;
  nombres: string;
  apellidos: string;
  edad?: number;
  estadoCivil?: string;
  profesion?: string;
  domicilioReal: string;
  domicilioProcesal: string;
  telefono?: string;
  email?: string;
  fotoUrl?: string;
}

export interface UpdateClienteInput extends Partial<CreateClienteInput> {
  id: string;
}

// ============================================
// Proceso Types
// ============================================

export interface ProcesoData {
  id: string;
  nurej: string | null;
  tipoProceso: TipoProceso;
  materia: MateriaProceso;
  cuantia: number | null;
  estado: EstadoProceso;
  juzgadoId: string;
  juezId: string | null;
  clienteActorId: string;
  abogadoActorId: string;
  clienteDemandadoId: string | null;
  demandadoNombres: string | null;
  demandadoApellidos: string | null;
  demandadoCI: string | null;
  demandadoEdad: number | null;
  demandadoEstadoCivil: string | null;
  demandadoProfesion: string | null;
  demandadoDomicilioReal: string | null;
  demandadoDomicilioProcesal: string | null;
  abogadoDemandadoId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProcesoWithRelations extends ProcesoData {
  juzgado: JuzgadoData;
  clienteActor: ClienteData;
  abogadoActor: ProfileData;
  clienteDemandado?: ClienteData;
  abogadoDemandado?: ProfileData;
  demanda?: DemandaData;
  citaciones?: CitacionData[];
  audiencias?: AudienciaData[];
  resoluciones?: ResolucionData[];
  sentencia?: SentenciaData;
  documentos?: DocumentoData[];
  notificaciones?: NotificacionData[];
  plazos?: PlazoData[];
}

export interface CreateProcesoInput {
  tipoProceso: TipoProceso;
  materia: MateriaProceso;
  cuantia?: number;
  juzgadoId: string;
  clienteActorId: string;
  demandadoNombres?: string;
  demandadoApellidos?: string;
  demandadoCI?: string;
  demandadoEdad?: number;
  demandadoEstadoCivil?: string;
  demandadoProfesion?: string;
  demandadoDomicilioReal?: string;
  demandadoDomicilioProcesal?: string;
}

// ============================================
// Demanda Types (Art. 110)
// ============================================

export interface DemandaData {
  id: string;
  procesoId: string;
  designacionJuez: string;
  objeto: string;
  hechos: string;
  derecho: string;
  petitorio: string;
  valorDemanda: number;
  pruebaOfrecida: string;
  documentoUrl: string;
  documentoHash: string;
  version: number;
  observaciones: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDemandaInput {
  procesoId: string;
  designacionJuez: string;
  objeto: string;
  hechos: string;
  derecho: string;
  petitorio: string;
  valorDemanda: number;
  pruebaOfrecida: string;
}

// ============================================
// Citacion Types
// ============================================

export interface CitacionData {
  id: string;
  procesoId: string;
  tipoCitacion: TipoCitacion;
  estado: EstadoCitacion;
  cedulaUrl: string | null;
  intentos: any;
  fechaCitacion: Date | null;
  evidenciaUrl: string | null;
  observaciones: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegistroIntentoCitacion {
  fecha: string;
  hora: string;
  motivo: string;
  evidenciaUrl?: string;
}

// ============================================
// Audiencia Types
// ============================================

export interface AudienciaData {
  id: string;
  procesoId: string;
  tipo: TipoAudiencia;
  modalidad: ModalidadAudiencia;
  estado: EstadoAudiencia;
  fechaHora: Date;
  linkGoogleMeet: string | null;
  autoConvocatoriaUrl: string | null;
  fechaInicio: Date | null;
  fechaCierre: Date | null;
  asistentes: any;
  huboConciliacion: boolean | null;
  acuerdoConciliacion: string | null;
  objetoProceso: string | null;
  pruebasAdmitidas: any;
  actaUrl: string | null;
  actaHash: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgramarAudienciaInput {
  procesoId: string;
  tipo: TipoAudiencia;
  modalidad: ModalidadAudiencia;
  fechaHora: Date;
  linkGoogleMeet?: string;
}

// ============================================
// Resolucion Types
// ============================================

export interface ResolucionData {
  id: string;
  procesoId: string;
  tipo: TipoResolucion;
  titulo: string;
  vistos: string | null;
  considerando: string | null;
  porTanto: string;
  documentoUrl: string;
  documentoHash: string;
  firmadoPor: string;
  fechaEmision: Date;
  fechaNotificacion: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateResolucionInput {
  procesoId: string;
  tipo: TipoResolucion;
  titulo: string;
  vistos?: string;
  considerando?: string;
  porTanto: string;
}

// ============================================
// Sentencia Types (Art. 213)
// ============================================

export interface SentenciaData {
  id: string;
  procesoId: string;
  resumenDemanda: string;
  resumenContestacion: string;
  tramitesProceso: string;
  pruebasPresentadas: string;
  analisisPruebas: string;
  valoracionPruebas: string;
  aplicacionDerecho: string;
  razonamientoJuridico: string;
  jurisprudencia: string | null;
  decision: string;
  condena: string | null;
  costas: string;
  documentoUrl: string;
  documentoHash: string;
  firmadoPor: string;
  fechaEmision: Date;
  fechaNotificacion: Date | null;
  fechaEjecutoria: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSentenciaInput {
  procesoId: string;
  resumenDemanda: string;
  resumenContestacion: string;
  tramitesProceso: string;
  pruebasPresentadas: string;
  analisisPruebas: string;
  valoracionPruebas: string;
  aplicacionDerecho: string;
  razonamientoJuridico: string;
  jurisprudencia?: string;
  decision: "ADMITE" | "RECHAZA" | "ADMITE_PARCIALMENTE";
  condena?: string;
  costas: string;
}

// ============================================
// Documento Types
// ============================================

export interface DocumentoData {
  id: string;
  procesoId: string;
  nombre: string;
  tipo: TipoDocumento;
  descripcion: string | null;
  visibilidad: VisibilidadDocumento;
  url: string;
  hash: string;
  mimeType: string;
  tamanio: number;
  subidoPor: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UploadDocumentoInput {
  procesoId: string;
  nombre: string;
  tipo: TipoDocumento;
  descripcion?: string;
  visibilidad?: VisibilidadDocumento;
  file: File;
}

// ============================================
// Notificacion Types
// ============================================

export interface NotificacionData {
  id: string;
  usuarioId: string;
  procesoId: string | null;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  accionUrl: string | null;
  leida: boolean;
  fechaLeida: Date | null;
  createdAt: Date;
}

// ============================================
// Plazo Types
// ============================================

export interface PlazoData {
  id: string;
  procesoId: string;
  tipo: TipoPlazo;
  estado: EstadoPlazo;
  fechaInicio: Date;
  fechaVencimiento: Date;
  diasHabiles: number;
  alertasEnviadas: any;
  destinatario: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlazoConProceso extends PlazoData {
  proceso: ProcesoWithRelations;
}

// ============================================
// Utility Types
// ============================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FilterOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}
