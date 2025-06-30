import { AppError } from "../../error/appError";
import { ITestimonial } from "./testimonial.interfce";
import testimonialModel from "./testimonial.model";

//============================================== Create a new testimonial==========================================
const testimonialCreate = async (data: ITestimonial) => {
  const testimonial = await testimonialModel.create(data);
  return testimonial;
};

//============================================== Get all testimonials sorted by newest==============================================


const findAllTestimonial = async ({ page = 1, limit = 10 }: { page?: number, limit?: number }) => {
  const skip = (page - 1) * limit;

  const testimonials = await testimonialModel
    .find()
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    

  return testimonials;
};


// ========================================Get testimonials by room ID====================================================
const findTestimonialByRoomId = async (roomId: string) => {
  const testimonials = await testimonialModel
    .find({ roomId })
    .sort({ _id: -1 });
  return testimonials;
};

// ========================================Hard delete testimonial by ID====================================================
const deleteTestimonialById = async (testimonialId: string) => {
  const result = await testimonialModel.findByIdAndDelete(testimonialId);
  if (result) throw new AppError("Testimonial not found", 404);
  return result;
};




// ===========================================Export services===================================================================
export const testimonialServices = {
  testimonialCreate,
  findAllTestimonial,
  findTestimonialByRoomId,
  deleteTestimonialById
};
