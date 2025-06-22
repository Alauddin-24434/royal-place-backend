"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.initiatePayment = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../config");
const initiatePayment = (_a) => __awaiter(void 0, [_a], void 0, function* ({ amount, transactionId, name, email, phone, address, city, }) {
    const payload = {
        store_id: config_1.envVariable.AAMARPAY_STORE_ID,
        signature_key: config_1.envVariable.AAMARPAY_SIGNATURE_KEY,
        currency: "BDT",
        amount,
        cus_add1: address,
        cus_add2: address,
        cus_city: city,
        cus_country: 'Bangladesh',
        tran_id: transactionId,
        success_url: `${config_1.envVariable.SUCCESS_URL}?transactionId=${transactionId}`,
        fail_url: `${config_1.envVariable.FAIL_URL}?transactionId=${transactionId}`,
        cancel_url: `${config_1.envVariable.CANCEL_URL}?transactionId=${transactionId}`,
        cus_name: name,
        cus_email: email,
        cus_phone: phone,
        desc: `Booking for room`,
        type: "json",
    };
    const response = yield axios_1.default.post("https://sandbox.aamarpay.com/jsonpost.php", payload);
    return response.data;
});
exports.initiatePayment = initiatePayment;
const verifyPayment = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Transaction ID:", transactionId);
    try {
        const verificationUrl = `https://sandbox.aamarpay.com/api/v1/trxcheck/request.php`;
        const response = yield axios_1.default.get(`${verificationUrl}`, {
            params: {
                store_id: config_1.envVariable.AAMARPAY_STORE_ID,
                signature_key: config_1.envVariable.AAMARPAY_SIGNATURE_KEY,
                request_id: transactionId,
                type: 'json',
            },
        });
        const { pay_status, amount, status_title, payment_type } = response.data;
        return { pay_status, amount, status_title, payment_type };
    }
    catch (error) {
        return {
            status: "error",
            message: "Verification failed",
            error: error.message || error,
        };
    }
});
exports.verifyPayment = verifyPayment;
