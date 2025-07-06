import { Request, Response } from "express";
import { catchAsyncHandeller } from "../../utils/handeller/catchAsyncHandeller";
import { bookingServices } from "./booking.services";
import { getIO } from "../../socket";

// =====================================================Initiate Booking========================================

const initiateBooking = catchAsyncHandeller(async (req: Request, res: Response) => {
  const bookingData = req.body;


  const result = await bookingServices.bookingInitialization(bookingData);
  // soket io
  const io = getIO();
  ["admin", "receptionist"].forEach(role => {
    io.to(role).emit("booking-created", result);
  });
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
  const { roomId } = req.params;
  const blockedDates = await bookingServices.getBookedDatesForRoomByRoomId(roomId);

  res.status(200).json({
    success: true,

    data: blockedDates,
  });



}
);

// ======================================== chek booking rooms by user id=================================================

const checkbookingRoomsByUserId = catchAsyncHandeller(async (req: Request, res: Response) => {
  const { id } = req.params;
  const bookedRooms = await bookingServices.getBookedRoomsByUserId(id);

  res.status(200).json({
    success: true,

    data: bookedRooms,
  });



}
);
// =====================================filter booking===========================================

const getFilteredBookings = async (req: Request, res: Response) => {

  const result = await bookingServices.filterBookings(req.query);
  res.status(200).json(result);
};


const cancelBooking = catchAsyncHandeller(async (req: Request, res: Response) => {

  const { id } = req.params;

  const result = await bookingServices.cancelBookingService(id);
// sokcket io
  const io = getIO();

  ["admin", "receptionist"].forEach(role => {
    io.to(role).emit("booking-cancelled", result)
  })

  res.status(200).json({
    message: "Booking has been successfully cancelled",
    success: true,
    booking: result.booking,
  });
});


// ========================Exxport Controller=============================
export const bookingController = {
  initiateBooking,
  checkAvailableRoomsById,
  cancelBooking,
  getFilteredBookings,
  checkbookingRoomsByUserId

};
