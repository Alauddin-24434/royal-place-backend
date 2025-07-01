"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomController = void 0;
const mongo_sanitize_1 = __importDefault(require("mongo-sanitize"));
const room_services_1 = require("./room.services");
const catchAsyncHandeller_1 = require("../../utils/catchAsyncHandeller");
// ---------------------------Create Room-------------------------------
const createRoom = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // sanitize req.body
    const cleanBody = (0, mongo_sanitize_1.default)(req.body);
    // Handle file uploads if 
    const files = req.files;
    const images = files ? files.map(file => file.path) : [];
    // Prepare room data
    const roomData = Object.assign(Object.assign({}, cleanBody), { images: images });
    const newRoom = yield room_services_1.roomService.createRoom(roomData);
    res.status(201).json({
        success: true,
        message: "Room created successfully",
        data: newRoom,
    });
}));
// -------------------------------Get All Rooms-----------------
const getAllRooms = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rooms = yield room_services_1.roomService.getAllRooms();
    res.status(200).json({
        success: true,
        message: "Rooms retrieved successfully",
        data: rooms,
    });
}));
// -------------------------------Filter All Rooms-----------------
const filterAllRooms = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // sanitize req.query
    const cleanQuery = (0, mongo_sanitize_1.default)(req.query);
    const rooms = yield room_services_1.roomService.filterRooms(cleanQuery);
    res.status(200).json({
        success: true,
        message: "Rooms filtered successfully",
        data: rooms,
    });
}));
//------------------------------- Get Single Room---------------------
const getRoomById = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // sanitize req.params.id
    const cleanId = (0, mongo_sanitize_1.default)(req.params.id);
    const room = yield room_services_1.roomService.getRoomById(cleanId);
    res.status(200).json({
        success: true,
        message: "Room retrieved successfully",
        data: room,
    });
}));
// ---------------------------------Update Room---------------------------
const updateRoom = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // sanitize req.params.id and req.body
    const cleanId = (0, mongo_sanitize_1.default)(req.params.id);
    const cleanBody = (0, mongo_sanitize_1.default)(req.body);
    const room = yield room_services_1.roomService.updateRoom(cleanId, cleanBody);
    res.status(200).json({
        success: true,
        message: "Room updated successfully",
        data: room,
    });
}));
// ------------------------------------Delete Room--------------------------------
const deleteRoom = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // sanitize req.params.id
    const cleanId = (0, mongo_sanitize_1.default)(req.params.id);
    const room = yield room_services_1.roomService.deleteRoom(cleanId);
    res.status(200).json({
        success: true,
        message: "Room deleted successfully",
        data: room,
    });
}));
exports.roomController = {
    createRoom,
    getAllRooms,
    getRoomById,
    updateRoom,
    deleteRoom,
    filterAllRooms
};
