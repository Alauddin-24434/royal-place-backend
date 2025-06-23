import express from "express";
import { dashboardController } from "./dashboard.controller";

const router = express.Router();

router.get("/dashboard", dashboardController.getDashboardData);

export const dashboardRoute = router;
