/**
 * Validaciones Zod para Resoluciones y Plantillas de Resolución
 */

import { z } from "zod";
import { TipoResolucion } from "@prisma/client";

// ============================================
// Schemas para Resoluciones
// ============================================

export const createResolucionSchema = z.object({
  procesoId: z.string().cuid("ID de proceso inválido"),
  tipo: z.nativeEnum(TipoResolucion, {
    errorMap: () => ({ message: "Tipo de resolución inválido" }),
  }),
  titulo: z
    .string()
    .min(10, "El título debe tener al menos 10 caracteres")
    .max(500, "El título no puede exceder 500 caracteres"),
  vistos: z
    .string()
    .max(10000, "La sección Vistos no puede exceder 10000 caracteres")
    .optional(),
  considerando: z
    .string()
    .max(20000, "La sección Considerando no puede exceder 20000 caracteres")
    .optional(),
  porTanto: z
    .string()
    .min(50, "La sección Por Tanto debe tener al menos 50 caracteres")
    .max(10000, "La sección Por Tanto no puede exceder 10000 caracteres"),
});

export const updateResolucionSchema = createResolucionSchema.partial().extend({
  id: z.string().cuid("ID de resolución inválido"),
});

// Validación específica según tipo de resolución
export const validateResolucionByType = (
  tipo: TipoResolucion,
  data: {
    vistos?: string;
    considerando?: string;
    porTanto: string;
  }
) => {
  switch (tipo) {
    case "PROVIDENCIA":
      // Providencias son simples, solo requieren Por Tanto
      if (!data.porTanto || data.porTanto.length < 20) {
        throw new Error(
          "Las providencias requieren al menos una disposición breve en Por Tanto"
        );
      }
      break;

    case "AUTO_INTERLOCUTORIO":
      // Autos Interlocutorios requieren Vistos y Por Tanto
      if (!data.vistos || data.vistos.length < 50) {
        throw new Error(
          "Los autos interlocutorios requieren una sección Vistos detallada"
        );
      }
      if (!data.porTanto || data.porTanto.length < 50) {
        throw new Error(
          "Los autos interlocutorios requieren una sección Por Tanto detallada"
        );
      }
      break;

    case "AUTO_DEFINITIVO":
      // Autos Definitivos requieren todas las secciones
      if (!data.vistos || data.vistos.length < 100) {
        throw new Error(
          "Los autos definitivos requieren una sección Vistos completa (mínimo 100 caracteres)"
        );
      }
      if (!data.considerando || data.considerando.length < 200) {
        throw new Error(
          "Los autos definitivos requieren una sección Considerando fundamentada (mínimo 200 caracteres)"
        );
      }
      if (!data.porTanto || data.porTanto.length < 100) {
        throw new Error(
          "Los autos definitivos requieren una sección Por Tanto completa (mínimo 100 caracteres)"
        );
      }
      break;
  }
};

// ============================================
// Schemas para Plantillas de Resolución
// ============================================

export const createPlantillaResolucionSchema = z.object({
  tipo: z.nativeEnum(TipoResolucion, {
    errorMap: () => ({ message: "Tipo de resolución inválido" }),
  }),
  titulo: z
    .string()
    .min(10, "El título debe tener al menos 10 caracteres")
    .max(500, "El título no puede exceder 500 caracteres"),
  vistos: z
    .string()
    .max(10000, "La sección Vistos no puede exceder 10000 caracteres")
    .optional(),
  considerando: z
    .string()
    .max(20000, "La sección Considerando no puede exceder 20000 caracteres")
    .optional(),
  porTanto: z
    .string()
    .min(20, "La sección Por Tanto debe tener al menos 20 caracteres")
    .max(10000, "La sección Por Tanto no puede exceder 10000 caracteres"),
  descripcion: z
    .string()
    .max(500, "La descripción no puede exceder 500 caracteres")
    .optional(),
  compartida: z.boolean().default(false),
});

export const updatePlantillaResolucionSchema =
  createPlantillaResolucionSchema.partial().extend({
    id: z.string().cuid("ID de plantilla inválido"),
    activa: z.boolean().optional(),
  });

// ============================================
// Variables dinámicas para plantillas
// ============================================

export const VARIABLES_PLANTILLA = {
  "{actor}": "Nombre completo del actor",
  "{demandado}": "Nombre completo del demandado",
  "{nurej}": "Número de referencia judicial (NUREJ)",
  "{fecha}": "Fecha actual",
  "{juzgado}": "Nombre del juzgado",
  "{juez}": "Nombre completo del juez",
  "{objeto}": "Objeto del proceso",
  "{cuantia}": "Cuantía del proceso",
} as const;

/**
 * Reemplaza las variables dinámicas en el texto de la plantilla
 */
export function procesarVariablesPlantilla(
  texto: string,
  variables: {
    actor?: string;
    demandado?: string;
    nurej?: string;
    fecha?: string;
    juzgado?: string;
    juez?: string;
    objeto?: string;
    cuantia?: string;
  }
): string {
  let resultado = texto;

  Object.entries(variables).forEach(([key, value]) => {
    if (value) {
      const placeholder = `{${key}}`;
      resultado = resultado.replaceAll(placeholder, value);
    }
  });

  return resultado;
}

export type CreateResolucionInput = z.infer<typeof createResolucionSchema>;
export type UpdateResolucionInput = z.infer<typeof updateResolucionSchema>;
export type CreatePlantillaResolucionInput = z.infer<
  typeof createPlantillaResolucionSchema
>;
export type UpdatePlantillaResolucionInput = z.infer<
  typeof updatePlantillaResolucionSchema
>;
