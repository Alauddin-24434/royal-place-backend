"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const rateLimiter_1 = require("../../middleware/rateLimiter");
const router = (0, express_1.Router)();
router.post("/signup", rateLimiter_1.generalLimiter, user_controller_1.userController.regestrationUser);
router.post("/login", rateLimiter_1.strictLimiter, user_controller_1.userController.loginUser);
router.post("/refresh-token", rateLimiter_1.strictLimiter, user_controller_1.userController.refreshAccessToken);
// RESTful routes with generalLimiter (or no limiter if you want)
router.get("/", rateLimiter_1.generalLimiter, user_controller_1.userController.getAllUsers);
router.get("/:id", rateLimiter_1.generalLimiter, user_controller_1.userController.getSingleUser);
router.patch("/:id", rateLimiter_1.generalLimiter, user_controller_1.userController.updateUser);
router.delete("/:id", rateLimiter_1.generalLimiter, user_controller_1.userController.deleteUser);
exports.userRoute = router;
