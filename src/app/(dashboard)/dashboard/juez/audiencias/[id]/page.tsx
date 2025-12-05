import { redirect } from "next/navigation";
import { getCurrentUser, requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Calendar, Users, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RealizarAudienciaForm } from "@/components/audiencias/realizar-audiencia-form";

interface AudienciaEnVivoPageProps {
  params: Promise<{ id: string }>;
}

export default async function AudienciaEnVivoPage({ params }: AudienciaEnVivoPageProps) {
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

  if (!profile) {
    redirect("/dashboard");
  }

  // Obtener audiencia con relaciones
  const audiencia = await prisma.audiencia.findUnique({
    where: { id },
    include: {
      proceso: {
        include: {
          juzgado: true,
          clienteActor: true,
          clienteDemandado: true,
          abogadoActor: true,
          abogadoDemandado: true,
          demanda: true,
          contestacion: true,
        },
      },
    },
  });

  if (!audiencia) {
    redirect("/dashboard/juez");
  }

  // Verificar que el juez sea el asignado
  if (audiencia.proceso.juezId !== profile.id) {
    redirect("/dashboard/juez");
  }

  // Si la audiencia ya fue realizada, mostrar solo vista de acta
  if (audiencia.estado === "REALIZADA") {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Audiencia Realizada</h1>
          <p className="text-muted-foreground mt-1">
            Proceso {audiencia.proceso.nurej || audiencia.proceso.id}
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Esta audiencia ya fue realizada el{" "}
            {audiencia.fechaCierre
              ? new Date(audiencia.fechaCierre).toLocaleString("es-BO")
              : "fecha no disponible"}
            .
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Resultados de la Audiencia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {audiencia.huboConciliacion !== null && (
              <div>
                <p className="font-medium">Conciliación:</p>
                <p className="text-sm text-muted-foreground">
                  {audiencia.huboConciliacion ? "Sí hubo acuerdo" : "No hubo acuerdo"}
                </p>
                {audiencia.acuerdoConciliacion && (
                  <p className="mt-2 p-3 bg-muted rounded-md text-sm">
                    {audiencia.acuerdoConciliacion}
                  </p>
                )}
              </div>
            )}

            {audiencia.objetoProceso && (
              <div>
                <p className="font-medium">Objeto del Proceso:</p>
                <p className="mt-2 p-3 bg-muted rounded-md text-sm whitespace-pre-wrap">
                  {audiencia.objetoProceso}
                </p>
              </div>
            )}

            {audiencia.pruebasAdmitidas && (
              <div>
                <p className="font-medium">Pruebas Admitidas:</p>
                <pre className="mt-2 p-3 bg-muted rounded-md text-sm overflow-auto">
                  {JSON.stringify(audiencia.pruebasAdmitidas, null, 2)}
                </pre>
              </div>
            )}

            {audiencia.actaUrl && (
              <div>
                <p className="font-medium">Acta de Audiencia:</p>
                <p className="text-sm text-muted-foreground mt-1">
                  <a href={audiencia.actaUrl} className="text-primary hover:underline">
                    Descargar acta (PDF)
                  </a>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si está suspendida o cancelada
  if (audiencia.estado === "SUSPENDIDA" || audiencia.estado === "CANCELADA") {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Esta audiencia fue {audiencia.estado.toLowerCase()}. No se puede realizar.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Realizar Audiencia {audiencia.tipo}</h1>
          <p className="text-muted-foreground mt-1">
            Proceso {audiencia.proceso.nurej || audiencia.proceso.id} - {audiencia.proceso.materia}
          </p>
        </div>
        <Badge variant={audiencia.estado === "PROGRAMADA" ? "outline" : "default"}>
          {audiencia.estado}
        </Badge>
      </div>

      {/* Información de la Audiencia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Datos de la Audiencia
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Fecha y Hora Programada</p>
            <p className="font-medium">
              {new Date(audiencia.fechaHora).toLocaleString("es-BO", {
                dateStyle: "full",
                timeStyle: "short",
              })}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Modalidad</p>
            <p className="font-medium flex items-center gap-2">
              {audiencia.modalidad === "VIRTUAL" ? <Video className="h-4 w-4" /> : null}
              {audiencia.modalidad}
            </p>
            {audiencia.linkGoogleMeet && (
              <a
                href={audiencia.linkGoogleMeet}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline mt-1 inline-block"
              >
                Abrir Google Meet
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Partes del Proceso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Asistentes
          </CardTitle>
          <CardDescription>
            Verificar asistencia de las partes y abogados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {audiencia.asistentes && Array.isArray(audiencia.asistentes) && (
            <div className="space-y-2">
              {(audiencia.asistentes as any[]).map((asistente: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded"
                >
                  <div>
                    <p className="font-medium">{asistente.nombre}</p>
                    <p className="text-sm text-muted-foreground">{asistente.rol}</p>
                  </div>
                  <Badge variant={asistente.obligatorio ? "default" : "secondary"}>
                    {asistente.obligatorio ? "Obligatorio" : "Opcional"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Formulario de Realización */}
      <Card>
        <CardHeader>
          <CardTitle>Desarrollo de la Audiencia</CardTitle>
          <CardDescription>
            Complete los datos durante y al finalizar la audiencia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RealizarAudienciaForm
            audienciaId={audiencia.id}
            tipoAudiencia={audiencia.tipo}
            asistentesIniciales={audiencia.asistentes as any}
            demanda={audiencia.proceso.demanda}
            contestacion={audiencia.proceso.contestacion}
          />
        </CardContent>
      </Card>
    </div>
  );
}
