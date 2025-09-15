import { PrismaClient, UserRole } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { KEY } from '@/types/key';
import { encryptPasswordForTCC } from '@/utils/vigenereCipher';

// Instancia o Prisma Client
const prisma = new PrismaClient();

const encryptionKey = process.env.ENCRYPTION_KEY || KEY;


async function main() {
  console.log('🚀 Iniciando o processo de seed...');

  console.log('🗑️  Limpando dados existentes...');
  // Apaga em uma ordem que respeita as constraints de chave estrangeira
  await prisma.address.deleteMany({});
  await prisma.coach.deleteMany({});
  await prisma.athlete.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('✅ Dados limpos.');

  const defaultPassword = '123456789';
  const encryptedPassword = encryptPasswordForTCC(defaultPassword, encryptionKey);
  console.log(`🔒 Senha padrão '${defaultPassword}' criptografada.`);

  const totalUsers = 40;
  console.log(`🌱 Criando ${totalUsers} usuários...`);

  for (let i = 0; i < totalUsers; i++) {
    let role: UserRole;

    if (i < 2) {
      role = UserRole.Admin;
    } else if (i < 22) {
      role = UserRole.Atleta;
    } else {
      role = UserRole.Treinador;
    }

    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: encryptedPassword,
        onboardingCompleted: true,
        birthDate: faker.date.birthdate({ min: 18, max: 45, mode: 'age' }),
        bio: faker.lorem.sentence(),
        role: role,
        address: {
          create: {
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state({ abbreviated: true }),
            zipCode: faker.location.zipCode(),
            country: 'Brasil',
          },
        },
        ...(role === UserRole.Atleta && {
          athlete: {
            create: {
              sport: faker.helpers.arrayElement(['Futebol', 'Basquete', 'Vôlei', 'Natação', 'Atletismo']),
              height: faker.number.int({ min: 150, max: 210 }),
              weight: faker.number.float({ min: 50, max: 120, fractionDigits: 1 }),
              injuryHistory: faker.helpers.arrayElement([faker.lorem.sentence(), null]),
              // Campos novos para Atleta
              position: faker.helpers.arrayElement(['Atacante', 'Defensor', 'Goleiro', 'Meio-campo', 'Pivô', 'Ala', null]),
              level: faker.helpers.arrayElement(['Amador', 'Profissional', 'Iniciante']),
              gamesPlayed: faker.number.int({ min: 0, max: 200 }),
              goals: faker.number.int({ min: 0, max: 150 }),
            },
          },
        }),
        ...(role === UserRole.Treinador && {
          coach: {
            create: {
              experience: faker.lorem.paragraph(),
              hourlyRate: parseFloat(faker.commerce.price({ min: 50, max: 300 })),
              certifications: faker.lorem.words(5),
              // Campos novos para Treinador
              title: faker.person.jobTitle(),
              rating: faker.number.float({ min: 3, max: 5, fractionDigits: 1 }),
              careerStartDate: faker.date.past({ years: 20 }),
              stateTitles: faker.number.int({ min: 0, max: 10 }),
              coachedProfessionalAthletes: faker.number.int({ min: 0, max: 15 }),
            },
          },
        }),
      },
    });

    console.log(`   -> Criado usuário ${i + 1}/${totalUsers}: ${user.name} (${user.role})`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o processo de seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('🏁 Processo de seed finalizado.');
    await prisma.$disconnect();
  });