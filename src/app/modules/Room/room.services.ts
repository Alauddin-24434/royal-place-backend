import RoomModel from "./room.schema";
import { AppError } from "../../error/appError";
import { IRoom, RoomQuery } from "./room.interface";
import sanitize from "mongo-sanitize";
import BookingModel from "../Booking/booking.schema";
import { universalQuery } from "../../utils/queryUtils";
import { redisClient } from "../../config/redis";

//================================================Create new room=========================================

//================================================Create new room with safe Redis invalidation====================
export const createRoom = async (roomData: IRoom) => {
  const cleanData = sanitize(roomData);

  // Check if room number exists
  const isRoomExist = await RoomModel.exists({ roomNumber: cleanData.roomNumber });
  if (isRoomExist) {
    throw new AppError("Room with this number already exists!", 409);
  }

  // Create the room
  const newRoom = await RoomModel.create(cleanData);

  return newRoom;
};


//=================================================== Get all active rooms=============================================

const getAllRooms = async (query: RoomQuery) => {
  const cacheKey = `rooms:${JSON.stringify(query)}`;

  // 1️⃣ Check cache first
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    console.log("✅ Returning rooms from Redis cache");
    return JSON.parse(cached);
  }

  console.log("⚡ Fetching rooms from MongoDB");

  // 2️⃣ Prepare filters
  const filters: any = { roomStatus: "active" };
  const totalGuests = Number(query.adults || 0) + Number(query.children || 0);
  if (totalGuests > 0) filters.maxOccupancy = { $gte: totalGuests };
  if (query.type)
    filters.type = {
      $in: query.type.split(",").map((t: string) => t.trim().toLowerCase()),
    };

  // 3️⃣ Optional lookup: join bookings
  const lookup = [
    {
      $lookup: {
        from: "bookings",
        let: { roomId: "$_id" },
        pipeline: [
          { $unwind: "$rooms" },
          {
            $match: { $expr: { $eq: ["$rooms.roomId", "$$roomId"] } },
          },
        ],
        as: "bookings",
      },
    },
  ];

  // 4️⃣ Query MongoDB
  const result = await universalQuery(RoomModel, {
    page: Number(query.page) || 1,
    limit: Number(query.limit) || 10,
    search: query.searchTerm
      ? { fields: ["title", "type"], value: query.searchTerm }
      : undefined,
    filters,
    lookup,
    sort: { createdAt: -1 },
    select: query.select, // string or object
  });

  // 5️⃣ Save to Redis cache for 30 minutes
  await redisClient.setEx(cacheKey, 1800, JSON.stringify(result));
  console.log("💾 Saved rooms to Redis cache");

  return result;
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

  const updatedRoom = await RoomModel.findByIdAndUpdate(cleanId, cleanData, {
    new: true,
  });
  if (!updatedRoom)
    throw new AppError("Failed to update room. Not found!", 404);
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
};
