import { ITestimonial } from "./testimonial.interfce";
import testimonialModel from "./testimonial.model";

//============================================== Create a new testimonial==========================================
const testimonialCreate = async (data: ITestimonial) => {
  const testimonial = await testimonialModel.create(data);
  return testimonial;
};

//============================================== Get all testimonials sorted by newest==============================================
const findAllTestimonial = async () => {
  const testimonials = await testimonialModel.find().sort({ _id: -1 });
  return testimonials;
};

// ========================================Get testimonials by room ID====================================================
const findTestimonialByRoomId = async (roomId: string) => {
  const testimonials = await testimonialModel
    .find({ roomId })
    .sort({ _id: -1 });
  return testimonials;
};

// ===========================================Export services===================================================================
export const testimonialServices = {
  testimonialCreate,
  findAllTestimonial,
  findTestimonialByRoomId,
};
