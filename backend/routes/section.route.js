import { Router } from "express";
import { isInstructor, verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createSection,
  deleteSection,
  updateSection,
} from "../controllers/section.controller.js";

const router = Router();

router.route("/createSection").post(verifyJWT, isInstructor, createSection);
router.route("/updateSection").put(verifyJWT, isInstructor, updateSection);
router.route("/deleteSection").delete(verifyJWT, isInstructor, deleteSection);

export default router;
