import { redirect } from "next/navigation";
import { getCurrentUser, requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Calendar, Video, Users } from "lucide-react";
import { ProgramarAudienciaForm } from "@/components/audiencias/programar-audiencia-form";
import { AudienciasList } from "@/components/audiencias/audiencias-list";

interface AudienciaPageProps {
  params: Promise<{ id: string }>;
}

export default async function AudienciaPage({ params }: AudienciaPageProps) {
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

  // Obtener proceso con relaciones
  const proceso = await prisma.proceso.findFirst({
    where: {
      id,
      juezId: profile.id,
    },
    include: {
      juzgado: true,
      clienteActor: true,
      clienteDemandado: true,
      abogadoActor: true,
      abogadoDemandado: true,
      audiencias: {
        orderBy: {
          createdAt: "desc",
        },
      },
      contestacion: true,
    },
  });

  if (!proceso) {
    redirect("/dashboard/procesos");
  }

  // Verificar que el proceso esté en estado CITADO, CONTESTADO o ADMITIDO
  const puedeConvocar = ["CITADO", "CONTESTADO", "ADMITIDO", "AUDIENCIA_PRELIMINAR", "AUDIENCIA_COMPLEMENTARIA"].includes(
    proceso.estado
  );

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Audiencias</h1>
          <p className="text-muted-foreground mt-1">
            Proceso {proceso.nurej || proceso.id} - {proceso.materia}
          </p>
        </div>
      </div>

      {/* Información del Proceso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Partes del Proceso
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">ACTOR</p>
            <p className="font-medium">
              {proceso.clienteActor.nombres} {proceso.clienteActor.apellidos}
            </p>
            <p className="text-sm text-muted-foreground">
              Abogado: {proceso.abogadoActor.firstName} {proceso.abogadoActor.lastName}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">DEMANDADO</p>
            <p className="font-medium">
              {proceso.clienteDemandado
                ? `${proceso.clienteDemandado.nombres} ${proceso.clienteDemandado.apellidos}`
                : `${proceso.demandadoNombres} ${proceso.demandadoApellidos}`}
            </p>
            {proceso.abogadoDemandado && (
              <p className="text-sm text-muted-foreground">
                Abogado: {proceso.abogadoDemandado.firstName} {proceso.abogadoDemandado.lastName}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Audiencias Existentes */}
      {proceso.audiencias.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Audiencias del Proceso
            </CardTitle>
            <CardDescription>
              Historial de audiencias programadas y realizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AudienciasList audiencias={proceso.audiencias as any} procesoId={proceso.id} />
          </CardContent>
        </Card>
      )}

      {/* Programar Nueva Audiencia */}
      {puedeConvocar ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Programar Nueva Audiencia
            </CardTitle>
            <CardDescription>
              Complete los datos para convocar a audiencia preliminar o complementaria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProgramarAudienciaForm
              procesoId={proceso.id}
              estadoProceso={proceso.estado}
              tieneContestacion={!!proceso.contestacion}
            />
          </CardContent>
        </Card>
      ) : (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            El proceso debe estar en estado CITADO, CONTESTADO o ADMITIDO para poder programar una audiencia.
            Estado actual: {proceso.estado}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
