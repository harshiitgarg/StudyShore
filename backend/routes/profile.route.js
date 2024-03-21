import { Router } from "express";
import {
  deleteAccount,
  getAllUserDetails,
  updateProfile,
  updateProfilePicture,
} from "../controllers/profile.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/updateProfilePicture")
  .put(verifyJWT, upload.single("imageFile"), updateProfilePicture);
router.route("/updateDetails").put(verifyJWT, updateProfile);
router.route("/").get(verifyJWT, getAllUserDetails);
router.route("/deleteProfile").delete(verifyJWT, deleteAccount);

export default router;
