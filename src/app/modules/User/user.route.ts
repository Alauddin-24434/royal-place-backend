import { Router } from "express";
import { userController } from "./user.controller";
import { generalLimiter, strictLimiter } from "../../middleware/rateLimiter";
import upload from "../../middleware/uploadMiddleware";
import { authenticateUser } from "../../middleware/authenticateUser";
import { authorizeRoles } from "../../utils/handeller/authorizeRoles";

const router = Router();

// User registration with general rate limiter
router.post("/signup", generalLimiter, userController.regestrationUser);

// User login with strict rate limiter
router.post("/login", strictLimiter, userController.loginUser);

// Refresh access token with strict rate limiter
router.post("/refresh-token", strictLimiter, userController.refreshAccessToken);

// Get all users (admin only) with authentication and strict limiter
router.get("/",   strictLimiter, userController.getAllUsers);

// Get single user by ID with general rate limiter
router.get("/:id", generalLimiter, userController.getSingleUser);

// Update user by ID with optional image upload and general limiter
router.patch("/:id", generalLimiter, upload.single("image"), userController.updateUser);

// Delete user by ID with general limiter
router.delete("/:id", generalLimiter, userController.deleteUser);

// Logout route (clears tokens)
router.post("/logout", userController.logoutUser);

export const userRoute = router;
