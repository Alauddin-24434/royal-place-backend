"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const router = (0, express_1.Router)();
router.post("/signup", user_controller_1.userController.regestrationUser);
router.post("/login", user_controller_1.userController.loginUser);
router.post("/refresh-token", user_controller_1.userController.refreshAccessToken);
// RESTful route group
router.get("/", user_controller_1.userController.getAllUsers); // GET /api/users
router.get("/:id", user_controller_1.userController.getSingleUser); // GET /api/users/:id
router.patch("/:id", user_controller_1.userController.updateUser); // PATCH /api/users/:id
router.delete("/:id", user_controller_1.userController.deleteUser); // DELETE /api/users/:id
//  Export the routes
exports.userRoute = router;
