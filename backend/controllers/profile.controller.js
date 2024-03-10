import { Course } from "../models/course.model";
import { Profile } from "../models/profile.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const updateProfile = asyncHandler(async (req, res) => {
  const { gender, contactNumber, dateOfBirth = "", about = "" } = req.body;
  if (!gender || !contactNumber) {
    return res
      .status(400)
      .json(new ApiResponse(400, "All fields are required", {}));
  }
  const user = await User.findById(req.user._id);
  const profileDetails = await Profile.findById(user.additionDetails);
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

const deleteAccount = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id);
  await Profile.findByIdAndDelete(user.additionDetails);
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
    .populate("additionalDetails")
    .exec();
  return res
    .status(200)
    .json(new ApiResponse(200, "User data fetched successfully", userDetails));
});

export { updateProfile, deleteAccount, getAllUserDetails };
