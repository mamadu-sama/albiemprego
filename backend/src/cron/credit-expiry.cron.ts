// Cron job para expiração de créditos e usos
import cron from "node-cron";
import { CreditService } from "../services/credit.service";
import { logger } from "../config/logger";

/**
 * Executar todo dia à meia-noite
 * Remove créditos expirados e desativa usos de créditos expirados
 */
cron.schedule("0 0 * * *", async () => {
  try {
    logger.info("[CRON] Starting credit expiry check...");

    // 1. Remover créditos expirados (> 90 dias)
    const removedCredits = await CreditService.removeExpiredCredits();

    // 2. Desativar usos de créditos que já passaram do endDate
    const deactivatedUsages = await CreditService.deactivateExpiredCreditUsages();

    logger.info(
      `[CRON] Credit expiry check completed. Removed ${removedCredits} expired credits, deactivated ${deactivatedUsages} usages.`
    );
  } catch (error) {
    logger.error("[CRON] Error in credit expiry job:", error);
  }
});

logger.info("[CRON] Credit expiry job scheduled (daily at midnight)");

