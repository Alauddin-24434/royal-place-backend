import express from "express";
import { dashboardController } from "./dashboard.controller";
import { authenticateUser } from "../../middleware/authenticateUser";

const router = express.Router();

// ✅ Only one dashboard route (role-based)
router.get("/",  dashboardController.getDashboardData);

export const dashboardRoute = router;
