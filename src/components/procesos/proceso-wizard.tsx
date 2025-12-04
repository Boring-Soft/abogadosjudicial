"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TipoProceso, MateriaProceso } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ChevronLeft, ChevronRight, Check } from "lucide-react";
import type { JuzgadoData, ClienteData } from "@/types/judicial";

const procesoWizardSchema = z.object({
  // Paso 1: Tipo de proceso
  tipoProceso: z.nativeEnum(TipoProceso),
  // Paso 2: Materia
  materia: z.nativeEnum(MateriaProceso),
  // Paso 3: Juzgado
  juzgadoId: z.string().min(1, "Debe seleccionar un juzgado"),
  // Paso 4: Cuantía
  cuantia: z.string().optional(),
  // Paso 5: Partes
  clienteActorId: z.string().min(1, "Debe seleccionar un cliente"),
  demandadoNombres: z.string().min(2, "Nombres del demandado requeridos").optional(),
  demandadoApellidos: z.string().min(2, "Apellidos del demandado requeridos").optional(),
  demandadoCI: z.string().min(5, "CI del demandado requerido").optional(),
});

type ProcesoWizardValues = z.infer<typeof procesoWizardSchema>;

const STEPS = [
  { id: 1, name: "Tipo de Proceso" },
  { id: 2, name: "Materia" },
  { id: 3, name: "Juzgado" },
  { id: 4, name: "Cuantía" },
  { id: 5, name: "Partes" },
];

export function ProcesoWizard() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [juzgados, setJuzgados] = useState<JuzgadoData[]>([]);
  const [clientes, setClientes] = useState<ClienteData[]>([]);

  const form = useForm<ProcesoWizardValues>({
    resolver: zodResolver(procesoWizardSchema),
    defaultValues: {
      tipoProceso: undefined,
      materia: undefined,
      juzgadoId: "",
      cuantia: "",
      clienteActorId: "",
      demandadoNombres: "",
      demandadoApellidos: "",
      demandadoCI: "",
    },
  });

  // Fetch juzgados and clientes
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch juzgados
        const juzgadosRes = await fetch("/api/juzgados");
        if (juzgadosRes.ok) {
          const data = await juzgadosRes.json();
          setJuzgados(data.juzgados);
        }

        // Fetch active clientes
        const clientesRes = await fetch("/api/clientes?activo=true&pageSize=1000");
        if (clientesRes.ok) {
          const data = await clientesRes.json();
          setClientes(data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  async function onSubmit(data: ProcesoWizardValues) {
    setIsLoading(true);

    try {
      const payload = {
        ...data,
        cuantia: data.cuantia ? parseFloat(data.cuantia) : null,
      };

      const response = await fetch("/api/procesos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al crear proceso");
      }

      const result = await response.json();

      toast({
        title: "Proceso creado",
        description: `Proceso ${result.proceso.nurej} creado exitosamente`,
      });

      router.push("/dashboard/procesos");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el proceso",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function nextStep() {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    currentStep > step.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : currentStep === step.id
                      ? "border-primary text-primary"
                      : "border-muted-foreground/25 text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                <span className="mt-2 text-xs font-medium">{step.name}</span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`mx-4 h-0.5 w-12 ${
                    currentStep > step.id
                      ? "bg-primary"
                      : "bg-muted-foreground/25"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Form Steps */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="p-6">
            <div className="space-y-6">
              {/* Step 1: Tipo de Proceso */}
              {currentStep === 1 && (
                <FormField
                  control={form.control}
                  name="tipoProceso"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Proceso *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione el tipo de proceso" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={TipoProceso.ORDINARIO}>
                            Ordinario
                          </SelectItem>
                          <SelectItem value={TipoProceso.EXTRAORDINARIO}>
                            Extraordinario
                          </SelectItem>
                          <SelectItem value={TipoProceso.MONITORIO}>
                            Monitorio
                          </SelectItem>
                          <SelectItem value={TipoProceso.CAUTELAR}>
                            Cautelar
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Seleccione el tipo de proceso judicial
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Step 2: Materia */}
              {currentStep === 2 && (
                <FormField
                  control={form.control}
                  name="materia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Materia *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione la materia" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={MateriaProceso.CIVIL}>
                            Civil
                          </SelectItem>
                          <SelectItem value={MateriaProceso.FAMILIAR}>
                            Familiar
                          </SelectItem>
                          <SelectItem value={MateriaProceso.COMERCIAL}>
                            Comercial
                          </SelectItem>
                          <SelectItem value={MateriaProceso.LABORAL}>
                            Laboral
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Seleccione la materia del proceso
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Step 3: Juzgado */}
              {currentStep === 3 && (
                <FormField
                  control={form.control}
                  name="juzgadoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Juzgado *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione el juzgado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {juzgados.map((juzgado) => (
                            <SelectItem key={juzgado.id} value={juzgado.id}>
                              {juzgado.nombre} - {juzgado.ciudad},{" "}
                              {juzgado.departamento}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Seleccione el juzgado donde se presentará el proceso
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Step 4: Cuantía */}
              {currentStep === 4 && (
                <FormField
                  control={form.control}
                  name="cuantia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cuantía (Bs)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="10000.00"
                          step="0.01"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Ingrese la cuantía del proceso en bolivianos (opcional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Step 5: Partes */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Parte Actora (Cliente)
                    </h3>
                    <FormField
                      control={form.control}
                      name="clienteActorId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cliente *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione el cliente" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {clientes.map((cliente) => (
                                <SelectItem key={cliente.id} value={cliente.id}>
                                  {cliente.nombres} {cliente.apellidos} (CI:{" "}
                                  {cliente.ci})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Seleccione el cliente que será la parte actora
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Parte Demandada
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="demandadoNombres"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombres</FormLabel>
                            <FormControl>
                              <Input placeholder="Juan Carlos" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="demandadoApellidos"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Apellidos</FormLabel>
                            <FormControl>
                              <Input placeholder="Pérez García" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="demandadoCI"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CI</FormLabel>
                            <FormControl>
                              <Input placeholder="1234567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1 || isLoading}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Anterior
              </Button>

              {currentStep < STEPS.length ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={isLoading}
                >
                  Siguiente
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Crear Proceso
                </Button>
              )}
            </div>
          </Card>
        </form>
      </Form>
    </div>
  );
}
