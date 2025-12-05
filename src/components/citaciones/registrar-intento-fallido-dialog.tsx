"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Calendar, Loader2 } from "lucide-react";
import {
  registrarIntentoFallidoSchema,
  type RegistrarIntentoFallidoInput,
} from "@/lib/validations/citacion";
import { format } from "date-fns";

interface RegistrarIntentoFallidoDialogProps {
  citacionId: string;
  intentosActuales: number;
}

export function RegistrarIntentoFallidoDialog({
  citacionId,
  intentosActuales,
}: RegistrarIntentoFallidoDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegistrarIntentoFallidoInput>({
    resolver: zodResolver(registrarIntentoFallidoSchema),
    defaultValues: {
      citacionId,
      fecha: format(new Date(), "yyyy-MM-dd"),
      hora: format(new Date(), "HH:mm"),
      motivo: "",
    },
  });

  const onSubmit = async (data: RegistrarIntentoFallidoInput) => {
    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/citaciones/${citacionId}/intento-fallido`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al registrar intento fallido");
      }

      const result = await response.json();

      toast({
        title: "Intento fallido registrado",
        description: result.recomendacion || `Intento ${result.totalIntentos} registrado.`,
        variant: result.recomendacion ? "destructive" : "default",
      });

      setOpen(false);
      form.reset();
      router.refresh();
    } catch (error) {
      console.error("Error al registrar intento fallido:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "No se pudo registrar el intento fallido",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Calendar className="h-4 w-4 mr-2" />
          Registrar Intento Fallido
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Intento Fallido de Citación</DialogTitle>
          <DialogDescription>
            Registre los detalles del intento fallido. Después de 3 intentos, se
            recomendará proceder con citación por edictos.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fecha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha del Intento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hora"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora del Intento</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="motivo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo del Intento Fallido</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ej: Domicilio cerrado, no se encontró al demandado, se negó a recibir la cédula"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describa detalladamente el motivo por el cual el intento fue fallido
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {intentosActuales >= 2 && (
              <div className="rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-950 p-4">
                <h4 className="font-semibold text-sm text-orange-900 dark:text-orange-100 mb-2">
                  ⚠️ Atención
                </h4>
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  Este será el intento {intentosActuales + 1}. Después de 3 intentos fallidos,
                  se recomienda proceder con citación por edictos según lo establece el
                  procedimiento.
                </p>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Registrar Intento Fallido
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
