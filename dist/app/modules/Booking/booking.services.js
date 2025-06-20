"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingServices = exports.cancelBookingService = exports.getBookedDatesForRoom = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const appError_1 = require("../../error/appError");
const booking_schema_1 = __importDefault(require("./booking.schema"));
const room_schema_1 = __importDefault(require("../Room/room.schema"));
const booking_interface_1 = require("./booking.interface");
const date_fns_1 = require("date-fns");
const aamarpay_1 = require("../../utils/aamarpay/aamarpay");
const payment_schema_1 = __importDefault(require("../Payment/payment.schema"));
const payment_interface_1 = require("../Payment/payment.interface");
// =====================================Genarate TranId==========================================
function generateTransactionId() {
    return "TXN" + Date.now() + Math.floor(Math.random() * 1000);
}
// =======================================================Booking Initiate====================================================
const bookingInitialization = (bookingData) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, rooms, name, email, city, address, phone } = bookingData;
    const roomIds = rooms.map((r) => r.roomId);
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // 1. Check Availability
        const existingBookings = yield booking_schema_1.default.find({
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
            bookingStatus: booking_interface_1.BookingStatus.Pending,
        }).session(session);
        if (existingBookings.length > 0) {
            throw new appError_1.AppError("One or more rooms are already booked in this period", 409);
        }
        // 2. Room Detail Validation
        const roomDetails = yield room_schema_1.default.find({ _id: { $in: roomIds } }).session(session);
        if (roomDetails.length !== roomIds.length) {
            throw new appError_1.AppError("Some rooms not found", 404);
        }
        // 3. Calculate Total Amount (based on individual nights)
        let totalAmount = 0;
        for (const room of rooms) {
            const nights = (0, date_fns_1.differenceInDays)(new Date(room.checkOutDate), new Date(room.checkInDate));
            if (nights <= 0) {
                throw new appError_1.AppError(`Invalid check-in/check-out dates for room ${room.roomId}`, 400);
            }
            if (typeof room.price !== "number") {
                throw new appError_1.AppError(`Invalid price for room ${room.roomId}`, 400);
            }
            totalAmount += room.price * nights;
        }
        // 4. Generate Transaction ID
        const transactionId = generateTransactionId();
        // 5. Save Booking
        const [createdBooking] = yield booking_schema_1.default.create([
            {
                userId,
                rooms: rooms.map((r) => ({
                    roomId: r.roomId,
                    checkInDate: r.checkInDate,
                    checkOutDate: r.checkOutDate,
                })),
                totalAmount,
                bookingStatus: booking_interface_1.BookingStatus.Pending,
                name,
                email,
                address,
                city,
                phone,
                transactionId,
            },
        ], { session });
        // 6. Initiate Payment
        const paymentResult = yield (0, aamarpay_1.initiatePayment)({
            amount: createdBooking.totalAmount,
            transactionId: createdBooking.transactionId,
            name,
            email,
            phone,
            address,
            city,
        });
        if (!(paymentResult === null || paymentResult === void 0 ? void 0 : paymentResult.payment_url)) {
            throw new appError_1.AppError("Payment initiation failed", 500);
        }
        // 7. Save Payment
        const paymentData = {
            userId,
            bookingId: createdBooking._id,
            amount: createdBooking.totalAmount,
            paymentMethod: "aamarpay",
            status: payment_interface_1.PaymentStatus.Pending,
            transactionId: createdBooking.transactionId,
        };
        yield payment_schema_1.default.create([paymentData], { session });
        yield session.commitTransaction();
        session.endSession();
        return {
            payment_url: paymentResult.payment_url,
            transactionId,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// ====================================================== Avalable Room For Booking======================================================
const getBookedDatesForRoom = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!roomId) {
        throw new appError_1.AppError("Roomid is Required", 400);
    }
    const bookings = yield booking_schema_1.default.find({
        rooms: [roomId],
        bookingStatus: { $in: ["booked", "pending"] }, // optional, if cancelled ignore
    }).select("checkInDate checkOutDate -_id");
    const blockedDates = [];
    for (const booking of bookings) {
        // const current = new Date(booking.checkInDate);
        // const end = new Date(booking.checkOutDate);
        // while (current <= end) {
        //   blockedDates.push(current.toISOString().split("T")[0]); // only YYYY-MM-DD
        //   current.setDate(current.getDate() + 1);
        // }
    }
    return blockedDates;
});
exports.getBookedDatesForRoom = getBookedDatesForRoom;
// ====================================filter booking===========================================
const filterBookings = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, startDate, endDate, bookingStatus, page = 1, limit = 10, } = queryParams;
    const skip = (Number(page) - 1) * Number(limit);
    // Build filters object manually instead of buildQueryFilters for more control
    const filters = {};
    // Status filter - only add if value exists
    if (bookingStatus) {
        // If multiple statuses are comma separated, split into array
        const statusArr = bookingStatus.split(",").map((s) => s.trim().toLowerCase());
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
    const data = yield booking_schema_1.default.find(filters)
        .populate("rooms")
        .populate("userId")
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });
    const total = yield booking_schema_1.default.countDocuments(filters);
    return {
        meta: {
            total,
            page: Number(page),
            limit: Number(limit),
        },
        data,
    };
});
// =========================================Cancel Booking====================================================
const cancelBookingService = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const booking = yield booking_schema_1.default.findOne({ transactionId }).session(session);
        if (!booking) {
            yield session.abortTransaction();
            session.endSession();
            return {
                success: false,
                statusCode: 404,
                message: "Booking not found",
            };
        }
        if (booking.bookingStatus !== booking_interface_1.BookingStatus.Booked) {
            yield session.abortTransaction();
            session.endSession();
            return {
                success: false,
                statusCode: 400,
                message: `Booking status is '${booking.bookingStatus}', so cannot cancel.`,
            };
        }
        // Cancel Booking
        booking.bookingStatus = booking_interface_1.BookingStatus.Cancelled;
        yield booking.save({ session });
        // Update Payment status to "cancelled"
        const payment = yield payment_schema_1.default.findOneAndUpdate({ transactionId }, { status: "cancelled" }, { new: true, session });
        yield session.commitTransaction();
        session.endSession();
        return {
            success: true,
            booking,
            payment,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.cancelBookingService = cancelBookingService;
// ========================Exxport Services=============================
exports.bookingServices = {
    bookingInitialization,
    getBookedDatesForRoom: exports.getBookedDatesForRoom,
    cancelBookingService: exports.cancelBookingService,
    filterBookings
};
