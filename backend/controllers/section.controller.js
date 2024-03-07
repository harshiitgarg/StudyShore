import { Course } from "../models/course.model.js";
import { Section } from "../models/section.model.js";
import { SubSection } from "../models/subSection.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createSection = asyncHandler(async (req, res) => {
  const { sectionName, courseId } = req.body;
  if (!sectionName || !courseId) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Required all fields", {}));
  }
  const section = await Section.create({
    sectionName,
  });
  if (!section) {
    return res
      .status(500)
      .json(new ApiResponse(500, "Failed to create a section", {}));
  }
  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    {
      $push: {
        courseContent: section._id,
      },
    },
    { new: true }
  )
    .populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    })
    .exec();
  return res
    .status(200)
    .json(new ApiResponse(200, "Section created successfully", updatedCourse));
});

const updateSection = asyncHandler(async (req, res) => {
  const { sectionName, sectionId, courseId } = req.body;
  if (!sectionName || !courseId || !sectionId) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Required all fields", {}));
  }
  const updatedSection = await Section.findByIdAndUpdate(
    sectionId,
    {
      sectionName: sectionName,
    },
    { new: true }
  );
  if (!updatedSection) {
    return res
      .status(500)
      .json(new ApiResponse(500, "Error while editing the section", {}));
  }
  const updatedCourse = await Course.findById(courseId)
    .populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    })
    .exec();
  return res
    .status(200)
    .json(new ApiResponse(200, "Section updated successfully", updatedCourse));
});

const deleteSection = asyncHandler(async (req, res) => {
  const { sectionId, courseId } = req.body;
  if (!sectionId || !courseId) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Missing required properties", {}));
  }
  await Course.findByIdAndUpdate(courseId, {
    $pull: {
      courseContent: sectionId,
    },
  });
  const section = await Section.findById(sectionId);
  if (!section) {
    return res.status(404).json(new ApiResponse(404, "Section not found", {}));
  }
  await SubSection.deleteMany({ _id: { $in: section.subSection } });
  await Section.findByIdAndDelete({ sectionId });
  const updatedCourse = await Course.findById(courseId)
    .populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    })
    .exec();
  return res
    .status(200)
    .json(new ApiResponse(200, "Deleted section succesfully", updatedCourse));
});

export { createSection, updateSection, deleteSection };
