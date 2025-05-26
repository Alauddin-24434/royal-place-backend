import { Request, Response, NextFunction } from "express";
import { catchAsyncHandeller } from "../utils/catchAsyncHandeller";
import { roomService } from "./room.services";

// ---------------------------Create Room-------------------------------
const createRoom = catchAsyncHandeller(async (req: Request, res: Response) => {
  const newRoom = await roomService.createRoom(req.body);
  res.status(201).json({
    success: true,
    message: "Room created successfully",
    data: newRoom,
  });
});

// -------------------------------Get All Rooms-----------------
const getAllRooms = catchAsyncHandeller(async (req: Request, res: Response) => {
  const rooms = await roomService.getAllRooms();
  res.status(200).json({
    success: true,
    message: "Rooms retrieved successfully",
    data: rooms,
  });
});

//------------------------------- Get Single Room---------------------
const getRoomById = catchAsyncHandeller(async (req: Request, res: Response) => {
  const room = await roomService.getRoomById(req.params.id);
  res.status(200).json({
    success: true,
    message: "Room retrieved successfully",
    data: room,
  });
});

// ---------------------------------Update Room---------------------------
const updateRoom = catchAsyncHandeller(async (req: Request, res: Response) => {
  const room = await roomService.updateRoom(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: "Room updated successfully",
    data: room,
  });
});

// ------------------------------------Delete Room--------------------------------
const deleteRoom = catchAsyncHandeller(async (req: Request, res: Response) => {
  const room = await roomService.deleteRoom(req.params.id);
  res.status(200).json({
    success: true,
    message: "Room deleted successfully",
    data: room,
  });
});



export const roomController = {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
};
