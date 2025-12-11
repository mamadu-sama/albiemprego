// Rotas públicas de manutenção (sem autenticação)
import { Router } from "express";
import { AdminMaintenanceController } from "../controllers/admin-maintenance.controller";

const router = Router();

// GET /api/v1/maintenance/status - Verificar estado do modo de manutenção (público)
router.get("/status", AdminMaintenanceController.getPublicMaintenanceStatus);

export default router;

