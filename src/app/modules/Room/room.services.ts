import RoomModel from "./room.schema";
import { AppError } from "../../error/appError";
import { IRoom } from "./room.interface";
import sanitize from "mongo-sanitize";

//================================================Create new room=========================================
const createRoom = async (roomData: IRoom) => {
  const cleanData = sanitize(roomData);  // sanitize body data

  const isRoomExist = await RoomModel.findOne({ roomNumber: cleanData.roomNumber });

  if (isRoomExist) {
    throw new AppError("Room with this number already exists!", 409);
  }

  const newRoom = {
    roomNumber: cleanData.roomNumber,
    floor: cleanData.floor,
    title: cleanData.title,
    description: cleanData.description,
    type: cleanData.type,
    bedType: cleanData.bedType,
    bedCount: cleanData?.bedCount,
    price: cleanData.price,
    adults: cleanData.adults,
    children: cleanData.children,
    features: cleanData.features,
    images: cleanData.images,
  };
  console.log(newRoom);

  const result = await RoomModel.create(newRoom);
  return result;
};

//=================================================== Get all active rooms=============================================
const getAllRooms = async () => {
  return RoomModel.find({ roomStatus: "active" });
};

// =================================================filter Room============================================================
const filterRooms = async (queryParams: any) => {
  const cleanQuery = sanitize(queryParams); // sanitize query params

  const { search: searchTerm, type, currentPrice, page = 1, limit = 10 } = cleanQuery;

  const skip = (Number(page) - 1) * Number(limit);

  const filters: any = {};

  // ✅ Type filter
  if (type) {
    const typeArr = type.split(",").map((s: string) => s.trim().toLowerCase());
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
    filters.price = {  // corrected from currentPrice to price
      ...(min && { $gte: min }),
      ...(max && { $lte: max }),
    };
  }

  const data = await RoomModel.find(filters)
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await RoomModel.countDocuments(filters);

  return {
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
    },
    data,
  };
};

// ===========================================Get a room by ID=========================================================
const getRoomById = async (id: string) => {
  const cleanId = sanitize(id); // sanitize id param

  const room = await RoomModel.findById(cleanId);

  if (!room) throw new AppError("Room not found!", 404);
  return room;
};

// ==================================Update room details============================================================
const updateRoom = async (id: string, data: Partial<IRoom>) => {
  const cleanId = sanitize(id);
  const cleanData = sanitize(data); // sanitize update data

  const updatedRoom = await RoomModel.findByIdAndUpdate(cleanId, cleanData, { new: true });
  if (!updatedRoom) throw new AppError("Failed to update room. Not found!", 404);
  return updatedRoom;
};

// =======================================Delete room (hard delete)============================================
const deleteRoom = async (id: string) => {
  const cleanId = sanitize(id);

  const deleted = await RoomModel.findByIdAndDelete(cleanId);
  if (!deleted) throw new AppError("Failed to delete room. Not found!", 404);
  return deleted;
};

export const roomService = {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  filterRooms,
};
