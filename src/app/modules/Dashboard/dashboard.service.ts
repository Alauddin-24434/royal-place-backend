import BookingModel from "../Booking/booking.schema";
import RoomModel from "../Room/room.schema";
import { BookingStatus } from "../Booking/booking.interface";
import dayjs from "dayjs";
import moment from 'moment';
import { Types } from "mongoose";

// ===== Admin Overview =====
const getAdminOverview = async () => {
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
    .populate("userId", "name email")
    .lean();

  return { role: "admin", stats, recentBookings };
};

// ===== Receptionist Overview =====
const getReceptionistOverview = async () => {
  const today = dayjs().startOf("day").toDate();
  const todaysBookings = await BookingModel.countDocuments({ createdAt: { $gte: today } });
  const checkedInGuests = await BookingModel.countDocuments({ bookingStatus: BookingStatus.Booked });
  const availableRooms = await RoomModel.countDocuments({ status: "available" });

  const stats = [
    { title: "Today's Bookings", value: todaysBookings.toString(), change: "+5%", icon: "Calendar", color: "text-amber-400" },
    { title: "Checked-in Guests", value: checkedInGuests.toString(), change: "+10%", icon: "Users", color: "text-purple-400" },
    { title: "Available Rooms", value: availableRooms.toString(), change: "-5%", icon: "Bed", color: "text-emerald-400" },
  ];

  const recentBookings = await BookingModel.find({
    bookingStatus: { $in: [BookingStatus.Booked, BookingStatus.Pending] },
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("userId rooms bookingStatus totalAmount transactionId")
    .populate("userId", "name email")
    .lean();

  return { role: "receptionist", stats, recentBookings };
};



export const getGuestOverview = async (userId: string) => {
  const today = new Date();
  const objectId = new Types.ObjectId(userId);

  // ✅ Count bookings by status
  const totalPaidBookings = await BookingModel.countDocuments({
    userId: objectId,
    bookingStatus: BookingStatus.Booked,
  });

  const totalCancelBookings = await BookingModel.countDocuments({
    userId: objectId,
    bookingStatus: BookingStatus.Cancelled,
  });

  const totalPendingBookings = await BookingModel.countDocuments({
    userId: objectId,
    bookingStatus: BookingStatus.Pending,
  });

  // ✅ 3. Sum total paid amounts using aggregation
  const totalPaidAmountAgg = await BookingModel.aggregate([
    {
      $match: {
        userId: new Types.ObjectId(userId),
        bookingStatus: BookingStatus.Booked || "Booked",
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$totalAmount" },
      },
    },
  ]);
  const totalPaidAmount = totalPaidAmountAgg?.[0]?.totalAmount || 0;

  // ✅ 4. Get latest 5 recent bookings excluding "InitiateCancel"
  const recentBookings = await BookingModel.find({
    userId: new Types.ObjectId(userId),
    bookingStatus: { $ne: "InitiateCancel" },
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("rooms totalAmount transactionId bookingStatus createdAt checkOutDate")
    .populate("rooms.roomId", "title")
    .lean();

  // ✅ 5. Get past bookings (checkout before today), excluding "InitiateCancel"
  const pastBookings = await BookingModel.find({
    userId: new Types.ObjectId(userId),
    bookingStatus: { $ne: "InitiateCancel" },
    "rooms.checkOutDate": { $lt: today },
  })
    .sort({ "rooms.checkOutDate": -1 })
    .limit(5)
    .select("rooms totalAmount transactionId bookingStatus checkOutDate")
    .populate("rooms.roomId", "title")
    .lean();


  // ✅ 6. Prepare dashboard stats
  const stats = [
    {
      title: "Total Paid Amount",
      value: `$${totalPaidAmount}`,
    },
    {
      title: "Total Paid Bookings",
      value: totalPaidBookings.toString(),
    },

    {
      title: "Total Pending Bookings",
      value: totalPendingBookings.toString(),
    },
    {
      title: "Total Cancel Bookings",
      value: totalCancelBookings.toString(),
    },

  ];

  // ✅ 7. Return overview object
  return {
    role: "guest",
    stats,
    recentBookings,
    pastBookings,
  };
};


export default getGuestOverview;





// ===== Main dispatcher function =====
export const dashboardOverviewByRole = async (role: string, userId?: string) => {
  switch (role) {
    case "admin":
      return getAdminOverview();
    case "receptionist":
      return getReceptionistOverview();
    case "guest":
      if (!userId) return { stats: [], recentBookings: [] };
      return getGuestOverview(userId);
    default:
      return { stats: [], recentBookings: [] };
  }
};




// ===== Export final dashboard service =====
export const dashboardService = {

  dashboardOverviewByRole,
};
