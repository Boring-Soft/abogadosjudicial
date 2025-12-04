"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, XCircle } from "lucide-react";
import { rechazarDemandaSchema } from "@/lib/validations/demanda";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type RechazarDemandaValues = z.infer<typeof rechazarDemandaSchema>;

interface RechazarDemandaDialogProps {
  demanda: {
    id: string;
    proceso: {
      nurej?: string | null;
    };
  };
}

const MOTIVOS_RECHAZO = [
  { value: "INCOMPETENCIA", label: "Incompetencia del juzgado" },
  { value: "FALTA_LEGITIMACION", label: "Falta de legitimación activa o pasiva" },
  { value: "PRESCRIPCION", label: "Prescripción de la acción" },
  { value: "COSA_JUZGADA", label: "Cosa juzgada" },
  { value: "OTRO", label: "Otro motivo" },
];

export function RechazarDemandaDialog({ demanda }: RechazarDemandaDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RechazarDemandaValues>({
    resolver: zodResolver(rechazarDemandaSchema),
    defaultValues: {
      demandaId: demanda.id,
      motivo: undefined,
      fundamentacion: "",
    },
  });

  const onSubmit = async (data: RechazarDemandaValues) => {
    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/demandas/${demanda.id}/rechazar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Demanda rechazada",
          description: "La demanda ha sido rechazada y el abogado ha sido notificado",
        });
        setOpen(false);
        router.refresh();
        router.push("/dashboard/juez/procesos");
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo rechazar la demanda",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error rechazando demanda:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al rechazar la demanda",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <XCircle className="h-4 w-4 mr-2" />
          Rechazar Demanda
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Rechazar Demanda</DialogTitle>
          <DialogDescription>
            Emita un auto fundamentado de rechazo de la demanda. El proceso pasará a estado
            RECHAZADO y se notificará al abogado actor.
          </DialogDescription>
        </DialogHeader>

        <Alert variant="destructive">
          <AlertTitle>Advertencia</AlertTitle>
          <AlertDescription>
            El rechazo de una demanda es una decisión definitiva que finaliza el proceso. Asegúrese
            de fundamentar adecuadamente su decisión.
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="motivo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo del Rechazo *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el motivo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MOTIVOS_RECHAZO.map((motivo) => (
                        <SelectItem key={motivo.value} value={motivo.value}>
                          {motivo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Seleccione el motivo principal del rechazo
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fundamentacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fundamentación *</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={12}
                      placeholder="Fundamente detalladamente el motivo del rechazo citando las normas legales aplicables..."
                      className="resize-none"
                    />
                  </FormControl>
                  <FormDescription>
                    Mínimo 100 caracteres, máximo 5000. Cite las normas legales aplicables.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} variant="destructive">
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Rechazar y Notificar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
