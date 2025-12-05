/**
 * Componente para mostrar lista de resoluciones en el expediente
 * Vista compartida para JUEZ y ABOGADO
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ResolucionData, TipoResolucion } from "@/types/judicial";
import { formatDateTime, formatDate } from "@/lib/utils";
import { FileText, Download, Eye, Calendar, Hash, User, Plus, Gavel } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ResolucionesListProps {
  procesoId: string;
  isJuez?: boolean;
}

const TIPO_LABELS: Record<TipoResolucion, string> = {
  PROVIDENCIA: "Providencia",
  AUTO_INTERLOCUTORIO: "Auto Interlocutorio",
  AUTO_DEFINITIVO: "Auto Definitivo",
};

const TIPO_COLORS: Record<TipoResolucion, "default" | "secondary" | "destructive" | "outline"> = {
  PROVIDENCIA: "secondary",
  AUTO_INTERLOCUTORIO: "default",
  AUTO_DEFINITIVO: "destructive",
};

export function ResolucionesList({ procesoId, isJuez = false }: ResolucionesListProps) {
  const router = useRouter();
  const [resoluciones, setResoluciones] = useState<ResolucionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResolucion, setSelectedResolucion] = useState<ResolucionData | null>(null);

  useEffect(() => {
    cargarResoluciones();
  }, [procesoId]);

  const cargarResoluciones = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/resoluciones?procesoId=${procesoId}`);
      const result = await response.json();

      if (result.success) {
        setResoluciones(result.data);
      } else {
        toast.error(result.error || "Error al cargar resoluciones");
      }
    } catch (error) {
      console.error("Error al cargar resoluciones:", error);
      toast.error("Error al cargar resoluciones");
    } finally {
      setLoading(false);
    }
  };

  const handleDescargar = (resolucionId: string) => {
    // TODO: Implementar descarga de PDF cuando esté disponible
    toast.info("Funcionalidad de descarga de PDF en desarrollo");
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Cargando resoluciones...
      </div>
    );
  }

  if (resoluciones.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Gavel className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No hay resoluciones</h3>
          <p className="text-muted-foreground text-center mb-4">
            {isJuez
              ? "Aún no has emitido ninguna resolución en este proceso."
              : "El juez aún no ha emitido ninguna resolución en este proceso."}
          </p>
          {isJuez && (
            <Button onClick={() => router.push(`/dashboard/juez/procesos/${procesoId}/resolucion`)}>
              <Plus className="mr-2 h-4 w-4" />
              Emitir Primera Resolución
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Resoluciones Emitidas</h3>
          <p className="text-sm text-muted-foreground">
            Total: {resoluciones.length} resolución{resoluciones.length !== 1 ? "es" : ""}
          </p>
        </div>
        {isJuez && (
          <Button onClick={() => router.push(`/dashboard/juez/procesos/${procesoId}/resolucion`)}>
            <Plus className="mr-2 h-4 w-4" />
            Emitir Nueva Resolución
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {resoluciones.map((resolucion, index) => (
          <Card key={resolucion.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={TIPO_COLORS[resolucion.tipo]}>
                      {TIPO_LABELS[resolucion.tipo]}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      #{resoluciones.length - index}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{resolucion.titulo}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedResolucion(resolucion)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDescargar(resolucion.id)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Emitida:</span>
                  <span className="font-medium">{formatDateTime(resolucion.fechaEmision)}</span>
                </div>
                {resolucion.fechaNotificacion && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Notificada:</span>
                    <span className="font-medium">{formatDateTime(resolucion.fechaNotificacion)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Hash:</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                    {resolucion.documentoHash.substring(0, 16)}...
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedResolucion && (
        <ResolucionDetailDialog
          resolucion={selectedResolucion}
          open={!!selectedResolucion}
          onOpenChange={(open) => !open && setSelectedResolucion(null)}
        />
      )}
    </div>
  );
}

interface ResolucionDetailDialogProps {
  resolucion: ResolucionData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ResolucionDetailDialog({ resolucion, open, onOpenChange }: ResolucionDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="space-y-2">
            <Badge variant={TIPO_COLORS[resolucion.tipo]}>
              {TIPO_LABELS[resolucion.tipo]}
            </Badge>
            <DialogTitle className="text-2xl">{resolucion.titulo}</DialogTitle>
            <DialogDescription>
              Emitida el {formatDateTime(resolucion.fechaEmision)}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {resolucion.vistos && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">VISTOS</h3>
              <Separator />
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap font-serif">{resolucion.vistos}</p>
              </div>
            </div>
          )}

          {resolucion.considerando && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">CONSIDERANDO</h3>
              <Separator />
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap font-serif">{resolucion.considerando}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">POR TANTO</h3>
            <Separator />
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap font-serif">{resolucion.porTanto}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Fecha de Emisión:</strong> {formatDateTime(resolucion.fechaEmision)}
            </p>
            {resolucion.fechaNotificacion && (
              <p>
                <strong>Fecha de Notificación:</strong> {formatDateTime(resolucion.fechaNotificacion)}
              </p>
            )}
            <p>
              <strong>Hash SHA-256:</strong>{" "}
              <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                {resolucion.documentoHash}
              </code>
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          <Button onClick={() => toast.info("Funcionalidad de descarga en desarrollo")}>
            <Download className="h-4 w-4 mr-2" />
            Descargar PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
