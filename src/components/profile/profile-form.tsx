"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UserRole } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import type { ProfileData } from "@/types/judicial";

const profileFormSchema = z.object({
  firstName: z.string().min(2, "Nombre debe tener al menos 2 caracteres").max(30),
  lastName: z.string().min(2, "Apellido debe tener al menos 2 caracteres").max(30),
  telefono: z.string().min(7, "Teléfono debe tener al menos 7 dígitos").optional().nullable(),
  registroProfesional: z.string().min(5, "Registro profesional debe tener al menos 5 caracteres").max(20).optional().nullable(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  profile: ProfileData & { juzgado?: any };
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      telefono: profile.telefono || "",
      registroProfesional: profile.registroProfesional || "",
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al actualizar perfil");
      }

      toast({
        title: "Perfil actualizado",
        description: "Tu información ha sido actualizada exitosamente",
      });

      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el perfil",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Juan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="Pérez" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input value={profile.email || ""} disabled />
          </FormControl>
          <FormDescription>
            El email no puede ser modificado desde aquí
          </FormDescription>
        </FormItem>

        <FormItem>
          <FormLabel>Rol</FormLabel>
          <FormControl>
            <Input value={profile.role} disabled />
          </FormControl>
          <FormDescription>
            Tu rol en el sistema
          </FormDescription>
        </FormItem>

        <FormField
          control={form.control}
          name="telefono"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input
                  placeholder="70123456"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {profile.role === UserRole.ABOGADO && (
          <FormField
            control={form.control}
            name="registroProfesional"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registro Profesional</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ABC-12345"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Número de registro profesional de abogado
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {profile.role === UserRole.JUEZ && profile.juzgado && (
          <FormItem>
            <FormLabel>Juzgado</FormLabel>
            <FormControl>
              <Input
                value={`${profile.juzgado.nombre} - ${profile.juzgado.ciudad}`}
                disabled
              />
            </FormControl>
            <FormDescription>
              El juzgado asignado no puede ser modificado desde aquí
            </FormDescription>
          </FormItem>
        )}

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar cambios
          </Button>
        </div>
      </form>
    </Form>
  );
}
