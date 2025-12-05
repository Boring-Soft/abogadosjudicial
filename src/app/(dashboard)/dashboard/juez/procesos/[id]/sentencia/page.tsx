/**
 * Página de Emisión de Sentencia (JUEZ) - Versión Simplificada
 * Ruta: /dashboard/juez/procesos/[id]/sentencia
 */

"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Save, Send, Loader2, AlertCircle, Scale } from "lucide-react";
import { ProcesoWithRelations } from "@/types/judicial";
import { toast } from "sonner";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EmitirSentenciaPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [proceso, setProceso] = useState<ProcesoWithRelations | null>(null);
  const [sentenciaExistente, setSentenciaExistente] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [emitting, setEmitting] = useState(false);

  const [formData, setFormData] = useState({
    // Narrativa
    resumenDemanda: "",
    resumenContestacion: "",
    tramitesProceso: "",
    pruebasPresentadas: "",
    // Considerandos
    analisisPruebas: "",
    valoracionPruebas: "",
    aplicacionDerecho: "",
    razonamientoJuridico: "",
    jurisprudencia: "",
    // Resolutiva
    decision: "ADMITE" as "ADMITE" | "RECHAZA" | "ADMITE_PARCIALMENTE",
    condena: "",
    costas: "",
  });

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      // Cargar proceso
      const procesoRes = await fetch(`/api/procesos/${id}`);
      if (!procesoRes.ok) throw new Error("Error al cargar proceso");
      const procesoData = await procesoRes.json();
      setProceso(procesoData.proceso);

      // Cargar sentencia si existe
      const sentenciaRes = await fetch(`/api/sentencias?procesoId=${id}`);
      if (sentenciaRes.ok) {
        const sentenciaData = await sentenciaRes.json();
        if (sentenciaData.data) {
          setSentenciaExistente(sentenciaData.data);
          setFormData({
            resumenDemanda: sentenciaData.data.resumenDemanda || "",
            resumenContestacion: sentenciaData.data.resumenContestacion || "",
            tramitesProceso: sentenciaData.data.tramitesProceso || "",
            pruebasPresentadas: sentenciaData.data.pruebasPresentadas || "",
            analisisPruebas: sentenciaData.data.analisisPruebas || "",
            valoracionPruebas: sentenciaData.data.valoracionPruebas || "",
            aplicacionDerecho: sentenciaData.data.aplicacionDerecho || "",
            razonamientoJuridico: sentenciaData.data.razonamientoJuridico || "",
            jurisprudencia: sentenciaData.data.jurisprudencia || "",
            decision: sentenciaData.data.decision || "ADMITE",
            condena: sentenciaData.data.condena || "",
            costas: sentenciaData.data.costas || "",
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar datos");
      router.push("/dashboard/juez/procesos");
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarBorrador = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/sentencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          procesoId: id,
          ...formData,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Borrador guardado");
        setSentenciaExistente(result.data);
      } else {
        toast.error(result.error || "Error al guardar");
      }
    } catch (error) {
      toast.error("Error al guardar borrador");
    } finally {
      setSaving(false);
    }
  };

  const handleEmitir = async () => {
    if (!sentenciaExistente) {
      toast.error("Primero guarda un borrador");
      return;
    }

    if (!confirm("¿Emitir sentencia? Esta acción es irreversible y notificará a las partes.")) {
      return;
    }

    try {
      setEmitting(true);
      const response = await fetch(`/api/sentencias/${sentenciaExistente.id}/emitir`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          procesoId: id,
          ...formData,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Sentencia emitida exitosamente");
        router.push(`/dashboard/procesos/${id}?tab=sentencia`);
      } else {
        toast.error(result.error || "Error al emitir");
      }
    } catch (error) {
      toast.error("Error al emitir sentencia");
    } finally {
      setEmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!proceso) return null;

  const yaEmitida = sentenciaExistente?.fechaNotificacion;

  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Scale className="h-8 w-8" />
            Emisión de Sentencia
          </h1>
          <p className="text-muted-foreground">Proceso: {proceso.nurej}</p>
        </div>
      </div>

      {yaEmitida && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Esta sentencia ya fue emitida el {new Date(sentenciaExistente.fechaEmision).toLocaleDateString("es-BO")}. No se puede modificar.
          </AlertDescription>
        </Alert>
      )}

      {/* Narrativa */}
      <Card>
        <CardHeader>
          <CardTitle>Sección 2: Narrativa (Resultandos)</CardTitle>
          <CardDescription>Resumen de demanda, contestación, trámites y pruebas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Resumen de Demanda *</Label>
            <Textarea
              value={formData.resumenDemanda}
              onChange={(e) => setFormData({ ...formData, resumenDemanda: e.target.value })}
              placeholder="Resumen de la demanda presentada..."
              rows={4}
              disabled={yaEmitida}
            />
          </div>
          <div>
            <Label>Resumen de Contestación *</Label>
            <Textarea
              value={formData.resumenContestacion}
              onChange={(e) => setFormData({ ...formData, resumenContestacion: e.target.value })}
              placeholder="Resumen de la contestación..."
              rows={4}
              disabled={yaEmitida}
            />
          </div>
          <div>
            <Label>Trámites del Proceso *</Label>
            <Textarea
              value={formData.tramitesProceso}
              onChange={(e) => setFormData({ ...formData, tramitesProceso: e.target.value })}
              placeholder="Trámites realizados durante el proceso..."
              rows={4}
              disabled={yaEmitida}
            />
          </div>
          <div>
            <Label>Pruebas Presentadas *</Label>
            <Textarea
              value={formData.pruebasPresentadas}
              onChange={(e) => setFormData({ ...formData, pruebasPresentadas: e.target.value })}
              placeholder="Pruebas presentadas por las partes..."
              rows={4}
              disabled={yaEmitida}
            />
          </div>
        </CardContent>
      </Card>

      {/* Considerandos */}
      <Card>
        <CardHeader>
          <CardTitle>Sección 3: Considerandos (Motiva)</CardTitle>
          <CardDescription>Análisis, valoración y aplicación del derecho</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Análisis de Pruebas *</Label>
            <Textarea
              value={formData.analisisPruebas}
              onChange={(e) => setFormData({ ...formData, analisisPruebas: e.target.value })}
              placeholder="Análisis detallado de las pruebas..."
              rows={5}
              disabled={yaEmitida}
            />
          </div>
          <div>
            <Label>Valoración de Pruebas (Art. 203-208) *</Label>
            <Textarea
              value={formData.valoracionPruebas}
              onChange={(e) => setFormData({ ...formData, valoracionPruebas: e.target.value })}
              placeholder="Valoración según artículos 203-208..."
              rows={5}
              disabled={yaEmitida}
            />
          </div>
          <div>
            <Label>Aplicación del Derecho *</Label>
            <Textarea
              value={formData.aplicacionDerecho}
              onChange={(e) => setFormData({ ...formData, aplicacionDerecho: e.target.value })}
              placeholder="Aplicación de artículos y normas..."
              rows={5}
              disabled={yaEmitida}
            />
          </div>
          <div>
            <Label>Razonamiento Jurídico *</Label>
            <Textarea
              value={formData.razonamientoJuridico}
              onChange={(e) => setFormData({ ...formData, razonamientoJuridico: e.target.value })}
              placeholder="Razonamiento y fundamentación jurídica..."
              rows={5}
              disabled={yaEmitida}
            />
          </div>
          <div>
            <Label>Jurisprudencia (Opcional)</Label>
            <Textarea
              value={formData.jurisprudencia}
              onChange={(e) => setFormData({ ...formData, jurisprudencia: e.target.value })}
              placeholder="Jurisprudencia aplicable..."
              rows={3}
              disabled={yaEmitida}
            />
          </div>
        </CardContent>
      </Card>

      {/* Resolutiva */}
      <Card>
        <CardHeader>
          <CardTitle>Sección 4: Resolutiva (Por Tanto)</CardTitle>
          <CardDescription>Decisión, condena y costas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Decisión *</Label>
            <Select
              value={formData.decision}
              onValueChange={(v: any) => setFormData({ ...formData, decision: v })}
              disabled={yaEmitida}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMITE">Admite la Demanda</SelectItem>
                <SelectItem value="RECHAZA">Rechaza la Demanda</SelectItem>
                <SelectItem value="ADMITE_PARCIALMENTE">Admite Parcialmente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Condena (si aplica)</Label>
            <Textarea
              value={formData.condena}
              onChange={(e) => setFormData({ ...formData, condena: e.target.value })}
              placeholder="Condena específica: pagar suma, entregar bien, hacer/no hacer..."
              rows={4}
              disabled={yaEmitida}
            />
          </div>
          <div>
            <Label>Costas *</Label>
            <Textarea
              value={formData.costas}
              onChange={(e) => setFormData({ ...formData, costas: e.target.value })}
              placeholder="Decisión sobre costas procesales..."
              rows={3}
              disabled={yaEmitida}
            />
          </div>
        </CardContent>
      </Card>

      {!yaEmitida && (
        <Card className="border-primary">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleGuardarBorrador}
                disabled={saving || emitting}
                className="flex-1"
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Guardar Borrador
              </Button>
              <Button
                onClick={handleEmitir}
                disabled={saving || emitting || !sentenciaExistente}
                className="flex-1"
              >
                {emitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Send className="mr-2 h-4 w-4" />
                Firmar y Emitir Sentencia
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              La sentencia emitida será inmutable y se notificará a ambas partes
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
