import { Router } from "express";
import {
  changePassword,
  loginUser,
  registerUser,
  sendOtp,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/sendOtp").post(sendOtp);
router.route("/login").post(loginUser);
router.route("/change-password").post(verifyJWT, changePassword);

export default router;
