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
exports.testimonialServices = void 0;
const appError_1 = require("../../error/appError");
const testimonial_model_1 = __importDefault(require("./testimonial.model"));
//============================================== Create a new testimonial==========================================
const testimonialCreate = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const testimonial = yield testimonial_model_1.default.create(data);
    return testimonial;
});
//============================================== Get all testimonials sorted by newest==============================================
const findAllTestimonial = (_a) => __awaiter(void 0, [_a], void 0, function* ({ page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    const testimonials = yield testimonial_model_1.default
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit);
    return testimonials;
});
// ========================================Get testimonials by room ID====================================================
const findTestimonialByRoomId = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const testimonials = yield testimonial_model_1.default
        .find({ roomId })
        .sort({ _id: -1 });
    return testimonials;
});
// ========================================Hard delete testimonial by ID====================================================
const deleteTestimonialById = (testimonialId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield testimonial_model_1.default.findByIdAndDelete(testimonialId);
    if (result)
        throw new appError_1.AppError("Testimonial not found", 404);
    return result;
});
// ===========================================Export services===================================================================
exports.testimonialServices = {
    testimonialCreate,
    findAllTestimonial,
    findTestimonialByRoomId,
    deleteTestimonialById
};
