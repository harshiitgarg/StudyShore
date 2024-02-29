import mongoose, { Schema } from "mongoose";

const courseProgressSchema = new Schema({
  courseID: {
    type: mongoose.Types.ObjectId,
    ref: "Course",
  },
  completedVideos: [
    {
      type: mongoose.Types.ObjectId,
      ref: "SubSection",
    },
  ],
});

export const CourseProgress = mongoose.model(
  "CourseProgress",
  courseProgressSchema
);
