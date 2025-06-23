"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceRoute = void 0;
const express_1 = require("express");
const service_controller_1 = require("./service.controller");
const uploadMiddleware_1 = __importDefault(require("../../middleware/multer/uploadMiddleware"));
const router = (0, express_1.Router)();
// Create service with image
router.post("/service", uploadMiddleware_1.default.single("image"), service_controller_1.serviceController.createService);
// Get all services
router.get("/services", service_controller_1.serviceController.getAllServices);
// Delete service by ID
router.delete("/service/:id", service_controller_1.serviceController.deleteService);
// ✅ Update service by ID
router.patch("/service/:id", uploadMiddleware_1.default.single("image"), service_controller_1.serviceController.updateService);
exports.serviceRoute = router;
