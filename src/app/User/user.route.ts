import { Router } from "express";
import { userController } from "./user.controller";


const router= Router();
//  register user
router.post('/register', userController.regestrationUser);

// login user
router.post('/login', userController.loginUser)



export const userRoute= router;