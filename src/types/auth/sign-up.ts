import { z } from "zod";
import { UserRole } from "@prisma/client";

// Schema base para registro (sin el campo role)
const baseSignUpSchemaFields = {
  email: z.string().email("Email inválido"),
  firstName: z.string().min(2, "Nombre debe tener al menos 2 caracteres").max(30),
  lastName: z.string().min(2, "Apellido debe tener al menos 2 caracteres").max(30),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  confirmPassword: z.string(),
};

// Schema base sin refine
const userSchema = z.object({
  ...baseSignUpSchemaFields,
  role: z.literal(UserRole.USER).default(UserRole.USER),
});

const abogadoSchemaBase = z.object({
  ...baseSignUpSchemaFields,
  role: z.literal(UserRole.ABOGADO),
  registroProfesional: z.string().min(5, "Registro profesional debe tener al menos 5 caracteres").max(20),
  telefono: z.string().min(7, "Teléfono debe tener al menos 7 dígitos").optional(),
});

const juezSchemaBase = z.object({
  ...baseSignUpSchemaFields,
  role: z.literal(UserRole.JUEZ),
  juzgadoId: z.string().min(1, "Debe seleccionar un juzgado"),
  telefono: z.string().min(7, "Teléfono debe tener al menos 7 dígitos").optional(),
});

// Schema unificado que valida según el rol
export const dynamicSignUpSchema = z.discriminatedUnion("role", [
  userSchema,
  abogadoSchemaBase,
  juezSchemaBase,
]).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

// Schemas individuales con refine para uso en formularios
export const signUpFormSchema = userSchema.refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export const abogadoSignUpSchema = abogadoSchemaBase.refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export const juezSignUpSchema = juezSchemaBase.refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export type SignUpFormData = z.infer<typeof signUpFormSchema>;
export type AbogadoSignUpFormData = z.infer<typeof abogadoSignUpSchema>;
export type JuezSignUpFormData = z.infer<typeof juezSignUpSchema>;
export type DynamicSignUpFormData = z.infer<typeof dynamicSignUpSchema>;

export type SignUpFormProps = React.HTMLAttributes<HTMLDivElement>;
