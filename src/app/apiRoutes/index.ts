import { Application, Router } from "express";
import { userRoute } from "../routes/v1/user.route";
import { roomRoute } from "../routes/v1/room.route";
import { bookingRoute } from "../routes/v1/booking.route";
import { paymentRoute } from "../routes/v1/payment.route";
// import { serviceRoute } from "../routes/v1/amenitie.routes";
import { testimonialRoute } from "../routes/v1/testimonial.route";
import { dashboardRoute } from "../routes/v1/dashboard.route";

// -------------------
// 1. Route Interface
// -------------------
interface IRouteV1 {
  path: string;
  handler: Router;
}

// -------------------
// 2. All v1 routes
// -------------------
export const routesV1: IRouteV1[] = [
  { path: "/users", handler: userRoute },
  { path: "/rooms", handler: roomRoute },
  { path: "/bookings", handler: bookingRoute },
  { path: "/payments", handler: paymentRoute },
  // { path: "/services", handler: serviceRoute },
  { path: "/testimonials", handler: testimonialRoute },
  { path: "/dashboards", handler: dashboardRoute },
];

// -------------------
// 3. Register main routes with common prefix
// -------------------
export const mainRoutes = (app: Application, apiPrefix = "/api/v1") => {
  routesV1.forEach((route) => {
    app.use(`${apiPrefix}${route.path}`, route.handler);
  });
};
