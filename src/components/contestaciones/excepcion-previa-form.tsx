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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Send } from "lucide-react";
import {
  excepcionPreviaSchema,
  type ExcepcionPreviaInput,
} from "@/lib/validations/contestacion";

interface ExcepcionPreviaFormProps {
  procesoId: string;
}

const TIPOS_EXCEPCION = [
  { value: "INCOMPETENCIA", label: "Incompetencia del juez" },
  { value: "FALTA_PERSONALIDAD", label: "Falta de personalidad" },
  { value: "FALTA_PERSONERIA", label: "Falta de personería" },
  { value: "LITISPENDENCIA", label: "Litispendencia" },
  { value: "COSA_JUZGADA", label: "Cosa juzgada" },
  { value: "TRANSACCION", label: "Transacción" },
  { value: "CONCILIACION", label: "Conciliación" },
  { value: "DESISTIMIENTO", label: "Desistimiento" },
  { value: "PRESCRIPCION", label: "Prescripción" },
  { value: "DEMANDA_DEFECTUOSA", label: "Demanda defectuosa" },
  { value: "OTRO", label: "Otro" },
];

export function ExcepcionPreviaForm({ procesoId }: ExcepcionPreviaFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ExcepcionPreviaInput>({
    resolver: zodResolver(excepcionPreviaSchema),
    defaultValues: {
      tipo: "EXCEPCION",
      tipoExcepcion: undefined,
      fundamentacion: "",
      pruebasOfrecidas: [],
      petitorio: "",
    },
  });

  const onSubmit = async (data: ExcepcionPreviaInput) => {
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
        throw new Error(error.error || "Error al presentar excepción previa");
      }

      toast({
        title: "Excepción previa presentada",
        description: "La excepción ha sido registrada y será resuelta por el juez.",
      });

      router.push(`/dashboard/procesos/${procesoId}`);
      router.refresh();
    } catch (error) {
      console.error("Error al presentar excepción:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "No se pudo presentar la excepción previa",
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
          name="tipoExcepcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Excepción Previa</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo de excepción" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TIPOS_EXCEPCION.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Las excepciones previas son cuestiones procesales que deben resolverse
                antes de analizar el fondo del asunto (Art. 370 CPC).
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
              <FormLabel>Fundamentación de la Excepción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Fundamente detalladamente la excepción previa planteada, citando las normas legales aplicables..."
                  className="min-h-[250px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Debe fundamentar jurídicamente la excepción y citar la normativa
                aplicable. Mínimo 100 caracteres.
              </FormDescription>
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
                <Textarea
                  placeholder="SOLICITO al Juzgado: 1) Se declare fundada la excepción previa de..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Indique claramente lo que solicita al juez (mínimo 50 caracteres).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-950 p-4">
          <p className="text-sm text-orange-900 dark:text-orange-100 font-medium mb-2">
            ℹ️ Información
          </p>
          <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-1 list-disc list-inside">
            <li>
              Las excepciones previas suspenden el proceso hasta su resolución
            </li>
            <li>
              El juez resolverá mediante auto fundamentado (fundar o rechazar)
            </li>
            <li>Si se funda, el proceso puede terminar o suspenderse</li>
            <li>Si se rechaza, el proceso continúa con audiencia preliminar</li>
          </ul>
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
            Presentar Excepción Previa
          </Button>
        </div>
      </form>
    </Form>
  );
}
