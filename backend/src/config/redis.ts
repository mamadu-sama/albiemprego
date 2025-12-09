// Configuração do Redis Client
import { createClient } from "redis";
import { logger } from "./logger";

export const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        logger.error("✗ Redis: Máximo de tentativas de reconexão atingido");
        return new Error("Redis: Máximo de tentativas de reconexão atingido");
      }
      return Math.min(retries * 100, 3000);
    },
  },
});

redisClient.on("error", (err) => {
  logger.error("✗ Redis Error:", err);
});

redisClient.on("connect", () => {
  logger.info("✓ Conectando ao Redis...");
});

redisClient.on("ready", () => {
  logger.info("✓ Redis pronto para uso");
});

redisClient.on("reconnecting", () => {
  logger.warn("⚠ Redis reconectando...");
});

// Conectar ao Redis
redisClient.connect().catch((err) => {
  logger.error("✗ Erro ao conectar ao Redis:", err);
});

// Funções helper para cache
export const cacheGet = async <T>(key: string): Promise<T | null> => {
  try {
    const cached = await redisClient.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    logger.error(`Erro ao buscar cache [${key}]:`, error);
    return null;
  }
};

export const cacheSet = async (
  key: string,
  value: any,
  ttl: number = 300
): Promise<void> => {
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
  } catch (error) {
    logger.error(`Erro ao salvar cache [${key}]:`, error);
  }
};

export const cacheDelete = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key);
  } catch (error) {
    logger.error(`Erro ao deletar cache [${key}]:`, error);
  }
};

export const cacheDeletePattern = async (pattern: string): Promise<void> => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    logger.error(`Erro ao deletar padrão de cache [${pattern}]:`, error);
  }
};

// Graceful shutdown
process.on("beforeExit", async () => {
  await redisClient.quit();
  logger.info("✓ Desconectado do Redis");
});

export default redisClient;

