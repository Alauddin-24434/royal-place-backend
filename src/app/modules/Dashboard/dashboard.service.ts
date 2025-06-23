import BookingModel from "../Booking/booking.schema";
import RoomModel from "../Room/room.schema";
import { BookingStatus } from "../Booking/booking.interface";
import dayjs from "dayjs";

export const dashboardService = {
  async getStatsByRole(role: string, userId?: string) {
    if (role === "admin") {
      const totalBookings = await BookingModel.countDocuments();
      const availableRooms = await RoomModel.countDocuments({ status: "available" });
      const totalRevenueAgg = await BookingModel.aggregate([
        { $match: { bookingStatus: { $in: [BookingStatus.Booked, BookingStatus.Pending] } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]);
      const totalRevenue = totalRevenueAgg[0]?.total || 0;
      const guestsCount = await BookingModel.distinct("userId").then((res) => res.length);

      const stats = [
        { title: "Total Bookings", value: totalBookings.toString(), change: "+12%", icon: "Calendar", color: "text-amber-400" },
        { title: "Available Rooms", value: availableRooms.toString(), change: "-5%", icon: "Bed", color: "text-emerald-400" },
        { title: "Revenue", value: `$${totalRevenue}`, change: "+18%", icon: "DollarSign", color: "text-blue-400" },
        { title: "Guests", value: guestsCount.toString(), change: "+8%", icon: "Users", color: "text-purple-400" },
      ];

      const recentBookings = await BookingModel.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("userId rooms bookingStatus totalAmount transactionId")
        .populate("userId", "name email") // populate guest info
        .lean();

      return { stats, recentBookings };
    }

    if (role === "receptionist") {
      // receptionist specific stats
      const today = dayjs().startOf("day").toDate();
      const todaysBookings = await BookingModel.countDocuments({ createdAt: { $gte: today } });
      const checkedInGuests = await BookingModel.countDocuments({ bookingStatus: BookingStatus.Booked });
      const availableRooms = await RoomModel.countDocuments({ status: "available" });

      const stats = [
        { title: "Today's Bookings", value: todaysBookings.toString(), change: "+5%", icon: "Calendar", color: "text-amber-400" },
        { title: "Checked-in Guests", value: checkedInGuests.toString(), change: "+10%", icon: "Users", color: "text-purple-400" },
        { title: "Available Rooms", value: availableRooms.toString(), change: "-5%", icon: "Bed", color: "text-emerald-400" },
      ];

      const recentBookings = await BookingModel.find({ bookingStatus: { $in: [BookingStatus.Booked, BookingStatus.Pending] } })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("userId rooms bookingStatus totalAmount transactionId")
        .populate("userId", "name email")
        .lean();

      return { stats, recentBookings };
    }

    if (role === "guest" && userId) {
      // guest এর জন্য নিজের বুকিং দেখানো
      const upcomingBooking = await BookingModel.findOne({ userId, bookingStatus: BookingStatus.Booked })
        .sort({ createdAt: -1 })
        .select("rooms bookingStatus totalAmount transactionId")
        .lean();

      const stats = upcomingBooking
        ? [
            {
              title: "Your Upcoming Booking",
              value: upcomingBooking.rooms?.[0]?.roomId.toString() || "N/A",
              change: "",
              icon: "Bed",
              color: "text-emerald-400",
            },
          ]
        : [];

      return { stats, recentBookings: [] };
    }

    return { stats: [], recentBookings: [] };
  },
};
