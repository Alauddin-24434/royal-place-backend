import mongoose, { ObjectId } from "mongoose";
import { AppError } from "../../error/appError";
import BookingModel from "./booking.schema";
import RoomModel from "../Room/room.schema";
import { BookingStatus, IBooking } from "./booking.interface";
import { differenceInDays } from "date-fns";

import { initiatePayment, } from "../../utils/aamarpay/aamarpay";

import PaymentModel from "../Payment/payment.schema";
import { PaymentStatus } from "../Payment/payment.interface";


// =====================================Genarate TranId==========================================
function generateTransactionId() {
  return "TXN" + Date.now() + Math.floor(Math.random() * 1000);
}


// =======================================================Booking Initiate====================================================
const bookingInitialization = async (bookingData: IBooking) => {
  const { userId, rooms, name, email, city, address, phone } = bookingData;

  const roomIds = rooms.map((r) => r.roomId);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Check Availability
    const existingBookings = await BookingModel.find({
      "rooms.roomId": { $in: roomIds },
      $or: rooms.map((r) => ({
        $or: [
          {
            "rooms.checkInDate": { $lt: new Date(r.checkOutDate), $gte: new Date(r.checkInDate) },
          },
          {
            "rooms.checkOutDate": { $gt: new Date(r.checkInDate), $lte: new Date(r.checkOutDate) },
          },
          {
            "rooms.checkInDate": { $lte: new Date(r.checkInDate) },
            "rooms.checkOutDate": { $gte: new Date(r.checkOutDate) },
          },
        ],
      })),
      bookingStatus: BookingStatus.Pending,
    }).session(session);

    if (existingBookings.length > 0) {
      throw new AppError("One or more rooms are already booked in this period", 409);
    }

    // 2. Room Detail Validation
    const roomDetails = await RoomModel.find({ _id: { $in: roomIds } }).session(session);
    if (roomDetails.length !== roomIds.length) {
      throw new AppError("Some rooms not found", 404);
    }

    // 3. Calculate Total Amount (based on individual nights)
    let totalAmount = 0;
    for (const room of rooms) {
      const nights = differenceInDays(new Date(room.checkOutDate), new Date(room.checkInDate));
      if (nights <= 0) {
        throw new AppError(`Invalid check-in/check-out dates for room ${room.roomId}`, 400);
      }
      if (typeof room.price !== "number") {
        throw new AppError(`Invalid price for room ${room.roomId}`, 400);
      }

      totalAmount += room.price * nights;
    }

    // 4. Generate Transaction ID
    const transactionId = generateTransactionId();

    // 5. Save Booking
    const [createdBooking] = await BookingModel.create(
      [
        {
          userId,
          rooms: rooms.map((r) => ({
            roomId: r.roomId,
            checkInDate: r.checkInDate,
            checkOutDate: r.checkOutDate,
          })),
          totalAmount,
          bookingStatus: BookingStatus.Pending,
          name,
          email,
          address,
          city,
          phone,
          transactionId,
        },
      ],
      { session }
    );

    // 6. Initiate Payment
    const paymentResult = await initiatePayment({
      amount: createdBooking.totalAmount,
      transactionId: createdBooking.transactionId as string,
      name,
      email,
      phone,
      address,
      city,
    });

    if (!paymentResult?.payment_url) {
      throw new AppError("Payment initiation failed", 500);
    }

    // 7. Save Payment
    const paymentData = {
      userId,
      bookingId: createdBooking._id,
      amount: createdBooking.totalAmount,
      paymentMethod: "aamarpay",
      status: PaymentStatus.Pending,
      transactionId: createdBooking.transactionId,
    };

    await PaymentModel.create([paymentData], { session });

    await session.commitTransaction();
    session.endSession();

    return {
      payment_url: paymentResult.payment_url,
      transactionId,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
// ====================================================== Avalable Room For Booking======================================================


export const getBookedDatesForRoom = async (roomId: string) => {

  if (!roomId) {
    throw new AppError("Roomid is Required", 400)
  }
  const bookings = await BookingModel.find({
    rooms: [roomId],
    bookingStatus: { $in: ["booked", "pending"] }, // optional, if cancelled ignore
  }).select("checkInDate checkOutDate -_id");

  const blockedDates: string[] = [];

  for (const booking of bookings) {
    // const current = new Date(booking.checkInDate);
    // const end = new Date(booking.checkOutDate);

    // while (current <= end) {
    //   blockedDates.push(current.toISOString().split("T")[0]); // only YYYY-MM-DD
    //   current.setDate(current.getDate() + 1);
    // }
  }

  return blockedDates;
};

// ====================================filter booking===========================================
const filterBookings = async (queryParams: any) => {
  const {
    search,
    startDate,
    endDate,
    bookingStatus,
    page = 1,
    limit = 10,
  } = queryParams;

  const skip = (Number(page) - 1) * Number(limit);

  // Build filters object manually instead of buildQueryFilters for more control
  const filters: any = {};

  // Status filter - only add if value exists
  if (bookingStatus) {
    // If multiple statuses are comma separated, split into array
    const statusArr = bookingStatus.split(",").map((s: string) => s.trim().toLowerCase());
    filters.bookingStatus = { $in: statusArr };
  }

  // Only include bookings that haven't expired (checkOutDate >= today 11:00 AM)
  const today = new Date();
  today.setHours(11, 0, 0, 0);
  filters.checkOutDate = { $gte: today };

  // Date range filtering (if both dates provided)
  if (startDate && endDate) {
    filters.checkInDate = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  // Text search (optional)
  if (search) {
    filters.$or = [
      { "bookingUser.name": { $regex: search, $options: "i" } },
      { "bookingUser.email": { $regex: search, $options: "i" } },
      { "bookingUser.phone": { $regex: search, $options: "i" } },
    ];
  }

  const data = await BookingModel.find(filters)
    .populate("rooms")
    .populate("userId")
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await BookingModel.countDocuments(filters);

  return {
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
    },
    data,
  };
};

// =========================================Cancel Booking====================================================



export const cancelBookingService = async (transactionId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await BookingModel.findOne({ transactionId }).session(session);

    if (!booking) {
      await session.abortTransaction();
      session.endSession();
      return {
        success: false,
        statusCode: 404,
        message: "Booking not found",
      };
    }

    if (booking.bookingStatus !== BookingStatus.Booked) {
      await session.abortTransaction();
      session.endSession();
      return {
        success: false,
        statusCode: 400,
        message: `Booking status is '${booking.bookingStatus}', so cannot cancel.`,
      };
    }

    
  

    // Cancel Booking
    booking.bookingStatus = BookingStatus.Cancelled;
    await booking.save({ session });

    // Update Payment status to "cancelled"
    const payment = await PaymentModel.findOneAndUpdate(
      { transactionId },
      { status: "cancelled" },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      booking,
      payment,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};



// ========================Exxport Services=============================
export const bookingServices = {
  bookingInitialization,
  getBookedDatesForRoom,
  cancelBookingService,
  filterBookings
};


