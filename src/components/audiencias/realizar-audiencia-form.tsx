"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Play, StopCircle, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const cerrarFormSchema = z.object({
  huboConciliacion: z.boolean(),
  acuerdoConciliacion: z.string().optional(),
  objetoProceso: z.string().optional(),
  pruebasAdmitidas: z
    .array(
      z.object({
        tipo: z.enum(["DOCUMENTAL", "TESTIMONIAL", "PERICIAL", "INSPECCION"]),
        descripcion: z.string(),
        admitida: z.boolean(),
        fundamentacion: z.string().optional(),
      })
    )
    .optional(),
  programarComplementaria: z.boolean().default(false),
  fechaComplementaria: z.string().optional(),
  linkComplementaria: z.string().optional(),
});

type CerrarFormValues = z.infer<typeof cerrarFormSchema>;

interface RealizarAudienciaFormProps {
  audienciaId: string;
  tipoAudiencia: "PRELIMINAR" | "COMPLEMENTARIA";
  asistentesIniciales: any[];
  demanda: any;
  contestacion: any;
}

export function RealizarAudienciaForm({
  audienciaId,
  tipoAudiencia,
  asistentesIniciales,
  demanda,
  contestacion,
}: RealizarAudienciaFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [audienciaIniciada, setAudienciaIniciada] = useState(false);
  const [asistentes, setAsistentes] = useState(
    asistentesIniciales.map((a: any) => ({ ...a, asistio: false }))
  );

  const form = useForm<CerrarFormValues>({
    resolver: zodResolver(cerrarFormSchema),
    defaultValues: {
      huboConciliacion: false,
      acuerdoConciliacion: "",
      objetoProceso: "",
      pruebasAdmitidas: [],
      programarComplementaria: false,
      fechaComplementaria: "",
      linkComplementaria: "",
    },
  });

  const huboConciliacion = form.watch("huboConciliacion");
  const programarComplementaria = form.watch("programarComplementaria");

  async function iniciarAudiencia() {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/audiencias/${audienciaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accion: "iniciar",
          asistentes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar audiencia");
      }

      toast({
        title: "Audiencia iniciada",
        description: "La audiencia ha sido iniciada exitosamente",
      });

      setAudienciaIniciada(true);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al iniciar la audiencia",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(values: CerrarFormValues) {
    try {
      setIsLoading(true);

      // Validaciones adicionales
      if (values.huboConciliacion && !values.acuerdoConciliacion) {
        toast({
          title: "Error",
          description: "Debe describir el acuerdo de conciliación",
          variant: "destructive",
        });
        return;
      }

      if (!values.huboConciliacion && !values.objetoProceso && tipoAudiencia === "PRELIMINAR") {
        toast({
          title: "Error",
          description: "Debe fijar el objeto del proceso si no hubo conciliación",
          variant: "destructive",
        });
        return;
      }

      const audienciaComplementaria = values.programarComplementaria
        ? {
            fechaHora: values.fechaComplementaria,
            linkGoogleMeet: values.linkComplementaria,
          }
        : undefined;

      const response = await fetch(`/api/audiencias/${audienciaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accion: "cerrar",
          ...values,
          audienciaComplementaria,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al cerrar audiencia");
      }

      toast({
        title: "Audiencia cerrada",
        description: values.huboConciliacion
          ? "El proceso ha concluido por conciliación"
          : "La audiencia ha sido cerrada exitosamente y se ha generado el acta",
      });

      router.push(`/dashboard/procesos/${data.data.procesoId}`);
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al cerrar la audiencia",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function toggleAsistencia(index: number) {
    const nuevosAsistentes = [...asistentes];
    nuevosAsistentes[index].asistio = !nuevosAsistentes[index].asistio;
    setAsistentes(nuevosAsistentes);
  }

  function agregarPrueba() {
    const pruebasActuales = form.getValues("pruebasAdmitidas") || [];
    form.setValue("pruebasAdmitidas", [
      ...pruebasActuales,
      {
        tipo: "DOCUMENTAL" as const,
        descripcion: "",
        admitida: true,
        fundamentacion: "",
      },
    ]);
  }

  function eliminarPrueba(index: number) {
    const pruebasActuales = form.getValues("pruebasAdmitidas") || [];
    form.setValue(
      "pruebasAdmitidas",
      pruebasActuales.filter((_, i) => i !== index)
    );
  }

  return (
    <div className="space-y-6">
      {/* Botón de Iniciar Audiencia */}
      {!audienciaIniciada && (
        <Card>
          <CardHeader>
            <CardTitle>Paso 1: Iniciar Audiencia</CardTitle>
            <CardDescription>
              Marcar la asistencia de las partes e iniciar la audiencia
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Checklist de Asistencia */}
            <div className="space-y-2">
              <p className="font-medium">Asistencia:</p>
              {asistentes.map((asistente: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded"
                >
                  <div>
                    <p className="font-medium">{asistente.nombre}</p>
                    <p className="text-sm text-muted-foreground">{asistente.rol}</p>
                  </div>
                  <Checkbox
                    checked={asistente.asistio}
                    onCheckedChange={() => toggleAsistencia(index)}
                  />
                </div>
              ))}
            </div>

            <Button
              onClick={iniciarAudiencia}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              <Play className="h-4 w-4 mr-2" />
              Iniciar Audiencia
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Formulario de Cierre */}
      {audienciaIniciada && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Conciliación */}
            <Card>
              <CardHeader>
                <CardTitle>Paso 2: Conciliación</CardTitle>
                <CardDescription>
                  Intentar conciliación entre las partes (Art. 365)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="huboConciliacion"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>¿Hubo acuerdo de conciliación?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => field.onChange(value === "true")}
                          value={field.value ? "true" : "false"}
                          className="flex gap-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="true" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer flex items-center gap-1">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              Sí, hay acuerdo
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="false" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer flex items-center gap-1">
                              <XCircle className="h-4 w-4 text-red-600" />
                              No hay acuerdo
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {huboConciliacion && (
                  <FormField
                    control={form.control}
                    name="acuerdoConciliacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción del Acuerdo de Conciliación *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Detallar los términos del acuerdo al que llegaron las partes..."
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          El proceso terminará y se emitirá sentencia homologatoria
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            {/* Objeto del Proceso y Pruebas (solo si no hubo conciliación) */}
            {!huboConciliacion && tipoAudiencia === "PRELIMINAR" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Paso 3: Objeto del Proceso</CardTitle>
                    <CardDescription>
                      Fijar el objeto del proceso y las cuestiones a resolver
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="objetoProceso"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Objeto del Proceso *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Establecer claramente las cuestiones que serán objeto de prueba y resolución..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Paso 4: Admisión de Pruebas</CardTitle>
                    <CardDescription>
                      Revisar y admitir/rechazar las pruebas ofrecidas por las partes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {(form.watch("pruebasAdmitidas") || []).map((prueba, index) => (
                        <div key={index} className="p-4 border rounded-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Prueba #{index + 1}</p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => eliminarPrueba(index)}
                            >
                              Eliminar
                            </Button>
                          </div>

                          <div className="grid gap-3">
                            <div>
                              <label className="text-sm font-medium">Tipo</label>
                              <select
                                className="w-full p-2 border rounded-md mt-1"
                                value={prueba.tipo}
                                onChange={(e) => {
                                  const pruebasActuales = form.getValues("pruebasAdmitidas") || [];
                                  pruebasActuales[index].tipo = e.target.value as any;
                                  form.setValue("pruebasAdmitidas", pruebasActuales);
                                }}
                              >
                                <option value="DOCUMENTAL">Documental</option>
                                <option value="TESTIMONIAL">Testimonial</option>
                                <option value="PERICIAL">Pericial</option>
                                <option value="INSPECCION">Inspección</option>
                              </select>
                            </div>

                            <div>
                              <label className="text-sm font-medium">Descripción</label>
                              <Textarea
                                className="mt-1"
                                placeholder="Descripción de la prueba..."
                                value={prueba.descripcion}
                                onChange={(e) => {
                                  const pruebasActuales = form.getValues("pruebasAdmitidas") || [];
                                  pruebasActuales[index].descripcion = e.target.value;
                                  form.setValue("pruebasAdmitidas", pruebasActuales);
                                }}
                              />
                            </div>

                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={prueba.admitida}
                                onCheckedChange={(checked) => {
                                  const pruebasActuales = form.getValues("pruebasAdmitidas") || [];
                                  pruebasActuales[index].admitida = checked as boolean;
                                  form.setValue("pruebasAdmitidas", pruebasActuales);
                                }}
                              />
                              <label className="text-sm font-medium">Admitir esta prueba</label>
                            </div>

                            {!prueba.admitida && (
                              <div>
                                <label className="text-sm font-medium">
                                  Fundamentación del Rechazo
                                </label>
                                <Textarea
                                  className="mt-1"
                                  placeholder="Motivo por el cual se rechaza esta prueba..."
                                  value={prueba.fundamentacion}
                                  onChange={(e) => {
                                    const pruebasActuales =
                                      form.getValues("pruebasAdmitidas") || [];
                                    pruebasActuales[index].fundamentacion = e.target.value;
                                    form.setValue("pruebasAdmitidas", pruebasActuales);
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button type="button" variant="outline" onClick={agregarPrueba}>
                      Agregar Prueba
                    </Button>
                  </CardContent>
                </Card>

                {/* Audiencia Complementaria */}
                <Card>
                  <CardHeader>
                    <CardTitle>Paso 5: Audiencia Complementaria (Opcional)</CardTitle>
                    <CardDescription>
                      Programar audiencia complementaria si es necesario practicar pruebas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="programarComplementaria"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Programar audiencia complementaria
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    {programarComplementaria && (
                      <>
                        <FormField
                          control={form.control}
                          name="fechaComplementaria"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fecha y Hora</FormLabel>
                              <FormControl>
                                <Input type="datetime-local" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="linkComplementaria"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Link de Google Meet (opcional)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {/* Botón de Cerrar */}
            <div className="flex gap-3">
              <Button type="submit" disabled={isLoading} size="lg" className="flex-1">
                <StopCircle className="h-4 w-4 mr-2" />
                {isLoading ? "Cerrando..." : "Cerrar Audiencia y Generar Acta"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
