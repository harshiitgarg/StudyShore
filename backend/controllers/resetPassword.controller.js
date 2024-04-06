import { resetPasswordUrl } from "../constants.js";
import passwordUpdated from "../mail/templates/changePassword.mjs";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mailSender from "../utils/mailSender.js";

const resetPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email?.trim()) {
    return res.status(400).json(new ApiResponse(400, "Email is required", {}));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json(new ApiResponse(400, "This email is not registered with us", {}));
  }
  const token = crypto.randomUUID();

  const updatedDetails = await User.findOneAndUpdate(
    { email },
    {
      token,
      resetPasswordExpires: Date.now() + 5 * 60 * 1000,
    },
    { new: true }
  );
  const url = `${resetPasswordUrl}/${token}`;
  const mailResponse = mailSender(
    email,
    "Password reset token",
    `Your Link for email verification is ${url}. Please click this url to reset your password.`
  );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Password reset link sent successfully. Please check your email for further process",
        mailResponse
      )
    );
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password, confirmPassword, token } = req.body;
  if (!password || !confirmPassword || !token) {
    return res
      .status(400)
      .json(new ApiResponse(400, "All fields are required", {}));
  }
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, "Password and Confirm Password Does not Match", {})
      );
  }
  const user = await User.findOne({ token });
  if (!user) {
    return res.status(400).json(new ApiResponse(400, "Invalid token", {}));
  }
  if (user.resetPasswordExpires < Date.now()) {
    return res.status(403).json(new ApiResponse(403, "Token expired", {}));
  }
  user.password = password;
  await user.save({ validateBeforeSave: false });
  const response = mailSender(
    user.email,
    "Password updated successfully",
    passwordUpdated(user.email, user.firstName)
  );
  return res
    .status(200)
    .json(new ApiResponse(200, "Password reset successfully", {}));
});

export { resetPasswordToken, resetPassword };
