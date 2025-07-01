import express from "express";
import { galleryController } from "./gallery.controller";
import upload from "../../middleware/multer/uploadMiddleware";

const router = express.Router();

router.post("/", upload.single('image'), galleryController.createGallery);
router.get("/", galleryController.getAllGalleries);
router.get("/:id", galleryController.getGalleryById);
router.delete("/:id", galleryController.deleteGalleryById);

export default router;
