
import { getCancelRiskForUser } from "../../utils/helperFunction/getCancelRiskForUser"; // ML কলার ফাংশন
import { BookingStatus } from "../Booking/booking.interface";
import BookingModel from "../Booking/booking.schema";


const getBookedRoomsWithCancelPrediction = async () => {
    // ১. সব booked বুকিং নিয়ে আসো
    const bookedBookings = await BookingModel.find({ bookingStatus: BookingStatus.Cancelled })
        .populate('rooms') // যদি rooms ডিটেইলস লাগে
        .populate('userId'); // ইউজার ডিটেইলস লাগলে

        console.log("booking",bookedBookings)

    // ২. প্রতিটি বুকিং এর ইউজার আইডি নিয়ে cancel risk ML মডেল কল করো
    // const results: BookingWithPrediction[] = [];

    // for (const booking of bookedBookings) {
    //     // userId কে স্ট্রিং এ কনভার্ট করো (যদি ObjectId হয়)
    //     const userIdStr = booking.userId.toString();

    //     // এখানে তোমার cancel history নিয়ে ML মডেল কল করবে
    //     // আমি ধরে নিচ্ছি getCancelRiskForUser(userIdStr) মডেল কল করছে এবং score দিচ্ছে
    //     const cancelRiskScore = await getCancelRiskForUser(userIdStr);

    //     results.push({
    //         booking,
    //         cancelRiskScore,
    //     });
    // }

    // return results;
    return bookedBookings
};



export const cancelPredictService = {
    getBookedRoomsWithCancelPrediction
}