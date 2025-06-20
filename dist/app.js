"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_route_1 = require("./app/modules/User/user.route");
const room_route_1 = require("./app/modules/Room/room.route");
const amenities_route_1 = require("./app/modules/Amenities/amenities.route");
const booking_route_1 = require("./app/modules/Booking/booking.route");
const payment_route_1 = require("./app/modules/Payment/payment.route");
const service_route_1 = require("./app/modules/Service/service.route");
const testimonial_route_1 = require("./app/modules/Testimonials/testimonial.route");
const globalErrorHandeller_1 = __importDefault(require("./app/middleware/globalErrorHandeller"));
const cancel_predict_route_1 = require("./app/modules/CancelPredict/cancel.predict.route");
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    credentials: true,
    origin: ["http://localhost:3000"],
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true })); // For parsing form-urlencoded bodies
app.use(express_1.default.static('public'));
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Database connected",
    });
});
app.post("/api/payment/refund", (req, res) => {
    console.log(req.body);
    res.status(200).json({
        success: true,
        message: "Pyment Refuned",
    });
});
app.get("/check", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Database checked",
    });
});
//refresh token route and veryfy and accestoken
app.post("/api/refresh-token", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Refresh token route",
    });
});
app.use('/api', user_route_1.userRoute);
app.use('/api', room_route_1.roomRoute);
app.use('/api', amenities_route_1.amenityRoute);
app.use('/api', booking_route_1.bookingRoute);
app.use('/api', payment_route_1.paymentRoute);
app.use('/api', service_route_1.serviceRoute);
app.use('/api', testimonial_route_1.testimonialRoute);
app.use('/api', cancel_predict_route_1.cancelPredictRoute);
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Page Not Found",
    });
});
app.use(globalErrorHandeller_1.default);
exports.default = app;
