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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle } from "lucide-react";
import { admitirDemandaSchema } from "@/lib/validations/demanda";

type AdmitirDemandaValues = z.infer<typeof admitirDemandaSchema>;

interface AdmitirDemandaDialogProps {
  demanda: {
    id: string;
    proceso: {
      nurej?: string | null;
      juzgado: { nombre: string };
    };
  };
}

const PLANTILLA_DECRETO_ADMISION = `AUTO INTERLOCUTORIO

En la ciudad de [CIUDAD], a los [DIA] días del mes de [MES] del año [AÑO], el Juez del [JUZGADO], en el proceso seguido por [ACTOR] contra [DEMANDADO], dicta el siguiente:

AUTO

VISTOS: La demanda presentada en fecha [FECHA_DEMANDA], cumpliendo con los requisitos establecidos en el Art. 110 del Código Procesal Civil.

CONSIDERANDO: Que la demanda reúne los requisitos formales y sustanciales exigidos por ley.

POR TANTO: Se ADMITE la demanda a trámite ordinario. Póngase en conocimiento del demandado mediante citación personal. Cítese y emplácese.

Regístrese, notifíquese y cúmplase.`;

export function AdmitirDemandaDialog({ demanda }: AdmitirDemandaDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AdmitirDemandaValues>({
    resolver: zodResolver(admitirDemandaSchema),
    defaultValues: {
      demandaId: demanda.id,
      decretoAdmision: PLANTILLA_DECRETO_ADMISION,
      nurejDefinitivo: demanda.proceso.nurej || undefined,
    },
  });

  const onSubmit = async (data: AdmitirDemandaValues) => {
    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/demandas/${demanda.id}/admitir`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Demanda admitida",
          description: "La demanda ha sido admitida exitosamente y el abogado ha sido notificado",
        });
        setOpen(false);
        router.refresh();
        router.push("/dashboard/juez/procesos");
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo admitir la demanda",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error admitiendo demanda:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al admitir la demanda",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-green-600 hover:bg-green-700">
          <CheckCircle className="h-4 w-4 mr-2" />
          Admitir Demanda
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Admitir Demanda</DialogTitle>
          <DialogDescription>
            Emita el decreto de admisión de la demanda. El proceso pasará a estado ADMITIDO y se
            notificará al abogado actor.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nurejDefinitivo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NUREJ Definitivo (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ej: LA1CIV-2025-00123"
                      className="font-mono"
                    />
                  </FormControl>
                  <FormDescription>
                    Si no especifica, se generará automáticamente. Actual:{" "}
                    {demanda.proceso.nurej || "No asignado"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="decretoAdmision"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Decreto de Admisión</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={16} className="font-mono text-sm resize-none" />
                  </FormControl>
                  <FormDescription>
                    Edite el decreto según sea necesario. Se generará un PDF con firma digital.
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
              <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Admitir y Notificar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
