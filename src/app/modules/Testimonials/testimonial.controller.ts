import { Request, Response } from "express";
import { catchAsyncHandeller } from "../../utils/catchAsyncHandeller";
import { testimonialServices } from "./testimonial.service";


const testimonialCreate = catchAsyncHandeller(async (req: Request, res: Response) => {
    const body = req.body;
    const result = await testimonialServices.testimonialCreate(body);
    res.status(201).json({
        success: true,
        message: "Room created successfully",
        data: result,
    });

});



const findAllTestimonials = catchAsyncHandeller(async (req: Request, res: Response) => {
  const result = await testimonialServices.findAllTestimonial();
  res.status(200).json({
    success: true,
    message: "Testimonials fetched successfully",
    data: result,
  });
});

export const testimonialController = {
  testimonialCreate,
  findAllTestimonials,
};