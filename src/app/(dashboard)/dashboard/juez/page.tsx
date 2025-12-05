import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Calendar, Video } from "lucide-react";

export default async function JuezDashboardPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== UserRole.JUEZ) {
    redirect("/sign-in");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    redirect("/sign-in");
  }

  // Obtener estadísticas de demandas
  const [
    demandasPendientes,
    demandasAdmitidas,
    demandasObservadas,
    demandasRechazadas,
    totalProcesos,
  ] = await Promise.all([
    prisma.proceso.count({
      where: {
        estado: "PRESENTADO",
        juezId: profile.id,
      },
    }),
    prisma.proceso.count({
      where: {
        estado: "ADMITIDO",
        juezId: profile.id,
      },
    }),
    prisma.proceso.count({
      where: {
        estado: "OBSERVADO",
        juezId: profile.id,
      },
    }),
    prisma.proceso.count({
      where: {
        estado: "RECHAZADO",
        juezId: profile.id,
      },
    }),
    prisma.proceso.count({
      where: {
        juezId: profile.id,
      },
    }),
  ]);

  // Obtener demandas recientes pendientes de revisión
  const demandasRecientes = await prisma.proceso.findMany({
    where: {
      estado: "PRESENTADO",
      juezId: profile.id,
    },
    include: {
      clienteActor: true,
      abogadoActor: true,
      juzgado: true,
      demanda: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  // Obtener procesos admitidos que necesitan citación
  const procesosParaCitar = await prisma.proceso.findMany({
    where: {
      estado: "ADMITIDO",
      juezId: profile.id,
    },
    include: {
      clienteActor: true,
      abogadoActor: true,
      juzgado: true,
      citaciones: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 5,
  });

  // Obtener procesos citados (para ver estado de citaciones)
  const procesosCitados = await prisma.proceso.findMany({
    where: {
      estado: "CITADO",
      juezId: profile.id,
    },
    include: {
      clienteActor: true,
      abogadoActor: true,
      citaciones: {
        where: {
          estado: "EXITOSA",
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 3,
  });

  // Obtener audiencias programadas próximas
  const audienciasProgramadas = await prisma.audiencia.findMany({
    where: {
      proceso: {
        juezId: profile.id,
      },
      estado: "PROGRAMADA",
      fechaHora: {
        gte: new Date(),
      },
    },
    include: {
      proceso: {
        include: {
          clienteActor: true,
          abogadoActor: true,
        },
      },
    },
    orderBy: {
      fechaHora: "asc",
    },
    take: 5,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard del Juez</h1>
        <p className="text-muted-foreground">
          Bienvenido, {profile.firstName} {profile.lastName}
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pendientes de Revisión
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demandasPendientes}</div>
            <p className="text-xs text-muted-foreground">
              Demandas por revisar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Admitidas
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demandasAdmitidas}</div>
            <p className="text-xs text-muted-foreground">
              Demandas admitidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Observadas
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demandasObservadas}</div>
            <p className="text-xs text-muted-foreground">
              Con observaciones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rechazadas
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demandasRechazadas}</div>
            <p className="text-xs text-muted-foreground">
              Demandas rechazadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Procesos
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProcesos}</div>
            <p className="text-xs text-muted-foreground">
              Procesos asignados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Demandas pendientes de revisión */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Demandas Pendientes de Revisión</CardTitle>
            <Link href="/dashboard/juez/demandas">
              <Button variant="outline" size="sm">
                Ver todas
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {demandasRecientes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay demandas pendientes de revisión
            </div>
          ) : (
            <div className="space-y-4">
              {demandasRecientes.map((proceso) => (
                <div
                  key={proceso.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {proceso.clienteActor.nombres} {proceso.clienteActor.apellidos}
                      </p>
                      <Badge variant="secondary">{proceso.materia}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Abogado: {proceso.abogadoActor.firstName}{" "}
                      {proceso.abogadoActor.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Presentado:{" "}
                      {new Date(proceso.createdAt).toLocaleDateString("es-BO")}
                    </p>
                  </div>
                  {proceso.demanda && (
                    <Link href={`/dashboard/juez/demandas/${proceso.demanda.id}`}>
                      <Button size="sm">Revisar</Button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Procesos admitidos - Ordenar citación */}
      {procesosParaCitar.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Procesos Admitidos - Ordenar Citación</CardTitle>
              <Link href="/dashboard/procesos?estado=ADMITIDO">
                <Button variant="outline" size="sm">
                  Ver todos
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {procesosParaCitar.map((proceso) => (
                <div
                  key={proceso.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {proceso.clienteActor.nombres} {proceso.clienteActor.apellidos}
                      </p>
                      <Badge variant="secondary">{proceso.materia}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Abogado: {proceso.abogadoActor.firstName}{" "}
                      {proceso.abogadoActor.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      NUREJ: {proceso.nurej || "Sin asignar"}
                    </p>
                    {proceso.citaciones.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {proceso.citaciones.length} citación(es) registrada(s)
                      </Badge>
                    )}
                  </div>
                  <Link href={`/dashboard/juez/procesos/${proceso.id}/citacion`}>
                    <Button size="sm" variant="default">
                      Ordenar Citación
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Procesos citados - Estado de citaciones */}
      {procesosCitados.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Citaciones Exitosas - Pendiente de Contestación</CardTitle>
              <Link href="/dashboard/procesos?estado=CITADO">
                <Button variant="outline" size="sm">
                  Ver todos
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {procesosCitados.map((proceso) => (
                <div
                  key={proceso.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {proceso.clienteActor.nombres} {proceso.clienteActor.apellidos}
                      </p>
                      <Badge variant="secondary">{proceso.materia}</Badge>
                      <Badge variant="default" className="bg-green-600">
                        Citado
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Abogado: {proceso.abogadoActor.firstName}{" "}
                      {proceso.abogadoActor.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      NUREJ: {proceso.nurej || "Sin asignar"}
                    </p>
                    {proceso.citaciones[0] && (
                      <p className="text-xs text-green-600">
                        Citación exitosa:{" "}
                        {new Date(proceso.citaciones[0].createdAt).toLocaleDateString("es-BO")}
                      </p>
                    )}
                  </div>
                  <Link href={`/dashboard/procesos/${proceso.id}`}>
                    <Button size="sm" variant="outline">
                      Ver Expediente
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audiencias Programadas */}
      {audienciasProgramadas.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Audiencias Programadas
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {audienciasProgramadas.map((audiencia) => (
                <div
                  key={audiencia.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {audiencia.proceso.clienteActor.nombres} {audiencia.proceso.clienteActor.apellidos}
                      </p>
                      <Badge variant="secondary">{audiencia.tipo}</Badge>
                      {audiencia.modalidad === "VIRTUAL" && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Video className="h-3 w-3" />
                          Virtual
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
                  <Link href={`/dashboard/juez/audiencias/${audiencia.id}`}>
                    <Button size="sm">Realizar Audiencia</Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Acciones rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Link href="/dashboard/juez/demandas">
            <Button className="w-full" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Revisar Demandas
            </Button>
          </Link>
          <Link href="/dashboard/procesos">
            <Button className="w-full" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Ver Procesos
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
