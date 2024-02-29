import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema({
  courseName: {
    type: String,
    required: true,
    trim: true,
  },
  courseDescription: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  whatYouWillLearn: {
    type: String,
  },
  instructor: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseContent: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Section",
    },
  ],
  ratingAndReviews: [
    {
      type: mongoose.Types.ObjectId,
      ref: "RatingAndReview",
    },
  ],
  thumbnail: {
    type: String,
  },
  tag: {
    type: mongoose.Types.ObjectId,
    ref: "Tag",
  },
  studentsEnrolled: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
});

export const Course = mongoose.model("Course", courseSchema);
