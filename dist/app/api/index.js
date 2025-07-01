"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialRoute = exports.routes = void 0;
const booking_route_1 = require("../modules/Booking/booking.route");
const dashboard_route_1 = require("../modules/Dashboard/dashboard.route");
const payment_route_1 = require("../modules/Payment/payment.route");
const room_route_1 = require("../modules/Room/room.route");
const service_route_1 = require("../modules/Service/service.route");
const testimonial_route_1 = require("../modules/Testimonials/testimonial.route");
const user_route_1 = require("../modules/User/user.route");
exports.routes = [
    { path: '/api/users', handler: user_route_1.userRoute },
    { path: '/api/rooms', handler: room_route_1.roomRoute },
    { path: '/api/bookings', handler: booking_route_1.bookingRoute },
    { path: '/api/payments', handler: payment_route_1.paymentRoute },
    { path: '/api/services', handler: service_route_1.serviceRoute },
    { path: '/api/testimonials', handler: testimonial_route_1.testimonialRoute },
    { path: '/api/dashboards', handler: dashboard_route_1.dashboardRoute },
];
const initialRoute = (app) => {
    exports.routes.forEach(route => {
        app.use(route.path, route.handler);
    });
};
exports.initialRoute = initialRoute;
