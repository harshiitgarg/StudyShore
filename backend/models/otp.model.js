import mongoose, { Schema } from "mongoose";
import mailSender from "../utils/mailSender.js";

const otpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      expires: 5 * 60,
    },
  },
  { timestamps: true }
);

async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email from StudyShore",
      otp
    ); // I think error is happening while passing otp directly instead of html.
  } catch (error) {
    console.log(
      "Error occured while sending verification email:",
      error.message
    );
    throw error;
  }
}

otpSchema.pre("save", async function (next) {
  await sendVerificationEmail(this.email, this.otp);
  next();
});

export const OTP = mongoose.model("OTP", otpSchema);
