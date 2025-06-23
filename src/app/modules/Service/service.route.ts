import { Router } from "express";
import { serviceController } from "./service.controller";
import upload from "../../middleware/multer/uploadMiddleware";

const router = Router();

// Create service with image
router.post("/service", upload.single("image"), serviceController.createService);

// Get all services
router.get("/services", serviceController.getAllServices);

// Delete service by ID
router.delete("/service/:id", serviceController.deleteService);

// ✅ Update service by ID
router.patch("/service/:id", upload.single("image"), serviceController.updateService);

export const serviceRoute = router;
