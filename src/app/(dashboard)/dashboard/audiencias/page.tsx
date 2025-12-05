import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Video, Clock, CheckCircle, XCircle } from "lucide-react";

export default async function AudienciasPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    redirect("/sign-in");
  }

  const isJuez = session.user.role === UserRole.JUEZ;

  // Obtener audiencias según el rol
  const whereClause = isJuez
    ? {
        proceso: {
          juezId: profile.id,
        },
      }
    : {
        proceso: {
          OR: [
            { abogadoActorId: profile.id },
            { abogadoDemandadoId: profile.id },
          ],
        },
      };

  const [audienciasProgramadas, audienciasRealizadas, audienciasSuspendidas] =
    await Promise.all([
      prisma.audiencia.findMany({
        where: {
          ...whereClause,
          estado: "PROGRAMADA",
        },
        include: {
          proceso: {
            include: {
              clienteActor: true,
              clienteDemandado: true,
              abogadoActor: true,
              abogadoDemandado: true,
            },
          },
        },
        orderBy: {
          fechaHora: "asc",
        },
      }),
      prisma.audiencia.findMany({
        where: {
          ...whereClause,
          estado: "REALIZADA",
        },
        include: {
          proceso: {
            include: {
              clienteActor: true,
              clienteDemandado: true,
              abogadoActor: true,
              abogadoDemandado: true,
            },
          },
        },
        orderBy: {
          fechaHora: "desc",
        },
        take: 10,
      }),
      prisma.audiencia.findMany({
        where: {
          ...whereClause,
          estado: "SUSPENDIDA",
        },
        include: {
          proceso: {
            include: {
              clienteActor: true,
              clienteDemandado: true,
              abogadoActor: true,
              abogadoDemandado: true,
            },
          },
        },
        orderBy: {
          fechaHora: "desc",
        },
        take: 10,
      }),
    ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Mis Audiencias
        </h1>
        <p className="text-muted-foreground">
          Gestiona todas las audiencias {isJuez ? "asignadas" : "de tus procesos"}
        </p>
      </div>

      {/* Audiencias Programadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Audiencias Programadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {audienciasProgramadas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay audiencias programadas
            </div>
          ) : (
            <div className="space-y-4">
              {audienciasProgramadas.map((audiencia) => {
                const esActor = audiencia.proceso.abogadoActorId === profile.id;
                const esDemandado = audiencia.proceso.abogadoDemandadoId === profile.id;

                return (
                  <div
                    key={audiencia.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {audiencia.proceso.clienteActor.nombres}{" "}
                          {audiencia.proceso.clienteActor.apellidos}
                          {audiencia.proceso.clienteDemandado && (
                            <>
                              {" vs "}
                              {audiencia.proceso.clienteDemandado.nombres}{" "}
                              {audiencia.proceso.clienteDemandado.apellidos}
                            </>
                          )}
                        </p>
                        <Badge variant="secondary">{audiencia.tipo}</Badge>
                        {audiencia.modalidad === "VIRTUAL" && (
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Video className="h-3 w-3" />
                            Virtual
                          </Badge>
                        )}
                        {!isJuez && esActor && (
                          <Badge variant="default" className="bg-blue-600">
                            Actor
                          </Badge>
                        )}
                        {!isJuez && esDemandado && (
                          <Badge variant="default" className="bg-purple-600">
                            Demandado
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        NUREJ: {audiencia.proceso.nurej || "Sin asignar"}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(audiencia.fechaHora).toLocaleString("es-BO", {
                          dateStyle: "full",
                          timeStyle: "short",
                        })}
                      </p>
                      {audiencia.linkGoogleMeet && (
                        <a
                          href={audiencia.linkGoogleMeet}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Video className="h-3 w-3" />
                          Unirse a Google Meet
                        </a>
                      )}
                    </div>
                    <Link
                      href={
                        isJuez
                          ? `/dashboard/juez/audiencias/${audiencia.id}`
                          : `/dashboard/procesos/${audiencia.procesoId}/audiencias/${audiencia.id}`
                      }
                    >
                      <Button size="sm">
                        {isJuez ? "Realizar Audiencia" : "Ver Detalles"}
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audiencias Realizadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Audiencias Realizadas (Últimas 10)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {audienciasRealizadas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay audiencias realizadas
            </div>
          ) : (
            <div className="space-y-4">
              {audienciasRealizadas.map((audiencia) => {
                const esActor = audiencia.proceso.abogadoActorId === profile.id;
                const esDemandado = audiencia.proceso.abogadoDemandadoId === profile.id;

                return (
                  <div
                    key={audiencia.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors bg-green-50/50 border-green-200"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {audiencia.proceso.clienteActor.nombres}{" "}
                          {audiencia.proceso.clienteActor.apellidos}
                          {audiencia.proceso.clienteDemandado && (
                            <>
                              {" vs "}
                              {audiencia.proceso.clienteDemandado.nombres}{" "}
                              {audiencia.proceso.clienteDemandado.apellidos}
                            </>
                          )}
                        </p>
                        <Badge variant="secondary">{audiencia.tipo}</Badge>
                        {!isJuez && esActor && (
                          <Badge variant="default" className="bg-blue-600">
                            Actor
                          </Badge>
                        )}
                        {!isJuez && esDemandado && (
                          <Badge variant="default" className="bg-purple-600">
                            Demandado
                          </Badge>
                        )}
                        {audiencia.huboConciliacion && (
                          <Badge variant="default" className="bg-green-600">
                            Conciliado
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        NUREJ: {audiencia.proceso.nurej || "Sin asignar"}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(audiencia.fechaHora).toLocaleString("es-BO", {
                          dateStyle: "full",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                    <Link
                      href={
                        isJuez
                          ? `/dashboard/juez/audiencias/${audiencia.id}`
                          : `/dashboard/procesos/${audiencia.procesoId}/audiencias/${audiencia.id}`
                      }
                    >
                      <Button size="sm" variant="outline">
                        Ver Acta
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audiencias Suspendidas */}
      {audienciasSuspendidas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-orange-600" />
              Audiencias Suspendidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {audienciasSuspendidas.map((audiencia) => {
                const esActor = audiencia.proceso.abogadoActorId === profile.id;
                const esDemandado = audiencia.proceso.abogadoDemandadoId === profile.id;

                return (
                  <div
                    key={audiencia.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors bg-orange-50/50 border-orange-200"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {audiencia.proceso.clienteActor.nombres}{" "}
                          {audiencia.proceso.clienteActor.apellidos}
                          {audiencia.proceso.clienteDemandado && (
                            <>
                              {" vs "}
                              {audiencia.proceso.clienteDemandado.nombres}{" "}
                              {audiencia.proceso.clienteDemandado.apellidos}
                            </>
                          )}
                        </p>
                        <Badge variant="secondary">{audiencia.tipo}</Badge>
                        {!isJuez && esActor && (
                          <Badge variant="default" className="bg-blue-600">
                            Actor
                          </Badge>
                        )}
                        {!isJuez && esDemandado && (
                          <Badge variant="default" className="bg-purple-600">
                            Demandado
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        NUREJ: {audiencia.proceso.nurej || "Sin asignar"}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Programada para:{" "}
                        {new Date(audiencia.fechaHora).toLocaleString("es-BO", {
                          dateStyle: "full",
                          timeStyle: "short",
                        })}
                      </p>
                      {audiencia.motivoSuspension && (
                        <p className="text-xs text-orange-600 mt-1">
                          <strong>Motivo:</strong> {audiencia.motivoSuspension}
                        </p>
                      )}
                    </div>
                    <Link
                      href={
                        isJuez
                          ? `/dashboard/juez/audiencias/${audiencia.id}`
                          : `/dashboard/procesos/${audiencia.procesoId}/audiencias/${audiencia.id}`
                      }
                    >
                      <Button size="sm" variant="outline">
                        Ver Detalles
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
