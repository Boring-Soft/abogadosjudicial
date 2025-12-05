"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Video, MapPin, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

interface Audiencia {
  id: string;
  tipo: "PRELIMINAR" | "COMPLEMENTARIA";
  modalidad: "PRESENCIAL" | "VIRTUAL";
  estado: "PROGRAMADA" | "REALIZADA" | "SUSPENDIDA" | "CANCELADA";
  fechaHora: Date | string;
  linkGoogleMeet?: string | null;
  fechaInicio?: Date | string | null;
  fechaCierre?: Date | string | null;
  huboConciliacion?: boolean | null;
}

interface AudienciasListProps {
  audiencias: Audiencia[];
  procesoId: string;
}

export function AudienciasList({ audiencias, procesoId }: AudienciasListProps) {
  const getEstadoBadge = (estado: Audiencia["estado"]) => {
    switch (estado) {
      case "PROGRAMADA":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Clock className="h-3 w-3 mr-1" />
            Programada
          </Badge>
        );
      case "REALIZADA":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Realizada
          </Badge>
        );
      case "SUSPENDIDA":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Suspendida
          </Badge>
        );
      case "CANCELADA":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelada
          </Badge>
        );
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const getTipoBadge = (tipo: Audiencia["tipo"]) => {
    return tipo === "PRELIMINAR" ? (
      <Badge variant="secondary">Preliminar</Badge>
    ) : (
      <Badge variant="secondary">Complementaria</Badge>
    );
  };

  const getModalidadIcon = (modalidad: Audiencia["modalidad"]) => {
    return modalidad === "VIRTUAL" ? (
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Video className="h-4 w-4" />
        Virtual
      </div>
    ) : (
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" />
        Presencial
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {audiencias.map((audiencia) => (
        <div
          key={audiencia.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              {getTipoBadge(audiencia.tipo)}
              {getEstadoBadge(audiencia.estado)}
              {audiencia.huboConciliacion && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  Conciliación exitosa
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {new Date(audiencia.fechaHora).toLocaleString("es-BO", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </span>
              </div>
              {getModalidadIcon(audiencia.modalidad)}
            </div>
            {audiencia.linkGoogleMeet && audiencia.modalidad === "VIRTUAL" && (
              <div className="text-sm text-muted-foreground">
                <a
                  href={audiencia.linkGoogleMeet}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  <Video className="h-3 w-3" />
                  Unirse a Google Meet
                </a>
              </div>
            )}
            {audiencia.fechaInicio && audiencia.fechaCierre && (
              <p className="text-xs text-muted-foreground">
                Duración:{" "}
                {Math.round(
                  (new Date(audiencia.fechaCierre).getTime() -
                    new Date(audiencia.fechaInicio).getTime()) /
                    60000
                )}{" "}
                minutos
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {audiencia.estado === "PROGRAMADA" && (
              <Link href={`/dashboard/juez/audiencias/${audiencia.id}`}>
                <Button size="sm" variant="default">
                  Realizar Audiencia
                </Button>
              </Link>
            )}
            {audiencia.estado === "REALIZADA" && (
              <Link href={`/dashboard/procesos/${procesoId}/audiencias/${audiencia.id}`}>
                <Button size="sm" variant="outline">
                  Ver Acta
                </Button>
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
