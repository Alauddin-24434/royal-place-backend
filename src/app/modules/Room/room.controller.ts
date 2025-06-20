import { Request, Response, NextFunction } from "express";

import { roomService } from "./room.services";
import { catchAsyncHandeller } from "../../utils/catchAsyncHandeller";
import { logger } from "../../utils/logger";

// ---------------------------Create Room-------------------------------
const createRoom = catchAsyncHandeller(async (req: Request, res: Response) => {


  // Handle file uploads if 
   const files= req.files as Express.Multer.File[];
   const images= files ? files.map(file=> file.path):[];

  
  // Prepare room data
const roomData={
   ...req.body,
   images:images,
}

  const newRoom = await roomService.createRoom(roomData);
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

// -------------------------------Filter All Rooms-----------------
const filterAllRooms = catchAsyncHandeller(async (req: Request, res: Response) => {
  const rooms = await roomService.filterRooms(req.query);
  res.status(200).json({
    success: true,
    message: "Rooms filter successfully",
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
  filterAllRooms
};
