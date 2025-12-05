"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Send } from "lucide-react";
import { allanamientoSchema, type AllanamientoInput } from "@/lib/validations/contestacion";

interface AllanamientoFormProps {
  procesoId: string;
}

export function AllanamientoForm({ procesoId }: AllanamientoFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AllanamientoInput>({
    resolver: zodResolver(allanamientoSchema),
    defaultValues: {
      tipo: "ALLANAMIENTO",
      manifestacion: "",
      solicitaCostas: false,
      observacionesCostas: "",
    },
  });

  const solicitaCostas = form.watch("solicitaCostas");

  const onSubmit = async (data: AllanamientoInput) => {
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/contestaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          procesoId,
          ...data,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al presentar allanamiento");
      }

      toast({
        title: "Allanamiento presentado",
        description: "El allanamiento ha sido registrado exitosamente.",
      });

      router.push(`/dashboard/procesos/${procesoId}`);
      router.refresh();
    } catch (error) {
      console.error("Error al presentar allanamiento:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "No se pudo presentar el allanamiento",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="manifestacion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manifestación de Allanamiento</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Manifiesto expresamente mi allanamiento a la demanda presentada por las siguientes razones..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Exprese claramente su aceptación de los términos de la demanda y las
                razones de su allanamiento (mínimo 100 caracteres).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="solicitaCostas"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Solicitar exención de costas
                </FormLabel>
                <FormDescription>
                  Marque esta opción si desea solicitar que se le exima del pago de costas
                  procesales.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {solicitaCostas && (
          <FormField
            control={form.control}
            name="observacionesCostas"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fundamento para exención de costas</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Fundamente las razones por las cuales solicita la exención de costas..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Explique las razones por las cuales considera que debe ser eximido del
                  pago de costas (máximo 500 caracteres).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-950 p-4">
          <p className="text-sm text-yellow-900 dark:text-yellow-100 font-medium mb-2">
            ⚠️ Importante
          </p>
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            El allanamiento implica la aceptación de todos los términos de la demanda. El
            juez dictará sentencia favorable al demandante sin necesidad de audiencia ni
            prueba.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/dashboard/procesos/${procesoId}`)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Send className="mr-2 h-4 w-4" />
            Presentar Allanamiento
          </Button>
        </div>
      </form>
    </Form>
  );
}
