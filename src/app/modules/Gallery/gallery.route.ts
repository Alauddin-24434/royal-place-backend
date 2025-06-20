import express from "express";
import { galleryController } from "./gallery.controller";
import upload from "../../middleware/multer/uploadMiddleware";

const router = express.Router();

router.post("/gallery", upload.single('image'), galleryController.createGallery);
router.get("/galleries", galleryController.getAllGalleries);
router.get("/gallery:id", galleryController.getGalleryById);
router.delete("gallery/:id", galleryController.deleteGalleryById);

export default router;
