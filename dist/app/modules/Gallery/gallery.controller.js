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
exports.galleryController = void 0;
const catchAsyncHandeller_1 = require("../../utils/catchAsyncHandeller");
const gallery_service_1 = require("./gallery.service");
// ================================================Create gallery=============================================
const createGallery = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const imageUrl = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    const bodyData = Object.assign(Object.assign({}, req.body), { image: imageUrl });
    const result = yield gallery_service_1.galleryService.createGallery(bodyData);
    res.status(201).json({
        success: true,
        message: "Gallery item created successfully",
        data: result,
    });
}));
// =====================================Get all galleries==========================================
const getAllGalleries = (0, catchAsyncHandeller_1.catchAsyncHandeller)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield gallery_service_1.galleryService.getAllGalleries();
    res.status(200).json({
        success: true,
        message: "Gallery items fetched successfully",
        data: result,
    });
}));
// ====================================Get gallery by ID==================================================
const getGalleryById = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield gallery_service_1.galleryService.getGalleryById(id);
    res.status(200).json({
        success: true,
        message: "Gallery item fetched successfully",
        data: result,
    });
}));
// ==========================================Delete gallery===========================================
const deleteGalleryById = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield gallery_service_1.galleryService.deleteGalleryById(id);
    res.status(200).json({
        success: true,
        message: "Gallery item deleted successfully",
        data: result,
    });
}));
// ============================Export Controller===============================
exports.galleryController = {
    createGallery,
    getAllGalleries,
    getGalleryById,
    deleteGalleryById,
};
