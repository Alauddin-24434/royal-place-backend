"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatus = void 0;
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["Pending"] = "pending";
    PaymentStatus["Completed"] = "completed";
    PaymentStatus["Failed"] = "failed";
    PaymentStatus["Refunded"] = "refunded";
    PaymentStatus["Cancel"] = "cancled";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
