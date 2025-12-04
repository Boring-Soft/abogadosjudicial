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
import { Loader2, AlertTriangle } from "lucide-react";
import { observarDemandaSchema } from "@/lib/validations/demanda";

type ObservarDemandaValues = z.infer<typeof observarDemandaSchema>;

interface ObservarDemandaDialogProps {
  demanda: {
    id: string;
    proceso: {
      nurej?: string | null;
    };
  };
}

export function ObservarDemandaDialog({ demanda }: ObservarDemandaDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ObservarDemandaValues>({
    resolver: zodResolver(observarDemandaSchema),
    defaultValues: {
      demandaId: demanda.id,
      observaciones: "",
      plazoCorreccion: 10,
    },
  });

  const onSubmit = async (data: ObservarDemandaValues) => {
    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/demandas/${demanda.id}/observar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Demanda observada",
          description: `La demanda ha sido observada. El abogado tiene ${data.plazoCorreccion} días para corregirla`,
        });
        setOpen(false);
        router.refresh();
        router.push("/dashboard/juez/procesos");
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo observar la demanda",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error observando demanda:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al observar la demanda",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-yellow-600 text-yellow-700 hover:bg-yellow-50">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Observar Demanda
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Observar Demanda</DialogTitle>
          <DialogDescription>
            Especifique las observaciones que debe corregir el abogado. El proceso pasará a estado
            OBSERVADO y se notificará al abogado actor.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones *</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={8}
                      placeholder="Especifique las observaciones que debe corregir el abogado..."
                      className="resize-none"
                    />
                  </FormControl>
                  <FormDescription>Mínimo 20 caracteres, máximo 2000</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="plazoCorreccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plazo de Corrección (días)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="5"
                      max="30"
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Entre 5 y 30 días hábiles. Por defecto: 10 días
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
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="outline"
                className="border-yellow-600 text-yellow-700 hover:bg-yellow-50"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Observar y Notificar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
