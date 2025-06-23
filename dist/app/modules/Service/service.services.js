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
exports.serviceServices = void 0;
const appError_1 = require("../../error/appError");
const service_schema_1 = __importDefault(require("./service.schema"));
// =============================================Create Service=====================================================
const crateService = (serviceData) => __awaiter(void 0, void 0, void 0, function* () {
    const extistingService = yield service_schema_1.default.findOne({
        name: serviceData.name,
    });
    if (extistingService) {
        throw new appError_1.AppError("Service already exists for this room", 400);
    }
    const cratedService = yield service_schema_1.default.create(serviceData);
    return cratedService;
});
// ===============================================Find all Services=======================================================
const getAllServices = () => __awaiter(void 0, void 0, void 0, function* () {
    const services = yield service_schema_1.default.find({ isActive: true });
    return services;
});
// ==================================================Delete service by Id=======================================================
const deleteService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const extistingService = yield service_schema_1.default.findOne({
        _id: id,
    });
    if (!extistingService) {
        throw new appError_1.AppError("Service does not exist", 400);
    }
    const deleteService = yield service_schema_1.default.deleteOne({ _id: id });
    return deleteService;
});
// ===============================================Update service by Id=======================================================
const updateService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingService = yield service_schema_1.default.findById(id);
    if (!existingService) {
        throw new appError_1.AppError("Service not found", 404);
    }
    const updatedService = yield service_schema_1.default.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return updatedService;
});
// ==============================export service=============================
exports.serviceServices = {
    crateService,
    getAllServices,
    deleteService,
    updateService
};
