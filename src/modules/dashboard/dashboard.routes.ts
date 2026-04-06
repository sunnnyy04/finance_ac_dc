import { Router } from "express";
import { DashboardController } from "./dashboard.controller.js";
import { requireAuth, requireRoles } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.get(
  "/summary",
  requireRoles(["ANALYST", "ADMIN"]),
  DashboardController.getSummary
);

router.get(
  "/trends",
  requireRoles(["ANALYST", "ADMIN"]),
  DashboardController.getTrends
);

export default router;
