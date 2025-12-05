import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, MapPin, FileText, Clock } from "lucide-react";
import Link from "next/link";
import { OrdenarCitacionDialog } from "@/components/citaciones/ordenar-citacion-dialog";
import { CitacionesList } from "@/components/citaciones/citaciones-list";

export default async function CitacionPage({ params }: { params: { id: string } }) {
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

  // Obtener proceso con relaciones
  const proceso = await prisma.proceso.findFirst({
    where: {
      id: params.id,
      juezId: profile.id,
    },
    include: {
      clienteActor: true,
      abogadoActor: true,
      juzgado: true,
      demanda: true,
      clienteDemandado: true,
    },
  });

  if (!proceso) {
    redirect("/dashboard/juez");
  }

  // Obtener citaciones del proceso
  const citaciones = await prisma.citacion.findMany({
    where: { procesoId: proceso.id },
    orderBy: { createdAt: "desc" },
  });

  // Verificar si se puede ordenar citación
  const puedeOrdenarCitacion = proceso.estado === "ADMITIDO" && citaciones.length === 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href={`/dashboard/procesos/${proceso.id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Expediente
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Citación</h1>
          <p className="text-muted-foreground">NUREJ: {proceso.nurej}</p>
        </div>
        {puedeOrdenarCitacion && (
          <OrdenarCitacionDialog procesoId={proceso.id} />
        )}
      </div>

      {/* Información del Demandado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Datos del Demandado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Nombres y Apellidos</p>
              <p className="font-medium">
                {proceso.demandadoNombres} {proceso.demandadoApellidos}
              </p>
            </div>

            {proceso.demandadoCI && (
              <div>
                <p className="text-sm text-muted-foreground">Cédula de Identidad</p>
                <p className="font-medium">{proceso.demandadoCI}</p>
              </div>
            )}

            {proceso.demandadoEdad && (
              <div>
                <p className="text-sm text-muted-foreground">Edad</p>
                <p className="font-medium">{proceso.demandadoEdad} años</p>
              </div>
            )}

            {proceso.demandadoEstadoCivil && (
              <div>
                <p className="text-sm text-muted-foreground">Estado Civil</p>
                <p className="font-medium">{proceso.demandadoEstadoCivil}</p>
              </div>
            )}

            {proceso.demandadoProfesion && (
              <div>
                <p className="text-sm text-muted-foreground">Profesión</p>
                <p className="font-medium">{proceso.demandadoProfesion}</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t space-y-4">
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Domicilio Real</p>
                <p className="font-medium">
                  {proceso.demandadoDomicilioReal || "No especificado"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Domicilio Procesal</p>
                <p className="font-medium">
                  {proceso.demandadoDomicilioProcesal || "No especificado"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de la Demanda */}
      {proceso.demanda && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Resumen de la Demanda
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Objeto</p>
              <p className="text-sm whitespace-pre-wrap">{proceso.demanda.objeto}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Petitorio</p>
              <p className="text-sm whitespace-pre-wrap">{proceso.demanda.petitorio}</p>
            </div>
            {proceso.demanda.valorDemanda && (
              <div>
                <p className="text-sm text-muted-foreground">Valor de la Demanda</p>
                <p className="font-medium">
                  Bs. {proceso.demanda.valorDemanda.toLocaleString("es-BO")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Citaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Citaciones del Proceso
          </CardTitle>
        </CardHeader>
        <CardContent>
          {citaciones.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {puedeOrdenarCitacion
                  ? "No se ha ordenado ninguna citación aún. Use el botón superior para ordenar la citación."
                  : "No hay citaciones registradas en este proceso."}
              </p>
            </div>
          ) : (
            <CitacionesList citaciones={citaciones} procesoId={proceso.id} />
          )}
        </CardContent>
      </Card>

      {/* Información Legal */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">Información Legal sobre Citaciones</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Citación Personal:</strong> El demandado recibe la cédula personalmente.
              Plazo: 30 días hábiles para contestar desde la citación exitosa.
            </p>
            <p>
              <strong>Citación por Cédula:</strong> Se entrega en el domicilio con persona mayor.
              Plazo: 30 días hábiles para contestar.
            </p>
            <p>
              <strong>Citación por Edictos:</strong> Publicación en prensa 3 veces (días alternos).
              Plazo: 20 días hábiles después de la última publicación.
            </p>
            <p>
              <strong>Citación Tácita:</strong> Cuando el demandado se apersona voluntariamente
              sin citación previa.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
