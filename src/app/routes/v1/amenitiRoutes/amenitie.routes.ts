import { Router } from "express";
import { amenitieController } from "../../../controllers/v1/amenitieControllers/amenitie.contollers";
import { authenticateUser } from "../../../middleware/authenticateUser";
import { authorizeRoles } from "../../../middleware/authorizeRoles";
import upload from "../../../middleware/uploadMiddleware";

const router = Router();

// 🔓 Public Route — Anyone with authentication can access this
router.get("/",  amenitieController.getAllAmenities);


// Create a new service (Only "receptionist" role is allowed)
router.post(
  "/",
  authenticateUser,
  authorizeRoles("admin"),
  upload.single("image"),
  amenitieController.createAmenitie
);

// Delete an existing service (Only "receptionist" role is allowed)
router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("admin"),
  amenitieController.deleteAmenitie
);

// Update an existing service (Only "admin" role is allowed)
router.patch(
  "/:id",
  authenticateUser,
  authorizeRoles("admin"),
  upload.single("image"),
  amenitieController.updateAmenitie
);

// Export the router to be used in the main app
export const serviceRoute = router;
