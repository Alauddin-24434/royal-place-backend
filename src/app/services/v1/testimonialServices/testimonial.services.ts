
import mongoose from 'mongoose';
import { ITestimonial } from '../../../interfaces/v1/testimonialInterfaces/testimonial.interfaces';

import { BookingStatus } from '../../../interfaces/v1/bookingInterfaces/booking.interfcae';
import { AppError } from '../../../error/appError';
import testimonialModel from '../../../mongoSchema/v1/testimonialsSchema/testimonials.schema';
import BookingModel from '../../../mongoSchema/v1/bookingSchema/booking.schema';

//============================================== Create a new testimonial==========================================


const testimonialCreate = async (data: ITestimonial) => {
  const { userId, roomId } = data;

  const bookings = await BookingModel.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    bookingStatus: BookingStatus.Booked,
    rooms: {
      $elemMatch: {
        roomId: new mongoose.Types.ObjectId(roomId),
      },
    },
  });

  if (!bookings) {
    throw new AppError("You can only review rooms you have booked.", 403);
  }

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
