import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Genera un hash SHA-256 de un texto o contenido
 * @param content - Texto o contenido a hashear
 * @returns Hash SHA-256 en formato hexadecimal
 */
export async function generateSHA256Hash(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

/**
 * Formatea una fecha a string legible en español
 * @param date - Fecha a formatear
 * @returns Fecha formateada
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("es-BO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Formatea una fecha y hora a string legible en español
 * @param date - Fecha y hora a formatear
 * @returns Fecha y hora formateada
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("es-BO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
