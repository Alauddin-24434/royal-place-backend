import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.post("/signup", userController.regestrationUser);
router.post("/login", userController.loginUser);
router.post("/refresh-token", userController.refreshAccessToken);

// RESTful route group
router.get("/", userController.getAllUsers);         // GET /api/users
router.get("/:id", userController.getSingleUser);    // GET /api/users/:id
router.patch("/:id", userController.updateUser);     // PATCH /api/users/:id
router.delete("/:id", userController.deleteUser);    // DELETE /api/users/:id
//  Export the routes
export const userRoute = router;
