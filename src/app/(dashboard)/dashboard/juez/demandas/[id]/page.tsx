import { redirect } from "next/navigation";
import { getCurrentUser, requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AdmitirDemandaDialog } from "@/components/demandas/admitir-demanda-dialog";
import { ObservarDemandaDialog } from "@/components/demandas/observar-demanda-dialog";
import { RechazarDemandaDialog } from "@/components/demandas/rechazar-demanda-dialog";
import { AlertCircle, FileText, Scale, User } from "lucide-react";
import { EstadoProceso } from "@prisma/client";

interface RevisionDemandaPageProps {
  params: Promise<{ id: string }>;
}

export default async function RevisionDemandaPage({ params }: RevisionDemandaPageProps) {
  const { id } = await params;

  // Verificar autenticación y rol
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");

  const hasPermission = await requireRole(user.id, ["JUEZ"]);
  if (!hasPermission) {
    redirect("/dashboard");
  }

  // Obtener perfil del juez
  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  if (!profile || !profile.juzgadoId) {
    redirect("/dashboard");
  }

  // Obtener demanda con relaciones
  const demanda = await prisma.demanda.findUnique({
    where: { id },
    include: {
      proceso: {
        include: {
          juzgado: true,
          clienteActor: true,
          abogadoActor: true,
          juez: true,
        },
      },
    },
  });

  if (!demanda) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Demanda no encontrada</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Verificar que el juez pertenece al juzgado del proceso
  if (demanda.proceso.juzgadoId !== profile.juzgadoId) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Esta demanda no pertenece a su juzgado
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const isEditable = demanda.proceso.estado === EstadoProceso.PRESENTADO;

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Revisión de Demanda</h1>
          <p className="text-muted-foreground mt-1">
            Proceso {demanda.proceso.nurej || demanda.proceso.id} - {demanda.proceso.materia}
          </p>
        </div>
        <Badge
          variant={
            demanda.proceso.estado === EstadoProceso.PRESENTADO
              ? "default"
              : demanda.proceso.estado === EstadoProceso.OBSERVADO
              ? "destructive"
              : "secondary"
          }
        >
          {demanda.proceso.estado}
        </Badge>
      </div>

      {/* Información del Proceso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Información del Proceso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tipo de Proceso</p>
              <p className="text-sm">{demanda.proceso.tipoProceso}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Materia</p>
              <p className="text-sm">{demanda.proceso.materia}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cuantía</p>
              <p className="text-sm">
                Bs. {demanda.valorDemanda.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fecha de Presentación</p>
              <p className="text-sm">{new Date(demanda.createdAt).toLocaleDateString("es-BO")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partes del Proceso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Partes del Proceso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">ACTOR (Demandante)</h4>
            <div className="bg-muted p-4 rounded-md space-y-1">
              <p className="text-sm">
                <span className="font-medium">Nombre:</span>{" "}
                {demanda.proceso.clienteActor.nombres} {demanda.proceso.clienteActor.apellidos}
              </p>
              <p className="text-sm">
                <span className="font-medium">CI:</span> {demanda.proceso.clienteActor.ci}
              </p>
              <p className="text-sm">
                <span className="font-medium">Domicilio Real:</span>{" "}
                {demanda.proceso.clienteActor.domicilioReal}
              </p>
              <p className="text-sm">
                <span className="font-medium">Domicilio Procesal:</span>{" "}
                {demanda.proceso.clienteActor.domicilioProcesal}
              </p>
              <p className="text-sm">
                <span className="font-medium">Abogado:</span>{" "}
                {demanda.proceso.abogadoActor.firstName} {demanda.proceso.abogadoActor.lastName}
                {demanda.proceso.abogadoActor.registroProfesional &&
                  ` (Reg. ${demanda.proceso.abogadoActor.registroProfesional})`}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">DEMANDADO</h4>
            <div className="bg-muted p-4 rounded-md space-y-1">
              <p className="text-sm">
                <span className="font-medium">Nombre:</span> {demanda.proceso.demandadoNombres}{" "}
                {demanda.proceso.demandadoApellidos}
              </p>
              <p className="text-sm">
                <span className="font-medium">CI:</span> {demanda.proceso.demandadoCI}
              </p>
              <p className="text-sm">
                <span className="font-medium">Domicilio Real:</span>{" "}
                {demanda.proceso.demandadoDomicilioReal || "No especificado"}
              </p>
              <p className="text-sm">
                <span className="font-medium">Domicilio Procesal:</span>{" "}
                {demanda.proceso.demandadoDomicilioProcesal || "No especificado"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contenido de la Demanda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Contenido de la Demanda (Art. 110)
          </CardTitle>
          <CardDescription>Versión {demanda.version}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2">1. Designación del Juez</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {demanda.designacionJuez}
            </p>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-2">2. Objeto de la Demanda</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{demanda.objeto}</p>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-2">3. Hechos</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{demanda.hechos}</p>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-2">4. Fundamento de Derecho</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{demanda.derecho}</p>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-2">5. Petitorio</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {demanda.petitorio}
            </p>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-2">6. Valor de la Demanda</h4>
            <p className="text-sm text-muted-foreground">
              Bs. {demanda.valorDemanda.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
            </p>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-2">7. Prueba Ofrecida</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {demanda.pruebaOfrecida}
            </p>
          </div>

          {demanda.observaciones && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2 text-destructive">Observaciones Previas</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {demanda.observaciones}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Acciones del Juez */}
      {isEditable && (
        <Card>
          <CardHeader>
            <CardTitle>Acciones</CardTitle>
            <CardDescription>
              Revise cuidadosamente la demanda y tome una decisión según el Art. 110 del Código
              Procesal Civil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <AdmitirDemandaDialog demanda={demanda} />
              <ObservarDemandaDialog demanda={demanda} />
              <RechazarDemandaDialog demanda={demanda} />
            </div>
          </CardContent>
        </Card>
      )}

      {!isEditable && demanda.proceso.estado !== EstadoProceso.PRESENTADO && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Esta demanda ya ha sido procesada. Estado actual: {demanda.proceso.estado}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
