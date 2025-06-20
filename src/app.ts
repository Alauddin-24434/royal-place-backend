import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { userRoute } from "./app/modules/User/user.route";
import { roomRoute } from "./app/modules/Room/room.route";
import { amenityRoute } from "./app/modules/Amenities/amenities.route";
import { bookingRoute } from "./app/modules/Booking/booking.route";
import { paymentRoute } from "./app/modules/Payment/payment.route";
import { serviceRoute } from "./app/modules/Service/service.route";
import { testimonialRoute } from "./app/modules/Testimonials/testimonial.route";
import globalErrorHandler from "./app/middleware/globalErrorHandeller";
import { cancelPredictRoute } from "./app/modules/CancelPredict/cancel.predict.route";

const app: Application = express();

app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: ["http://localhost:3000"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing form-urlencoded bodies
app.use(express.static('public'));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Database connected",
  });
});

app.post("/api/payment/refund", (req: Request, res: Response) => {

  console.log(req.body)
  res.status(200).json({
    success: true,
    message: "Pyment Refuned",
  });
});
app.get("/check", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Database checked",
  });
});

//refresh token route and veryfy and accestoken

app.post("/api/refresh-token", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Refresh token route",
  });
});



app.use('/api', userRoute);
app.use('/api', roomRoute);
app.use('/api', amenityRoute);
app.use('/api', bookingRoute);
app.use('/api', paymentRoute);
app.use('/api', serviceRoute);
app.use('/api', testimonialRoute);
app.use('/api', cancelPredictRoute);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "Page Not Found",
  });
});






app.use(globalErrorHandler)

export default app;
