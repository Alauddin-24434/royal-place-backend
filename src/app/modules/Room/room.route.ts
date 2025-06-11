import { Router } from "express";
import { roomController } from "./room.controller";
import upload from "../../middleware/multer/uploadMiddleware";
// import { auth } from "../middlewares/auth"; // optional
// import { checkRole } from "../middlewares/checkRole"; // optional

const router = Router();

router.post("/create-room", upload.array("images",5), roomController.createRoom);
router.get("/rooms", roomController.getAllRooms);
router.get("/room/:id", roomController.getRoomById);
router.patch("/room/:id", roomController.updateRoom);
router.delete("/roo/:id", roomController.deleteRoom);

export const roomRoute = router;
