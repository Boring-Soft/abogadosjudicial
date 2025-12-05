"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TipoCitacion } from "@prisma/client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { FileText, Loader2 } from "lucide-react";
import { ordenarCitacionSchema, type OrdenarCitacionInput } from "@/lib/validations/citacion";

interface OrdenarCitacionDialogProps {
  procesoId: string;
}

export function OrdenarCitacionDialog({ procesoId }: OrdenarCitacionDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OrdenarCitacionInput>({
    resolver: zodResolver(ordenarCitacionSchema),
    defaultValues: {
      procesoId,
      tipoCitacion: TipoCitacion.PERSONAL,
    },
  });

  const onSubmit = async (data: OrdenarCitacionInput) => {
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/citaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al ordenar citación");
      }

      toast({
        title: "Citación ordenada",
        description: "La citación ha sido ordenada exitosamente.",
      });

      setOpen(false);
      form.reset();
      router.refresh();
    } catch (error) {
      console.error("Error al ordenar citación:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo ordenar la citación",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Ordenar Citación
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ordenar Citación al Demandado</DialogTitle>
          <DialogDescription>
            Seleccione el tipo de citación que se utilizará para notificar al demandado.
            Se generará automáticamente la cédula de citación.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="tipoCitacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Citación</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el tipo de citación" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={TipoCitacion.PERSONAL}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Citación Personal</span>
                          <span className="text-xs text-muted-foreground">
                            El demandado recibe la cédula personalmente
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value={TipoCitacion.CEDULA}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Citación por Cédula</span>
                          <span className="text-xs text-muted-foreground">
                            Se entrega en el domicilio con persona mayor
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value={TipoCitacion.EDICTO}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Citación por Edictos</span>
                          <span className="text-xs text-muted-foreground">
                            Publicación en prensa 3 veces (días alternos)
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value={TipoCitacion.TACITA}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Citación Tácita</span>
                          <span className="text-xs text-muted-foreground">
                            Apersonamiento voluntario del demandado
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    El tipo de citación determina el procedimiento y los plazos procesales.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-lg border p-4 bg-muted/50 space-y-2">
              <h4 className="font-semibold text-sm">Importante</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Se generará la cédula de citación automáticamente</li>
                <li>• El proceso cambiará a estado CITADO</li>
                <li>• Se notificará al abogado actor</li>
                <li>• Los plazos comenzarán según el tipo de citación</li>
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
                Ordenar Citación
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
