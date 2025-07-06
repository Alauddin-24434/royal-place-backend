import { calculateDaysBeforeCheckIn, calculateDuration } from "../../utils/dateUtils";
import BookingModel from "./booking.schema";

export async function prepareMLFeatures(userId: string, bookingData: any) {
  const totalBookings = await BookingModel.countDocuments({ userId });
  const cancelledBookings = await BookingModel.countDocuments({ userId, bookingStatus: "cancelled" });
  const cancelRate = totalBookings > 0 ? cancelledBookings / totalBookings : 0;

  const durationDays = calculateDuration(bookingData.rooms);
  const daysBeforeCheckIn = calculateDaysBeforeCheckIn(bookingData.rooms);
  const paymentCompleted = bookingData.paymentCompleted ? 1 : 0;

  return {
    user_total_bookings: totalBookings,
    user_cancel_rate: cancelRate,
    price: bookingData.totalAmount,
    duration_days: durationDays,
    days_before_checkin: daysBeforeCheckIn,
    payment_completed: paymentCompleted,
  };
}


import axios from "axios";

interface MLFeatures {
  user_total_bookings: number;
  user_cancel_rate: number;
  price: number;
  duration_days: number;
  days_before_checkin: number;
  payment_completed: number;
}

export async function predictCancelProbability(features: MLFeatures): Promise<number> {
  try {
    const response = await axios.post("https://mlservice-production.up.railway.app/predict", features);
    return response.data.cancel_probability;
  } catch (error) {
    console.error("ML prediction failed:", error);
    return 0;
  }
}

