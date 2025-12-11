// Rotas de gestão de modo de manutenção para administradores
import { Router } from "express";
import { AdminMaintenanceController } from "../controllers/admin-maintenance.controller";
import { authenticateToken, authorize } from "../middlewares/auth.middleware";
import { updateMaintenanceValidation } from "../validators/admin-maintenance.validator";

const router = Router();

// Todas as rotas requerem autenticação + ADMIN
router.use(authenticateToken);
router.use(authorize("ADMIN"));

// ==========================================
// MODO DE MANUTENÇÃO
// ==========================================

// GET /api/admin/maintenance - Obter estado do modo de manutenção
router.get("/maintenance", AdminMaintenanceController.getMaintenanceStatus);

// PUT /api/admin/maintenance - Atualizar modo de manutenção
router.put(
  "/maintenance",
  updateMaintenanceValidation,
  AdminMaintenanceController.updateMaintenance
);

export default router;

