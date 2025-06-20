import { Router } from "express";
import { roomController } from "./room.controller";
import upload from "../../middleware/multer/uploadMiddleware";

const router = Router();

router.post("/room", upload.array("images",5), roomController.createRoom);
router.get("/rooms", roomController.getAllRooms);
router.get("/filter/rooms", roomController.filterAllRooms);
router.get("/room/:id", roomController.getRoomById);
router.patch("/room/:id", roomController.updateRoom);
router.delete("/room/:id", roomController.deleteRoom);

export const roomRoute = router;
