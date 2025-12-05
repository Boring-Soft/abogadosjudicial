import { z } from "zod";

/**
 * Schema de validación para programar una audiencia
 */
export const programarAudienciaSchema = z.object({
  procesoId: z.string().min(1, "El ID del proceso es requerido"),
  tipo: z.enum(["PRELIMINAR", "COMPLEMENTARIA"], {
    required_error: "El tipo de audiencia es requerido",
  }),
  modalidad: z.enum(["PRESENCIAL", "VIRTUAL"], {
    required_error: "La modalidad es requerida",
  }),
  fechaHora: z.string().min(1, "La fecha y hora son requeridas"),
  linkGoogleMeet: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
  asistentes: z
    .array(
      z.object({
        nombre: z.string(),
        rol: z.enum(["ACTOR", "DEMANDADO", "ABOGADO_ACTOR", "ABOGADO_DEMANDADO", "TESTIGO", "PERITO"]),
        obligatorio: z.boolean().default(true),
      })
    )
    .optional(),
});

export type ProgramarAudienciaInput = z.infer<typeof programarAudienciaSchema>;

/**
 * Schema de validación para iniciar una audiencia
 */
export const iniciarAudienciaSchema = z.object({
  asistentes: z.array(
    z.object({
      nombre: z.string(),
      rol: z.string(),
      asistio: z.boolean(),
    })
  ),
});

export type IniciarAudienciaInput = z.infer<typeof iniciarAudienciaSchema>;

/**
 * Schema de validación para cerrar una audiencia
 */
export const cerrarAudienciaSchema = z.object({
  huboConciliacion: z.boolean(),
  acuerdoConciliacion: z
    .string()
    .min(50, "El acuerdo de conciliación debe tener al menos 50 caracteres")
    .optional(),
  objetoProceso: z.string().optional(),
  pruebasAdmitidas: z
    .array(
      z.object({
        tipo: z.enum(["DOCUMENTAL", "TESTIMONIAL", "PERICIAL", "INSPECCION"]),
        descripcion: z.string(),
        admitida: z.boolean(),
        fundamentacion: z.string().optional(),
      })
    )
    .optional(),
  audienciaComplementaria: z
    .object({
      fechaHora: z.string(),
      linkGoogleMeet: z.string().optional(),
    })
    .optional(),
});

export type CerrarAudienciaInput = z.infer<typeof cerrarAudienciaSchema>;

/**
 * Schema de validación para el acta de audiencia
 */
export const actaAudienciaSchema = z.object({
  presidio: z.string().min(1, "El campo 'Presidió' es requerido"),
  asistentes: z.string().min(10, "Debe detallar los asistentes"),
  desarrollo: z.string().min(50, "El desarrollo debe tener al menos 50 caracteres"),
  ratificacion: z.string().optional(),
  conciliacion: z.string().optional(),
  objetoProceso: z.string().optional(),
  pruebasAdmitidas: z.string().optional(),
  senalamiento: z.string().optional(),
});

export type ActaAudienciaInput = z.infer<typeof actaAudienciaSchema>;
