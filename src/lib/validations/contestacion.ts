import { z } from "zod";

/**
 * Tipos de respuesta a hechos de la demanda
 */
export const TipoRespuestaHecho = z.enum(["ADMITE", "NIEGA", "ADMITE_PARCIALMENTE"]);

/**
 * Schema para admisión/negación de cada hecho
 */
export const admisionHechoSchema = z.object({
  numeroHecho: z.number().int().positive(),
  textoHecho: z.string().min(10, "El hecho debe tener al menos 10 caracteres"),
  respuesta: TipoRespuestaHecho,
  explicacion: z
    .string()
    .min(20, "La explicación debe tener al menos 20 caracteres")
    .optional(),
});

/**
 * Tipos de excepción previa (Art. 370)
 */
export const TipoExcepcionPrevia = z.enum([
  "INCOMPETENCIA",
  "FALTA_PERSONALIDAD",
  "FALTA_PERSONERIA",
  "LITISPENDENCIA",
  "COSA_JUZGADA",
  "TRANSACCION",
  "CONCILIACION",
  "DESISTIMIENTO",
  "PRESCRIPCION",
  "DEMANDA_DEFECTUOSA",
  "OTRO",
]);

/**
 * Tipos de prueba
 */
export const TipoPrueba = z.enum([
  "DOCUMENTAL",
  "TESTIMONIAL",
  "PERICIAL",
  "CONFESION",
  "INSPECCION",
]);

/**
 * Schema para prueba ofrecida
 */
export const pruebaSchema = z.object({
  tipo: TipoPrueba,
  descripcion: z.string().min(20, "La descripción debe tener al menos 20 caracteres"),
  documentoUrl: z.string().url().optional(),
});

/**
 * Schema para contestación normal (Opción A)
 */
export const contestacionNormalSchema = z.object({
  tipo: z.literal("CONTESTACION"),
  admisionHechos: z
    .array(admisionHechoSchema)
    .min(1, "Debe responder al menos a un hecho"),
  fundamentacion: z
    .string()
    .min(100, "La fundamentación debe tener al menos 100 caracteres"),
  pruebasOfrecidas: z.array(pruebaSchema).optional(),
  petitorio: z.string().min(50, "El petitorio debe tener al menos 50 caracteres"),
});

/**
 * Schema para allanamiento (Opción B)
 */
export const allanamientoSchema = z.object({
  tipo: z.literal("ALLANAMIENTO"),
  manifestacion: z
    .string()
    .min(100, "La manifestación de allanamiento debe tener al menos 100 caracteres"),
  solicitaCostas: z.boolean().default(false),
  observacionesCostas: z.string().max(500).optional(),
});

/**
 * Schema para excepción previa (Opción C)
 */
export const excepcionPreviaSchema = z.object({
  tipo: z.literal("EXCEPCION"),
  tipoExcepcion: TipoExcepcionPrevia,
  fundamentacion: z
    .string()
    .min(100, "La fundamentación debe tener al menos 100 caracteres"),
  pruebasOfrecidas: z.array(pruebaSchema).optional(),
  petitorio: z.string().min(50, "El petitorio debe tener al menos 50 caracteres"),
});

/**
 * Schema para reconvención (Opción D)
 */
export const reconvencionSchema = z.object({
  tipo: z.literal("RECONVENCION"),
  // Primero contesta la demanda
  admisionHechos: z
    .array(admisionHechoSchema)
    .min(1, "Debe responder al menos a un hecho"),
  fundamentacionContestacion: z
    .string()
    .min(100, "La fundamentación de la contestación debe tener al menos 100 caracteres"),
  // Luego la reconvención (contrademanda)
  objetoReconvencion: z
    .string()
    .min(50, "El objeto de la reconvención debe tener al menos 50 caracteres"),
  hechosReconvencion: z
    .string()
    .min(100, "Los hechos de la reconvención deben tener al menos 100 caracteres"),
  derechoReconvencion: z
    .string()
    .min(100, "El derecho de la reconvención debe tener al menos 100 caracteres"),
  valorReconvencion: z
    .number()
    .positive("El valor de la reconvención debe ser positivo"),
  pruebasOfrecidas: z.array(pruebaSchema).optional(),
  petitorioReconvencion: z
    .string()
    .min(50, "El petitorio de la reconvención debe tener al menos 50 caracteres"),
});

/**
 * Schema unificado para presentar contestación
 */
export const presentarContestacionSchema = z.discriminatedUnion("tipo", [
  contestacionNormalSchema,
  allanamientoSchema,
  excepcionPreviaSchema,
  reconvencionSchema,
]);

/**
 * Schema para resolver excepción previa (JUEZ)
 */
export const resolverExcepcionSchema = z.object({
  contestacionId: z.string().min(1, "El ID de la contestación es requerido"),
  decision: z.enum(["FUNDAR", "RECHAZAR"]),
  fundamentacion: z
    .string()
    .min(100, "La fundamentación debe tener al menos 100 caracteres"),
  conCostas: z.boolean().default(false),
});

/**
 * Tipos inferidos
 */
export type AdmisionHechoInput = z.infer<typeof admisionHechoSchema>;
export type PruebaInput = z.infer<typeof pruebaSchema>;
export type ContestacionNormalInput = z.infer<typeof contestacionNormalSchema>;
export type AllanamientoInput = z.infer<typeof allanamientoSchema>;
export type ExcepcionPreviaInput = z.infer<typeof excepcionPreviaSchema>;
export type ReconvencionInput = z.infer<typeof reconvencionSchema>;
export type PresentarContestacionInput = z.infer<typeof presentarContestacionSchema>;
export type ResolverExcepcionInput = z.infer<typeof resolverExcepcionSchema>;
