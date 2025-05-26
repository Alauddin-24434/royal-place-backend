import { Router } from "express";
import { userController } from "./user.controller";
// import { auth } from "../middlewares/auth"; // future: authentication middleware
// import { checkRole } from "../middlewares/checkRole"; // future: role-based access control

const router = Router();

// 👉 Register user
router.post("/register", userController.regestrationUser);

// 👉 Login user
router.post("/login", userController.loginUser);

// 👉 Get all users (accessible by admin & receptionist)
// router.get("/", auth, checkRole(["admin", "receptionist"]), userController.getAllUsers);
router.get("/users", userController.getAllUsers); // temporarily open

// 👉 Get single user by ID
router.get("/user/:id", userController.getSingleUser);

// 👉 Update user by ID
router.patch("/user/:id", userController.updateUser);

// 👉 Delete user by ID
router.delete("/user/:id", userController.deleteUser);

// 🚀 Export the routes
export const userRoute = router;
