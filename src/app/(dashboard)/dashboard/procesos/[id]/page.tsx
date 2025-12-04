import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { ExpedienteDigital } from "@/components/procesos/expediente-digital";

interface ProcesoDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProcesoDetailPage({
  params,
}: ProcesoDetailPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Only ABOGADO and JUEZ can access
  if (user.role !== UserRole.ABOGADO && user.role !== UserRole.JUEZ) {
    redirect("/dashboard");
  }

  return <ExpedienteDigital procesoId={id} userRole={user.role} />;
}
