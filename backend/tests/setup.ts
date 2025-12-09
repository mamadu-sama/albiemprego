// Setup global para testes
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/albiemprego_test?schema=public",
    },
  },
});

beforeAll(async () => {
  // Conectar ao banco de testes
  await prisma.$connect();
  console.log("✓ Conectado ao banco de dados de testes");
});

afterEach(async () => {
  // Limpar dados após cada teste (ordem importante por causa das foreign keys)
  const deleteMessages = prisma.message.deleteMany();
  const deleteConversations = prisma.conversation.deleteMany();
  const deleteNotifications = prisma.notification.deleteMany();
  const deleteApplications = prisma.application.deleteMany();
  const deleteJobs = prisma.job.deleteMany();
  const deleteLanguages = prisma.language.deleteMany();
  const deleteEducations = prisma.education.deleteMany();
  const deleteExperiences = prisma.experience.deleteMany();
  const deleteCompanies = prisma.company.deleteMany();
  const deleteCandidates = prisma.candidate.deleteMany();
  const deleteUsers = prisma.user.deleteMany();

  await prisma.$transaction([
    deleteMessages,
    deleteConversations,
    deleteNotifications,
    deleteApplications,
    deleteJobs,
    deleteLanguages,
    deleteEducations,
    deleteExperiences,
    deleteCompanies,
    deleteCandidates,
    deleteUsers,
  ]);
});

afterAll(async () => {
  await prisma.$disconnect();
  console.log("✓ Desconectado do banco de dados de testes");
});

// Helper para criar utilizador de teste
export const createTestUser = async (data: {
  email: string;
  password: string;
  name: string;
  type: "CANDIDATO" | "EMPRESA" | "ADMIN";
  status?: "ACTIVE" | "PENDING" | "SUSPENDED";
}) => {
  return await prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      name: data.name,
      type: data.type,
      status: data.status || "ACTIVE",
      emailVerified: true,
    },
  });
};

