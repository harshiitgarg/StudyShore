import mongoose from "mongoose";
import { CourseProgress } from "../models/courseProgress.model.js";
import { SubSection } from "../models/subSection.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const updateCourseProgress = asyncHandler(async (req, res) => {
  const { courseId, subSectionId } = req.body;
  const userId = req.user._id.toString();

  const subSection = await SubSection.findById(subSectionId);
  if (!subSection) {
    return res
      .status(404)
      .json(new ApiResponse(404, "Subsection doesn't exist"));
  }
  console.log({ courseId: courseId }, { userId: userId });
  let courseProgress = await CourseProgress.findOne({
    courseId: courseId,
    userId: userId,
  });

  if (!courseProgress) {
    return res
      .status(404)
      .json(new ApiResponse(404, "Course progress Does Not Exist"));
  } else {
    if (courseProgress.completedVideos.includes(subSectionId)) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Subsection already completed"));
    }

    courseProgress.completedVideos.push(subSectionId);
  }

  await courseProgress.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Course Progress updated successfully"));
});

export { updateCourseProgress };
