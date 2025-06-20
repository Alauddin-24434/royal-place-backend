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
exports.galleryService = void 0;
const gallery_schema_1 = __importDefault(require("./gallery.schema"));
// ================================================Create gallery=============================================
const createGallery = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const gallery = yield gallery_schema_1.default.create(data);
    return gallery;
});
// =====================================Get all galleries==========================================
const getAllGalleries = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield gallery_schema_1.default.find().sort({ createdAt: -1 });
});
// ====================================Get gallery by ID==================================================
const getGalleryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield gallery_schema_1.default.findById(id);
});
// ==========================================Delete gallery===========================================
const deleteGalleryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield gallery_schema_1.default.findByIdAndDelete(id);
});
// ============================Export Services===============================
exports.galleryService = {
    createGallery,
    getAllGalleries,
    getGalleryById,
    deleteGalleryById,
};
