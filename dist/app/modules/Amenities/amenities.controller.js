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
exports.amenitiesController = void 0;
const catchAsyncHandeller_1 = require("../../utils/catchAsyncHandeller");
const amenities_services_1 = require("./amenities.services");
// ---------------------------Create Amenity-------------------------------
const createAmenity = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newAmenity = yield amenities_services_1.amenitiesService.createAmenity(req.body);
    res.status(201).json({
        success: true,
        message: "Amenity created successfully",
        data: newAmenity,
    });
}));
// 
const getAllAmenities = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const amenities = yield amenities_services_1.amenitiesService.getAllAmenities();
    res.status(200).json({
        success: true,
        message: "Amenities retrieved successfully",
        data: amenities,
    });
}));
// --------------------------------exporting controller methods--------------------------------
exports.amenitiesController = {
    createAmenity,
    getAllAmenities,
};
