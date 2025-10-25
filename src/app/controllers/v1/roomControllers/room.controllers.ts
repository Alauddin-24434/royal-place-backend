import { Request, Response, NextFunction } from "express";
import sanitize from "mongo-sanitize";
import { catchAsyncHandeller } from "../../../utils/handeller/catchAsyncHandeller";
import { roomService } from "../../../services/v1/roomServices/room.services";

// ---------------------------Create Room-------------------------------
const createRoom = catchAsyncHandeller(async (req: Request, res: Response) => {
  // sanitize req.body
  const cleanBody = sanitize(req.body);

  // Handle file uploads if
  const files = req.files as Express.Multer.File[];
  const images = files ? files.map((file) => file.path) : [];

  // Prepare room data
  const roomData = {
    ...cleanBody,
    images: images,
  };

  const newRoom = await roomService.createRoom(roomData);
  
  
 
  res.status(201).json({
    success: true,
    message: "Room created successfully",
    data: newRoom,
  });
});

// -------------------------------Get All Rooms-----------------
const getAllRooms = catchAsyncHandeller(async (req: Request, res: Response) => {
  const query = req.query;
  const rooms = await roomService.getAllRooms(query);
  res.status(200).json({
    success: true,
    message: "Rooms retrieved successfully",
    data: rooms,
  });
});

// // -------------------------------Filter All Rooms-----------------
// const filterAllRooms = catchAsyncHandeller(async (req: Request, res: Response) => {
//   // sanitize req.query
//   const cleanQuery = sanitize(req.query);

//   const rooms = await roomService.filterRooms(cleanQuery);
//   res.status(200).json({
//     success: true,
//     message: "Rooms filtered successfully",
//     data: rooms,
//   });
// });

//------------------------------- Get Single Room---------------------
const getRoomById = catchAsyncHandeller(async (req: Request, res: Response) => {
  // sanitize req.params.id
  const cleanId = sanitize(req.params.id);

  const room = await roomService.getRoomById(cleanId);
  res.status(200).json({
    success: true,
    message: "Room retrieved successfully",
    data: room,
  });
});

// ---------------------------------Update Room---------------------------
const updateRoom = catchAsyncHandeller(async (req: Request, res: Response) => {
  // sanitize req.params.id and req.body
  const cleanId = sanitize(req.params.id);
  const cleanBody = sanitize(req.body);

  const room = await roomService.updateRoom(cleanId, cleanBody);
  res.status(200).json({
    success: true,
    message: "Room updated successfully",
    data: room,
  });
});

// ------------------------------------Delete Room--------------------------------
const deleteRoom = catchAsyncHandeller(async (req: Request, res: Response) => {
  // sanitize req.params.id
  const cleanId = sanitize(req.params.id);

  const room = await roomService.deleteRoom(cleanId);
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
  // filterAllRooms,
};
