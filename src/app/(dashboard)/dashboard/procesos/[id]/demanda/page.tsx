import { redirect } from "next/navigation";
import { getCurrentUser, requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { DemandaWizard } from "@/components/demandas/demanda-wizard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { EstadoProceso } from "@prisma/client";

interface DemandaPageProps {
  params: Promise<{ id: string }>;
}

export default async function DemandaPage({ params }: DemandaPageProps) {
  const { id } = await params;

  // Verificar autenticación y rol
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");

  const hasPermission = await requireRole(user.id, ["ABOGADO"]);
  if (!hasPermission) {
    redirect("/dashboard");
  }

  // Obtener perfil del abogado
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
      abogadoActorId: profile.id,
    },
    include: {
      juzgado: true,
      clienteActor: true,
      abogadoActor: true,
      demanda: true,
    },
  });

  if (!proceso) {
    redirect("/dashboard/procesos");
  }

  // Verificar que el proceso esté en estado BORRADOR o OBSERVADO
  const isEditable = proceso.estado === EstadoProceso.BORRADOR || proceso.estado === EstadoProceso.OBSERVADO;

  if (!isEditable) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Este proceso ya tiene una demanda {proceso.estado === EstadoProceso.PRESENTADO && "presentada"}
            {proceso.estado === EstadoProceso.ADMITIDO && "admitida"}
            {proceso.estado === EstadoProceso.RECHAZADO && "rechazada"}.
            No puede modificar la demanda en este estado.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const isCorreccion = proceso.estado === EstadoProceso.OBSERVADO;

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {isCorreccion ? "Corregir Demanda Observada" : "Presentar Demanda"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Proceso {proceso.nurej || proceso.id} - {proceso.materia}
          </p>
        </div>
      </div>

      {isCorreccion && proceso.demanda && proceso.demanda.observaciones && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <div className="ml-2">
            <p className="font-semibold text-orange-900 mb-1">
              Observaciones del Juez
            </p>
            <AlertDescription className="text-orange-800">
              {proceso.demanda.observaciones}
            </AlertDescription>
          </div>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {isCorreccion ? "Corrección de Demanda" : "Demanda según Art. 110"}
          </CardTitle>
          <CardDescription>
            {isCorreccion
              ? "Corrija los puntos observados por el juez y vuelva a presentar la demanda."
              : "Complete todos los campos requeridos según el Código Procesal Civil. Los campos marcados con (*) son obligatorios."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DemandaWizard proceso={proceso as any} isCorreccion={isCorreccion} />
        </CardContent>
      </Card>
    </div>
  );
}
