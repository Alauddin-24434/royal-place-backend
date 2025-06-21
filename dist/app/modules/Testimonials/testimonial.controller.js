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
Object.defineProperty(exports, "__esModule", { value: true });
exports.testimonialController = void 0;
const catchAsyncHandeller_1 = require("../../utils/catchAsyncHandeller");
const testimonial_service_1 = require("./testimonial.service");
// ==============================================Create a new testimonial==========================================
const testimonialCreate = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const result = yield testimonial_service_1.testimonialServices.testimonialCreate(body);
    res.status(201).json({
        success: true,
        message: "Testimonial created successfully",
        data: result,
    });
}));
//====================================================== Get all testimonials===============================================
const findAllTestimonials = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield testimonial_service_1.testimonialServices.findAllTestimonial();
    res.status(200).json({
        success: true,
        message: "Testimonials fetched successfully",
        data: result,
    });
}));
//========================================================== Get testimonials by roomId===========================================
const findTestimonialsByRoomId = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId } = req.params;
    const result = yield testimonial_service_1.testimonialServices.findTestimonialByRoomId(roomId);
    res.status(200).json({
        success: true,
        message: `Testimonials for Room ID: ${roomId} fetched successfully`,
        data: result,
    });
}));
// ==================================================export controller==============================================================
exports.testimonialController = {
    testimonialCreate,
    findAllTestimonials,
    findTestimonialsByRoomId,
};
