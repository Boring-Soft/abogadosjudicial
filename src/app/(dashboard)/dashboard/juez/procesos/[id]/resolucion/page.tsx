/**
 * Página para Emitir Resolución (JUEZ)
 * Ruta: /dashboard/juez/procesos/[id]/resolucion
 */

"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, FileCheck, Loader2, AlertCircle, Send } from "lucide-react";
import { TipoResolucion } from "@prisma/client";
import { ProcesoWithRelations } from "@/types/judicial";
import { ResolucionEditor } from "@/components/resoluciones/resolucion-editor";
import { toast } from "sonner";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EmitirResolucionPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [proceso, setProceso] = useState<ProcesoWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    tipo: "" as TipoResolucion | "",
    titulo: "",
    vistos: "",
    considerando: "",
    porTanto: "",
  });

  useEffect(() => {
    cargarProceso();
  }, [id]);

  const cargarProceso = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/procesos/${id}`);

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Error al cargar proceso");
        router.push("/dashboard/juez/procesos");
        return;
      }

      const result = await response.json();

      if (result.proceso) {
        setProceso(result.proceso);
      } else {
        toast.error("Proceso no encontrado");
        router.push("/dashboard/juez/procesos");
      }
    } catch (error) {
      console.error("Error al cargar proceso:", error);
      toast.error("Error al cargar proceso");
      router.push("/dashboard/juez/procesos");
    } finally {
      setLoading(false);
    }
  };

  const validarFormulario = (): boolean => {
    if (!formData.tipo) {
      toast.error("Selecciona el tipo de resolución");
      return false;
    }

    if (!formData.titulo.trim()) {
      toast.error("El título es requerido");
      return false;
    }

    if (!formData.porTanto.trim()) {
      toast.error("La sección Por Tanto es requerida");
      return false;
    }

    // Validaciones según tipo
    if (formData.tipo === "AUTO_INTERLOCUTORIO" || formData.tipo === "AUTO_DEFINITIVO") {
      if (!formData.vistos.trim() || formData.vistos.trim().length < 50) {
        toast.error(`Los ${formData.tipo === "AUTO_DEFINITIVO" ? "autos definitivos" : "autos interlocutorios"} requieren una sección Vistos detallada (mínimo 50 caracteres)`);
        return false;
      }
    }

    if (formData.tipo === "AUTO_DEFINITIVO") {
      if (!formData.considerando.trim() || formData.considerando.trim().length < 200) {
        toast.error("Los autos definitivos requieren una sección Considerando fundamentada (mínimo 200 caracteres)");
        return false;
      }
    }

    if (formData.porTanto.trim().length < 50) {
      toast.error("La sección Por Tanto debe tener al menos 50 caracteres");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    if (!confirm("¿Está seguro de emitir esta resolución? Una vez firmada, será inmutable y se notificará automáticamente a los abogados.")) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/resoluciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          procesoId: id,
          tipo: formData.tipo,
          titulo: formData.titulo.trim(),
          vistos: formData.vistos.trim() || undefined,
          considerando: formData.considerando.trim() || undefined,
          porTanto: formData.porTanto.trim(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Resolución emitida y firmada exitosamente");
        router.push(`/dashboard/procesos/${id}?tab=resoluciones`);
      } else {
        toast.error(result.error || "Error al emitir resolución");
      }
    } catch (error) {
      console.error("Error al emitir resolución:", error);
      toast.error("Error al emitir resolución");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!proceso) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Proceso no encontrado</AlertDescription>
        </Alert>
      </div>
    );
  }

  const procesoData = {
    nurej: proceso.nurej || "Sin NUREJ",
    actorNombre: `${proceso.clienteActor.nombres} ${proceso.clienteActor.apellidos}`,
    demandadoNombre: proceso.demandadoNombres
      ? `${proceso.demandadoNombres} ${proceso.demandadoApellidos}`
      : "No especificado",
    juzgadoNombre: proceso.juzgado.nombre,
    juezNombre: `${proceso.abogadoActor.firstName || ""} ${proceso.abogadoActor.lastName || ""}`.trim(),
    objeto: proceso.demanda?.objeto || "",
    cuantia: proceso.cuantia,
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Emitir Resolución</h1>
          <p className="text-muted-foreground mt-1">Proceso: {proceso.nurej}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Proceso</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">NUREJ</p>
            <p className="font-semibold">{proceso.nurej}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Estado</p>
            <Badge>{proceso.estado.replace("_", " ")}</Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Actor</p>
            <p className="font-medium">{procesoData.actorNombre}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Demandado</p>
            <p className="font-medium">{procesoData.demandadoNombre}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Juzgado</p>
            <p className="font-medium">{proceso.juzgado.nombre}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Materia</p>
            <p className="font-medium">{proceso.materia}</p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <form onSubmit={handleSubmit} className="space-y-6">
        <ResolucionEditor
          procesoData={procesoData}
          value={formData}
          onChange={setFormData}
        />

        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Emisión y Firma Digital
            </CardTitle>
            <CardDescription>
              Al emitir la resolución, se generará automáticamente:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Hash SHA-256 del contenido para garantizar integridad</li>
              <li>Firma digital interna con tu identificación</li>
              <li>Notificación automática a ambos abogados</li>
              <li>Registro en el expediente digital (inmutable)</li>
              <li>Fecha de emisión y notificación</li>
            </ul>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Una vez emitida, la resolución NO podrá ser modificada por razones de seguridad jurídica.
                Revisa cuidadosamente antes de emitir.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={submitting}>
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Send className="mr-2 h-4 w-4" />
                Emitir y Firmar Resolución
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
