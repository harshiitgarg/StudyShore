import { Course } from "../models/course.model.js";
import { Category } from "../models/category.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createCourse = asyncHandler(async (req, res) => {
  const { courseName, courseDescription, price, whatYouWillLearn, category } =
    req.body;
  if (
    !courseName ||
    !courseDescription ||
    !price ||
    !whatYouWillLearn ||
    !category
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, "All fields are required", {}));
  }
  const thumbnailFilePath = req.files.thumbnail;
  if (!thumbnailFilePath) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Thumbnail is also required", {}));
  }
  const thumbnail = await uploadOnCloudinary(
    thumbnailFilePath,
    process.env.FOLDER_NAME
  );
  const course = await Course.create({
    courseName,
    courseDescription,
    price,
    whatYouWillLearn,
    category,
    thumbnail: thumbnail.secure_url,
  });
  if (!course) {
    return res
      .status(500)
      .json(new ApiResponse(500, "Error while creating the course", {}));
  }
  const userId = req.user._id;
  await User.findByIdAndUpdate(
    { userId },
    {
      $push: {
        courses: course._id,
      },
    },
    { new: true }
  );
  await Category.findByIdAndUpdate(
    { category },
    {
      $push: {
        courses: course._id,
      },
    },
    { new: true }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, "Course created successfully", course));
});

const showAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({});
  if (!courses) {
    return res.status(404).json(new ApiResponse(404, "No course found", {}));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Courses fetched successfully", courses));
});

const getAllCoursedetails = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const courseDetails = await Course.findById(courseId)
    .populate({
      path: "instructor",
      populate: {
        path: "additionalDetails",
      },
    })
    .populate({
      path: "courseContent",
      populate: {
        path: "subSection",
        select: "-videoUrl",
      },
    })
    .populate("ratingAndReviews")
    .populate("category");
  if (!courseDetails) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          `Could not found the course with id: ${courseId}`,
          {}
        )
      );
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        `Successfully fetched the details of the course with id: ${courseId}`,
        courseDetails
      )
    );
});

export { createCourse, showAllCourses, getAllCoursedetails };
