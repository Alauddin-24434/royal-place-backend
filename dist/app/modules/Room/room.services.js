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
exports.roomService = void 0;
const room_schema_1 = __importDefault(require("./room.schema"));
const appError_1 = require("../../error/appError");
const mongo_sanitize_1 = __importDefault(require("mongo-sanitize"));
//================================================Create new room=========================================
const createRoom = (roomData) => __awaiter(void 0, void 0, void 0, function* () {
    const cleanData = (0, mongo_sanitize_1.default)(roomData); // sanitize body data
    const isRoomExist = yield room_schema_1.default.findOne({ roomNumber: cleanData.roomNumber });
    if (isRoomExist) {
        throw new appError_1.AppError("Room with this number already exists!", 409);
    }
    const newRoom = {
        roomNumber: cleanData.roomNumber,
        floor: cleanData.floor,
        title: cleanData.title,
        description: cleanData.description,
        type: cleanData.type,
        bedType: cleanData.bedType,
        bedCount: cleanData === null || cleanData === void 0 ? void 0 : cleanData.bedCount,
        price: cleanData.price,
        adults: cleanData.adults,
        children: cleanData.children,
        features: cleanData.features,
        images: cleanData.images,
    };
    console.log(newRoom);
    const result = yield room_schema_1.default.create(newRoom);
    return result;
});
//=================================================== Get all active rooms=============================================
const getAllRooms = () => __awaiter(void 0, void 0, void 0, function* () {
    return room_schema_1.default.find({ roomStatus: "active" });
});
// =================================================filter Room============================================================
const filterRooms = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    const cleanQuery = (0, mongo_sanitize_1.default)(queryParams); // sanitize query params
    const { search: searchTerm, type, currentPrice, page = 1, limit = 10 } = cleanQuery;
    const skip = (Number(page) - 1) * Number(limit);
    const filters = {};
    // ✅ Type filter
    if (type) {
        const typeArr = type.split(",").map((s) => s.trim().toLowerCase());
        filters.type = { $in: typeArr };
    }
    // ✅ Search filter
    if (searchTerm) {
        filters.$or = [
            { title: { $regex: searchTerm, $options: "i" } },
            { type: { $regex: searchTerm, $options: "i" } },
        ];
    }
    // ✅ Current Price filter: expects format like "100-500"
    if (currentPrice) {
        const [min, max] = currentPrice.split("-").map(Number);
        filters.price = Object.assign(Object.assign({}, (min && { $gte: min })), (max && { $lte: max }));
    }
    const data = yield room_schema_1.default.find(filters)
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });
    const total = yield room_schema_1.default.countDocuments(filters);
    return {
        meta: {
            total,
            page: Number(page),
            limit: Number(limit),
        },
        data,
    };
});
// ===========================================Get a room by ID=========================================================
const getRoomById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const cleanId = (0, mongo_sanitize_1.default)(id); // sanitize id param
    const room = yield room_schema_1.default.findById(cleanId);
    if (!room)
        throw new appError_1.AppError("Room not found!", 404);
    return room;
});
// ==================================Update room details============================================================
const updateRoom = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const cleanId = (0, mongo_sanitize_1.default)(id);
    const cleanData = (0, mongo_sanitize_1.default)(data); // sanitize update data
    const updatedRoom = yield room_schema_1.default.findByIdAndUpdate(cleanId, cleanData, { new: true });
    if (!updatedRoom)
        throw new appError_1.AppError("Failed to update room. Not found!", 404);
    return updatedRoom;
});
// =======================================Delete room (hard delete)============================================
const deleteRoom = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const cleanId = (0, mongo_sanitize_1.default)(id);
    const deleted = yield room_schema_1.default.findByIdAndDelete(cleanId);
    if (!deleted)
        throw new appError_1.AppError("Failed to delete room. Not found!", 404);
    return deleted;
});
exports.roomService = {
    createRoom,
    getAllRooms,
    getRoomById,
    updateRoom,
    deleteRoom,
    filterRooms,
};
