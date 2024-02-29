import mongoose, { Schema } from "mongoose";
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: Number,
      trim: true,
    },
    accountType: {
      type: String,
      enum: ["Student", "Instructor", "Admin"],
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    approved: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      required: true,
    },
    additionDetails: {
      type: mongoose.Types.ObjectId,
      ref: "Profile",
    },
    courses: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Course",
      },
    ],
    courseProgress: [
      {
        type: mongoose.Types.ObjectId,
        ref: "CourseProgress",
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
