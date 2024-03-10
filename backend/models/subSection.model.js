import mongoose, { Schema } from "mongoose";

const subSectionSchema = new Schema(
  {
    videoUrl: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export const SubSection = mongoose.model("SubSection", subSectionSchema);
