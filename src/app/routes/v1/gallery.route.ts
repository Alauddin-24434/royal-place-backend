import express, { Router } from "express";
import upload from "../../middleware/uploadMiddleware";
import { galleryController } from "../../controllers/v1/galleryControllers/gallery.controllers";

const router = express.Router();

router.post("/", upload.single('image'), galleryController.createGallery);
router.get("/", galleryController.getAllGalleries);
router.get("/:id", galleryController.getGalleryById);
router.delete("/:id", galleryController.deleteGalleryById);

export const galleryRoute = router;
