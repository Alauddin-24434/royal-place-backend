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
exports.serviceController = void 0;
const catchAsyncHandeller_1 = require("../../utils/catchAsyncHandeller");
const service_services_1 = require("./service.services");
// =============================================Create Service=====================================================
const createService = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const imageUrl = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    const serviceData = Object.assign(Object.assign({}, req.body), { image: imageUrl, pricePerDay: Number(req.body.pricePerDay) });
    const service = yield service_services_1.serviceServices.crateService(serviceData);
    res.status(201).json({
        success: true,
        message: "Service created successfully",
        data: service,
    });
}));
// ===============================================Find all Services=======================================================
const getAllServices = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const services = yield service_services_1.serviceServices.getAllServices();
    res.status(200).json({
        success: true,
        message: "All services fetched successfully",
        data: services,
    });
}));
// ==================================================Delete service by Id=======================================================
const deleteService = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const service = service_services_1.serviceServices.deleteService(req.params.id);
    res.status(200).json({
        success: true,
        message: "Service delete successfully",
        data: service,
    });
}));
// ===============================================Update service by Id=======================================================
const updateService = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const imageUrl = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    const updateData = Object.assign(Object.assign({}, req.body), { pricePerDay: req.body.pricePerDay ? Number(req.body.pricePerDay) : undefined });
    // If image exists, attach it
    if (imageUrl) {
        updateData.image = imageUrl;
    }
    const updatedService = yield service_services_1.serviceServices.updateService(id, updateData);
    res.status(200).json({
        success: true,
        message: "Service updated successfully",
        data: updatedService,
    });
}));
// ==============================export controller=============================
exports.serviceController = {
    createService,
    updateService,
    getAllServices,
    deleteService
};
