import mongoose, { Schema } from "mongoose";

const ratingAndReviewSchema = new Schema(
  {
    rating: {
      type: Number,
      required: true,
    },
    review: {
      type: String,
      trim: true,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Course",
      index: true,
    },
  },
  { timestamps: true }
);

export const RatingAndReview = mongoose.model(
  "RatingAndReview",
  ratingAndReviewSchema
);
