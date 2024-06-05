import { Router } from "express";
import {
  isInstructor,
  isStudent,
  verifyJWT,
} from "../middlewares/auth.middleware.js";
import {
  createCourse,
  deleteCourse,
  editCourse,
  getAllCoursedetails,
  getFullCourseDetails,
  getInstructorCourses,
  showAllCourses,
} from "../controllers/course.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { updateCourseProgress } from "../controllers/courseProgress.controller.js";

const router = Router();

router
  .route("/createCourse")
  .post(verifyJWT, isInstructor, upload.single("thumbnail"), createCourse);
router.route("/showAllCourses").get(showAllCourses);
router.route("/getAllCoursedetails").post(getAllCoursedetails);
router
  .route("/editCourse")
  .post(verifyJWT, isInstructor, upload.single("thumbnail"), editCourse);
router
  .route("/getInstructorCourses")
  .get(verifyJWT, isInstructor, getInstructorCourses);
router.route("/deleteCourse").delete(verifyJWT, isInstructor, deleteCourse);
router.route("/getFullCourseDetails").post(verifyJWT, getFullCourseDetails);
router
  .route("/updateCourseProgress")
  .post(verifyJWT, isStudent, updateCourseProgress);

export default router;
