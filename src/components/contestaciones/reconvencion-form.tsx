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
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Send, Plus, Trash2, Scale } from "lucide-react";
import {
  reconvencionSchema,
  type ReconvencionInput,
} from "@/lib/validations/contestacion";

interface ReconvencionFormProps {
  procesoId: string;
}

export function ReconvencionForm({ procesoId }: ReconvencionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hechosDemanda, setHechosDemanda] = useState<string[]>([]);

  const form = useForm<ReconvencionInput>({
    resolver: zodResolver(reconvencionSchema),
    defaultValues: {
      tipo: "RECONVENCION",
      admisionHechos: [],
      fundamentacionContestacion: "",
      objetoReconvencion: "",
      hechosReconvencion: "",
      derechoReconvencion: "",
      valorReconvencion: 0,
      pruebasOfrecidas: [],
      petitorioReconvencion: "",
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
            const hechos = data.data.hechos
              .split(/\n+/)
              .filter((h: string) => h.trim().length > 10)
              .map((h: string) => h.trim());

            setHechosDemanda(hechos);

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

  const onSubmit = async (data: ReconvencionInput) => {
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
        throw new Error(error.error || "Error al presentar reconvención");
      }

      toast({
        title: "Reconvención presentada",
        description:
          "La contestación con reconvención ha sido registrada. El actor tiene 10 días para contestar.",
      });

      router.push(`/dashboard/procesos/${procesoId}`);
      router.refresh();
    } catch (error) {
      console.error("Error al presentar reconvención:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "No se pudo presentar la reconvención",
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* PARTE 1: CONTESTACIÓN */}
        <div className="space-y-4">
          <div className="rounded-lg border bg-purple-50 dark:bg-purple-950 p-4">
            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">
              PARTE 1: Contestación a la Demanda
            </h3>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              Primero debe contestar la demanda original
            </p>
          </div>

          {/* Admisión/Negación de Hechos */}
          <div className="space-y-4">
            <h4 className="font-medium">Respuesta a los Hechos de la Demanda</h4>

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
                              placeholder="Explique por qué niega o admite parcialmente..."
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Fundamentación de la Contestación */}
          <FormField
            control={form.control}
            name="fundamentacionContestacion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fundamentación de la Contestación</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Fundamente su contestación a la demanda..."
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Mínimo 100 caracteres</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator className="my-8" />

        {/* PARTE 2: RECONVENCIÓN */}
        <div className="space-y-4">
          <div className="rounded-lg border bg-purple-50 dark:bg-purple-950 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Scale className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                PARTE 2: Reconvención (Contrademanda)
              </h3>
            </div>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              Ahora presente su propia demanda contra el actor
            </p>
          </div>

          <FormField
            control={form.control}
            name="objetoReconvencion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Objeto de la Reconvención</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Indique claramente qué es lo que demanda en reconvención..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Mínimo 50 caracteres</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hechosReconvencion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hechos de la Reconvención</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Relate de forma clara y precisa los hechos que fundamentan su reconvención..."
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Mínimo 100 caracteres</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="derechoReconvencion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Derecho Aplicable</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Cite las normas legales que sustentan su reconvención..."
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Mínimo 100 caracteres</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="valorReconvencion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor de la Reconvención (Bs.)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  Indique la cuantía o valor económico de su reconvención
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pruebas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Pruebas Ofrecidas</h4>
                <p className="text-sm text-muted-foreground">
                  Pruebas que sustentan su reconvención
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
                    <h5 className="font-medium">Prueba {index + 1}</h5>
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
                        <FormLabel>Tipo</FormLabel>
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
                            <SelectItem value="INSPECCION">
                              Inspección Judicial
                            </SelectItem>
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
                            placeholder="Describa la prueba..."
                            className="min-h-[60px]"
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

          <FormField
            control={form.control}
            name="petitorioReconvencion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Petitorio de la Reconvención</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="SOLICITO al Juzgado..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Mínimo 50 caracteres</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="rounded-lg border border-purple-200 bg-purple-50 dark:bg-purple-950 p-4">
          <p className="text-sm text-purple-900 dark:text-purple-100 font-medium mb-2">
            ℹ️ Información importante
          </p>
          <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1 list-disc list-inside">
            <li>
              La reconvención debe cumplir los mismos requisitos que una demanda
            </li>
            <li>El actor tendrá 10 días hábiles para contestar su reconvención</li>
            <li>
              Si el actor no contesta, se aplicará rebeldía y se asumirán los hechos
              como admitidos
            </li>
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
            Presentar Contestación con Reconvención
          </Button>
        </div>
      </form>
    </Form>
  );
}
