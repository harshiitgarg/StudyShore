import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema(
  {
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
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    tags: [
      {
        type: String,
      },
    ],
    studentsEnrolled: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);
