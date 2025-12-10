// Seed de planos e pacotes para Castelo Branco
import { PrismaClient, CreditDuration } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding planos e pacotes para Castelo Branco...');

  // ==========================================
  // CRIAR PLANOS
  // ==========================================

  console.log('\n📦 Criando planos de assinatura...');

  const basicPlan = await prisma.subscriptionPlan.upsert({
    where: { name: 'Básico' },
    update: {},
    create: {
      name: 'Básico',
      description: 'Ideal para pequenas empresas locais',
      price: 0,
      maxJobs: 5,
      featuredCreditsMonthly: 1,
      homepageCreditsMonthly: 0,
      urgentCreditsMonthly: 0,
      creditDuration: CreditDuration.DAYS_7,
      features: JSON.stringify([
        'Até 5 vagas ativas',
        '1 destaque na listagem/mês (7 dias)',
        'Visualização de candidaturas',
        'Perfil básico da empresa',
        'Suporte por email',
      ]),
      isActive: true,
      isPopular: false,
      displayOrder: 1,
    },
  });

  console.log(`✓ Plano "${basicPlan.name}" criado (ID: ${basicPlan.id})`);

  const professionalPlan = await prisma.subscriptionPlan.upsert({
    where: { name: 'Profissional' },
    update: {},
    create: {
      name: 'Profissional',
      description: 'Melhor para empresas em crescimento',
      price: 35,
      maxJobs: 20,
      featuredCreditsMonthly: 3,
      homepageCreditsMonthly: 1,
      urgentCreditsMonthly: 1,
      creditDuration: CreditDuration.DAYS_7,
      features: JSON.stringify([
        'Até 20 vagas ativas',
        '3 destaques na listagem/mês (7 dias)',
        '1 destaque na homepage/mês (7 dias)',
        '1 badge urgente/mês (7 dias)',
        'Perfil completo da empresa',
        'Suporte prioritário',
      ]),
      isActive: true,
      isPopular: true, // Mais popular
      displayOrder: 2,
    },
  });

  console.log(`✓ Plano "${professionalPlan.name}" criado (ID: ${professionalPlan.id})`);

  const premiumPlan = await prisma.subscriptionPlan.upsert({
    where: { name: 'Premium' },
    update: {},
    create: {
      name: 'Premium',
      description: 'Solução completa para máxima visibilidade',
      price: 75,
      maxJobs: -1, // ilimitado
      featuredCreditsMonthly: 5,
      homepageCreditsMonthly: 3,
      urgentCreditsMonthly: 3,
      creditDuration: CreditDuration.DAYS_14, // Premium: 14 dias
      features: JSON.stringify([
        'Vagas ilimitadas',
        '5 destaques na listagem/mês (14 dias)',
        '3 destaques na homepage/mês (14 dias)',
        '3 badges urgente/mês (14 dias)',
        'Perfil premium com destaque',
        'Analytics avançado',
        'Suporte dedicado 24/7',
      ]),
      isActive: true,
      isPopular: false,
      displayOrder: 3,
    },
  });

  console.log(`✓ Plano "${premiumPlan.name}" criado (ID: ${premiumPlan.id})`);

  // ==========================================
  // CRIAR PACOTES DE CRÉDITOS
  // ==========================================

  console.log('\n💳 Criando pacotes de créditos...');

  const starterPackage = await prisma.creditPackage.create({
    data: {
      name: 'Starter',
      description: 'Ideal para começar',
      price: 15,
      featuredCredits: 3,
      homepageCredits: 0,
      urgentCredits: 0,
      creditDuration: CreditDuration.DAYS_7,
      isActive: true,
      displayOrder: 1,
    },
  });

  console.log(`✓ Pacote "${starterPackage.name}" criado (ID: ${starterPackage.id})`);

  const localBoostPackage = await prisma.creditPackage.create({
    data: {
      name: 'Local Boost',
      description: 'Aumente sua visibilidade local',
      price: 35,
      featuredCredits: 5,
      homepageCredits: 2,
      urgentCredits: 0,
      creditDuration: CreditDuration.DAYS_7,
      isActive: true,
      displayOrder: 2,
    },
  });

  console.log(`✓ Pacote "${localBoostPackage.name}" criado (ID: ${localBoostPackage.id})`);

  const completoPackage = await prisma.creditPackage.create({
    data: {
      name: 'Completo',
      description: 'Pacote completo de visibilidade',
      price: 60,
      featuredCredits: 8,
      homepageCredits: 4,
      urgentCredits: 2,
      creditDuration: CreditDuration.DAYS_7,
      isActive: true,
      displayOrder: 3,
    },
  });

  console.log(`✓ Pacote "${completoPackage.name}" criado (ID: ${completoPackage.id})`);

  const campanhaPackage = await prisma.creditPackage.create({
    data: {
      name: 'Campanha',
      description: 'Máxima visibilidade por mais tempo',
      price: 95,
      featuredCredits: 15,
      homepageCredits: 5,
      urgentCredits: 3,
      creditDuration: CreditDuration.DAYS_14,
      isActive: true,
      displayOrder: 4,
    },
  });

  console.log(`✓ Pacote "${campanhaPackage.name}" criado (ID: ${campanhaPackage.id})`);

  console.log('\n✅ Seed concluído com sucesso!');
  console.log('\n📊 Resumo:');
  console.log(`   - ${3} planos de assinatura criados`);
  console.log(`   - ${4} pacotes de créditos criados`);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

