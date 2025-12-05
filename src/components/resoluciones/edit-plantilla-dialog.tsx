/**
 * Diálogo para editar plantilla de resolución existente
 */

"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TipoResolucion } from "@prisma/client";
import { PlantillaResolucionData } from "@/types/judicial";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface EditPlantillaDialogProps {
  plantilla: PlantillaResolucionData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const TIPO_LABELS: Record<TipoResolucion, string> = {
  PROVIDENCIA: "Providencia",
  AUTO_INTERLOCUTORIO: "Auto Interlocutorio",
  AUTO_DEFINITIVO: "Auto Definitivo",
};

export function EditPlantillaDialog({ plantilla, open, onOpenChange, onSuccess }: EditPlantillaDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tipo: plantilla.tipo,
    titulo: plantilla.titulo,
    vistos: plantilla.vistos || "",
    considerando: plantilla.considerando || "",
    porTanto: plantilla.porTanto,
    descripcion: plantilla.descripcion || "",
    compartida: plantilla.compartida,
  });

  useEffect(() => {
    setFormData({
      tipo: plantilla.tipo,
      titulo: plantilla.titulo,
      vistos: plantilla.vistos || "",
      considerando: plantilla.considerando || "",
      porTanto: plantilla.porTanto,
      descripcion: plantilla.descripcion || "",
      compartida: plantilla.compartida,
    });
  }, [plantilla]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const response = await fetch(`/api/plantillas-resolucion/${plantilla.id}`, {
        method: "PUT",
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
        toast.success("Plantilla actualizada exitosamente");
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(result.error || "Error al actualizar plantilla");
      }
    } catch (error) {
      console.error("Error al actualizar plantilla:", error);
      toast.error("Error al actualizar plantilla");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Plantilla de Resolución</DialogTitle>
          <DialogDescription>Modifica los campos de la plantilla</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Ej: Vistos los antecedentes del proceso {nurej}..."
              rows={4}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="considerando">Sección CONSIDERANDO (opcional)</Label>
            <Textarea
              id="considerando"
              value={formData.considerando}
              onChange={(e) => setFormData({ ...formData, considerando: e.target.value })}
              placeholder="Ej: Considerando que la demanda cumple con los requisitos..."
              rows={6}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="porTanto">Sección POR TANTO *</Label>
            <Textarea
              id="porTanto"
              value={formData.porTanto}
              onChange={(e) => setFormData({ ...formData, porTanto: e.target.value })}
              placeholder="Ej: Se admite la demanda presentada por {actor}..."
              rows={5}
              className="font-mono text-sm"
              required
            />
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

          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
            <p>
              <strong>Creada:</strong> {new Date(plantilla.createdAt).toLocaleDateString("es-BO")}
            </p>
            <p>
              <strong>Usos:</strong> {plantilla.usosCantidad} veces
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
