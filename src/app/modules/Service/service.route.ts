import { Router } from "express";
import { serviceController } from "./service.controller";
import upload from "../../middleware/multer/uploadMiddleware";

const router = Router();

// RESTful route group
router.post("/", upload.single("image"), serviceController.createService);
router.get("/", serviceController.getAllServices);
router.delete("/:id", serviceController.deleteService);
router.patch("/:id", upload.single("image"), serviceController.updateService);

export const serviceRoute = router;
