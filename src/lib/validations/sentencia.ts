/**
 * Validaciones Zod para Sentencias (Art. 213)
 */

import { z } from "zod";

// ============================================
// Schemas para Sentencias
// ============================================

export const createSentenciaSchema = z.object({
  procesoId: z.string().cuid("ID de proceso inválido"),

  // Sección 2: Narrativa (Resultandos)
  resumenDemanda: z
    .string()
    .min(100, "El resumen de demanda debe tener al menos 100 caracteres")
    .max(5000, "El resumen de demanda no puede exceder 5000 caracteres"),
  resumenContestacion: z
    .string()
    .min(100, "El resumen de contestación debe tener al menos 100 caracteres")
    .max(5000, "El resumen de contestación no puede exceder 5000 caracteres"),
  tramitesProceso: z
    .string()
    .min(100, "Los trámites del proceso deben tener al menos 100 caracteres")
    .max(5000, "Los trámites del proceso no pueden exceder 5000 caracteres"),
  pruebasPresentadas: z
    .string()
    .min(100, "Las pruebas presentadas deben tener al menos 100 caracteres")
    .max(5000, "Las pruebas presentadas no pueden exceder 5000 caracteres"),

  // Sección 3: Motiva (Considerandos)
  analisisPruebas: z
    .string()
    .min(200, "El análisis de pruebas debe tener al menos 200 caracteres")
    .max(10000, "El análisis de pruebas no puede exceder 10000 caracteres"),
  valoracionPruebas: z
    .string()
    .min(200, "La valoración de pruebas debe tener al menos 200 caracteres")
    .max(10000, "La valoración de pruebas no puede exceder 10000 caracteres"),
  aplicacionDerecho: z
    .string()
    .min(200, "La aplicación del derecho debe tener al menos 200 caracteres")
    .max(10000, "La aplicación del derecho no puede exceder 10000 caracteres"),
  razonamientoJuridico: z
    .string()
    .min(200, "El razonamiento jurídico debe tener al menos 200 caracteres")
    .max(10000, "El razonamiento jurídico no puede exceder 10000 caracteres"),
  jurisprudencia: z
    .string()
    .max(5000, "La jurisprudencia no puede exceder 5000 caracteres")
    .optional(),

  // Sección 4: Resolutiva (Por Tanto)
  decision: z.enum(["ADMITE", "RECHAZA", "ADMITE_PARCIALMENTE"], {
    errorMap: () => ({ message: "Decisión inválida" }),
  }),
  condena: z
    .string()
    .max(5000, "La condena no puede exceder 5000 caracteres")
    .optional(),
  costas: z
    .string()
    .min(50, "Las costas deben tener al menos 50 caracteres")
    .max(2000, "Las costas no pueden exceder 2000 caracteres"),
});

export const updateSentenciaSchema = createSentenciaSchema.partial().extend({
  id: z.string().cuid("ID de sentencia inválido"),
});

// Schema para guardar borrador (campos opcionales)
export const saveBorradorSentenciaSchema = z.object({
  procesoId: z.string().cuid("ID de proceso inválido"),
  resumenDemanda: z.string().optional(),
  resumenContestacion: z.string().optional(),
  tramitesProceso: z.string().optional(),
  pruebasPresentadas: z.string().optional(),
  analisisPruebas: z.string().optional(),
  valoracionPruebas: z.string().optional(),
  aplicacionDerecho: z.string().optional(),
  razonamientoJuridico: z.string().optional(),
  jurisprudencia: z.string().optional(),
  decision: z.enum(["ADMITE", "RECHAZA", "ADMITE_PARCIALMENTE"]).optional(),
  condena: z.string().optional(),
  costas: z.string().optional(),
});

// ============================================
// Validación de estructura completa
// ============================================

export function validateSentenciaCompleta(data: {
  resumenDemanda: string;
  resumenContestacion: string;
  tramitesProceso: string;
  pruebasPresentadas: string;
  analisisPruebas: string;
  valoracionPruebas: string;
  aplicacionDerecho: string;
  razonamientoJuridico: string;
  decision: string;
  costas: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validar Narrativa (mínimo 500 caracteres en total)
  const narrativaTotal =
    data.resumenDemanda.length +
    data.resumenContestacion.length +
    data.tramitesProceso.length +
    data.pruebasPresentadas.length;

  if (narrativaTotal < 500) {
    errors.push(
      "La sección Narrativa (Resultandos) debe tener al menos 500 caracteres en total"
    );
  }

  // Validar Considerandos (mínimo 1000 caracteres en total)
  const considerandosTotal =
    data.analisisPruebas.length +
    data.valoracionPruebas.length +
    data.aplicacionDerecho.length +
    data.razonamientoJuridico.length;

  if (considerandosTotal < 1000) {
    errors.push(
      "La sección Considerandos debe tener al menos 1000 caracteres en total"
    );
  }

  // Validar Resolutiva (mínimo 200 caracteres)
  if (data.decision.length + data.costas.length < 200) {
    errors.push(
      "La sección Resolutiva (Por Tanto) debe tener al menos 200 caracteres en total"
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export type CreateSentenciaInput = z.infer<typeof createSentenciaSchema>;
export type UpdateSentenciaInput = z.infer<typeof updateSentenciaSchema>;
export type SaveBorradorSentenciaInput = z.infer<typeof saveBorradorSentenciaSchema>;
