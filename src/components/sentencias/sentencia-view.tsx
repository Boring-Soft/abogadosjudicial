/**
 * Componente de Vista de Sentencia
 * Muestra la sentencia emitida con información completa
 * Para JUEZ: Ver sentencia y acceso a emisión
 * Para ABOGADO: Ver sentencia, plazo de apelación y botón de apelar
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Scale,
  FileText,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Gavel,
  Loader2,
} from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/utils";
import { toast } from "sonner";

interface SentenciaViewProps {
  procesoId: string;
  isJuez: boolean;
}

export function SentenciaView({ procesoId, isJuez }: SentenciaViewProps) {
  const router = useRouter();
  const [sentencia, setSentencia] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [plazo, setPlazo] = useState<any>(null);

  useEffect(() => {
    cargarSentencia();
    if (!isJuez) {
      cargarPlazoApelacion();
    }
  }, [procesoId]);

  const cargarSentencia = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/sentencias?procesoId=${procesoId}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setSentencia(result.data);
        }
      }
    } catch (error) {
      console.error("Error al cargar sentencia:", error);
    } finally {
      setLoading(false);
    }
  };

  const cargarPlazoApelacion = async () => {
    try {
      const response = await fetch(`/api/plazos?procesoId=${procesoId}&tipo=APELACION`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data && result.data.length > 0) {
          setPlazo(result.data[0]);
        }
      }
    } catch (error) {
      console.error("Error al cargar plazo:", error);
    }
  };

  const calcularDiasRestantes = () => {
    if (!plazo || !plazo.fechaVencimiento) return 0;
    const hoy = new Date();
    const vencimiento = new Date(plazo.fechaVencimiento);
    const diferencia = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diferencia);
  };

  const handleEmitirSentencia = () => {
    router.push(`/dashboard/juez/procesos/${procesoId}/sentencia`);
  };

  const handleApelar = () => {
    toast.info("Módulo de apelación en desarrollo");
    // TODO: router.push(`/dashboard/procesos/${procesoId}/apelacion`);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!sentencia) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Scale className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No hay sentencia emitida</h3>
          <p className="text-muted-foreground text-center mb-4">
            {isJuez
              ? "Aún no se ha emitido sentencia para este proceso."
              : "El juez aún no ha emitido sentencia en este proceso."}
          </p>
          {isJuez && (
            <Button onClick={handleEmitirSentencia}>
              <Gavel className="mr-2 h-4 w-4" />
              Emitir Sentencia
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  const yaEmitida = !!sentencia.fechaNotificacion;
  const diasRestantes = calcularDiasRestantes();
  const puedeApelar = !isJuez && yaEmitida && diasRestantes > 0;

  const getDecisionBadge = () => {
    switch (sentencia.decision) {
      case "ADMITE":
        return (
          <Badge variant="default" className="bg-green-600">
            <CheckCircle className="mr-1 h-3 w-3" />
            Admite la Demanda
          </Badge>
        );
      case "RECHAZA":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Rechaza la Demanda
          </Badge>
        );
      case "ADMITE_PARCIALMENTE":
        return (
          <Badge variant="secondary">
            <AlertCircle className="mr-1 h-3 w-3" />
            Admite Parcialmente
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Información General */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Sentencia
              </CardTitle>
              <CardDescription className="mt-1">
                {yaEmitida
                  ? `Emitida el ${formatDate(sentencia.fechaEmision)}`
                  : "Borrador (no emitida)"}
              </CardDescription>
            </div>
            {getDecisionBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Fecha de Emisión:</span>
              <span className="font-medium">{formatDate(sentencia.fechaEmision)}</span>
            </div>
            {yaEmitida && (
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Hash SHA-256:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {sentencia.documentoHash?.substring(0, 16)}...
                </code>
              </div>
            )}
          </div>

          {/* Plazo de Apelación */}
          {!isJuez && yaEmitida && plazo && (
            <Alert className={diasRestantes > 0 ? "border-yellow-600" : "border-gray-400"}>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                {diasRestantes > 0 ? (
                  <>
                    Plazo de apelación: <strong>{diasRestantes} días hábiles restantes</strong>{" "}
                    (vence el {formatDate(plazo.fechaVencimiento)})
                  </>
                ) : (
                  <>Plazo de apelación vencido el {formatDate(plazo.fechaVencimiento)}</>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Botones de Acción */}
          <div className="flex gap-3 pt-2">
            {isJuez && !yaEmitida && (
              <Button onClick={handleEmitirSentencia} variant="default">
                <Gavel className="mr-2 h-4 w-4" />
                Completar y Emitir Sentencia
              </Button>
            )}
            {puedeApelar && (
              <Button onClick={handleApelar} variant="default">
                <AlertCircle className="mr-2 h-4 w-4" />
                Presentar Apelación
              </Button>
            )}
            {yaEmitida && (
              <Button variant="outline" disabled>
                <Download className="mr-2 h-4 w-4" />
                Descargar PDF (Próximamente)
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sección 2: Narrativa */}
      <Card>
        <CardHeader>
          <CardTitle>Sección 2: Narrativa (Resultandos)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Resumen de Demanda</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {sentencia.resumenDemanda || "No especificado"}
            </p>
          </div>
          <Separator />
          <div>
            <h4 className="font-semibold mb-2">Resumen de Contestación</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {sentencia.resumenContestacion || "No especificado"}
            </p>
          </div>
          <Separator />
          <div>
            <h4 className="font-semibold mb-2">Trámites del Proceso</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {sentencia.tramitesProceso || "No especificado"}
            </p>
          </div>
          <Separator />
          <div>
            <h4 className="font-semibold mb-2">Pruebas Presentadas</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {sentencia.pruebasPresentadas || "No especificado"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sección 3: Considerandos */}
      <Card>
        <CardHeader>
          <CardTitle>Sección 3: Considerandos (Motiva)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Análisis de Pruebas</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {sentencia.analisisPruebas || "No especificado"}
            </p>
          </div>
          <Separator />
          <div>
            <h4 className="font-semibold mb-2">Valoración de Pruebas (Art. 203-208)</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {sentencia.valoracionPruebas || "No especificado"}
            </p>
          </div>
          <Separator />
          <div>
            <h4 className="font-semibold mb-2">Aplicación del Derecho</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {sentencia.aplicacionDerecho || "No especificado"}
            </p>
          </div>
          <Separator />
          <div>
            <h4 className="font-semibold mb-2">Razonamiento Jurídico</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {sentencia.razonamientoJuridico || "No especificado"}
            </p>
          </div>
          {sentencia.jurisprudencia && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Jurisprudencia</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {sentencia.jurisprudencia}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Sección 4: Resolutiva */}
      <Card>
        <CardHeader>
          <CardTitle>Sección 4: Resolutiva (Por Tanto)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Decisión</h4>
            <div>{getDecisionBadge()}</div>
          </div>
          {sentencia.condena && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Condena</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {sentencia.condena}
                </p>
              </div>
            </>
          )}
          <Separator />
          <div>
            <h4 className="font-semibold mb-2">Costas</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {sentencia.costas || "No especificado"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
