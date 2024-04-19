import { Course } from "../models/course.model.js";
import { Category } from "../models/category.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createCourse = asyncHandler(async (req, res) => {
  const {
    courseName,
    courseDescription,
    price,
    whatYouWillLearn,
    category,
    tag,
  } = req.body;
  if (
    !courseName ||
    !courseDescription ||
    !price ||
    !whatYouWillLearn ||
    !category ||
    !tag
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, "All fields are required", {}));
  }
  const thumbnailFilePath = req.file?.path;
  if (!thumbnailFilePath) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Thumbnail is also required", {}));
  }
  const thumbnail = await uploadOnCloudinary(thumbnailFilePath);
  const course = await Course.create({
    courseName,
    courseDescription,
    price,
    whatYouWillLearn,
    category,
    tag,
    thumbnail: thumbnail.secure_url,
    instructor: req.user._id,
  });
  if (!course) {
    return res
      .status(500)
      .json(new ApiResponse(500, "Error while creating the course", {}));
  }
  // const userId = req.user._id;
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $push: {
        courses: course._id,
      },
    },
    { new: true }
  );
  await Category.findByIdAndUpdate(
    category,
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

const editCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const updates = req.body;
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json(new ApiResponse(404, "Course not found", {}));
  }
  if (req.file) {
    console.log("Thumbnail update");
    const thumbnailFilePath = req.file.path;
    const thumbnail = await uploadOnCloudinary(thumbnailFilePath);
    course.thumbnail = thumbnail.secure_url;
  }
  //update only the fields that are present in the request body
  for (const key in updates) {
    if (updates.hasOwnProperty(key)) {
      if (key == "tag" || key == "instructions") {
        course[key] = JSON.parse(updates[key]);
      } else {
        course[key] = updates[key];
      }
    }
  }
  await course.save();

  const updatedCourse = await Course.findOne({
    _id: courseId,
  })
    .populate({
      path: "instructor",
      populate: {
        path: "additionalDetails",
      },
    })
    .populate("category")
    .populate("ratingAndReviews")
    .populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    })
    .exec();

  if (!updatedCourse) {
    return res.status(500).json(new ApiResponse(500, "Course not updated", {}));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Course updated successfully", updatedCourse));
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

export { createCourse, editCourse, showAllCourses, getAllCoursedetails };
