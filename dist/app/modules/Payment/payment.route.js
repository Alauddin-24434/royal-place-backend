"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoute = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const rateLimiter_1 = require("../../middleware/rateLimiter");
const router = express_1.default.Router();
router.post("/verify-payment", rateLimiter_1.strictLimiter, payment_controller_1.paymentController.paymentSuccess);
router.post("/fail", rateLimiter_1.strictLimiter, payment_controller_1.paymentController.paymentFail);
router.post("/cancel", rateLimiter_1.strictLimiter, payment_controller_1.paymentController.paymentCancel);
router.get('/', payment_controller_1.paymentController.getPaymentsHandler);
exports.paymentRoute = router;
