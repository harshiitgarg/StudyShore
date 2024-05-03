import { Router } from "express";
import {
  categoryPageDetails,
  createCategory,
  showAllCategories,
} from "../controllers/category.controller.js";
import { isAdmin, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/createCategory").post(verifyJWT, isAdmin, createCategory);
// router.route("/showAllCategories").get(verifyJWT, isAdmin, showAllCategories);
router.route("/showAllCategories").get(showAllCategories);
router.route("/getCategoryPageDetails").post(categoryPageDetails);

export default router;
