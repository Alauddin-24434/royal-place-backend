import express from "express";
import { authenticateUser } from "../../../middleware/authenticateUser";
import { authorizeRoles } from "../../../middleware/authorizeRoles";
import { dashboardController } from "../../../controllers/v1/dashboardControllers/dashboard.controllers";

const router = express.Router();

// ✅ Only one dashboard route (role-based)
router.get("/", authenticateUser, authorizeRoles("admin", "guest", "receptonist"), dashboardController.getDashboardData);

export const dashboardRoute = router;
