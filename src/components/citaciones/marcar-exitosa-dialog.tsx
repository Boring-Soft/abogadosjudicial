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
import { CheckCircle, Loader2 } from "lucide-react";
import { registrarCitacionExitosaSchema, type RegistrarCitacionExitosaInput } from "@/lib/validations/citacion";
import { format } from "date-fns";

interface MarcarExitosaDialogProps {
  citacionId: string;
}

export function MarcarExitosaDialog({ citacionId }: MarcarExitosaDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegistrarCitacionExitosaInput>({
    resolver: zodResolver(registrarCitacionExitosaSchema),
    defaultValues: {
      citacionId,
      fechaCitacion: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      observaciones: "",
    },
  });

  const onSubmit = async (data: RegistrarCitacionExitosaInput) => {
    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/citaciones/${citacionId}/exitosa`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al marcar citación como exitosa");
      }

      const result = await response.json();

      toast({
        title: "Citación exitosa registrada",
        description: `El plazo de ${result.plazo.diasHabiles} días hábiles ha sido iniciado.`,
      });

      setOpen(false);
      form.reset();
      router.refresh();
    } catch (error) {
      console.error("Error al marcar citación como exitosa:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "No se pudo marcar la citación como exitosa",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <CheckCircle className="h-4 w-4 mr-2" />
          Marcar como Exitosa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Citación Exitosa</DialogTitle>
          <DialogDescription>
            Registre la fecha y hora en que se realizó exitosamente la citación.
            Se iniciará automáticamente el plazo de 30 días hábiles para contestar.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fechaCitacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha y Hora de Citación</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormDescription>
                    Ingrese la fecha y hora exacta en que se realizó la citación
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ej: Citación realizada en domicilio real, recibió el demandado personalmente"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Puede agregar detalles sobre cómo se realizó la citación
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-lg border bg-blue-50 dark:bg-blue-950 p-4">
              <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-2">
                Al marcar como exitosa:
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Se registrará la fecha de citación</li>
                <li>• Se iniciará el plazo de 30 días hábiles para contestar</li>
                <li>• Se notificará al abogado actor</li>
                <li>• Se creará un plazo en el sistema</li>
              </ul>
            </div>

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
                Registrar Citación Exitosa
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
