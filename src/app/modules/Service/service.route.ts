import { Router } from "express";
import { serviceController } from "./service.controller";
import upload from "../../middleware/uploadMiddleware";
import { authenticateUser } from "../../middleware/authenticateUser";
import { checkRole } from "../../utils/handeller/checkRole";

const router = Router();

// 🔓 Public Route — Anyone with authentication can access this
router.get("/",  serviceController.getAllServices);


// Create a new service (Only "receptionist" role is allowed)
router.post(
  "/",
  authenticateUser,
  checkRole("receptionist"),
  upload.single("image"),
  serviceController.createService
);

// Delete an existing service (Only "receptionist" role is allowed)
router.delete(
  "/:id",
  authenticateUser,
  checkRole("receptionist"),
  serviceController.deleteService
);

// Update an existing service (Only "admin" role is allowed)
router.patch(
  "/:id",
  authenticateUser,
  checkRole("admin"),
  upload.single("image"),
  serviceController.updateService
);

// Export the router to be used in the main app
export const serviceRoute = router;
