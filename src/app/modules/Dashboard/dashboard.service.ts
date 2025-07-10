import BookingModel from "../Booking/booking.schema";
import RoomModel from "../Room/room.schema";
import { BookingStatus } from "../Booking/booking.interface";
import dayjs from "dayjs";
import moment from 'moment'; 

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


const getGuestOverview = async (userId: string) => {
  const today = new Date();

  // Get the upcoming booking (starting today or later)
  const upcomingBooking = await BookingModel.findOne({
    userId,
    bookingStatus: BookingStatus.Booked,
    "rooms.checkOutDate": { $gte: today },
  })
    .sort({ "rooms.checkInDate": 1 })
    .select("rooms bookingStatus totalAmount transactionId createdAt")
    .populate("rooms.roomId", "title")
    .lean();

  // Safe extraction of upcoming room title
  const upcomingRoomTitle =
    upcomingBooking?.rooms?.[0]?.roomId &&
    typeof upcomingBooking.rooms[0].roomId === 'object' &&
    'title' in upcomingBooking.rooms[0].roomId
      ? (upcomingBooking.rooms[0].roomId as { title: string }).title
      : 'No upcoming booking';

  // Count total paid bookings (only Booked status)
  const totalPaidBookings = await BookingModel.countDocuments({
    userId,
    bookingStatus: BookingStatus.Booked,
  });

  // Sum total paid amounts (only Booked status)
  const totalPaidAmountAgg = await BookingModel.aggregate([
    {
      $match: {
        userId,
        bookingStatus: BookingStatus.Booked,
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$totalAmount" },
      },
    },
  ]);
  const totalPaidAmount = totalPaidAmountAgg[0]?.totalAmount || 0;

  // Get latest 5 bookings
  const recentBookings = await BookingModel.find({ userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("rooms totalAmount transactionId bookingStatus createdAt checkOutDate")
    .populate("rooms.roomId", "title")
    .lean();

  // Get past bookings (checkout date before today)
  const pastBookings = await BookingModel.find({
    userId,
    "rooms.checkOutDate": { $lt: today },
  })
    .sort({ "rooms.checkOutDate": -1 })
    .limit(5)
    .select("rooms totalAmount transactionId bookingStatus checkOutDate")
    .populate("rooms.roomId", "title")
    .lean();

  // Monthly stats for last 6 months (count bookings by createdAt month)
  const sixMonthsAgo = moment(today).subtract(5, 'months').startOf('month').toDate();

  const monthlyRaw = await BookingModel.aggregate([
    {
      $match: {
        userId,
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        month: '$_id',
        count: 1,
        _id: 0,
      },
    },
  ]);

  // Prepare array of last 6 months with counts
  const monthlyStats = Array.from({ length: 6 }).map((_, i) => {
    const date = moment().subtract(5 - i, 'months');
    const monthNum = date.month() + 1;
    const monthShort = date.format('MMM');
    const match = monthlyRaw.find((m) => m.month === monthNum);
    return { month: monthShort, count: match?.count || 0 };
  });

  // Prepare dashboard stats
  const stats = [
    {
      title: "Upcoming Booking Room",
      value: upcomingRoomTitle,
    },
    {
      title: "Total Paid Bookings",
      value: totalPaidBookings.toString(),
    },
    {
      title: "Total Paid",
      value: `$${totalPaidAmount}`,
    },
  ];

  return {
    role: "guest",
    stats,
    recentBookings,
    pastBookings,
    monthlyStats, // Add this to show charts like booking trends
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
