import { redirect } from "next/navigation";
import { getCurrentUser, requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContestacionWizard } from "@/components/contestaciones/contestacion-wizard";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import {
  Clock,
  AlertCircle,
  FileText,
  User,
  Scale,
  Calendar,
} from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ContestacionPage({ params }: PageProps) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const hasPermission = await requireRole(user.id, ["ABOGADO"]);
  if (!hasPermission) {
    redirect("/dashboard");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  if (!profile) {
    redirect("/dashboard");
  }

  // Obtener proceso con todas las relaciones necesarias
  const proceso = await prisma.proceso.findFirst({
    where: {
      id,
      // Permitir acceso si el proceso no tiene abogado demandado asignado
      // o si el usuario es el abogado demandado
      OR: [
        { abogadoDemandadoId: null },
        { abogadoDemandadoId: profile.id },
      ],
    },
    include: {
      clienteActor: true,
      abogadoActor: true,
      demanda: true,
      citaciones: {
        orderBy: { createdAt: "desc" },
      },
      juzgado: true,
      contestacion: true,
    },
  });

  if (!proceso) {
    redirect("/dashboard");
  }

  // Verificar que existe una citación exitosa
  const citacionExitosa = proceso.citaciones.find(
    (c) => c.estado === "EXITOSA"
  );

  if (!citacionExitosa || !citacionExitosa.fechaCitacion) {
    redirect(`/dashboard/procesos/${id}`);
  }

  // Calcular días restantes para contestar
  const plazoBase = citacionExitosa.tipoCitacion === "EDICTO" ? 20 : 30;
  const fechaCitacion = new Date(citacionExitosa.fechaCitacion);
  const fechaVencimiento = new Date(fechaCitacion);
  fechaVencimiento.setDate(fechaVencimiento.getDate() + plazoBase);

  const diasRestantes = differenceInDays(fechaVencimiento, new Date());
  const plazoVencido = diasRestantes < 0;

  // Si ya existe contestación, redirigir a vista de lectura
  if (proceso.contestacion) {
    redirect(`/dashboard/procesos/${id}`);
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Presentar Contestación</h1>
        <p className="text-muted-foreground">
          Proceso {proceso.nurej || proceso.id}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Columna principal - Wizard */}
        <div className="lg:col-span-2">
          <ContestacionWizard procesoId={proceso.id} />
        </div>

        {/* Columna lateral - Información */}
        <div className="space-y-4">
          {/* Plazo */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Plazo para Contestar</h3>
            </div>

            {plazoVencido ? (
              <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 p-3">
                <p className="text-sm text-red-900 dark:text-red-100 font-medium">
                  ⚠️ Plazo vencido
                </p>
                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                  El plazo venció hace {Math.abs(diasRestantes)} días
                </p>
              </div>
            ) : (
              <div
                className={`rounded-lg border p-3 ${
                  diasRestantes <= 5
                    ? "border-orange-200 bg-orange-50 dark:bg-orange-950"
                    : "border-green-200 bg-green-50 dark:bg-green-950"
                }`}
              >
                <p
                  className={`text-2xl font-bold ${
                    diasRestantes <= 5
                      ? "text-orange-900 dark:text-orange-100"
                      : "text-green-900 dark:text-green-100"
                  }`}
                >
                  {diasRestantes} días
                </p>
                <p
                  className={`text-xs mt-1 ${
                    diasRestantes <= 5
                      ? "text-orange-700 dark:text-orange-300"
                      : "text-green-700 dark:text-green-300"
                  }`}
                >
                  Vence el {format(fechaVencimiento, "dd/MM/yyyy", { locale: es })}
                </p>
              </div>
            )}

            <div className="mt-3 text-xs text-muted-foreground">
              <p>Citado el: {format(fechaCitacion, "dd/MM/yyyy", { locale: es })}</p>
              <p>Plazo: {plazoBase} días hábiles</p>
            </div>
          </Card>

          {/* Información de las partes */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Partes del Proceso</h3>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground font-medium">DEMANDANTE</p>
                <p className="text-sm font-medium">
                  {proceso.clienteActor.nombres} {proceso.clienteActor.apellidos}
                </p>
                <p className="text-xs text-muted-foreground">
                  CI: {proceso.clienteActor.ci}
                </p>
              </div>

              <div className="border-t pt-3">
                <p className="text-xs text-muted-foreground font-medium">
                  ABOGADO DEMANDANTE
                </p>
                <p className="text-sm font-medium">
                  {proceso.abogadoActor.firstName} {proceso.abogadoActor.lastName}
                </p>
              </div>

              <div className="border-t pt-3">
                <p className="text-xs text-muted-foreground font-medium">JUZGADO</p>
                <p className="text-sm">{proceso.juzgado.nombre}</p>
              </div>
            </div>
          </Card>

          {/* Información de la demanda */}
          {proceso.demanda && (
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Demanda</h3>
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Objeto</p>
                  <p className="text-sm line-clamp-3">{proceso.demanda.objeto}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Petitorio</p>
                  <p className="text-sm line-clamp-2">{proceso.demanda.petitorio}</p>
                </div>

                {proceso.cuantia && (
                  <div>
                    <p className="text-xs text-muted-foreground">Cuantía</p>
                    <p className="text-sm font-medium">
                      Bs. {proceso.cuantia.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Recordatorios legales */}
          <Card className="p-4 border-blue-200 bg-blue-50 dark:bg-blue-950">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-100">
                  Recordatorios
                </h3>
                <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                  <li>Debe responder a todos los hechos de la demanda</li>
                  <li>Ofrezca toda la prueba de descargo disponible</li>
                  <li>
                    Las excepciones previas deben fundamentarse adecuadamente
                  </li>
                  <li>La reconvención debe cumplir requisitos de demanda</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
