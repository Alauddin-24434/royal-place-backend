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
// RESTful route group
router.post("/", uploadMiddleware_1.default.single("image"), service_controller_1.serviceController.createService);
router.get("/", service_controller_1.serviceController.getAllServices);
router.delete("/:id", service_controller_1.serviceController.deleteService);
router.patch("/:id", uploadMiddleware_1.default.single("image"), service_controller_1.serviceController.updateService);
exports.serviceRoute = router;
