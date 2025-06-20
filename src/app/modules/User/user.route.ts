import { Router } from "express";
import { userController } from "./user.controller";
import { authenticateUser } from "../../middleware/authenticateUser";
import { checkRole } from "../../utils/checkRole";


const router = Router();

// 👉 Register user
router.post("/signup", userController.regestrationUser);


// 👉 Login user
router.post("/login", userController.loginUser);

// refresh token route
router.post("/refresh-token", userController.refreshAccessToken);

// 👉 Get all users (accessible by admin & receptionist)

router.get("/users",  userController.getAllUsers); 

// 👉 Get single user by ID
router.get("/user/:id", userController.getSingleUser);

// 👉 Update user by ID
router.patch("/user/:id", userController.updateUser);

// 👉 Delete user by ID
router.delete("/user/:id", userController.deleteUser);

// 🚀 Export the routes
export const userRoute = router;
