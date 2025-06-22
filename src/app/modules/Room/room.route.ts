import { Router } from "express";
import { roomController } from "./room.controller";
import upload from "../../middleware/multer/uploadMiddleware";
import { authenticateUser } from "../../middleware/authenticateUser";
import { checkRole } from "../../utils/checkRole";

const router = Router();

router.post("/room",  authenticateUser,  checkRole('admin','receptionist'), upload.array("images",5), roomController.createRoom);
router.get("/rooms", roomController.getAllRooms);
router.get("/filter/rooms", roomController.filterAllRooms);
router.get("/room/:id", roomController.getRoomById);
router.patch("/room/:id", authenticateUser,  checkRole('admin','receptionist'), roomController.updateRoom);
router.delete("/room/:id", authenticateUser,  checkRole('admin','receptionist'),  roomController.deleteRoom);

export const roomRoute = router;
