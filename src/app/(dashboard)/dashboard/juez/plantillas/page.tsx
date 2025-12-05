/**
 * Página de Gestión de Plantillas de Resolución (JUEZ)
 * Ruta: /dashboard/juez/plantillas
 */

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, Share2, Lock, Pencil, Trash2 } from "lucide-react";
import { PlantillaResolucionData, TipoResolucion } from "@/types/judicial";
import { CreatePlantillaDialog } from "@/components/resoluciones/create-plantilla-dialog";
import { EditPlantillaDialog } from "@/components/resoluciones/edit-plantilla-dialog";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

const TIPO_LABELS: Record<TipoResolucion, string> = {
  PROVIDENCIA: "Providencia",
  AUTO_INTERLOCUTORIO: "Auto Interlocutorio",
  AUTO_DEFINITIVO: "Auto Definitivo",
};

export default function PlantillasPage() {
  const [plantillas, setPlantillas] = useState<PlantillaResolucionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTipo, setSelectedTipo] = useState<TipoResolucion | "TODAS">("TODAS");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingPlantilla, setEditingPlantilla] = useState<PlantillaResolucionData | null>(null);

  useEffect(() => {
    cargarPlantillas();
  }, [selectedTipo]);

  const cargarPlantillas = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedTipo !== "TODAS") {
        params.append("tipo", selectedTipo);
      }
      params.append("activa", "true");

      const response = await fetch(`/api/plantillas-resolucion?${params.toString()}`);

      if (!response.ok) {
        const error = await response.json();
        console.error("Error response:", error);
        toast.error(error.error || "Error al cargar plantillas");
        return;
      }

      const result = await response.json();
      console.log("Plantillas cargadas:", result);

      if (result.success) {
        setPlantillas(result.data || []);
      } else {
        // Si no hay success pero tampoco error, asumir array vacío
        setPlantillas([]);
      }
    } catch (error) {
      console.error("Error al cargar plantillas:", error);
      toast.error("Error al cargar plantillas");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar esta plantilla? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      const response = await fetch(`/api/plantillas-resolucion/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Plantilla eliminada exitosamente");
        cargarPlantillas();
      } else {
        toast.error(result.error || "Error al eliminar plantilla");
      }
    } catch (error) {
      console.error("Error al eliminar plantilla:", error);
      toast.error("Error al eliminar plantilla");
    }
  };

  const plantillasFiltered = plantillas.filter((p) => {
    if (selectedTipo === "TODAS") return true;
    return p.tipo === selectedTipo;
  });

  const plantillasPropias = plantillasFiltered.filter((p) => !p.compartida);
  const plantillasCompartidas = plantillasFiltered.filter((p) => p.compartida);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Plantillas de Resolución</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona tus plantillas para agilizar la emisión de resoluciones
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Plantilla
        </Button>
      </div>

      <Tabs defaultValue="TODAS" value={selectedTipo} onValueChange={(v) => setSelectedTipo(v as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="TODAS">Todas</TabsTrigger>
          <TabsTrigger value="PROVIDENCIA">Providencias</TabsTrigger>
          <TabsTrigger value="AUTO_INTERLOCUTORIO">Autos Interlocutorios</TabsTrigger>
          <TabsTrigger value="AUTO_DEFINITIVO">Autos Definitivos</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTipo} className="space-y-6 mt-6">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Cargando plantillas...</div>
          ) : (
            <>
              {plantillasPropias.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Mis Plantillas ({plantillasPropias.length})
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {plantillasPropias.map((plantilla) => (
                      <PlantillaCard
                        key={plantilla.id}
                        plantilla={plantilla}
                        onEdit={setEditingPlantilla}
                        onDelete={handleEliminar}
                      />
                    ))}
                  </div>
                </div>
              )}

              {plantillasCompartidas.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Plantillas Compartidas ({plantillasCompartidas.length})
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {plantillasCompartidas.map((plantilla) => (
                      <PlantillaCard
                        key={plantilla.id}
                        plantilla={plantilla}
                        onEdit={setEditingPlantilla}
                        onDelete={handleEliminar}
                        readOnly
                      />
                    ))}
                  </div>
                </div>
              )}

              {plantillasFiltered.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No hay plantillas</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      {selectedTipo === "TODAS"
                        ? "Aún no has creado ninguna plantilla."
                        : `No hay plantillas de tipo ${TIPO_LABELS[selectedTipo as TipoResolucion]}.`}
                    </p>
                    <Button onClick={() => setShowCreateDialog(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Crear Primera Plantilla
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      <CreatePlantillaDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={cargarPlantillas}
      />

      {editingPlantilla && (
        <EditPlantillaDialog
          plantilla={editingPlantilla}
          open={!!editingPlantilla}
          onOpenChange={(open) => !open && setEditingPlantilla(null)}
          onSuccess={cargarPlantillas}
        />
      )}
    </div>
  );
}

interface PlantillaCardProps {
  plantilla: PlantillaResolucionData;
  onEdit: (plantilla: PlantillaResolucionData) => void;
  onDelete: (id: string) => void;
  readOnly?: boolean;
}

function PlantillaCard({ plantilla, onEdit, onDelete, readOnly }: PlantillaCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{plantilla.titulo}</CardTitle>
            <CardDescription className="mt-1">{plantilla.descripcion || "Sin descripción"}</CardDescription>
          </div>
          <Badge variant={plantilla.compartida ? "default" : "secondary"}>
            {plantilla.compartida ? (
              <Share2 className="h-3 w-3 mr-1" />
            ) : (
              <Lock className="h-3 w-3 mr-1" />
            )}
            {plantilla.compartida ? "Compartida" : "Privada"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tipo:</span>
            <Badge variant="outline">{TIPO_LABELS[plantilla.tipo]}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Usos:</span>
            <span className="font-semibold">{plantilla.usosCantidad}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Creada:</span>
            <span className="font-medium">{formatDate(plantilla.createdAt)}</span>
          </div>
        </div>

        {!readOnly && (
          <div className="flex gap-2 pt-2 border-t">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(plantilla)}>
              <Pencil className="h-4 w-4 mr-1" />
              Editar
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={() => onDelete(plantilla.id)}>
              <Trash2 className="h-4 w-4 mr-1" />
              Eliminar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
