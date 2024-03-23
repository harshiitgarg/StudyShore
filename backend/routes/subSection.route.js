import { Router } from "express";
import { isInstructor, verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createSubSection,
  deleteSubSection,
  updateSubSection,
} from "../controllers/subSection.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/createSubSection")
  .post(verifyJWT, isInstructor, upload.single("videoFile"), createSubSection);
router
  .route("/updateSubSection")
  .put(verifyJWT, isInstructor, upload.single("videoFile"), updateSubSection);
router
  .route("/deleteSubSection")
  .delete(verifyJWT, isInstructor, deleteSubSection);

export default router;
