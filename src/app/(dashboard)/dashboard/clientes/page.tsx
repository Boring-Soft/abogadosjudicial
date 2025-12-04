import { redirect } from "next/navigation";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { ClientesTable } from "@/components/clientes/clientes-table";
import { CreateClienteDialog } from "@/components/clientes/create-cliente-dialog";

export default async function ClientesPage() {
  // Require ABOGADO role
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");

  const hasPermission = await requireRole(user.id, [UserRole.ABOGADO]);
  if (!hasPermission) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gestiona tus clientes y sus datos personales
          </p>
        </div>
        <CreateClienteDialog />
      </div>

      <ClientesTable />
    </div>
  );
}
