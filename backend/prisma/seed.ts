// Seed de dados para desenvolvimento
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/password";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...\n");

  // Limpar dados existentes
  console.log("🧹 Limpando dados existentes...");
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.language.deleteMany();
  await prisma.education.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.company.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.user.deleteMany();
  console.log("✓ Dados limpos\n");

  // Criar Admin
  console.log("👤 Criando utilizador Admin...");
  const adminPassword = await hashPassword("Admin123!");
  const admin = await prisma.user.create({
    data: {
      email: "admin@albiemprego.pt",
      password: adminPassword,
      name: "Administrador",
      type: "ADMIN",
      status: "ACTIVE",
      emailVerified: true,
    },
  });
  console.log(`✓ Admin criado: ${admin.email}\n`);

  // Criar Candidatos
  console.log("👨‍💼 Criando candidatos...");
  const candidatePassword = await hashPassword("Candidato123!");

  const candidate1 = await prisma.user.create({
    data: {
      email: "joao.silva@example.com",
      password: candidatePassword,
      name: "João Silva",
      type: "CANDIDATO",
      status: "ACTIVE",
      emailVerified: true,
      phone: "+351912345678",
      location: "Castelo Branco",
      bio: "Desenvolvedor Full Stack com 5 anos de experiência em React e Node.js",
      candidate: {
        create: {
          skills: ["JavaScript", "TypeScript", "React", "Node.js", "PostgreSQL"],
          experienceYears: 5,
          currentPosition: "Full Stack Developer",
          profileCompleteness: 80,
        },
      },
    },
    include: { candidate: true },
  });

  await prisma.experience.create({
    data: {
      candidateId: candidate1.candidate!.id,
      company: "Tech Solutions Ltd",
      position: "Full Stack Developer",
      startDate: new Date("2020-01-01"),
      current: true,
      description: "Desenvolvimento de aplicações web com React e Node.js",
    },
  });

  await prisma.education.create({
    data: {
      candidateId: candidate1.candidate!.id,
      institution: "Instituto Politécnico de Castelo Branco",
      degree: "Licenciatura",
      field: "Engenharia Informática",
      startDate: new Date("2015-09-01"),
      endDate: new Date("2018-07-01"),
      current: false,
    },
  });

  await prisma.language.createMany({
    data: [
      {
        candidateId: candidate1.candidate!.id,
        language: "Português",
        level: "NATIVE",
      },
      {
        candidateId: candidate1.candidate!.id,
        language: "Inglês",
        level: "ADVANCED",
      },
    ],
  });

  const candidate2 = await prisma.user.create({
    data: {
      email: "maria.santos@example.com",
      password: candidatePassword,
      name: "Maria Santos",
      type: "CANDIDATO",
      status: "ACTIVE",
      emailVerified: true,
      phone: "+351923456789",
      location: "Castelo Branco",
      bio: "Designer UX/UI apaixonada por criar experiências digitais incríveis",
      candidate: {
        create: {
          skills: ["Figma", "Adobe XD", "Sketch", "UI Design", "UX Research"],
          experienceYears: 3,
          currentPosition: "UX/UI Designer",
          profileCompleteness: 75,
        },
      },
    },
    include: { candidate: true },
  });

  console.log(`✓ ${candidate1.name} criado`);
  console.log(`✓ ${candidate2.name} criado\n`);

  // Criar Empresas
  console.log("🏢 Criando empresas...");
  const companyPassword = await hashPassword("Empresa123!");

  const company1 = await prisma.user.create({
    data: {
      email: "rh@techsolutions.pt",
      password: companyPassword,
      name: "Tech Solutions",
      type: "EMPRESA",
      status: "ACTIVE",
      emailVerified: true,
      phone: "+351272000000",
      location: "Castelo Branco",
      company: {
        create: {
          name: "Tech Solutions Portugal",
          nif: "123456789",
          website: "https://techsolutions.pt",
          sector: "Tecnologia",
          employees: "10-50",
          description:
            "Empresa de desenvolvimento de software especializada em soluções web e mobile",
          approvedAt: new Date(),
        },
      },
    },
    include: { company: true },
  });

  const company2 = await prisma.user.create({
    data: {
      email: "recrutamento@castelo-digital.pt",
      password: companyPassword,
      name: "Castelo Digital",
      type: "EMPRESA",
      status: "ACTIVE",
      emailVerified: true,
      phone: "+351272111111",
      location: "Castelo Branco",
      company: {
        create: {
          name: "Castelo Digital, Lda",
          nif: "987654321",
          website: "https://castelo-digital.pt",
          sector: "Marketing Digital",
          employees: "5-10",
          description:
            "Agência de marketing digital focada em pequenas e médias empresas",
          approvedAt: new Date(),
        },
      },
    },
    include: { company: true },
  });

  // Empresa pendente (não aprovada)
  await prisma.user.create({
    data: {
      email: "info@startup-tech.pt",
      password: companyPassword,
      name: "Startup Tech",
      type: "EMPRESA",
      status: "PENDING",
      emailVerified: true,
      company: {
        create: {
          name: "Startup Tech Innovations",
          nif: "555666777",
          sector: "Tecnologia",
          description: "Startup de tecnologia em fase de crescimento",
        },
      },
    },
  });

  console.log(`✓ ${company1.company!.name} criada`);
  console.log(`✓ ${company2.company!.name} criada`);
  console.log(`✓ Startup Tech Innovations criada (PENDENTE)\n`);

  // Criar Vagas
  console.log("💼 Criando vagas de emprego...");

  const job1 = await prisma.job.create({
    data: {
      companyId: company1.company!.id,
      title: "Full Stack Developer - React & Node.js",
      description:
        "Procuramos um desenvolvedor Full Stack experiente para integrar a nossa equipa. Trabalharás em projetos desafiantes para clientes nacionais e internacionais.",
      requirements: [
        "3+ anos de experiência em desenvolvimento web",
        "Domínio de React e Node.js",
        "Experiência com PostgreSQL",
        "Conhecimentos de Git",
        "Boas capacidades de comunicação",
      ],
      responsibilities: [
        "Desenvolver e manter aplicações web",
        "Colaborar com a equipa de design",
        "Participar em code reviews",
        "Contribuir para a arquitetura técnica",
      ],
      benefits: [
        "Seguro de saúde",
        "Formação contínua",
        "Ambiente jovem e dinâmico",
        "Possibilidade de trabalho remoto",
      ],
      location: "Castelo Branco",
      type: "FULL_TIME",
      workMode: "HIBRIDO",
      salaryMin: 1500,
      salaryMax: 2500,
      salaryCurrency: "EUR",
      salaryPeriod: "month",
      showSalary: true,
      sector: "Tecnologia",
      experienceLevel: "mid",
      status: "ACTIVE",
      approvedAt: new Date(),
      publishedAt: new Date(),
    },
  });

  const job2 = await prisma.job.create({
    data: {
      companyId: company2.company!.id,
      title: "Designer UX/UI",
      description:
        "Estamos à procura de um designer talentoso para criar interfaces incríveis para os nossos clientes.",
      requirements: [
        "Portfolio demonstrável",
        "Experiência com Figma",
        "Conhecimentos de design system",
        "Criatividade e atenção ao detalhe",
      ],
      responsibilities: [
        "Criar wireframes e protótipos",
        "Desenhar interfaces web e mobile",
        "Colaborar com developers",
        "Realizar testes de usabilidade",
      ],
      benefits: [
        "Horário flexível",
        "Equipamento Apple",
        "Formação em design",
        "Projetos diversos",
      ],
      location: "Castelo Branco",
      type: "FULL_TIME",
      workMode: "PRESENCIAL",
      salaryMin: 1200,
      salaryMax: 1800,
      salaryCurrency: "EUR",
      salaryPeriod: "month",
      showSalary: false,
      sector: "Design",
      experienceLevel: "junior",
      status: "ACTIVE",
      approvedAt: new Date(),
      publishedAt: new Date(),
    },
  });

  await prisma.job.create({
    data: {
      companyId: company1.company!.id,
      title: "Estágio em Desenvolvimento Web",
      description:
        "Oportunidade de estágio para estudantes ou recém-licenciados em Informática.",
      requirements: [
        "Estudante ou licenciado em Informática",
        "Conhecimentos básicos de HTML, CSS, JavaScript",
        "Vontade de aprender",
        "Proatividade",
      ],
      responsibilities: [
        "Apoiar a equipa de desenvolvimento",
        "Desenvolver componentes frontend",
        "Participar em reuniões de equipa",
        "Aprender tecnologias modernas",
      ],
      benefits: [
        "Bolsa de estágio",
        "Formação on-the-job",
        "Mentoria dedicada",
        "Possibilidade de contratação",
      ],
      location: "Castelo Branco",
      type: "INTERNSHIP",
      workMode: "PRESENCIAL",
      salaryMin: 600,
      salaryMax: 800,
      salaryCurrency: "EUR",
      salaryPeriod: "month",
      showSalary: true,
      sector: "Tecnologia",
      experienceLevel: "entry",
      status: "ACTIVE",
      approvedAt: new Date(),
      publishedAt: new Date(),
    },
  });

  console.log(`✓ ${job1.title} criada`);
  console.log(`✓ ${job2.title} criada`);
  console.log(`✓ Estágio em Desenvolvimento Web criada\n`);

  // Criar algumas candidaturas
  console.log("📋 Criando candidaturas...");

  await prisma.application.create({
    data: {
      jobId: job1.id,
      candidateId: candidate1.candidate!.id,
      coverLetter:
        "Tenho muito interesse nesta posição e acredito que a minha experiência é uma ótima fit para a vossa equipa.",
      status: "IN_REVIEW",
      timeline: [
        {
          status: "NEW",
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          note: "Candidatura recebida",
        },
        {
          status: "VIEWED",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          note: "CV visualizado",
        },
        {
          status: "IN_REVIEW",
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          note: "Candidatura em análise pela equipa técnica",
        },
      ],
    },
  });

  await prisma.application.create({
    data: {
      jobId: job2.id,
      candidateId: candidate2.candidate!.id,
      coverLetter:
        "Sou apaixonada por design e adoraria contribuir para os vossos projetos!",
      status: "VIEWED",
      timeline: [
        {
          status: "NEW",
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          note: "Candidatura recebida",
        },
        {
          status: "VIEWED",
          date: new Date().toISOString(),
          note: "Portfolio analisado",
        },
      ],
    },
  });

  console.log("✓ 2 candidaturas criadas\n");

  // Criar modo de manutenção (desativado)
  await prisma.maintenanceMode.create({
    data: {
      enabled: false,
      message: null,
      estimatedEndTime: null,
    },
  });

  console.log("✅ Seed concluído com sucesso!\n");
  console.log("📝 Credenciais de teste:");
  console.log("   Admin: admin@albiemprego.pt / Admin123!");
  console.log("   Candidato: joao.silva@example.com / Candidato123!");
  console.log("   Empresa: rh@techsolutions.pt / Empresa123!\n");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

