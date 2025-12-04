import { redirect } from "next/navigation";
import { getCurrentUser, requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ProfileForm } from "@/components/profile/profile-form";
import { ChangePasswordForm } from "@/components/profile/change-password-form";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserRole } from "@prisma/client";

export default async function JuezPerfilPage() {
  // Require JUEZ role
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");

  const hasPermission = await requireRole(user.id, [UserRole.JUEZ]);
  if (!hasPermission) {
    redirect("/dashboard");
  }

  // Fetch full profile with juzgado relation
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
        <h1 className="text-3xl font-bold tracking-tight">Mi Perfil - Juez</h1>
        <p className="text-muted-foreground">
          Gestiona tu información personal y datos del juzgado
        </p>
      </div>

      {profile.juzgado && (
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Juzgado Asignado</h3>
              <p className="text-sm text-muted-foreground">
                Información del juzgado al que estás asignado
              </p>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Nombre del Juzgado
                </p>
                <p className="text-base font-semibold">{profile.juzgado.nombre}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Ciudad
                </p>
                <p className="text-base">{profile.juzgado.ciudad}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Departamento
                </p>
                <p className="text-base">{profile.juzgado.departamento}</p>
              </div>
              {profile.juzgado.direccion && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Dirección
                  </p>
                  <p className="text-base">{profile.juzgado.direccion}</p>
                </div>
              )}
              {profile.juzgado.telefono && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Teléfono del Juzgado
                  </p>
                  <p className="text-base">{profile.juzgado.telefono}</p>
                </div>
              )}
              {profile.juzgado.email && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Email del Juzgado
                  </p>
                  <p className="text-base">{profile.juzgado.email}</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

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
