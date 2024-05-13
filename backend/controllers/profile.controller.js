import { Course } from "../models/course.model.js";
import { CourseProgress } from "../models/courseProgress.model.js";
import { Profile } from "../models/profile.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import convertSecondsToDuration from "../utils/secToDuration.js";

const updateProfile = asyncHandler(async (req, res) => {
  const {
    firstName = "",
    lastName = "",
    gender = "",
    contactNumber = "",
    dateOfBirth = "",
    about = "",
  } = req.body;
  if (!gender || !contactNumber) {
    return res
      .status(400)
      .json(new ApiResponse(400, "All fields are required", {}));
  }
  const userDetails = await User.findById(req.user._id);
  const profileDetails = await Profile.findById(userDetails.additionalDetails);
  const user = await User.findByIdAndUpdate(req.user._id, {
    firstName,
    lastName,
  });
  await user.save();
  profileDetails.gender = gender;
  profileDetails.contactNumber = contactNumber;
  profileDetails.dateOfBirth = dateOfBirth;
  profileDetails.about = about;
  await profileDetails.save();
  const updatedUserDetails = await User.findById(req.user._id)
    .populate("additionalDetails")
    .exec();
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Profile updated successfully", updatedUserDetails)
    );
});

const updateProfilePicture = asyncHandler(async (req, res) => {
  // extract the path from req
  const imageFilePath = req.file?.path;
  if (!imageFilePath) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Upload a valid image", {}));
  }
  // upload to cloudinary
  const image = await uploadOnCloudinary(imageFilePath);
  // find and delete the previous profile picture
  const user = await User.findById(req.user?._id);
  if (user?.image) {
    await deleteFromCloudinary(user?.image);
  }
  if (!image.secure_url) {
    return res.status(401).json(new ApiResponse(401, "Image not uploaded", {}));
  }
  // update the profile picture
  const updatedUser = await User.findByIdAndUpdate(
    req?.user._id,
    {
      $set: {
        image: image.secure_url,
      },
    },
    { new: true }
  ).select("-password");
  if (!updatedUser) {
    return res
      .status(500)
      .json(new ApiResponse(500, "Error occured while updating the image", {}));
  }
  // return the res
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Profile picture updated successfully", updatedUser)
    );
});

const deleteAccount = asyncHandler(async (req, res) => {
  const _id = req.user._id;
  const user = await User.findById(_id);
  await Profile.findByIdAndDelete(user.additionalDetails);
  for (const courseId of user.courses) {
    await Course.findByIdAndUpdate(
      courseId,
      {
        $pull: {
          studentsEnrolled: _id,
        },
      },
      { new: true }
    );
  }
  await User.findByIdAndDelete(_id);
  return res
    .status(200)
    .json(new ApiResponse(200, "Account deleted successfully"));
});

const getAllUserDetails = asyncHandler(async (req, res) => {
  const userDetails = await User.findById(req.user._id)
    .select("-password")
    .populate("additionalDetails")
    .exec();
  return res
    .status(200)
    .json(new ApiResponse(200, "User data fetched successfully", userDetails));
});

const getEnrolledCourses = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  let userDetails = await User.findOne({
    _id: userId,
  })
    .populate({
      path: "courses",
      populate: {
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      },
    })
    .exec();

  var subSectionLength = 0;

  for (let i = 0; i < userDetails.courses.length; i++) {
    let totalDurationInSeconds = 0;
    subSectionLength = 0;

    for (let j = 0; j < userDetails.courses[i].courseContent.length; j++) {
      totalDurationInSeconds += userDetails.courses[i].courseContent[
        j
      ].subSection.reduce((acc, curr) => acc + parseInt(curr.duration), 0);

      userDetails.courses[i].courseContent[j].duration =
        convertSecondsToDuration(totalDurationInSeconds);
      subSectionLength +=
        userDetails.courses[i].courseContent[j].subSection.length;
    }

    let courseProgressCount = await CourseProgress.findOne({
      courseId: userDetails.courses[i]._id,
      userId: userId,
    });
    courseProgressCount = courseProgressCount?.completedVideos.length;

    if (subSectionLength === 0) {
      userDetails.courses[i].progressPercentage = 100;
    } else {
      // To make it up to 2 decimal point
      const multiplier = Math.pow(10, 2);
      userDetails.courses[i].progressPercentage =
        Math.round(
          (courseProgressCount / subSectionLength) * 100 * multiplier
        ) / multiplier;
    }
  }

  if (!userDetails) {
    return res
      .status(404)
      .json(
        new ApiResponse(404, `Could not find user with id: ${userDetails}`, {})
      );
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Enrolled courses fetched successfully",
        userDetails.courses
      )
    );
});

export {
  updateProfile,
  deleteAccount,
  getAllUserDetails,
  updateProfilePicture,
  getEnrolledCourses,
};
