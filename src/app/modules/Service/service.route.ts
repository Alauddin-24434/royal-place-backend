import { Router } from "express";
import { serviceController } from "./service.controller";
import upload from "../../middleware/multer/uploadMiddleware";

const router = Router();

router.post("/service", upload.single("image"), serviceController.createService);
router.get("/services", serviceController.getAllServices);
router.delete("/service/:id", serviceController.deleteService);

export const serviceRoute = router;
