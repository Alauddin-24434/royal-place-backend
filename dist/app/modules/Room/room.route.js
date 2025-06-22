"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomRoute = void 0;
const express_1 = require("express");
const room_controller_1 = require("./room.controller");
const uploadMiddleware_1 = __importDefault(require("../../middleware/multer/uploadMiddleware"));
const authenticateUser_1 = require("../../middleware/authenticateUser");
const checkRole_1 = require("../../utils/checkRole");
const router = (0, express_1.Router)();
router.post("/room", authenticateUser_1.authenticateUser, (0, checkRole_1.checkRole)('admin', 'receptionist'), uploadMiddleware_1.default.array("images", 5), room_controller_1.roomController.createRoom);
router.get("/rooms", room_controller_1.roomController.getAllRooms);
router.get("/filter/rooms", room_controller_1.roomController.filterAllRooms);
router.get("/room/:id", room_controller_1.roomController.getRoomById);
router.patch("/room/:id", authenticateUser_1.authenticateUser, (0, checkRole_1.checkRole)('admin', 'receptionist'), room_controller_1.roomController.updateRoom);
router.delete("/room/:id", authenticateUser_1.authenticateUser, (0, checkRole_1.checkRole)('admin', 'receptionist'), room_controller_1.roomController.deleteRoom);
exports.roomRoute = router;
