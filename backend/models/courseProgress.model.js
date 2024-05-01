import mongoose, { Schema } from "mongoose";

const courseProgressSchema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    completedVideos: [
      {
        type: Schema.Types.ObjectId,
        ref: "SubSection",
      },
    ],
  },
  { timestamps: true }
);

export const CourseProgress = mongoose.model(
  "CourseProgress",
  courseProgressSchema
);
