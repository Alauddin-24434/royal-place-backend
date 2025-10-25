import { Router } from "express";
import { userController } from "../../../controllers/v1/userControllers/user.controllers";
import { authenticateUser } from "../../../middleware/authenticateUser";

import upload from "../../../middleware/uploadMiddleware";

const router = Router();

// User registration with general rate limiter
router.post("/signup",  userController.regestrationUser);

// User login with strict rate limiter
router.post("/login", userController.loginUser);

// Refresh access token with strict rate limiter
router.post("/refresh-token",  userController.refreshAccessToken);

// Get all users (admin only) with authentication and strict limiter
router.get("/", userController.getAllUsers);


// Get single user by ID with general rate limiter
router.get("/:id", userController.getSingleUser);

// Update user by ID with optional image upload and general limiter
router.patch("/:id",  upload.single("image"), userController.updateUser);

// Delete user by ID with general limiter
router.delete("/:id",userController.deleteUser);

// Logout route (clears tokens)
router.post("/logout", userController.logoutUser);

export const userRoute = router;