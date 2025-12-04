import { redirect } from "next/navigation";
import { getCurrentUser, requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, AlertCircle } from "lucide-react";
import Link from "next/link";
import { EstadoProceso } from "@prisma/client";

export default async function DemandasJuezPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");

  const hasPermission = await requireRole(user.id, ["JUEZ"]);
  if (!hasPermission) {
    redirect("/dashboard");
  }

  // Obtener perfil del juez
  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    include: {
      juzgado: true,
    },
  });

  if (!profile || !profile.juzgadoId) {
    redirect("/dashboard");
  }

  // Obtener demandas pendientes de admisión (estado PRESENTADO)
  const demandasPendientes = await prisma.demanda.findMany({
    where: {
      proceso: {
        juzgadoId: profile.juzgadoId,
        estado: EstadoProceso.PRESENTADO,
      },
    },
    include: {
      proceso: {
        include: {
          juzgado: true,
          clienteActor: true,
          abogadoActor: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Obtener demandas observadas
  const demandasObservadas = await prisma.demanda.findMany({
    where: {
      proceso: {
        juzgadoId: profile.juzgadoId,
        estado: EstadoProceso.OBSERVADO,
      },
    },
    include: {
      proceso: {
        include: {
          juzgado: true,
          clienteActor: true,
          abogadoActor: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Demandas</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona las demandas presentadas en {profile.juzgado?.nombre}
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pendientes de Admisión</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demandasPendientes.length}</div>
            <p className="text-xs text-muted-foreground">Requieren revisión</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Observadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demandasObservadas.length}</div>
            <p className="text-xs text-muted-foreground">Pendientes de corrección</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total del Día</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {demandasPendientes.length + demandasObservadas.length}
            </div>
            <p className="text-xs text-muted-foreground">Demandas para revisar</p>
          </CardContent>
        </Card>
      </div>

      {/* Demandas Pendientes de Admisión */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Demandas Pendientes de Admisión
          </CardTitle>
          <CardDescription>
            Demandas que requieren revisión y decisión (Admitir, Observar o Rechazar)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {demandasPendientes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <p className="text-muted-foreground mt-4">No hay demandas pendientes de admisión</p>
            </div>
          ) : (
            <div className="space-y-4">
              {demandasPendientes.map((demanda) => (
                <Card key={demanda.id} className="hover:bg-accent transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            {demanda.proceso.nurej || `PROC-${demanda.proceso.id.slice(0, 8)}`}
                          </h3>
                          <Badge variant="default" className="bg-yellow-500">
                            PRESENTADO
                          </Badge>
                          <Badge variant="outline">{demanda.proceso.materia}</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-muted-foreground">Actor</p>
                            <p className="font-medium">
                              {demanda.proceso.clienteActor.nombres}{" "}
                              {demanda.proceso.clienteActor.apellidos}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Abogado</p>
                            <p className="font-medium">
                              {demanda.proceso.abogadoActor.firstName}{" "}
                              {demanda.proceso.abogadoActor.lastName}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Tipo de Proceso</p>
                            <p className="font-medium">{demanda.proceso.tipoProceso}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Fecha de Presentación</p>
                            <p className="font-medium">
                              {new Date(demanda.createdAt).toLocaleDateString("es-BO")}
                            </p>
                          </div>
                        </div>

                        <div className="text-sm">
                          <p className="text-muted-foreground mb-1">Cuantía</p>
                          <p className="font-semibold">
                            Bs.{" "}
                            {demanda.valorDemanda.toLocaleString("es-BO", {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Link href={`/dashboard/juez/demandas/${demanda.id}`}>
                          <Button>
                            <Eye className="h-4 w-4 mr-2" />
                            Revisar Demanda
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Demandas Observadas */}
      {demandasObservadas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Demandas Observadas
            </CardTitle>
            <CardDescription>
              Demandas que fueron observadas y están pendientes de corrección por el abogado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {demandasObservadas.map((demanda) => (
                <Card key={demanda.id} className="border-orange-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            {demanda.proceso.nurej || `PROC-${demanda.proceso.id.slice(0, 8)}`}
                          </h3>
                          <Badge variant="default" className="bg-orange-500">
                            OBSERVADO
                          </Badge>
                          <Badge variant="outline">{demanda.proceso.materia}</Badge>
                        </div>

                        <div className="text-sm space-y-2">
                          <div>
                            <p className="text-muted-foreground">Actor</p>
                            <p className="font-medium">
                              {demanda.proceso.clienteActor.nombres}{" "}
                              {demanda.proceso.clienteActor.apellidos}
                            </p>
                          </div>
                          {demanda.observaciones && (
                            <div className="bg-orange-50 p-3 rounded-md">
                              <p className="text-xs text-muted-foreground mb-1">
                                Observaciones realizadas
                              </p>
                              <p className="text-sm">{demanda.observaciones}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-muted-foreground">Versión</p>
                            <p className="font-medium">v{demanda.version}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Link href={`/dashboard/juez/demandas/${demanda.id}`}>
                          <Button variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
