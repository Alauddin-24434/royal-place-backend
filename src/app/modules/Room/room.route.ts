import { Router } from "express";
import { roomController } from "./room.controller";
import upload from "../../middleware/multer/uploadMiddleware";
import { authenticateUser } from "../../middleware/authenticateUser";
import { checkRole } from "../../utils/checkRole";

const router = Router();

router.post("/",  authenticateUser,  checkRole('admin','receptionist'), upload.array("images",5), roomController.createRoom);
router.get("/", roomController.getAllRooms);
router.get("/filter", roomController.filterAllRooms);
router.get("/:id", roomController.getRoomById);
router.patch("/:id", authenticateUser,  checkRole('admin','receptionist'), roomController.updateRoom);
router.delete("/:id", authenticateUser,  checkRole('admin','receptionist'),  roomController.deleteRoom);

export const roomRoute = router;
