// Configuração do Prisma Client
import { PrismaClient } from "@prisma/client";
import { logger } from "./logger";

// Singleton pattern para o Prisma Client
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Evento de conexão
prisma.$connect()
  .then(() => {
    logger.info("✓ Conectado ao PostgreSQL com sucesso");
  })
  .catch((error) => {
    logger.error("✗ Erro ao conectar ao PostgreSQL:", error);
    process.exit(1);
  });

// Graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
  logger.info("✓ Desconectado do PostgreSQL");
});

export default prisma;

