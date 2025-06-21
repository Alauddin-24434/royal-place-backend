import { Request, Response } from "express";
import { catchAsyncHandeller } from "../../utils/catchAsyncHandeller";
import { testimonialServices } from "./testimonial.service";

// ==============================================Create a new testimonial==========================================
const testimonialCreate = catchAsyncHandeller(async (req: Request, res: Response) => {
  const body = req.body;
  const result = await testimonialServices.testimonialCreate(body);
  res.status(201).json({
    success: true,
    message: "Testimonial created successfully",
    data: result,
  });
});

//====================================================== Get all testimonials===============================================
const findAllTestimonials = catchAsyncHandeller(async (req: Request, res: Response) => {
  const result = await testimonialServices.findAllTestimonial();
  res.status(200).json({
    success: true,
    message: "Testimonials fetched successfully",
    data: result,
  });
});

//========================================================== Get testimonials by roomId===========================================
const findTestimonialsByRoomId = catchAsyncHandeller(async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const result = await testimonialServices.findTestimonialByRoomId(roomId);
  res.status(200).json({
    success: true,
    message: `Testimonials for Room ID: ${roomId} fetched successfully`,
    data: result,
  });
});

// ==================================================export controller==============================================================
export const testimonialController = {
  testimonialCreate,
  findAllTestimonials,
  findTestimonialsByRoomId,
};
