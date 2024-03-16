import { Router } from "express";
import { registerUser, sendOtp } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/sendOtp").post(sendOtp);

export default router;
