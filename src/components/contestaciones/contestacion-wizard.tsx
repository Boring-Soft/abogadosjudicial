"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Scale,
} from "lucide-react";
import { ContestacionNormalForm } from "./contestacion-normal-form";
import { AllanamientoForm } from "./allanamiento-form";
import { ExcepcionPreviaForm } from "./excepcion-previa-form";
import { ReconvencionForm } from "./reconvencion-form";

interface ContestacionWizardProps {
  procesoId: string;
}

export function ContestacionWizard({ procesoId }: ContestacionWizardProps) {
  const [activeTab, setActiveTab] = useState<string>("contestacion");

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Tipo de Respuesta</h2>
        <p className="text-muted-foreground">
          Seleccione cómo desea responder a la demanda
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="contestacion" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Contestar</span>
          </TabsTrigger>
          <TabsTrigger value="allanamiento" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Allanarse</span>
          </TabsTrigger>
          <TabsTrigger value="excepcion" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Excepciones</span>
          </TabsTrigger>
          <TabsTrigger value="reconvencion" className="flex items-center gap-2">
            <Scale className="h-4 w-4" />
            <span className="hidden sm:inline">Reconvención</span>
          </TabsTrigger>
        </TabsList>

        {/* Opción A: Contestación Normal */}
        <TabsContent value="contestacion" className="space-y-4">
          <div className="rounded-lg border bg-blue-50 dark:bg-blue-950 p-4 mb-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Opción A: Contestar la Demanda
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Responda a cada hecho de la demanda (admitiendo, negando o admitiendo
                  parcialmente), presente su fundamentación y ofrezca pruebas de descargo.
                </p>
              </div>
            </div>
          </div>
          <ContestacionNormalForm procesoId={procesoId} />
        </TabsContent>

        {/* Opción B: Allanamiento */}
        <TabsContent value="allanamiento" className="space-y-4">
          <div className="rounded-lg border bg-green-50 dark:bg-green-950 p-4 mb-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                  Opción B: Allanamiento
                </h3>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Acepte los términos de la demanda. El proceso terminará con sentencia
                  favorable al demandante. Puede solicitar exención de costas.
                </p>
              </div>
            </div>
          </div>
          <AllanamientoForm procesoId={procesoId} />
        </TabsContent>

        {/* Opción C: Excepciones Previas */}
        <TabsContent value="excepcion" className="space-y-4">
          <div className="rounded-lg border bg-orange-50 dark:bg-orange-950 p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-1">
                  Opción C: Excepciones Previas (Art. 370)
                </h3>
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  Plantee excepciones que impiden el análisis del fondo: incompetencia,
                  cosa juzgada, prescripción, etc. Deben resolverse antes de continuar.
                </p>
              </div>
            </div>
          </div>
          <ExcepcionPreviaForm procesoId={procesoId} />
        </TabsContent>

        {/* Opción D: Reconvención */}
        <TabsContent value="reconvencion" className="space-y-4">
          <div className="rounded-lg border bg-purple-50 dark:bg-purple-950 p-4 mb-4">
            <div className="flex items-start gap-3">
              <Scale className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">
                  Opción D: Contestación con Reconvención
                </h3>
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  Conteste la demanda Y presente una contrademanda. El actor tendrá 10
                  días para contestar su reconvención.
                </p>
              </div>
            </div>
          </div>
          <ReconvencionForm procesoId={procesoId} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
