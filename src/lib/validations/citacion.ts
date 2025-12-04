import { z } from "zod";
import { TipoCitacion } from "@prisma/client";

/**
 * Schema para ordenar citación (JUEZ)
 */
export const ordenarCitacionSchema = z.object({
  procesoId: z.string().min(1, "El ID del proceso es requerido"),
  tipoCitacion: z.nativeEnum(TipoCitacion),
});

/**
 * Schema para registrar citación exitosa (PERSONAL o CEDULA)
 */
export const registrarCitacionExitosaSchema = z.object({
  citacionId: z.string().min(1, "El ID de la citación es requerido"),
  fechaCitacion: z.string().min(1, "La fecha de citación es requerida"),
  observaciones: z.string().max(500).optional(),
});

/**
 * Schema para registrar intento fallido
 */
export const registrarIntentoFallidoSchema = z.object({
  citacionId: z.string().min(1, "El ID de la citación es requerido"),
  fecha: z.string().min(1, "La fecha es requerida"),
  hora: z.string().min(1, "La hora es requerida"),
  motivo: z.string().min(10, "El motivo debe tener al menos 10 caracteres"),
});

/**
 * Schema para citación por edictos
 */
export const registrarPublicacionEdictoSchema = z.object({
  citacionId: z.string().min(1, "El ID de la citación es requerido"),
  numeroPublicacion: z.number().int().min(1).max(3),
  fechaPublicacion: z.string().min(1, "La fecha de publicación es requerida"),
});

/**
 * Schema para marcar citación como tácita
 */
export const marcarCitacionTacitaSchema = z.object({
  citacionId: z.string().min(1, "El ID de la citación es requerido"),
  fechaApersonamiento: z.string().min(1, "La fecha de apersonamiento es requerida"),
  observaciones: z
    .string()
    .min(20, "Las observaciones deben tener al menos 20 caracteres"),
});

/**
 * Tipos inferidos
 */
export type OrdenarCitacionInput = z.infer<typeof ordenarCitacionSchema>;
export type RegistrarCitacionExitosaInput = z.infer<typeof registrarCitacionExitosaSchema>;
export type RegistrarIntentoFallidoInput = z.infer<typeof registrarIntentoFallidoSchema>;
export type RegistrarPublicacionEdictoInput = z.infer<typeof registrarPublicacionEdictoSchema>;
export type MarcarCitacionTacitaInput = z.infer<typeof marcarCitacionTacitaSchema>;
