import { Section } from "../models/section.model.js";
import { SubSection } from "../models/subSection.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

const createSubSection = asyncHandler(async (req, res) => {
  const { sectionId, title, description } = req.body;
  const videoLocalPath = req.file.path;
  if (!title?.trim() || !description?.trim() || !videoLocalPath || !sectionId) {
    return res
      .status(400)
      .json(new ApiResponse(400, "All fields are required", {}));
  }
  const uploadedVideo = await uploadOnCloudinary(videoLocalPath);
  const newSubSection = await SubSection.create({
    videoUrl: uploadedVideo.secure_url,
    duration: `${uploadedVideo.duration}`,
    title,
    description,
  });
  if (!newSubSection) {
    return res
      .status(500)
      .json(new ApiResponse(500, "Failed to create a sub-section", {}));
  }
  const updatedSection = await Section.findByIdAndUpdate(
    sectionId,
    {
      $push: {
        subSection: newSubSection._id,
      },
    },
    { new: true }
  ).populate("subSection");
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Sub-section created successfully", updatedSection)
    );
});

const updateSubSection = asyncHandler(async (req, res) => {
  const { sectionId, subSectionId, title, description } = req.body;
  const videoLocalPath = req.file.path;
  if (
    !title?.trim() ||
    !description?.trim() ||
    !videoLocalPath ||
    !subSectionId ||
    !sectionId
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, "All fields are required", {}));
  }
  const subSection = await SubSection.findById(subSectionId);
  if (!subSection) {
    return res
      .status(404)
      .json(new ApiResponse(404, "Sub-section doesn't exist", {}));
  }
  subSection.title = title;
  subSection.description = description;
  // await deleteFromCloudinary(subSection?.videoUrl);
  const uploadedVideo = await uploadOnCloudinary(videoLocalPath);
  subSection.videoUrl = uploadedVideo.secure_url;
  subSection.duration = `${uploadedVideo.duration}`;
  await subSection.save();
  const updatedSection = await Section.findById(sectionId).populate(
    "subSection"
  );
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Sub-section updated successfully", updatedSection)
    );
});

const deleteSubSection = asyncHandler(async (req, res) => {
  const { sectionId, subSectionId } = req.body;
  if (!sectionId || !subSectionId) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Invalid section or sub-section", {}));
  }
  await Section.findByIdAndUpdate(sectionId, {
    $pull: {
      subSection: subSectionId,
    },
  });
  await SubSection.findByIdAndDelete(subSectionId);
  const updatedSection = await Section.findById(sectionId).populate(
    "subSection"
  );
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Sub-section deleted successfully", updatedSection)
    );
});

export { createSubSection, updateSubSection, deleteSubSection };
