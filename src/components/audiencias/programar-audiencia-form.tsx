"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Video, Users as UsersIcon } from "lucide-react";

const formSchema = z.object({
  tipo: z.enum(["PRELIMINAR", "COMPLEMENTARIA"]),
  modalidad: z.enum(["PRESENCIAL", "VIRTUAL"]),
  fechaHora: z.string().min(1, "La fecha y hora son requeridas"),
  linkGoogleMeet: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProgramarAudienciaFormProps {
  procesoId: string;
  estadoProceso: string;
  tieneContestacion: boolean;
}

export function ProgramarAudienciaForm({
  procesoId,
  estadoProceso,
  tieneContestacion,
}: ProgramarAudienciaFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Determinar tipo por defecto según estado del proceso
  const tipoDefault = estadoProceso === "AUDIENCIA_COMPLEMENTARIA" ? "COMPLEMENTARIA" : "PRELIMINAR";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: tipoDefault,
      modalidad: "PRESENCIAL",
      fechaHora: "",
      linkGoogleMeet: "",
    },
  });

  const modalidadSeleccionada = form.watch("modalidad");

  async function onSubmit(values: FormValues) {
    try {
      setIsLoading(true);

      const response = await fetch("/api/audiencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          procesoId,
          ...values,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al programar audiencia");
      }

      toast({
        title: "Audiencia programada",
        description: "La audiencia ha sido programada exitosamente y se han notificado a los abogados",
      });

      router.refresh();
      form.reset();
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al programar la audiencia",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Tipo de Audiencia */}
        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Tipo de Audiencia
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="PRELIMINAR" />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-normal cursor-pointer">
                        Audiencia Preliminar (Art. 365)
                      </FormLabel>
                      <FormDescription>
                        Primera audiencia. Se ratifican escritos, se intenta conciliación, se fija objeto del
                        proceso y se admiten pruebas.
                      </FormDescription>
                    </div>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="COMPLEMENTARIA" />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-normal cursor-pointer">
                        Audiencia Complementaria
                      </FormLabel>
                      <FormDescription>
                        Práctica de pruebas (testimonial, pericial, inspección). Se cierra etapa probatoria.
                      </FormDescription>
                    </div>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Modalidad */}
        <FormField
          control={form.control}
          name="modalidad"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4" />
                Modalidad
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="PRESENCIAL" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Presencial (en el juzgado)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="VIRTUAL" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Virtual (Google Meet)
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Fecha y Hora */}
        <FormField
          control={form.control}
          name="fechaHora"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha y Hora de la Audiencia</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormDescription>
                Programar con al menos 5 días de anticipación para notificar a las partes
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Link de Google Meet (solo si es virtual) */}
        {modalidadSeleccionada === "VIRTUAL" && (
          <FormField
            control={form.control}
            name="linkGoogleMeet"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Link de Google Meet
                </FormLabel>
                <FormControl>
                  <Input placeholder="https://meet.google.com/xxx-xxxx-xxx" {...field} />
                </FormControl>
                <FormDescription>
                  Crear reunión en{" "}
                  <a
                    href="https://meet.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    Google Meet
                  </a>{" "}
                  y pegar el link aquí
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? "Programando..." : "Programar Audiencia"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
