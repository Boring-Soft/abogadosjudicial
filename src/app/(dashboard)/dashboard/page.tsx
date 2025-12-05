import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  // Redirigir según el rol del usuario
  if (session.user.role === UserRole.JUEZ) {
    redirect("/dashboard/juez");
  }

  if (session.user.role === UserRole.ABOGADO) {
    redirect("/dashboard/abogado");
  }

  // Para otros roles (ADMIN, SECRETARIO, etc.) mostrar dashboard genérico
  redirect("/dashboard/procesos");
} 