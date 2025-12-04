import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function cleanup() {
  console.log('🧹 Limpiando usuarios de prueba...');

  const testEmails = ['abogado@test.com', 'juez@test.com'];

  for (const email of testEmails) {
    try {
      // Buscar usuario en Supabase
      const { data: { users } } = await supabase.auth.admin.listUsers();
      const user = users.find(u => u.email === email);

      if (user) {
        // Eliminar perfil de Prisma primero
        await prisma.profile.deleteMany({
          where: { userId: user.id }
        });
        console.log(`✅ Perfil eliminado para ${email}`);

        // Eliminar usuario de Supabase
        await supabase.auth.admin.deleteUser(user.id);
        console.log(`✅ Usuario eliminado de Supabase: ${email}`);
      } else {
        console.log(`⚠️  Usuario no encontrado: ${email}`);
      }
    } catch (error) {
      console.error(`❌ Error eliminando ${email}:`, error);
    }
  }

  console.log('✅ Limpieza completada');
}

cleanup()
  .catch((e) => {
    console.error('❌ Error en cleanup:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
