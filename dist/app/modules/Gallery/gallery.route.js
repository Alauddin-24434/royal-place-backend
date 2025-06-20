"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gallery_controller_1 = require("./gallery.controller");
const uploadMiddleware_1 = __importDefault(require("../../middleware/multer/uploadMiddleware"));
const router = express_1.default.Router();
router.post("/gallery", uploadMiddleware_1.default.single('image'), gallery_controller_1.galleryController.createGallery);
router.get("/galleries", gallery_controller_1.galleryController.getAllGalleries);
router.get("/gallery:id", gallery_controller_1.galleryController.getGalleryById);
router.delete("gallery/:id", gallery_controller_1.galleryController.deleteGalleryById);
exports.default = router;
