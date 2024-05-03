import { Router } from "express";
import { isStudent, verifyJWT } from "../middlewares/auth.middleware.js";
import {
  capturePayment,
  sendPaymentSuccessEmail,
  verifyPayment,
} from "../controllers/payment.controller.js";
const router = Router();

router.route("/capturePayment").post(verifyJWT, isStudent, capturePayment);
router.route("/verifyPayment").post(verifyJWT, isStudent, verifyPayment);
router
  .route("/sendPaymentSuccessEmail")
  .post(verifyJWT, isStudent, sendPaymentSuccessEmail);

export default router;
