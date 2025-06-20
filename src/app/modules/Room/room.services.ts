
import RoomModel from "./room.schema";

import { AppError } from "../../error/appError";

import { IRoom } from "./room.interface";

//================================================Create new room=========================================
const createRoom = async (roomData: IRoom) => {


  const isRoomExist = await RoomModel.findOne({ roomNumber: roomData.roomNumber });



  if (isRoomExist) {
    throw new AppError("Room with this number already exists!", 409);
  }

  const newRoom = {
    roomNumber: roomData.roomNumber,
    floor: roomData.floor,
    title: roomData.title,
    description: roomData.description,
    type: roomData.type,
    bedType: roomData.bedType,
    bedCount: roomData?.bedCount,
    price: roomData.price,
    adults: roomData.adults,
    children: roomData.children,
    features: roomData.features,
    images: roomData.images,

  }
  console.log(newRoom)

  const result = await RoomModel.create(newRoom);
  return result;
};

//=================================================== Get all active rooms=============================================

const getAllRooms = async () => {
  return RoomModel.find({ roomStatus: "active" });
};


// =================================================filter Room============================================================


const filterRooms = async (queryParams: any) => {
  console.log(queryParams)

  const { search: searchTerm, type, currentPrice, page = 1, limit = 10 } = queryParams;


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
      { type: { $regex: searchTerm, $options: "i" } }, // fixed typo: type instead of type variable
    ];
  }

  // ✅ Current Price filter: expects format like "100-500"
  if (currentPrice) {
    const [min, max] = currentPrice.split("-").map(Number);
    filters.currentPrice = {
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



  const room = await RoomModel.findById(id);

  if (!room) throw new AppError("Room not found!", 404);
  return room;
};

// ==================================Update room details============================================================
const updateRoom = async (id: string, data: Partial<IRoom>) => {
  const updatedRoom = await RoomModel.findByIdAndUpdate(id, data, { new: true });
  if (!updatedRoom) throw new AppError("Failed to update room. Not found!", 404);
  return updatedRoom;
};

// =======================================Delete room (hard delete)============================================
const deleteRoom = async (id: string) => {
  const deleted = await RoomModel.findByIdAndDelete({ _id: id });
  if (!deleted) throw new AppError("Failed to delete room. Not found!", 404);
  return deleted;
};

export const roomService = {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  filterRooms
};
