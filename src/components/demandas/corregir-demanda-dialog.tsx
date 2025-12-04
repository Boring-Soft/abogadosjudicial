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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, AlertCircle, FileEdit } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { updateDemandaSchema } from "@/lib/validations/demanda";
import type { DemandaData } from "@/types/judicial";

type CorregirDemandaValues = Omit<z.infer<typeof updateDemandaSchema>, "id">;

interface CorregirDemandaDialogProps {
  demanda: DemandaData & { proceso?: { nurej?: string | null } };
}

export function CorregirDemandaDialog({ demanda }: CorregirDemandaDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CorregirDemandaValues>({
    resolver: zodResolver(updateDemandaSchema.omit({ id: true })),
    defaultValues: {
      designacionJuez: demanda.designacionJuez,
      objeto: demanda.objeto,
      hechos: demanda.hechos,
      derecho: demanda.derecho,
      petitorio: demanda.petitorio,
      valorDemanda: demanda.valorDemanda,
      pruebaOfrecida: demanda.pruebaOfrecida,
    },
  });

  const onSubmit = async (data: CorregirDemandaValues) => {
    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/demandas/${demanda.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Demanda corregida",
          description: "La demanda ha sido corregida y re-presentada exitosamente",
        });
        setOpen(false);
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo corregir la demanda",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error corrigiendo demanda:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al corregir la demanda",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <FileEdit className="h-4 w-4 mr-2" />
          Corregir Demanda
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Corregir Demanda Observada</DialogTitle>
          <DialogDescription>
            Corrija los aspectos observados por el juez. La demanda será re-presentada con versión{" "}
            {demanda.version + 1}.
          </DialogDescription>
        </DialogHeader>

        {demanda.observaciones && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Observaciones del Juez</AlertTitle>
            <AlertDescription className="mt-2 whitespace-pre-wrap">
              {demanda.observaciones}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="designacionJuez"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designación del Juez</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} className="resize-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="objeto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objeto de la Demanda</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} className="resize-none" />
                  </FormControl>
                  <FormDescription>Mínimo 50 caracteres</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hechos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hechos</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={6} className="resize-none" />
                  </FormControl>
                  <FormDescription>Mínimo 100 caracteres</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="derecho"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fundamento de Derecho</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} className="resize-none" />
                  </FormControl>
                  <FormDescription>Mínimo 50 caracteres</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="petitorio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Petitorio</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} className="resize-none" />
                  </FormControl>
                  <FormDescription>Mínimo 30 caracteres</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="valorDemanda"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor de la Demanda (Bs.)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      min="1"
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pruebaOfrecida"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prueba Ofrecida</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} className="resize-none" />
                  </FormControl>
                  <FormDescription>Mínimo 30 caracteres</FormDescription>
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Re-presentar Demanda Corregida
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
