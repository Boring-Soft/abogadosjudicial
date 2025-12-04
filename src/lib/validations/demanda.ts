import { z } from "zod";

/**
 * Schema de validación para presentación de demanda según Art. 110
 * Todos los campos son obligatorios según el Código Procesal Civil
 */
export const createDemandaSchema = z.object({
  procesoId: z.string().min(1, "El ID del proceso es requerido"),
  designacionJuez: z
    .string()
    .min(10, "La designación del juez debe tener al menos 10 caracteres")
    .max(500, "La designación del juez no puede exceder 500 caracteres"),
  objeto: z
    .string()
    .min(50, "El objeto debe tener al menos 50 caracteres")
    .max(2000, "El objeto no puede exceder 2000 caracteres"),
  hechos: z
    .string()
    .min(100, "Los hechos deben tener al menos 100 caracteres")
    .max(10000, "Los hechos no pueden exceder 10000 caracteres"),
  derecho: z
    .string()
    .min(50, "El fundamento de derecho debe tener al menos 50 caracteres")
    .max(5000, "El fundamento de derecho no puede exceder 5000 caracteres"),
  petitorio: z
    .string()
    .min(30, "El petitorio debe tener al menos 30 caracteres")
    .max(2000, "El petitorio no puede exceder 2000 caracteres"),
  valorDemanda: z
    .number()
    .positive("El valor de la demanda debe ser positivo")
    .min(1, "El valor de la demanda debe ser mayor a 0"),
  pruebaOfrecida: z
    .string()
    .min(30, "La prueba ofrecida debe tener al menos 30 caracteres")
    .max(5000, "La prueba ofrecida no puede exceder 5000 caracteres"),
});

/**
 * Schema para actualizar/corregir demanda observada
 */
export const updateDemandaSchema = createDemandaSchema.partial().extend({
  id: z.string().min(1, "El ID de la demanda es requerido"),
  observaciones: z.string().optional(),
});

/**
 * Schema para observar demanda (JUEZ)
 */
export const observarDemandaSchema = z.object({
  demandaId: z.string().min(1, "El ID de la demanda es requerido"),
  observaciones: z
    .string()
    .min(20, "Las observaciones deben tener al menos 20 caracteres")
    .max(2000, "Las observaciones no pueden exceder 2000 caracteres"),
  plazoCorreccion: z
    .number()
    .int()
    .min(5, "El plazo debe ser al menos 5 días")
    .max(30, "El plazo no puede exceder 30 días")
    .default(10),
});

/**
 * Schema para admitir demanda (JUEZ)
 */
export const admitirDemandaSchema = z.object({
  demandaId: z.string().min(1, "El ID de la demanda es requerido"),
  decretoAdmision: z
    .string()
    .min(50, "El decreto debe tener al menos 50 caracteres")
    .max(2000, "El decreto no puede exceder 2000 caracteres"),
  nurejDefinitivo: z
    .string()
    .min(5, "El NUREJ definitivo es requerido")
    .max(50, "El NUREJ no puede exceder 50 caracteres")
    .optional(), // Puede ser generado automáticamente
});

/**
 * Schema para rechazar demanda (JUEZ)
 */
export const rechazarDemandaSchema = z.object({
  demandaId: z.string().min(1, "El ID de la demanda es requerido"),
  motivo: z.enum([
    "INCOMPETENCIA",
    "FALTA_LEGITIMACION",
    "PRESCRIPCION",
    "COSA_JUZGADA",
    "OTRO",
  ]),
  fundamentacion: z
    .string()
    .min(100, "La fundamentación debe tener al menos 100 caracteres")
    .max(5000, "La fundamentación no puede exceder 5000 caracteres"),
});

/**
 * Tipos inferidos de los schemas
 */
export type CreateDemandaInput = z.infer<typeof createDemandaSchema>;
export type UpdateDemandaInput = z.infer<typeof updateDemandaSchema>;
export type ObservarDemandaInput = z.infer<typeof observarDemandaSchema>;
export type AdmitirDemandaInput = z.infer<typeof admitirDemandaSchema>;
export type RechazarDemandaInput = z.infer<typeof rechazarDemandaSchema>;
