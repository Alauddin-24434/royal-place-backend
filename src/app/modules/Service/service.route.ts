import { Router } from "express";
import { serviceController } from "./service.controller";
import upload from "../../middleware/multer/uploadMiddleware";
import { authenticateUser } from "../../middleware/authenticateUser";
import { checkRole } from "../../utils/checkRole";

const router = Router();

// Public route — সবাই দেখতে পারবে
router.get("/",  authenticateUser, checkRole("receptionist"),  serviceController.getAllServices);

// Protected routes — শুধু অথরাইজড ইউজার এবং নির্দিষ্ট রোলধারীরা এ্যাক্সেস পাবে
router.post(
  "/",
  authenticateUser,
  checkRole("receptionist"),  // শুধু admin ইউজার allowed
  upload.single("image"),
  serviceController.createService
);

router.delete(
  "/:id",
  authenticateUser,
  checkRole("receptionist"),
  serviceController.deleteService
);

router.patch(
  "/:id",
  authenticateUser,
  checkRole("admin"),
  upload.single("image"),
  serviceController.updateService
);

export const serviceRoute = router;
