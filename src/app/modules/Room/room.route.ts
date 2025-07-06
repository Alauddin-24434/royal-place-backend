import { Router } from "express";
import { roomController } from "./room.controller";
import upload from "../../middleware/uploadMiddleware";
import { authenticateUser } from "../../middleware/authenticateUser";
import { checkRole } from "../../utils/handeller/checkRole";

const router = Router();
import { strictLimiter } from '../../middleware/rateLimiter';

router.post("/", authenticateUser, checkRole('admin', 'receptionist'), strictLimiter, upload.array("images", 5), roomController.createRoom);
router.patch("/:id", authenticateUser, checkRole('admin', 'receptionist'), strictLimiter, roomController.updateRoom);
router.delete("/:id", authenticateUser, checkRole('admin', 'receptionist'), strictLimiter, roomController.deleteRoom);
router.get("/", roomController.getAllRooms);
router.get("/filter", roomController.filterAllRooms);

router.get("/:id", roomController.getRoomById);



export const roomRoute = router;
