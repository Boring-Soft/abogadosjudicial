import { PrismaClient, UserRole } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { saltAndHashPassword } from '../src/lib/auth/password-crypto-server';

const prisma = new PrismaClient();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function main() {
  console.log('🌱 Iniciando seed de base de datos...');

  // Crear Juzgado de ejemplo
  const juzgado = await prisma.juzgado.upsert({
    where: { id: 'test-juzgado-1' },
    update: {},
    create: {
      id: 'test-juzgado-1',
      nombre: 'Juzgado de Instrucción Civil y Comercial N° 1',
      ciudad: 'La Paz',
      departamento: 'La Paz',
      direccion: 'Av. Mariscal Santa Cruz 1234',
      telefono: '2-123456',
      email: 'juzgado1@organojudicial.gob.bo',
      activo: true,
    },
  });
  console.log('✅ Juzgado creado:', juzgado.nombre);

  // Crear cuenta ABOGADO
  const abogadoEmail = 'abogado@test.com';
  const abogadoPassword = 'Test123456!';
  const abogadoHashedPassword = saltAndHashPassword(abogadoPassword, abogadoEmail);

  let abogadoAuthUser;
  try {
    // Intentar crear usuario en Supabase con contraseña hasheada
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: abogadoEmail,
      password: abogadoHashedPassword,
      email_confirm: true,
      user_metadata: {
        first_name: 'Juan',
        last_name: 'Pérez',
        role: UserRole.ABOGADO,
      },
    });

    if (authError) {
      console.log('⚠️  Usuario abogado ya existe en Supabase, continuando...');
      // Obtener usuario existente
      const { data: { users } } = await supabase.auth.admin.listUsers();
      abogadoAuthUser = users.find(u => u.email === abogadoEmail);
    } else {
      abogadoAuthUser = authData.user;
      console.log('✅ Usuario ABOGADO creado en Supabase');
    }
  } catch (error) {
    console.error('Error creando usuario abogado:', error);
  }

  if (abogadoAuthUser) {
    // Crear perfil en Prisma
    await prisma.profile.upsert({
      where: { userId: abogadoAuthUser.id },
      update: {},
      create: {
        userId: abogadoAuthUser.id,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: abogadoEmail,
        role: UserRole.ABOGADO,
        registroProfesional: 'LP-12345',
        telefono: '71234567',
        active: true,
      },
    });
    console.log('✅ Perfil ABOGADO creado');
    console.log(`📧 Email: ${abogadoEmail}`);
    console.log(`🔑 Password: ${abogadoPassword}`);
  }

  // Crear cuenta JUEZ
  const juezEmail = 'juez@test.com';
  const juezPassword = 'Test123456!';
  const juezHashedPassword = saltAndHashPassword(juezPassword, juezEmail);

  let juezAuthUser;
  try {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: juezEmail,
      password: juezHashedPassword,
      email_confirm: true,
      user_metadata: {
        first_name: 'María',
        last_name: 'González',
        role: UserRole.JUEZ,
      },
    });

    if (authError) {
      console.log('⚠️  Usuario juez ya existe en Supabase, continuando...');
      const { data: { users } } = await supabase.auth.admin.listUsers();
      juezAuthUser = users.find(u => u.email === juezEmail);
    } else {
      juezAuthUser = authData.user;
      console.log('✅ Usuario JUEZ creado en Supabase');
    }
  } catch (error) {
    console.error('Error creando usuario juez:', error);
  }

  if (juezAuthUser) {
    await prisma.profile.upsert({
      where: { userId: juezAuthUser.id },
      update: {},
      create: {
        userId: juezAuthUser.id,
        firstName: 'María',
        lastName: 'González',
        email: juezEmail,
        role: UserRole.JUEZ,
        juzgadoId: juzgado.id,
        telefono: '71234568',
        active: true,
      },
    });
    console.log('✅ Perfil JUEZ creado');
    console.log(`📧 Email: ${juezEmail}`);
    console.log(`🔑 Password: ${juezPassword}`);
  }

  console.log('');
  console.log('🎉 Seed completado exitosamente!');
  console.log('');
  console.log('=== CUENTAS DE PRUEBA ===');
  console.log('');
  console.log('ABOGADO:');
  console.log(`  Email: ${abogadoEmail}`);
  console.log(`  Password: ${abogadoPassword}`);
  console.log('');
  console.log('JUEZ:');
  console.log(`  Email: ${juezEmail}`);
  console.log(`  Password: ${juezPassword}`);
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
