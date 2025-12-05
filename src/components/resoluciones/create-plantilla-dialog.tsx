/**
 * Diálogo para crear nueva plantilla de resolución
 */

"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TipoResolucion } from "@prisma/client";
import { toast } from "sonner";
import { Loader2, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CreatePlantillaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const TIPO_LABELS: Record<TipoResolucion, string> = {
  PROVIDENCIA: "Providencia",
  AUTO_INTERLOCUTORIO: "Auto Interlocutorio",
  AUTO_DEFINITIVO: "Auto Definitivo",
};

const VARIABLES_DISPONIBLES = [
  { variable: "{actor}", descripcion: "Nombre completo del actor" },
  { variable: "{demandado}", descripcion: "Nombre completo del demandado" },
  { variable: "{nurej}", descripcion: "Número de referencia judicial" },
  { variable: "{fecha}", descripcion: "Fecha actual" },
  { variable: "{juzgado}", descripcion: "Nombre del juzgado" },
  { variable: "{juez}", descripcion: "Nombre completo del juez" },
  { variable: "{objeto}", descripcion: "Objeto del proceso" },
  { variable: "{cuantia}", descripcion: "Cuantía del proceso" },
];

export function CreatePlantillaDialog({ open, onOpenChange, onSuccess }: CreatePlantillaDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tipo: "" as TipoResolucion | "",
    titulo: "",
    vistos: "",
    considerando: "",
    porTanto: "",
    descripcion: "",
    compartida: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tipo) {
      toast.error("Selecciona un tipo de resolución");
      return;
    }

    if (!formData.titulo.trim()) {
      toast.error("El título es requerido");
      return;
    }

    if (!formData.porTanto.trim()) {
      toast.error("La sección Por Tanto es requerida");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/plantillas-resolucion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          vistos: formData.vistos.trim() || undefined,
          considerando: formData.considerando.trim() || undefined,
          descripcion: formData.descripcion.trim() || undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Plantilla creada exitosamente");
        setFormData({
          tipo: "" as TipoResolucion | "",
          titulo: "",
          vistos: "",
          considerando: "",
          porTanto: "",
          descripcion: "",
          compartida: false,
        });
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(result.error || "Error al crear plantilla");
      }
    } catch (error) {
      console.error("Error al crear plantilla:", error);
      toast.error("Error al crear plantilla");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Plantilla de Resolución</DialogTitle>
          <DialogDescription>
            Crea una plantilla reutilizable para agilizar la emisión de resoluciones
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Puedes usar variables dinámicas en tus plantillas. Ejemplo: <code className="bg-muted px-1 rounded">{"{actor}"}</code>
              {" "}será reemplazado por el nombre del actor al usar la plantilla.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Resolución *</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => setFormData({ ...formData, tipo: value as TipoResolucion })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TIPO_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="titulo">Título de la Plantilla *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Ej: Admisión de demanda estándar"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción (opcional)</Label>
            <Input
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Breve descripción de cuándo usar esta plantilla"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vistos">Sección VISTOS (opcional)</Label>
            <Textarea
              id="vistos"
              value={formData.vistos}
              onChange={(e) => setFormData({ ...formData, vistos: e.target.value })}
              placeholder="Ej: Vistos los antecedentes del proceso {nurej}, presentado por {actor} contra {demandado}..."
              rows={4}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">Requerido para Autos Interlocutorios y Definitivos</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="considerando">Sección CONSIDERANDO (opcional)</Label>
            <Textarea
              id="considerando"
              value={formData.considerando}
              onChange={(e) => setFormData({ ...formData, considerando: e.target.value })}
              placeholder="Ej: Considerando que la demanda cumple con los requisitos del Art. 110..."
              rows={6}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">Requerido para Autos Definitivos</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="porTanto">Sección POR TANTO *</Label>
            <Textarea
              id="porTanto"
              value={formData.porTanto}
              onChange={(e) => setFormData({ ...formData, porTanto: e.target.value })}
              placeholder="Ej: Se admite la demanda presentada por {actor}. Cítese al demandado {demandado}..."
              rows={5}
              className="font-mono text-sm"
              required
            />
            <p className="text-xs text-muted-foreground">Requerido para todos los tipos de resolución</p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="compartida"
              checked={formData.compartida}
              onCheckedChange={(checked) => setFormData({ ...formData, compartida: checked })}
            />
            <Label htmlFor="compartida" className="cursor-pointer">
              Compartir con otros jueces del juzgado
            </Label>
          </div>

          <details className="border rounded-lg p-4">
            <summary className="cursor-pointer font-semibold text-sm">
              Variables Disponibles
            </summary>
            <div className="mt-3 space-y-2">
              {VARIABLES_DISPONIBLES.map(({ variable, descripcion }) => (
                <div key={variable} className="flex items-start gap-2 text-sm">
                  <code className="bg-muted px-2 py-1 rounded text-xs font-mono">{variable}</code>
                  <span className="text-muted-foreground">{descripcion}</span>
                </div>
              ))}
            </div>
          </details>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear Plantilla
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
