/**
 * Editor de Resolución con secciones
 * Componente simplificado para el MVP (sin rich text editor complejo)
 */

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TipoResolucion } from "@prisma/client";
import { PlantillaResolucionData } from "@/types/judicial";
import { procesarVariablesPlantilla } from "@/lib/validations/resolucion";
import { FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface ResolucionEditorProps {
  procesoData?: {
    nurej: string;
    actorNombre: string;
    demandadoNombre: string;
    juzgadoNombre: string;
    juezNombre: string;
    objeto: string;
    cuantia: number | null;
  };
  value: {
    tipo: TipoResolucion | "";
    titulo: string;
    vistos: string;
    considerando: string;
    porTanto: string;
  };
  onChange: (value: {
    tipo: TipoResolucion | "";
    titulo: string;
    vistos: string;
    considerando: string;
    porTanto: string;
  }) => void;
}

const TIPO_LABELS: Record<TipoResolucion, string> = {
  PROVIDENCIA: "Providencia",
  AUTO_INTERLOCUTORIO: "Auto Interlocutorio",
  AUTO_DEFINITIVO: "Auto Definitivo",
};

const TIPO_DESCRIPTIONS: Record<TipoResolucion, string> = {
  PROVIDENCIA: "Resolución breve para trámites simples. Solo requiere sección Por Tanto.",
  AUTO_INTERLOCUTORIO: "Resolución para decisiones procesales. Requiere Vistos y Por Tanto.",
  AUTO_DEFINITIVO: "Resolución completa que decide cuestiones importantes. Requiere Vistos, Considerando y Por Tanto.",
};

export function ResolucionEditor({ procesoData, value, onChange }: ResolucionEditorProps) {
  const [plantillasDisponibles, setPlantillasDisponibles] = useState<PlantillaResolucionData[]>([]);
  const [loadingPlantillas, setLoadingPlantillas] = useState(false);

  useEffect(() => {
    if (value.tipo) {
      cargarPlantillas(value.tipo);
    }
  }, [value.tipo]);

  const cargarPlantillas = async (tipo: TipoResolucion) => {
    try {
      setLoadingPlantillas(true);
      const response = await fetch(`/api/plantillas-resolucion?tipo=${tipo}&activa=true`);
      const result = await response.json();

      if (result.success) {
        setPlantillasDisponibles(result.data);
      }
    } catch (error) {
      console.error("Error al cargar plantillas:", error);
    } finally {
      setLoadingPlantillas(false);
    }
  };

  const aplicarPlantilla = async (plantillaId: string) => {
    const plantilla = plantillasDisponibles.find((p) => p.id === plantillaId);
    if (!plantilla) return;

    // Preparar variables para reemplazo
    const variables = {
      actor: procesoData?.actorNombre || "",
      demandado: procesoData?.demandadoNombre || "",
      nurej: procesoData?.nurej || "",
      fecha: new Date().toLocaleDateString("es-BO", { year: "numeric", month: "long", day: "numeric" }),
      juzgado: procesoData?.juzgadoNombre || "",
      juez: procesoData?.juezNombre || "",
      objeto: procesoData?.objeto || "",
      cuantia: procesoData?.cuantia ? `Bs ${procesoData.cuantia.toLocaleString()}` : "",
    };

    // Aplicar plantilla con reemplazo de variables
    onChange({
      ...value,
      titulo: procesarVariablesPlantilla(plantilla.titulo, variables),
      vistos: procesarVariablesPlantilla(plantilla.vistos || "", variables),
      considerando: procesarVariablesPlantilla(plantilla.considerando || "", variables),
      porTanto: procesarVariablesPlantilla(plantilla.porTanto, variables),
    });

    // Incrementar contador de usos
    try {
      await fetch(`/api/plantillas-resolucion/${plantillaId}`, {
        method: "PATCH",
      });
    } catch (error) {
      console.error("Error al actualizar contador de usos:", error);
    }

    toast.success("Plantilla aplicada exitosamente");
  };

  const insertarVariable = (variable: string, campo: "titulo" | "vistos" | "considerando" | "porTanto") => {
    const textarea = document.getElementById(campo) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = value[campo];
    const newText = text.substring(0, start) + variable + text.substring(end);

    onChange({ ...value, [campo]: newText });

    // Mantener el foco y posición del cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + variable.length, start + variable.length);
    }, 0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tipo de Resolución</CardTitle>
          <CardDescription>Selecciona el tipo de resolución a emitir</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo *</Label>
            <Select
              value={value.tipo}
              onValueChange={(val) => onChange({ ...value, tipo: val as TipoResolucion })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TIPO_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex flex-col items-start">
                      <span className="font-semibold">{label}</span>
                      <span className="text-xs text-muted-foreground">
                        {TIPO_DESCRIPTIONS[key as TipoResolucion]}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {value.tipo && plantillasDisponibles.length > 0 && (
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <Label className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Plantillas Disponibles ({plantillasDisponibles.length})
              </Label>
              <div className="grid gap-2">
                {plantillasDisponibles.slice(0, 5).map((plantilla) => (
                  <Button
                    key={plantilla.id}
                    variant="outline"
                    size="sm"
                    className="justify-start"
                    onClick={() => aplicarPlantilla(plantilla.id)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {plantilla.titulo}
                    {plantilla.compartida && (
                      <Badge variant="secondary" className="ml-auto">
                        Compartida
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Título de la Resolución</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            id="titulo"
            value={value.titulo}
            onChange={(e) => onChange({ ...value, titulo: e.target.value })}
            placeholder="Ej: Decreto de Admisión de Demanda"
            className="text-lg font-semibold"
          />
        </CardContent>
      </Card>

      {value.tipo && ["AUTO_INTERLOCUTORIO", "AUTO_DEFINITIVO"].includes(value.tipo) && (
        <Card>
          <CardHeader>
            <CardTitle>VISTOS</CardTitle>
            <CardDescription>Antecedentes y exposición de hechos del proceso</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              id="vistos"
              value={value.vistos}
              onChange={(e) => onChange({ ...value, vistos: e.target.value })}
              placeholder="Ej: Vistos los antecedentes del proceso, la demanda presentada el..."
              rows={6}
              className="font-serif"
            />
          </CardContent>
        </Card>
      )}

      {value.tipo === "AUTO_DEFINITIVO" && (
        <Card>
          <CardHeader>
            <CardTitle>CONSIDERANDO</CardTitle>
            <CardDescription>Fundamentación legal y razonamiento jurídico</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              id="considerando"
              value={value.considerando}
              onChange={(e) => onChange({ ...value, considerando: e.target.value })}
              placeholder="Ej: Considerando que de acuerdo al Art. 110 del Código Procesal Civil..."
              rows={10}
              className="font-serif"
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>POR TANTO</CardTitle>
          <CardDescription>Parte resolutiva - Decisión del juez (Requerido)</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            id="porTanto"
            value={value.porTanto}
            onChange={(e) => onChange({ ...value, porTanto: e.target.value })}
            placeholder="Ej: Se admite la presente demanda. Cítese al demandado conforme a derecho..."
            rows={8}
            className="font-serif"
          />
        </CardContent>
      </Card>
    </div>
  );
}
