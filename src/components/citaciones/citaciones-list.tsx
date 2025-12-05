"use client";

import { EstadoCitacion, TipoCitacion } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MarcarExitosaDialog } from "./marcar-exitosa-dialog";
import { RegistrarIntentoFallidoDialog } from "./registrar-intento-fallido-dialog";

interface Citacion {
  id: string;
  tipoCitacion: TipoCitacion;
  estado: EstadoCitacion;
  cedulaUrl: string | null;
  intentos: any;
  fechaCitacion: Date | null;
  evidenciaUrl: string | null;
  observaciones: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CitacionesListProps {
  citaciones: Citacion[];
  procesoId: string;
}

const TIPO_CITACION_LABELS: Record<TipoCitacion, string> = {
  [TipoCitacion.PERSONAL]: "Personal",
  [TipoCitacion.CEDULA]: "Por Cédula",
  [TipoCitacion.EDICTO]: "Por Edictos",
  [TipoCitacion.TACITA]: "Tácita",
};

const ESTADO_CITACION_CONFIG: Record<
  EstadoCitacion,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: any }
> = {
  [EstadoCitacion.PENDIENTE]: {
    label: "Pendiente",
    variant: "secondary",
    icon: Clock,
  },
  [EstadoCitacion.EN_PROCESO]: {
    label: "En Proceso",
    variant: "default",
    icon: Clock,
  },
  [EstadoCitacion.EXITOSA]: {
    label: "Exitosa",
    variant: "default",
    icon: CheckCircle,
  },
  [EstadoCitacion.FALLIDA]: {
    label: "Fallida",
    variant: "destructive",
    icon: XCircle,
  },
  [EstadoCitacion.TACITA]: {
    label: "Tácita",
    variant: "default",
    icon: CheckCircle,
  },
};

export function CitacionesList({ citaciones, procesoId }: CitacionesListProps) {
  if (citaciones.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay citaciones registradas
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {citaciones.map((citacion) => {
        const estadoConfig = ESTADO_CITACION_CONFIG[citacion.estado];
        const Icon = estadoConfig.icon;
        const intentosArray = Array.isArray(citacion.intentos) ? citacion.intentos : [];

        return (
          <Card key={citacion.id} className="p-4">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">
                      Citación {TIPO_CITACION_LABELS[citacion.tipoCitacion]}
                    </h3>
                    <Badge variant={estadoConfig.variant}>
                      <Icon className="h-3 w-3 mr-1" />
                      {estadoConfig.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Ordenada el{" "}
                    {format(new Date(citacion.createdAt), "dd 'de' MMMM 'de' yyyy", {
                      locale: es,
                    })}
                  </p>
                </div>

                {citacion.cedulaUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={citacion.cedulaUrl} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4 mr-2" />
                      Ver Cédula
                    </a>
                  </Button>
                )}
              </div>

              {/* Detalles según estado */}
              {citacion.estado === EstadoCitacion.EXITOSA && citacion.fechaCitacion && (
                <div className="rounded-lg border bg-green-50 dark:bg-green-950 p-3">
                  <div className="flex items-center gap-2 text-green-900 dark:text-green-100">
                    <CheckCircle className="h-4 w-4" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Citación Exitosa</p>
                      <p className="text-xs text-green-700 dark:text-green-300">
                        Fecha de citación:{" "}
                        {format(new Date(citacion.fechaCitacion), "dd/MM/yyyy HH:mm", {
                          locale: es,
                        })}
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                        Plazo para contestar: 30 días hábiles
                        {citacion.tipoCitacion === TipoCitacion.EDICTO &&
                          " (20 días para edictos)"}
                      </p>
                    </div>
                  </div>
                  {citacion.observaciones && (
                    <p className="text-sm text-green-800 dark:text-green-200 mt-2">
                      {citacion.observaciones}
                    </p>
                  )}
                </div>
              )}

              {/* Intentos fallidos */}
              {intentosArray.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <span>Intentos de Citación ({intentosArray.length})</span>
                  </div>
                  <div className="space-y-2">
                    {intentosArray.map((intento: any, index: number) => (
                      <div
                        key={index}
                        className="rounded-lg border bg-orange-50 dark:bg-orange-950 p-3 text-sm"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-orange-900 dark:text-orange-100">
                              Intento #{index + 1}
                            </p>
                            <p className="text-xs text-orange-700 dark:text-orange-300">
                              {intento.fecha} a las {intento.hora}
                            </p>
                          </div>
                        </div>
                        <p className="text-orange-800 dark:text-orange-200 mt-1">
                          Motivo: {intento.motivo}
                        </p>
                      </div>
                    ))}
                  </div>
                  {intentosArray.length >= 3 && citacion.estado !== EstadoCitacion.EXITOSA && (
                    <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 p-3">
                      <p className="text-sm text-red-900 dark:text-red-100">
                        <strong>Atención:</strong> Se han realizado 3 intentos fallidos. Se
                        recomienda proceder con citación por edictos.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Estado pendiente */}
              {citacion.estado === EstadoCitacion.PENDIENTE && (
                <div className="rounded-lg border bg-blue-50 dark:bg-blue-950 p-3">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    La citación ha sido ordenada y está pendiente de ejecución.
                  </p>
                </div>
              )}

              {/* Acciones */}
              {citacion.estado !== EstadoCitacion.EXITOSA &&
                citacion.estado !== EstadoCitacion.TACITA && (
                  <div className="flex gap-2 pt-2 border-t">
                    {citacion.tipoCitacion === TipoCitacion.PERSONAL ||
                    citacion.tipoCitacion === TipoCitacion.CEDULA ? (
                      <>
                        <RegistrarIntentoFallidoDialog
                          citacionId={citacion.id}
                          intentosActuales={intentosArray.length}
                        />
                        <MarcarExitosaDialog citacionId={citacion.id} />
                      </>
                    ) : null}

                    {citacion.tipoCitacion === TipoCitacion.EDICTO && (
                      <Button size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Registrar Publicación
                      </Button>
                    )}

                    {citacion.tipoCitacion === TipoCitacion.TACITA && (
                      <Button size="sm">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirmar Apersonamiento
                      </Button>
                    )}
                  </div>
                )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
