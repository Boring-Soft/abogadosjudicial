"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Loader2, ChevronLeft, ChevronRight, Check, FileText } from "lucide-react";
import { createDemandaSchema } from "@/lib/validations/demanda";
import type { ProcesoWithRelations } from "@/types/judicial";

type DemandaWizardValues = z.infer<typeof createDemandaSchema>;

const STEPS = [
  { id: 1, name: "Designación del Juez", icon: FileText },
  { id: 2, name: "Datos de las Partes", icon: FileText },
  { id: 3, name: "Objeto, Hechos y Derecho", icon: FileText },
  { id: 4, name: "Petitorio, Valor y Prueba", icon: FileText },
  { id: 5, name: "Revisión y Envío", icon: Check },
];

interface DemandaWizardProps {
  proceso: ProcesoWithRelations;
  isCorreccion?: boolean;
}

export function DemandaWizard({ proceso, isCorreccion = false }: DemandaWizardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DemandaWizardValues>({
    resolver: zodResolver(createDemandaSchema),
    defaultValues: {
      procesoId: proceso.id,
      designacionJuez: isCorreccion && proceso.demanda
        ? proceso.demanda.designacionJuez
        : `Señor Juez del ${proceso.juzgado.nombre}, ${proceso.juzgado.ciudad}, ${proceso.juzgado.departamento}`,
      objeto: isCorreccion && proceso.demanda ? proceso.demanda.objeto : "",
      hechos: isCorreccion && proceso.demanda ? proceso.demanda.hechos : "",
      derecho: isCorreccion && proceso.demanda ? proceso.demanda.derecho : "",
      petitorio: isCorreccion && proceso.demanda ? proceso.demanda.petitorio : "",
      valorDemanda: isCorreccion && proceso.demanda
        ? proceso.demanda.valorDemanda
        : proceso.cuantia || 0,
      pruebaOfrecida: isCorreccion && proceso.demanda
        ? proceso.demanda.pruebaOfrecida
        : "",
    },
  });

  const nextStep = async () => {
    const fields = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fields);

    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number): (keyof DemandaWizardValues)[] => {
    switch (step) {
      case 1:
        return ["designacionJuez"];
      case 2:
        return []; // Datos pre-cargados
      case 3:
        return ["objeto", "hechos", "derecho"];
      case 4:
        return ["petitorio", "valorDemanda", "pruebaOfrecida"];
      case 5:
        return [];
      default:
        return [];
    }
  };

  const onSubmit = async (data: DemandaWizardValues) => {
    try {
      setIsSubmitting(true);

      const url = isCorreccion && proceso.demanda
        ? `/api/demandas/${proceso.demanda.id}`
        : "/api/demandas";
      const method = isCorreccion ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: isCorreccion ? "Demanda corregida" : "Demanda presentada",
          description: isCorreccion
            ? "La demanda ha sido corregida y re-presentada exitosamente"
            : "La demanda ha sido presentada exitosamente y está pendiente de admisión",
        });
        router.push(`/dashboard/procesos/${proceso.id}`);
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: result.error || (isCorreccion ? "No se pudo corregir la demanda" : "No se pudo presentar la demanda"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting demanda:", error);
      toast({
        title: "Error",
        description: isCorreccion
          ? "Ocurrió un error al corregir la demanda"
          : "Ocurrió un error al presentar la demanda",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1DesignacionJuez form={form} proceso={proceso} />;
      case 2:
        return <Step2DatosPartes form={form} proceso={proceso} />;
      case 3:
        return <Step3ObjetoHechosDerecho form={form} />;
      case 4:
        return <Step4PetitorioValorPrueba form={form} />;
      case 5:
        return <Step5Revision form={form} proceso={proceso} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="flex justify-between items-center">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-gray-300 text-gray-500"
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={`text-xs mt-1 ${
                  currentStep >= step.id ? "text-primary font-medium" : "text-gray-500"
                }`}
              >
                {step.name}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-12 mx-2 ${
                  currentStep > step.id ? "bg-primary" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1 || isSubmitting}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            {currentStep < STEPS.length ? (
              <Button type="button" onClick={nextStep} disabled={isSubmitting}>
                Siguiente
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isCorreccion ? "Re-presentar Demanda Corregida" : "Presentar Demanda"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}

/* ============ STEP COMPONENTS ============ */

function Step1DesignacionJuez({
  form,
  proceso,
}: {
  form: any;
  proceso: ProcesoWithRelations;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paso 1: Designación del Juez</CardTitle>
        <CardDescription>
          Especifique la designación completa del juez al que se dirige la demanda (Art. 110.1)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="designacionJuez"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Designación del Juez *</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={3}
                  placeholder="Señor Juez del Juzgado..."
                  className="resize-none"
                />
              </FormControl>
              <FormDescription>
                Juzgado: {proceso.juzgado.nombre}, {proceso.juzgado.ciudad},{" "}
                {proceso.juzgado.departamento}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}

function Step2DatosPartes({
  form,
  proceso,
}: {
  form: any;
  proceso: ProcesoWithRelations;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paso 2: Datos de las Partes</CardTitle>
        <CardDescription>
          Verifique los datos del actor (demandante) y del demandado (Art. 110.2)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3">ACTOR (Demandante)</h3>
          <div className="bg-muted p-4 rounded-md space-y-2">
            <p>
              <span className="font-medium">Nombre:</span> {proceso.clienteActor.nombres}{" "}
              {proceso.clienteActor.apellidos}
            </p>
            <p>
              <span className="font-medium">CI:</span> {proceso.clienteActor.ci}
            </p>
            <p>
              <span className="font-medium">Domicilio Real:</span>{" "}
              {proceso.clienteActor.domicilioReal}
            </p>
            <p>
              <span className="font-medium">Domicilio Procesal:</span>{" "}
              {proceso.clienteActor.domicilioProcesal}
            </p>
            <p>
              <span className="font-medium">Abogado:</span> {proceso.abogadoActor.firstName}{" "}
              {proceso.abogadoActor.lastName}
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">DEMANDADO</h3>
          <div className="bg-muted p-4 rounded-md space-y-2">
            <p>
              <span className="font-medium">Nombre:</span> {proceso.demandadoNombres}{" "}
              {proceso.demandadoApellidos}
            </p>
            <p>
              <span className="font-medium">CI:</span> {proceso.demandadoCI}
            </p>
            <p>
              <span className="font-medium">Domicilio Real:</span>{" "}
              {proceso.demandadoDomicilioReal || "No especificado"}
            </p>
            <p>
              <span className="font-medium">Domicilio Procesal:</span>{" "}
              {proceso.demandadoDomicilioProcesal || "No especificado"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Step3ObjetoHechosDerecho({ form }: { form: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paso 3: Objeto, Hechos y Derecho</CardTitle>
        <CardDescription>
          Describa el objeto de la demanda, los hechos que la fundamentan y el derecho aplicable
          (Art. 110.3, 110.4, 110.5)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="objeto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Objeto de la Demanda *</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={4}
                  placeholder="Describa el objeto de la pretensión (mínimo 50 caracteres)..."
                  className="resize-none"
                />
              </FormControl>
              <FormDescription>Mínimo 50 caracteres, máximo 2000</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hechos"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hechos *</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={8}
                  placeholder="Narre los hechos que fundamentan la demanda (mínimo 100 caracteres)..."
                  className="resize-none"
                />
              </FormControl>
              <FormDescription>Mínimo 100 caracteres, máximo 10000</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="derecho"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fundamento de Derecho *</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={6}
                  placeholder="Cite las normas legales y fundamentos jurídicos (mínimo 50 caracteres)..."
                  className="resize-none"
                />
              </FormControl>
              <FormDescription>Mínimo 50 caracteres, máximo 5000</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}

function Step4PetitorioValorPrueba({ form }: { form: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paso 4: Petitorio, Valor y Prueba</CardTitle>
        <CardDescription>
          Especifique el petitorio, el valor de la demanda y la prueba que ofrece (Art. 110.6,
          110.7, 110.8)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="petitorio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Petitorio *</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={6}
                  placeholder="Especifique claramente lo que solicita al juzgado (mínimo 30 caracteres)..."
                  className="resize-none"
                />
              </FormControl>
              <FormDescription>Mínimo 30 caracteres, máximo 2000</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="valorDemanda"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor de la Demanda (Bs.) *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="0.00"
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormDescription>Especifique la cuantía en Bolivianos</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pruebaOfrecida"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prueba Ofrecida *</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={6}
                  placeholder="Liste las pruebas documentales, testimoniales, periciales, etc. (mínimo 30 caracteres)..."
                  className="resize-none"
                />
              </FormControl>
              <FormDescription>Mínimo 30 caracteres, máximo 5000</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}

function Step5Revision({
  form,
  proceso,
}: {
  form: any;
  proceso: ProcesoWithRelations;
}) {
  const values = form.getValues();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paso 5: Revisión y Envío</CardTitle>
        <CardDescription>
          Revise todos los datos antes de presentar la demanda. Una vez presentada, se notificará
          al juzgado.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Designación del Juez</h4>
            <p className="text-sm text-muted-foreground">{values.designacionJuez}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Partes</h4>
            <p className="text-sm">
              <span className="font-medium">Actor:</span> {proceso.clienteActor.nombres}{" "}
              {proceso.clienteActor.apellidos}
            </p>
            <p className="text-sm">
              <span className="font-medium">Demandado:</span> {proceso.demandadoNombres}{" "}
              {proceso.demandadoApellidos}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Objeto</h4>
            <p className="text-sm text-muted-foreground line-clamp-3">{values.objeto}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Petitorio</h4>
            <p className="text-sm text-muted-foreground line-clamp-3">{values.petitorio}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Valor de la Demanda</h4>
            <p className="text-sm">
              Bs. {values.valorDemanda?.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">Importante:</span> Una vez presentada la demanda, el
            proceso cambiará a estado <span className="font-mono">PRESENTADO</span> y se notificará
            al juez asignado para su admisión.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
