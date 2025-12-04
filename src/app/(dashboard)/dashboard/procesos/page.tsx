import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { ProcesosList } from "@/components/procesos/procesos-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function ProcesosPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Only ABOGADO and JUEZ can access
  if (user.role !== UserRole.ABOGADO && user.role !== UserRole.JUEZ) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Procesos</h1>
          <p className="text-muted-foreground">
            {user.role === UserRole.ABOGADO
              ? "Gestiona tus procesos judiciales"
              : "Procesos asignados a tu juzgado"}
          </p>
        </div>
        {user.role === UserRole.ABOGADO && (
          <Link href="/dashboard/procesos/nuevo">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Proceso
            </Button>
          </Link>
        )}
      </div>

      <ProcesosList />
    </div>
  );
}
