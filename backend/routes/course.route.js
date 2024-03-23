import { Router } from "express";
import { isInstructor, verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createCourse,
  getAllCoursedetails,
  showAllCourses,
} from "../controllers/course.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/createCourse")
  .post(verifyJWT, isInstructor, upload.single("thumbnail"), createCourse);
router.route("/showAllCourses").get(showAllCourses);
router.route("/getAllCoursedetails").get(getAllCoursedetails);

export default router;
