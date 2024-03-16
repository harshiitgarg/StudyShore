import mongoose from "mongoose";
import { RatingAndReview } from "../models/ratingAndReview.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Course } from "../models/course.model.js";

const addRating = asyncHandler(async (req, res) => {
  //get rating and review
  const { courseId, rating, review } = req.body;
  const userId = req.user._id;
  //validation
  if (!courseId || !rating || !review) {
    return res
      .status(400)
      .json(new ApiResponse(400, "All fields are required", {}));
  }
  //check if student is enrolled or not
  const enrolledStudentCheck = await Course.findOne({
    _id: courseId,
    studentsEnrolled: { $elemMatch: { $eq: userId } },
  });
  if (!enrolledStudentCheck) {
    return res
      .status(404)
      .json(new ApiResponse(404, "Student is not enrolled in this course", {}));
  }
  //check whether the user already reviewed the course or not
  const alreadyReviewed = await RatingAndReview.findOne({
    user: userId,
    course: courseId,
  });
  if (alreadyReviewed) {
    return res
      .status(403)
      .json(
        new ApiResponse(403, "Course is already reviewed by the Student", {})
      );
  }
  //create a rating
  const ratingAndReview = await RatingAndReview.create({
    rating,
    review,
    user: userId,
    course: courseId,
  });
  if (!ratingAndReview) {
    return res
      .status(500)
      .json(
        new ApiResponse(500, "Failed to publish the rating and review", {})
      );
  }
  //push the rating to the course
  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    {
      $push: {
        ratingAndReviews: ratingAndReview._id,
      },
    },
    { new: true }
  );
  if (!updatedCourse) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          "Failed to publish the rating and review to the course",
          {}
        )
      );
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Published the rating and review successfully",
        ratingAndReview
      )
    );
});

const getAvgRating = asyncHandler(async (req, res) => {
  const courseId = req.body.courseId;

  const result = await RatingAndReview.aggregate([
    {
      $match: {
        course: mongoose.Types.ObjectId(courseId),
      },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
      },
    },
  ]);
  if (!result.length) {
    return res.status(200).json(
      new ApiResponse(200, "Average Rating is 0, no ratings given till now", {
        averageRating: 0,
      })
    );
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Average rating of the course fetched successfully",
        result[0].averageRating
      )
    );
});

const getAllRatings = asyncHandler(async (req, res) => {
  const allRatings = await RatingAndReview.find({})
    .sort({ rating: "desc" })
    .populate({
      path: "user",
      select: "firstName lastName image email",
    })
    .populate({
      path: "course",
      select: "courseName",
    })
    .exec();
  if (!allRatings) {
    return res
      .status(500)
      .json(
        new ApiResponse(500, "Failed to fetch the ratings for this course", {})
      );
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Successfully fetched the ratings for this course",
        allRatings
      )
    );
});

export { addRating, getAvgRating, getAllRatings };
