import { Router } from "express";
import { userController } from "./user.controller";
import { generalLimiter, strictLimiter } from "../../middleware/rateLimiter";
import upload from "../../middleware/uploadMiddleware";
import { authenticateUser } from "../../middleware/authenticateUser";

const router = Router();

router.post("/signup", generalLimiter, userController.regestrationUser);
router.post("/login", strictLimiter, userController.loginUser);
router.post("/refresh-token", strictLimiter, userController.refreshAccessToken);

// RESTful routes with generalLimiter (or no limiter if you want)
router.get("/", authenticateUser, generalLimiter, userController.getAllUsers);
router.get("/:id", generalLimiter, userController.getSingleUser);
router.patch("/:id",  generalLimiter, upload.single("image"), userController.updateUser);
router.delete("/:id",  generalLimiter, userController.deleteUser);

export const userRoute = router;
