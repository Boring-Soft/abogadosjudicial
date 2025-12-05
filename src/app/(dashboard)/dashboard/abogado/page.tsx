import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, Clock, CheckCircle, AlertCircle, Users, Scale, Calendar, Video } from "lucide-react";

export default async function AbogadoDashboardPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== UserRole.ABOGADO) {
    redirect("/sign-in");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    redirect("/sign-in");
  }

  // Obtener estadísticas de procesos
  const [
    procesosBorrador,
    procesosPresentados,
    procesosObservados,
    procesosAdmitidos,
    procesosCitados,
    totalProcesos,
  ] = await Promise.all([
    prisma.proceso.count({
      where: {
        estado: "BORRADOR",
        abogadoActorId: profile.id,
      },
    }),
    prisma.proceso.count({
      where: {
        estado: "PRESENTADO",
        abogadoActorId: profile.id,
      },
    }),
    prisma.proceso.count({
      where: {
        estado: "OBSERVADO",
        abogadoActorId: profile.id,
      },
    }),
    prisma.proceso.count({
      where: {
        estado: "ADMITIDO",
        abogadoActorId: profile.id,
      },
    }),
    prisma.proceso.count({
      where: {
        estado: "CITADO",
        abogadoActorId: profile.id,
      },
    }),
    prisma.proceso.count({
      where: {
        abogadoActorId: profile.id,
      },
    }),
  ]);

  // Obtener procesos observados (requieren corrección)
  const procesosParaCorregir = await prisma.proceso.findMany({
    where: {
      estado: "OBSERVADO",
      abogadoActorId: profile.id,
    },
    include: {
      clienteActor: true,
      juzgado: true,
      juez: true,
      demanda: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 5,
  });

  // Obtener procesos citados (requieren contestación de demandado)
  const procesosParaContestar = await prisma.proceso.findMany({
    where: {
      estado: "CITADO",
      abogadoActorId: profile.id,
    },
    include: {
      clienteActor: true,
      clienteDemandado: true,
      juzgado: true,
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
    take: 5,
  });

  // Obtener procesos en borrador (pendientes de presentar demanda)
  const procesosPendientes = await prisma.proceso.findMany({
    where: {
      estado: "BORRADOR",
      abogadoActorId: profile.id,
    },
    include: {
      clienteActor: true,
      juzgado: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

  // Obtener audiencias programadas próximas
  const audienciasProgramadas = await prisma.audiencia.findMany({
    where: {
      proceso: {
        OR: [
          { abogadoActorId: profile.id },
          { abogadoDemandadoId: profile.id },
        ],
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
          clienteDemandado: true,
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
        <h1 className="text-3xl font-bold tracking-tight">Dashboard del Abogado</h1>
        <p className="text-muted-foreground">
          Bienvenido, {profile.firstName} {profile.lastName}
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Borradores
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{procesosBorrador}</div>
            <p className="text-xs text-muted-foreground">
              Por presentar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Presentados
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{procesosPresentados}</div>
            <p className="text-xs text-muted-foreground">
              En revisión
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Observados
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{procesosObservados}</div>
            <p className="text-xs text-muted-foreground">
              Requieren corrección
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Admitidos
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{procesosAdmitidos}</div>
            <p className="text-xs text-muted-foreground">
              Demandas admitidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Citados
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{procesosCitados}</div>
            <p className="text-xs text-muted-foreground">
              Citación exitosa
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total
            </CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProcesos}</div>
            <p className="text-xs text-muted-foreground">
              Total de procesos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Demandas observadas - Requieren corrección */}
      {procesosParaCorregir.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Demandas Observadas - Requieren Corrección</CardTitle>
              <Link href="/dashboard/procesos?estado=OBSERVADO">
                <Button variant="outline" size="sm">
                  Ver todas
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {procesosParaCorregir.map((proceso) => (
                <div
                  key={proceso.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors border-orange-200 bg-orange-50/50"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {proceso.clienteActor.nombres} {proceso.clienteActor.apellidos}
                      </p>
                      <Badge variant="secondary">{proceso.materia}</Badge>
                      <Badge variant="outline" className="border-orange-600 text-orange-600">
                        Observado
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Juzgado: {proceso.juzgado.nombre}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      NUREJ: {proceso.nurej || "Sin asignar"}
                    </p>
                    {proceso.demanda?.observaciones && (
                      <p className="text-xs text-orange-600 mt-2">
                        <strong>Observación:</strong> {proceso.demanda.observaciones.substring(0, 100)}
                        {proceso.demanda.observaciones.length > 100 && "..."}
                      </p>
                    )}
                  </div>
                  <Link href={`/dashboard/procesos/${proceso.id}/demanda`}>
                    <Button size="sm" variant="default" className="bg-orange-500 hover:bg-orange-600">
                      Corregir Demanda
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Procesos citados - Pendiente de contestación */}
      {procesosParaContestar.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Procesos Citados - Pendiente de Contestación del Demandado</CardTitle>
              <Link href="/dashboard/procesos?estado=CITADO">
                <Button variant="outline" size="sm">
                  Ver todos
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {procesosParaContestar.map((proceso) => (
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
                    {proceso.clienteDemandado && (
                      <p className="text-sm text-muted-foreground">
                        Demandado: {proceso.clienteDemandado.nombres} {proceso.clienteDemandado.apellidos}
                      </p>
                    )}
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

      {/* Procesos pendientes de presentar demanda */}
      {procesosPendientes.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Procesos en Borrador - Presentar Demanda</CardTitle>
              <Link href="/dashboard/procesos?estado=BORRADOR">
                <Button variant="outline" size="sm">
                  Ver todos
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {procesosPendientes.map((proceso) => (
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
                      Juzgado: {proceso.juzgado.nombre}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Creado: {new Date(proceso.createdAt).toLocaleDateString("es-BO")}
                    </p>
                  </div>
                  <Link href={`/dashboard/procesos/${proceso.id}/demanda`}>
                    <Button size="sm">
                      Presentar Demanda
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
                  <Link href={`/dashboard/procesos/${audiencia.procesoId}/audiencias/${audiencia.id}`}>
                    <Button size="sm">Ver Audiencia</Button>
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
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Link href="/dashboard/procesos/nuevo">
            <Button className="w-full" variant="default">
              <FileText className="mr-2 h-4 w-4" />
              Nuevo Proceso
            </Button>
          </Link>
          <Link href="/dashboard/procesos">
            <Button className="w-full" variant="outline">
              <Scale className="mr-2 h-4 w-4" />
              Ver Todos los Procesos
            </Button>
          </Link>
          <Link href="/dashboard/clientes">
            <Button className="w-full" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Mis Clientes
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
