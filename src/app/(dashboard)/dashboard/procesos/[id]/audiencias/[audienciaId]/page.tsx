import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Video, MapPin, Users, Clock, FileText } from "lucide-react";

interface AudienciaAbogadoPageProps {
  params: Promise<{ id: string; audienciaId: string }>;
}

export default async function AudienciaAbogadoPage({ params }: AudienciaAbogadoPageProps) {
  const { id, audienciaId } = await params;

  // Verificar autenticación
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");

  // Obtener perfil
  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  if (!profile) {
    redirect("/dashboard");
  }

  // Obtener audiencia con relaciones
  const audiencia = await prisma.audiencia.findUnique({
    where: { id: audienciaId },
    include: {
      proceso: {
        include: {
          juzgado: true,
          clienteActor: true,
          clienteDemandado: true,
          abogadoActor: true,
          abogadoDemandado: true,
          juez: true,
        },
      },
    },
  });

  if (!audiencia) {
    redirect("/dashboard/procesos");
  }

  // Verificar acceso
  const tieneAcceso =
    audiencia.proceso.abogadoActorId === profile.id ||
    audiencia.proceso.abogadoDemandadoId === profile.id;

  if (!tieneAcceso) {
    redirect("/dashboard/procesos");
  }

  const esActor = audiencia.proceso.abogadoActorId === profile.id;

  const getEstadoBadge = () => {
    switch (audiencia.estado) {
      case "PROGRAMADA":
        return <Badge className="bg-blue-600">Programada</Badge>;
      case "REALIZADA":
        return <Badge className="bg-green-600">Realizada</Badge>;
      case "SUSPENDIDA":
        return <Badge className="bg-orange-600">Suspendida</Badge>;
      case "CANCELADA":
        return <Badge className="bg-red-600">Cancelada</Badge>;
      default:
        return <Badge variant="secondary">{audiencia.estado}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Audiencia {audiencia.tipo}</h1>
          <p className="text-muted-foreground mt-1">
            Proceso {audiencia.proceso.nurej || audiencia.proceso.id}
          </p>
        </div>
        {getEstadoBadge()}
      </div>

      {/* Datos de la Audiencia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Información de la Audiencia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tipo</p>
              <p className="font-medium">
                {audiencia.tipo === "PRELIMINAR" ? "Audiencia Preliminar" : "Audiencia Complementaria"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {audiencia.tipo === "PRELIMINAR"
                  ? "Ratificación, conciliación, fijación de objeto y admisión de pruebas"
                  : "Práctica de pruebas y cierre de etapa probatoria"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Fecha y Hora</p>
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
                {audiencia.modalidad === "VIRTUAL" ? (
                  <>
                    <Video className="h-4 w-4" />
                    Virtual
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4" />
                    Presencial
                  </>
                )}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Juzgado</p>
              <p className="font-medium">{audiencia.proceso.juzgado.nombre}</p>
              {audiencia.modalidad === "PRESENCIAL" && (
                <p className="text-xs text-muted-foreground mt-1">
                  {audiencia.proceso.juzgado.direccion}
                </p>
              )}
            </div>
          </div>

          {/* Link de Google Meet */}
          {audiencia.linkGoogleMeet && audiencia.modalidad === "VIRTUAL" && (
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="font-medium mb-2 flex items-center gap-2">
                <Video className="h-4 w-4" />
                Enlace de Videoconferencia
              </p>
              <a
                href={audiencia.linkGoogleMeet}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {audiencia.linkGoogleMeet}
              </a>
              <div className="mt-3">
                <Button asChild>
                  <a href={audiencia.linkGoogleMeet} target="_blank" rel="noopener noreferrer">
                    <Video className="h-4 w-4 mr-2" />
                    Unirse a la Audiencia
                  </a>
                </Button>
              </div>
            </div>
          )}

          {/* Duración (si está realizada) */}
          {audiencia.fechaInicio && audiencia.fechaCierre && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Duración</p>
              <p className="font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {Math.round(
                  (new Date(audiencia.fechaCierre).getTime() -
                    new Date(audiencia.fechaInicio).getTime()) /
                    60000
                )}{" "}
                minutos
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Partes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Partes del Proceso
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">ACTOR (Demandante)</p>
            <p className="font-medium">
              {audiencia.proceso.clienteActor.nombres} {audiencia.proceso.clienteActor.apellidos}
            </p>
            <p className="text-sm text-muted-foreground">
              Representado por: {audiencia.proceso.abogadoActor.firstName}{" "}
              {audiencia.proceso.abogadoActor.lastName}
              {esActor && <Badge variant="outline" className="ml-2">Usted</Badge>}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">DEMANDADO</p>
            <p className="font-medium">
              {audiencia.proceso.clienteDemandado
                ? `${audiencia.proceso.clienteDemandado.nombres} ${audiencia.proceso.clienteDemandado.apellidos}`
                : `${audiencia.proceso.demandadoNombres} ${audiencia.proceso.demandadoApellidos}`}
            </p>
            {audiencia.proceso.abogadoDemandado && (
              <p className="text-sm text-muted-foreground">
                Representado por: {audiencia.proceso.abogadoDemandado.firstName}{" "}
                {audiencia.proceso.abogadoDemandado.lastName}
                {!esActor && <Badge variant="outline" className="ml-2">Usted</Badge>}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Asistentes */}
      {audiencia.asistentes && Array.isArray(audiencia.asistentes) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Asistentes Registrados
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                  {asistente.asistio !== undefined && (
                    <Badge variant={asistente.asistio ? "default" : "secondary"}>
                      {asistente.asistio ? "Asistió" : "No asistió"}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resultados (si está realizada) */}
      {audiencia.estado === "REALIZADA" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Resultados de la Audiencia
            </CardTitle>
            <CardDescription>
              Información registrada en el acta de audiencia
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Conciliación */}
            {audiencia.huboConciliacion !== null && (
              <div>
                <p className="font-medium">Conciliación:</p>
                {audiencia.huboConciliacion ? (
                  <div className="mt-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-900 font-medium mb-2">
                      ✓ Las partes llegaron a un acuerdo de conciliación
                    </p>
                    {audiencia.acuerdoConciliacion && (
                      <p className="text-sm text-green-800 whitespace-pre-wrap">
                        {audiencia.acuerdoConciliacion}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">
                    No se llegó a un acuerdo de conciliación. El proceso continúa.
                  </p>
                )}
              </div>
            )}

            {/* Objeto del Proceso */}
            {audiencia.objetoProceso && (
              <div>
                <p className="font-medium">Objeto del Proceso:</p>
                <div className="mt-2 p-4 bg-muted rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{audiencia.objetoProceso}</p>
                </div>
              </div>
            )}

            {/* Pruebas Admitidas */}
            {audiencia.pruebasAdmitidas && (
              <div>
                <p className="font-medium mb-2">Pruebas Admitidas:</p>
                <div className="space-y-2">
                  {Array.isArray(audiencia.pruebasAdmitidas) &&
                    (audiencia.pruebasAdmitidas as any[]).map((prueba: any, index: number) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{prueba.tipo}</Badge>
                          <Badge variant={prueba.admitida ? "default" : "destructive"}>
                            {prueba.admitida ? "Admitida" : "Rechazada"}
                          </Badge>
                        </div>
                        <p className="text-sm">{prueba.descripcion}</p>
                        {!prueba.admitida && prueba.fundamentacion && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Motivo de rechazo: {prueba.fundamentacion}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Acta */}
            {audiencia.actaUrl && (
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="font-medium mb-2">Acta de Audiencia</p>
                <p className="text-sm text-muted-foreground mb-3">
                  El acta oficial de la audiencia ha sido generada y firmada digitalmente.
                </p>
                <Button asChild variant="default">
                  <a href={audiencia.actaUrl} target="_blank" rel="noopener noreferrer">
                    <FileText className="h-4 w-4 mr-2" />
                    Descargar Acta (PDF)
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Botón de volver */}
      <div className="flex justify-end">
        <Button variant="outline" asChild>
          <a href={`/dashboard/procesos/${id}`}>Volver al Expediente</a>
        </Button>
      </div>
    </div>
  );
}
