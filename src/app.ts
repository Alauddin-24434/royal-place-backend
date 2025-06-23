// ==============================
// Imports & Initial Setup
// ==============================
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// ==============================
// Route Imports
// ==============================
import { userRoute } from "./app/modules/User/user.route";
import { roomRoute } from "./app/modules/Room/room.route";
import { amenityRoute } from "./app/modules/Amenities/amenities.route";
import { bookingRoute } from "./app/modules/Booking/booking.route";
import { paymentRoute } from "./app/modules/Payment/payment.route";
import { serviceRoute } from "./app/modules/Service/service.route";
import { testimonialRoute } from "./app/modules/Testimonials/testimonial.route";
import { cancelPredictRoute } from "./app/modules/CancelPredict/cancel.predict.route";

// ==============================
// Middleware Imports
// ==============================
import globalErrorHandler from "./app/middleware/globalErrorHandeller";
import { dashboardRoute } from "./app/modules/Dashboard/dashboard.route";

// ==============================
// App Configuration
// ==============================
const app: Application = express();

app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: ["http://localhost:3000", "https://royal-place.vercel.app"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ==============================
// Root and Utility Routes
// ==============================
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Database connected",
  });
});

app.get("/check", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Database checked",
  });
});

app.post("/api/payment/refund", (req: Request, res: Response) => {
  console.log(req.body);
  res.status(200).json({
    success: true,
    message: "Payment Refunded",
  });
});

app.post("/api/refresh-token", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Refresh token route",
  });
});

// ==============================
// API Routes
// ==============================
app.use('/api', userRoute);
app.use('/api', roomRoute);
app.use('/api', amenityRoute);
app.use('/api', bookingRoute);
app.use('/api', paymentRoute);
app.use('/api', serviceRoute);
app.use('/api', testimonialRoute);
app.use('/api', cancelPredictRoute);
app.use('/api', dashboardRoute);

// ==============================
// 404 Not Found Handler
// ==============================
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "Page Not Found",
  });
});

// ==============================
// Global Error Handler
// ==============================
app.use(globalErrorHandler);

// ==============================
// Export App
// ==============================
export default app;
