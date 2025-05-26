import { AppError } from "../error/appError";
import RoomModel from "./room.model";
import { Iroom } from "./room.interface";

//--------------------------------- Create new room------------------------------
const createRoom = async (roomData: Iroom) => {
  const isRoomExist = await RoomModel.findOne({ roomNumber: roomData.roomNumber });

  if (isRoomExist) {
    throw new AppError("Room with this number already exists!", 409);
  }

  const newRoom = await RoomModel.create(roomData);
  return newRoom;
};

//------------------------------- Get all active rooms-----------------------------

const getAllRooms = async () => {
  return RoomModel.find({ isActive: true });
};

// -------------------------------Get a room by ID----------------------------------
const getRoomById = async (id: string) => {
  const room = await RoomModel.findById(id);
  if (!room) throw new AppError("Room not found!", 404);
  return room;
};

// -------------------------------Update room details-------------------------------
const updateRoom = async (id: string, data: Partial<Iroom>) => {
  const updatedRoom = await RoomModel.findByIdAndUpdate(id, data, { new: true });
  if (!updatedRoom) throw new AppError("Failed to update room. Not found!", 404);
  return updatedRoom;
};

// ----------------------------Delete room (hard delete)-------------------------------
const deleteRoom = async (id: string) => {
  const deleted = await RoomModel.findByIdAndDelete(id);
  if (!deleted) throw new AppError("Failed to delete room. Not found!", 404);
  return deleted;
};

export const roomService = {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
};
