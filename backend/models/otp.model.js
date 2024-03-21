import mongoose, { Schema } from "mongoose";
import mailSender from "../utils/mailSender.js";
import otpTemplate from "../mail/templates/emailVerification.mjs";

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
      expires: 15 * 60,
    },
  },
  { timestamps: true }
);

async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email from StudyShore",
      otpTemplate(otp)
    );
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
