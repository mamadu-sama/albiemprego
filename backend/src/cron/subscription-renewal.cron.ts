// Cron job para renovação automática de assinaturas
import cron from "node-cron";
import { CompanySubscriptionService } from "../services/company-subscription.service";
import { CompanyNotificationService } from "../services/company-notification.service";
import { NotificationPriority } from "@prisma/client";
import { logger } from "../config/logger";

/**
 * Executar todo dia à meia-noite
 * Verifica assinaturas expiradas e renova automaticamente
 * Também notifica sobre renovações próximas (3 dias antes)
 */
cron.schedule("0 0 * * *", async () => {
  try {
    logger.info("[CRON] Starting subscription renewal check...");

    // 1. Renovar assinaturas expiradas
    await CompanySubscriptionService.checkAndRenewExpiredSubscriptions();

    // 2. Notificar sobre renovações próximas (3 dias antes)
    const upcomingRenewals = await CompanySubscriptionService.getUpcomingRenewals(3);

    for (const sub of upcomingRenewals) {
      const daysUntil = Math.ceil(
        (sub.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );

      await CompanyNotificationService.createNotification(
        sub.companyId,
        "RENEWAL_UPCOMING",
        "Renovação Próxima",
        `O seu plano ${sub.plan.name} será renovado automaticamente em ${daysUntil} dia(s).`,
        undefined,
        NotificationPriority.NORMAL
      );
    }

    logger.info(`[CRON] Subscription renewal check completed. Notified ${upcomingRenewals.length} companies.`);
  } catch (error) {
    logger.error("[CRON] Error in subscription renewal job:", error);
  }
});

logger.info("[CRON] Subscription renewal job scheduled (daily at midnight)");

