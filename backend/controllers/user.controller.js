import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import generateUniqueOtp from "../helpers/otpGenerator.js";
import { OTP } from "../models/otp.model.js";
import { Profile } from "../models/profile.model.js";
import mailSender from "../utils/mailSender.js";
import { imageUrl } from "../constants.js";
import otpGenerator from "otp-generator";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          "Error occured while generating access and refresh tokens",
          {}
        )
      );
  }
};

const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email?.trim()) {
    return res.status(401).json(new ApiResponse(401, "Email is required", {}));
  }
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    return res
      .status(401)
      .json(new ApiResponse(401, "User already exists", {}));
  }
  // const otp = generateUniqueOtp();
  var otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  console.log(otp);
  const savedOtp = await OTP.create({ email, otp });
  if (!savedOtp) {
    return res
      .status(500)
      .json(new ApiResponse(500, "Error occured while sending otp", {}));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Otp sent successfully", otp));
});

const registerUser = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    accountType,
    otp,
  } = req.body;
  if (
    [
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      otp,
    ].some((field) => field?.trim() === "")
  ) {
    return res
      .status(403)
      .json(new ApiResponse(403, "All fields are required", {}));
  }
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          "Password and confirm password does not match. Please try again",
          {}
        )
      );
  }
  const existingUser = await User.findOne({ $or: [{ firstName }, { email }] });
  if (existingUser) {
    return res
      .status(401)
      .json(new ApiResponse(401, "User already exists", {}));
  }
  const response = await OTP.findOne({ email });
  if (!response) {
    return res.status(400).json(new ApiResponse(400, "OTP is not valid", {}));
  }
  const profileDetails = await Profile.create({
    gender: null,
    dateOfBirth: null,
    about: null,
    contactNumber: null,
  });
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password,
    accountType,
    additionDetails: profileDetails._id,
    image: `${imageUrl} ${firstName} ${lastName}`,
  });
  if (!newUser) {
    return res
      .status(500)
      .json(new ApiResponse(500, "Error while registering the user", {}));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "User registered successfully", newUser));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email?.trim() || !password) {
    return res
      .status(400)
      .json(new ApiResponse(400, "All fields are required", {}));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(404)
      .json(new ApiResponse(404, "User does not exists", {}));
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    return res.status(401).json(new ApiResponse(401, "Incorrect password", {}));
  }
  const { accessToken, refreshToken } = generateAccessAndRefreshTokens(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select([
    "-password -refreshToken",
  ]);
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "User logged in successfully", {
        user: loggedInUser,
        accessToken,
        refreshToken,
      })
    );
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Current and new password are required", {}));
  }
  if (newPassword !== confirmNewPassword) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Please enter the same password", {}));
  }
  const user = await User.findById(req.user?.id);
  const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);
  if (!isPasswordCorrect) {
    return res.status(400).json(new ApiResponse(400, "Incorrect password", {}));
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  const mailResponse = mailSender(
    user?.email,
    "Password updated successfully",
    "Password is updated."
  );
  return res
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully", {}));
});

export { sendOtp, registerUser, loginUser, changePassword };
