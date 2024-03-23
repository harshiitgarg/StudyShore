import { Router } from "express";
import {
  addRating,
  getAllRatings,
  getAvgRating,
} from "../controllers/ratingAndReview.controller.js";
import { isStudent, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/addRating").post(verifyJWT, isStudent, addRating);
router.route("/getAvgRating").get(verifyJWT, isStudent, getAvgRating);
router.route("/getAllRatings").get(verifyJWT, isStudent, getAllRatings);

export default router;
