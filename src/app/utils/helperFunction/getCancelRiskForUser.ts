// services/risk.service.ts
import axios from 'axios';
import BookingModel from '../../modules/Booking/booking.schema';

export const getCancelRiskForUser = async (userId: string) => {
  // 🔢 ইউজার কতবার cancel করেছে
  const pastCancellations = await BookingModel.countDocuments({
    userId,
    status: 'cancelled',
  });

  // ✅ ইউজার কতবার সফলভাবে বুক করেছে
  const bookingFrequency = await BookingModel.countDocuments({
    userId,
    status: 'booked',
  });

  // 🔁 ML API-তে পাঠানো
  const response = await axios.post('http://localhost:8000/predict-cancel-risk', {
    user_id: parseInt(userId.slice(-4), 16), 
    past_cancellations: pastCancellations,
    booking_frequency: bookingFrequency,
  });


  
  return response.data.cancel_risk_percentage;
};
