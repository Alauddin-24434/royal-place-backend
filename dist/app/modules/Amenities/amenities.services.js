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
exports.amenitiesService = exports.getAllAmenities = exports.createAmenity = void 0;
const appError_1 = require("../../error/appError");
const amenities_model_1 = __importDefault(require("./amenities.model"));
// ---------------------------Create Amenity-------------------------------
const createAmenity = (amenityData) => __awaiter(void 0, void 0, void 0, function* () {
    const isAmenityExist = yield amenities_model_1.default.findOne({ name: amenityData.name });
    if (isAmenityExist) {
        throw new appError_1.AppError("Amenity with this name already exists!", 409);
    }
    const newAmenity = yield amenities_model_1.default.create(amenityData);
    return newAmenity;
});
exports.createAmenity = createAmenity;
// -------------------------------Get All Amenities-----------------
const getAllAmenities = () => __awaiter(void 0, void 0, void 0, function* () {
    return amenities_model_1.default.find({ isActive: true });
});
exports.getAllAmenities = getAllAmenities;
// ------------------------------- exporting service methods--------------------------------
exports.amenitiesService = {
    createAmenity: exports.createAmenity,
    getAllAmenities: exports.getAllAmenities,
};
