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

  // Verificar que el proceso esté en estado BORRADOR
  if (proceso.estado !== EstadoProceso.BORRADOR) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Este proceso ya tiene una demanda {proceso.estado === EstadoProceso.PRESENTADO && "presentada"}
            {proceso.estado === EstadoProceso.OBSERVADO && "observada"}
            {proceso.estado === EstadoProceso.ADMITIDO && "admitida"}.
            {proceso.estado === EstadoProceso.OBSERVADO
              ? " Puede corregirla desde el expediente digital."
              : " No puede crear una nueva demanda."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Presentar Demanda</h1>
          <p className="text-muted-foreground mt-1">
            Proceso {proceso.nurej || proceso.id} - {proceso.materia}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Demanda según Art. 110</CardTitle>
          <CardDescription>
            Complete todos los campos requeridos según el Código Procesal Civil. Los campos marcados
            con (*) son obligatorios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DemandaWizard proceso={proceso as any} />
        </CardContent>
      </Card>
    </div>
  );
}
