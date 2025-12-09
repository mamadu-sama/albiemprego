// Entry point do servidor
import app from "./app";
import { logger } from "./config/logger";

// Importar configs para inicializar conexões
import "./config/database";
import "./config/redis";

const PORT = parseInt(process.env.PORT || "3001");

// Iniciar servidor
const server = app.listen(PORT, "0.0.0.0", () => {
  logger.info(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║              🚀 AlbiEmprego Backend API                      ║
║                                                              ║
║  Environment: ${process.env.NODE_ENV?.padEnd(46) || "development".padEnd(46)}║
║  Port:        ${PORT.toString().padEnd(46)}║
║  URL:         http://localhost:${PORT}${" ".repeat(26)}║
║                                                              ║
║  Health:      http://localhost:${PORT}/health${" ".repeat(20)}║
║  API v1:      http://localhost:${PORT}/api/v1${" ".repeat(19)}║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
const gracefulShutdown = () => {
  logger.info("Recebido sinal de encerramento. A desligar gracefully...");
  
  server.close(() => {
    logger.info("✓ Servidor HTTP encerrado");
    process.exit(0);
  });

  // Forçar encerramento após 10 segundos
  setTimeout(() => {
    logger.error("Forçando encerramento após timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

export default server;

