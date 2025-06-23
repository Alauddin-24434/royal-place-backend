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
exports.dashboardService = void 0;
const booking_schema_1 = __importDefault(require("../Booking/booking.schema"));
const room_schema_1 = __importDefault(require("../Room/room.schema"));
const booking_interface_1 = require("../Booking/booking.interface");
const dayjs_1 = __importDefault(require("dayjs"));
exports.dashboardService = {
    getStatsByRole(role, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (role === "admin") {
                const totalBookings = yield booking_schema_1.default.countDocuments();
                const availableRooms = yield room_schema_1.default.countDocuments({ status: "available" });
                const totalRevenueAgg = yield booking_schema_1.default.aggregate([
                    { $match: { bookingStatus: { $in: [booking_interface_1.BookingStatus.Booked, booking_interface_1.BookingStatus.Pending] } } },
                    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
                ]);
                const totalRevenue = ((_a = totalRevenueAgg[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
                const guestsCount = yield booking_schema_1.default.distinct("userId").then((res) => res.length);
                const stats = [
                    { title: "Total Bookings", value: totalBookings.toString(), change: "+12%", icon: "Calendar", color: "text-amber-400" },
                    { title: "Available Rooms", value: availableRooms.toString(), change: "-5%", icon: "Bed", color: "text-emerald-400" },
                    { title: "Revenue", value: `$${totalRevenue}`, change: "+18%", icon: "DollarSign", color: "text-blue-400" },
                    { title: "Guests", value: guestsCount.toString(), change: "+8%", icon: "Users", color: "text-purple-400" },
                ];
                const recentBookings = yield booking_schema_1.default.find()
                    .sort({ createdAt: -1 })
                    .limit(5)
                    .select("userId rooms bookingStatus totalAmount transactionId")
                    .populate("userId", "name email") // populate guest info
                    .lean();
                return { stats, recentBookings };
            }
            if (role === "receptionist") {
                // receptionist specific stats
                const today = (0, dayjs_1.default)().startOf("day").toDate();
                const todaysBookings = yield booking_schema_1.default.countDocuments({ createdAt: { $gte: today } });
                const checkedInGuests = yield booking_schema_1.default.countDocuments({ bookingStatus: booking_interface_1.BookingStatus.Booked });
                const availableRooms = yield room_schema_1.default.countDocuments({ status: "available" });
                const stats = [
                    { title: "Today's Bookings", value: todaysBookings.toString(), change: "+5%", icon: "Calendar", color: "text-amber-400" },
                    { title: "Checked-in Guests", value: checkedInGuests.toString(), change: "+10%", icon: "Users", color: "text-purple-400" },
                    { title: "Available Rooms", value: availableRooms.toString(), change: "-5%", icon: "Bed", color: "text-emerald-400" },
                ];
                const recentBookings = yield booking_schema_1.default.find({ bookingStatus: { $in: [booking_interface_1.BookingStatus.Booked, booking_interface_1.BookingStatus.Pending] } })
                    .sort({ createdAt: -1 })
                    .limit(5)
                    .select("userId rooms bookingStatus totalAmount transactionId")
                    .populate("userId", "name email")
                    .lean();
                return { stats, recentBookings };
            }
            if (role === "guest" && userId) {
                // guest এর জন্য নিজের বুকিং দেখানো
                const upcomingBooking = yield booking_schema_1.default.findOne({ userId, bookingStatus: booking_interface_1.BookingStatus.Booked })
                    .sort({ createdAt: -1 })
                    .select("rooms bookingStatus totalAmount transactionId")
                    .lean();
                const stats = upcomingBooking
                    ? [
                        {
                            title: "Your Upcoming Booking",
                            value: ((_c = (_b = upcomingBooking.rooms) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.roomId.toString()) || "N/A",
                            change: "",
                            icon: "Bed",
                            color: "text-emerald-400",
                        },
                    ]
                    : [];
                return { stats, recentBookings: [] };
            }
            return { stats: [], recentBookings: [] };
        });
    },
};
