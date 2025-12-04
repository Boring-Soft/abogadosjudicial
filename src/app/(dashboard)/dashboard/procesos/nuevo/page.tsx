import { redirect } from "next/navigation";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { ProcesoWizard } from "@/components/procesos/proceso-wizard";

export default async function NuevoProcesoPage() {
  // Require ABOGADO role
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");

  const hasPermission = await requireRole(user.id, [UserRole.ABOGADO]);
  if (!hasPermission) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nuevo Proceso</h1>
        <p className="text-muted-foreground">
          Crea un nuevo proceso judicial siguiendo los pasos del wizard
        </p>
      </div>

      <ProcesoWizard />
    </div>
  );
}
