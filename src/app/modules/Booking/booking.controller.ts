import { Request, Response } from "express";
import { catchAsyncHandeller } from "../../utils/catchAsyncHandeller";
import { bookingServices } from "./booking.services";

// =====================================================Initiate Booking========================================

const initiateBooking = catchAsyncHandeller(async (req: Request, res: Response) => {
  const bookingData = req.body;


  const result = await bookingServices.bookingInitialization(bookingData);
  res.status(200).json({
    success: true,
    payment_url: result.payment_url,
    message: "Booking Initiate",
    transactionId: result.transactionId,
    data: bookingData,
  });
}
);

// ========================================Avalabe rooms For Booking=================================================

const checkAvailableRoomsById = catchAsyncHandeller(async (req: Request, res: Response) => {
  const { id } = req.params;
  const blockedDates = await bookingServices.getBookedDatesForRoom(id);

  res.status(200).json({
    success: true,

    data: blockedDates, 
  });



}
);
// =====================================filter booking===========================================

const getFilteredBookings = async (req: Request, res: Response) => {

  const result = await bookingServices.filterBookings(req.query);
  res.status(200).json(result);
};


const cancelBooking = catchAsyncHandeller(async (req: Request, res: Response) => {
  const { transactionId } = req.body;

  const result = await bookingServices.cancelBookingService(transactionId);

  res.status(200).json({
    message: "Booking cancelled successfully",
    success: true,
    booking: result.booking,
  });
});


// ========================Exxport Controller=============================
export const bookingController = {
  initiateBooking,
  checkAvailableRoomsById,
  cancelBooking,
  getFilteredBookings

};
