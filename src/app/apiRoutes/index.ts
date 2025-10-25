import { Application } from "express";
import { userRoute } from "../routes/v1/userRoutes/user.routes";
import { roomRoute } from "../routes/v1/roomRoutes/room.routes";
import { paymentRoute } from "../routes/v1/paymentRoutes/payment.route";
import { serviceRoute } from "../routes/v1/amenitiRoutes/amenitie.routes";
import { testimonialRoute } from "../routes/v1/testimonialRoutes/testimonial.routes";
import { dashboardRoute } from "../routes/v1/dashboardRoutes/dashboard.routes";
import { bookingRoute } from "../routes/v1/bookingRoutes/booking.routes";

// All version 1 routes (without /api/v1 prefix)
export const routesV1 = [
  { path: '/users', handler: userRoute },
  { path: '/rooms', handler: roomRoute },
  { path: '/bookings', handler: bookingRoute },
  { path: '/payments', handler: paymentRoute },
  { path: '/services', handler: serviceRoute },
  { path: '/testimonials', handler: testimonialRoute },
  { path: '/dashboards', handler: dashboardRoute },
];

// Register main routes with common prefix
export const mainRoutes = (app: Application) => {
  const apiVersion = '/api/v1';
  routesV1.forEach(route => {
    app.use(`${apiVersion}${route.path}`, route.handler);
  });
};
