"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Send, Plus, Trash2 } from "lucide-react";
import {
  contestacionNormalSchema,
  type ContestacionNormalInput,
} from "@/lib/validations/contestacion";

interface ContestacionNormalFormProps {
  procesoId: string;
}

export function ContestacionNormalForm({ procesoId }: ContestacionNormalFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hechosDemanda, setHechosDemanda] = useState<string[]>([]);

  const form = useForm<ContestacionNormalInput>({
    resolver: zodResolver(contestacionNormalSchema),
    defaultValues: {
      tipo: "CONTESTACION",
      admisionHechos: [],
      fundamentacion: "",
      pruebasOfrecidas: [],
      petitorio: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pruebasOfrecidas",
  });

  // Cargar hechos de la demanda
  useEffect(() => {
    const fetchDemanda = async () => {
      try {
        const response = await fetch(`/api/demandas?procesoId=${procesoId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data.hechos) {
            // Separar hechos por saltos de línea o numeración
            const hechos = data.data.hechos
              .split(/\n+/)
              .filter((h: string) => h.trim().length > 10)
              .map((h: string, i: number) => h.trim());

            setHechosDemanda(hechos);

            // Inicializar array de admisión de hechos
            const admisionInicial = hechos.map((hecho: string, index: number) => ({
              numeroHecho: index + 1,
              textoHecho: hecho,
              respuesta: "NIEGA" as const,
              explicacion: "",
            }));

            form.setValue("admisionHechos", admisionInicial);
          }
        }
      } catch (error) {
        console.error("Error al cargar demanda:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los hechos de la demanda",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDemanda();
  }, [procesoId, form]);

  const onSubmit = async (data: ContestacionNormalInput) => {
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
        throw new Error(error.error || "Error al presentar contestación");
      }

      toast({
        title: "Contestación presentada",
        description: "La contestación ha sido registrada exitosamente.",
      });

      router.push(`/dashboard/procesos/${procesoId}`);
      router.refresh();
    } catch (error) {
      console.error("Error al presentar contestación:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "No se pudo presentar la contestación",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const admisionHechosFields = form.watch("admisionHechos") || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Admisión/Negación de Hechos */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Respuesta a los Hechos de la Demanda
            </h3>
            <p className="text-sm text-muted-foreground">
              Para cada hecho, indique si lo admite, niega o admite parcialmente
            </p>
          </div>

          {admisionHechosFields.map((hecho, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-3">
                <div>
                  <div className="flex items-start gap-2 mb-2">
                    <Badge variant="outline">Hecho {hecho.numeroHecho}</Badge>
                  </div>
                  <p className="text-sm">{hecho.textoHecho}</p>
                </div>

                <FormField
                  control={form.control}
                  name={`admisionHechos.${index}.respuesta`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Su respuesta</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ADMITE">Admite</SelectItem>
                          <SelectItem value="NIEGA">Niega</SelectItem>
                          <SelectItem value="ADMITE_PARCIALMENTE">
                            Admite Parcialmente
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {(hecho.respuesta === "NIEGA" ||
                  hecho.respuesta === "ADMITE_PARCIALMENTE") && (
                  <FormField
                    control={form.control}
                    name={`admisionHechos.${index}.explicacion`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Explicación</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Explique por qué niega o admite parcialmente este hecho..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Debe fundamentar su negación o admisión parcial (mínimo 20
                          caracteres)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Fundamentación */}
        <FormField
          control={form.control}
          name="fundamentacion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fundamentación de la Contestación</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Exponga los fundamentos de hecho y de derecho de su contestación..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Fundamente jurídicamente su posición, citando normas legales aplicables
                (mínimo 100 caracteres).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Pruebas Ofrecidas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Pruebas de Descargo</h3>
              <p className="text-sm text-muted-foreground">
                Ofrezca las pruebas que respaldan su contestación
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  tipo: "DOCUMENTAL",
                  descripcion: "",
                  documentoUrl: undefined,
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Prueba
            </Button>
          </div>

          {fields.map((field, index) => (
            <Card key={field.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Prueba {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name={`pruebasOfrecidas.${index}.tipo`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Prueba</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="DOCUMENTAL">Documental</SelectItem>
                          <SelectItem value="TESTIMONIAL">Testimonial</SelectItem>
                          <SelectItem value="PERICIAL">Pericial</SelectItem>
                          <SelectItem value="CONFESION">Confesión</SelectItem>
                          <SelectItem value="INSPECCION">Inspección Judicial</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`pruebasOfrecidas.${index}.descripcion`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describa la prueba y su relevancia..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Petitorio */}
        <FormField
          control={form.control}
          name="petitorio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Petitorio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="SOLICITO al Juzgado: 1) Se declare improbada la demanda, 2) Se me exima de costas..."
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
            Presentar Contestación
          </Button>
        </div>
      </form>
    </Form>
  );
}
