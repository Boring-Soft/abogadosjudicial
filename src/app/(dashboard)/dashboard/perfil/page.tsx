import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ProfileForm } from "@/components/profile/profile-form";
import { ChangePasswordForm } from "@/components/profile/change-password-form";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function PerfilPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch full profile with relations
  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    include: {
      juzgado: true,
    },
  });

  if (!profile) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
        <p className="text-muted-foreground">
          Gestiona tu información personal y preferencias
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Información Personal</h3>
            <p className="text-sm text-muted-foreground">
              Actualiza tus datos personales y de contacto
            </p>
          </div>
          <Separator />
          <ProfileForm profile={profile} />
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Cambiar Contraseña</h3>
            <p className="text-sm text-muted-foreground">
              Actualiza tu contraseña para mantener tu cuenta segura
            </p>
          </div>
          <Separator />
          <ChangePasswordForm />
        </div>
      </Card>
    </div>
  );
}
