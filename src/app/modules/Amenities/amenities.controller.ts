import { NextFunction, Request, Response } from "express";
import { catchAsyncHandeller } from "../../utils/catchAsyncHandeller";
import { amenitiesService } from "./amenities.services";

// ---------------------------Create Amenity-------------------------------
const createAmenity =catchAsyncHandeller(async (req:Request, res:Response) => {
  const newAmenity = await amenitiesService.createAmenity(req.body);
  res.status(201).json({
    success: true,
    message: "Amenity created successfully",
    data: newAmenity,
  });
});

// 
const getAllAmenities = catchAsyncHandeller(async (req: Request, res: Response) => {
  const amenities = await amenitiesService.getAllAmenities();
  res.status(200).json({
    success: true,
    message: "Amenities retrieved successfully",
    data: amenities,
  });
});

// --------------------------------exporting controller methods--------------------------------
export const amenitiesController = {
  createAmenity,
  getAllAmenities,
};