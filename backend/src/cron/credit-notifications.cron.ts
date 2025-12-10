// Cron job para notificações de créditos baixos e expirando
import cron from "node-cron";
import { CreditService } from "../services/credit.service";
import { CompanyNotificationService } from "../services/company-notification.service";
import { NotificationPriority, CreditType } from "@prisma/client";
import { prisma } from "../config/database";
import { logger } from "../config/logger";

/**
 * Executar a cada 6 horas
 * Notifica empresas sobre créditos baixos e expirando
 */
cron.schedule("0 */6 * * *", async () => {
  try {
    logger.info("[CRON] Starting credit alerts check...");

    // 1. Créditos baixos (< 2 restantes)
    const lowCredits = await CreditService.getCompaniesWithLowCredits(2);

    for (const { companyId, creditType, amount } of lowCredits) {
      const creditTypeNames: Record<string, string> = {
        FEATURED: "Featured",
        HOMEPAGE: "Homepage",
        URGENT: "Urgente",
      };

      await CompanyNotificationService.createNotification(
        companyId,
        "CREDIT_LOW",
        "Créditos Baixos",
        `Restam apenas ${amount} crédito(s) ${creditTypeNames[creditType]}. Considere adquirir mais para manter suas vagas em destaque.`,
        { creditType: creditType as CreditType },
        NotificationPriority.HIGH
      );

      // Marcar como notificado para não enviar novamente
      await prisma.creditBalance.updateMany({
        where: {
          companyId,
          creditType: creditType as CreditType,
          amount: { lte: 2, gt: 0 },
        },
        data: {
          lowCreditNotified: true,
        },
      });
    }

    // 2. Créditos expirando em 7 dias
    const expiring = await CreditService.getExpiringCredits(7);

    for (const { companyId, creditType, amount, expiresAt } of expiring) {
      const creditTypeNames: Record<string, string> = {
        FEATURED: "Featured",
        HOMEPAGE: "Homepage",
        URGENT: "Urgente",
      };

      const daysUntilExpiry = Math.ceil(
        (expiresAt!.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );

      await CompanyNotificationService.createNotification(
        companyId,
        "CREDIT_EXPIRING",
        "Créditos a Expirar",
        `${amount} crédito(s) ${creditTypeNames[creditType]} vão expirar em ${daysUntilExpiry} dia(s). Use-os antes de perder!`,
        { creditType: creditType as CreditType },
        NotificationPriority.HIGH
      );

      // Marcar como notificado
      await prisma.creditBalance.updateMany({
        where: {
          companyId,
          creditType: creditType as CreditType,
          expiresAt: expiresAt,
        },
        data: {
          expiryNotified: true,
        },
      });
    }

    logger.info(
      `[CRON] Credit alerts completed. Sent ${lowCredits.length} low credit alerts, ${expiring.length} expiry alerts.`
    );
  } catch (error) {
    logger.error("[CRON] Error in credit notifications job:", error);
  }
});

logger.info("[CRON] Credit notifications job scheduled (every 6 hours)");

