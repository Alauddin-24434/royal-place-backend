import { Router } from "express";
import { authenticateUser } from "../../../middleware/authenticateUser";
import { authorizeRoles } from "../../../middleware/authorizeRoles";

import upload from "../../../middleware/uploadMiddleware";
import { roomController } from "../../../controllers/v1/roomControllers/room.controllers";

const router = Router();

router.post("/", authenticateUser, authorizeRoles('admin', 'receptionist', "guest"), upload.array("images", 5), roomController.createRoom);
router.patch("/:id", authenticateUser, authorizeRoles('admin', 'receptionist'),roomController.updateRoom);
router.delete("/:id", authenticateUser, authorizeRoles('admin', 'receptionist'), roomController.deleteRoom);
router.get("/", roomController.getAllRooms);
// router.get("/filter", roomController.filterAllRooms);

router.get("/:id", roomController.getRoomById);



export const roomRoute = router;