"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const router = (0, express_1.Router)();
// 👉 Register user
router.post("/signup", user_controller_1.userController.regestrationUser);
// 👉 Login user
router.post("/login", user_controller_1.userController.loginUser);
// refresh token route
router.post("/refresh-token", user_controller_1.userController.refreshAccessToken);
// 👉 Get all users (accessible by admin & receptionist)
router.get("/users", user_controller_1.userController.getAllUsers);
// 👉 Get single user by ID
router.get("/user/:id", user_controller_1.userController.getSingleUser);
// 👉 Update user by ID
router.patch("/user/:id", user_controller_1.userController.updateUser);
// 👉 Delete user by ID
router.delete("/user/:id", user_controller_1.userController.deleteUser);
// 🚀 Export the routes
exports.userRoute = router;
