"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoute = void 0;
const express_1 = __importDefault(require("express"));
const dashboard_controller_1 = require("./dashboard.controller");
const authenticateUser_1 = require("../../middleware/authenticateUser");
const router = express_1.default.Router();
// ✅ Only one dashboard route (role-based)
router.get("/", authenticateUser_1.authenticateUser, dashboard_controller_1.dashboardController.getDashboardData);
exports.dashboardRoute = router;
