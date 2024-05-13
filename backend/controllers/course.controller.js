import { Course } from "../models/course.model.js";
import { Category } from "../models/category.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Section } from "../models/section.model.js";
import { SubSection } from "../models/subSection.model.js";
import { CourseProgress } from "../models/courseProgress.model.js";
import convertSecondsToDuration from "../utils/secToDuration.js";

const createCourse = asyncHandler(async (req, res) => {
  const {
    courseName,
    courseDescription,
    price,
    whatYouWillLearn,
    category,
    tags,
    instructions,
  } = req.body;
  if (
    !courseName ||
    !courseDescription ||
    !price ||
    !whatYouWillLearn ||
    !category ||
    !tags ||
    !instructions
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
    tags,
    instructions,
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
    if (key == "tag" || key == "instructions") {
      course[key] = JSON.parse(updates[key]);
    } else {
      course[key] = updates[key];
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

const deleteCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json(new ApiResponse(404, "No course found"));
  }
  // unenroll students from the course
  const studentsEnrolled = course.studentsEnrolled;
  for (const studentId of studentsEnrolled) {
    await User.findByIdAndUpdate(studentId, { $pull: { courses: courseId } });
  }

  // delete sections and subsections
  const sections = course.courseContent;
  for (const sectionId of sections) {
    const section = await Section(sectionId);
    if (section) {
      const subSections = section.subSection;
      for (const subSectionId of subSections) {
        await SubSection.findByIdAndDelete(subSectionId);
      }
    }
    await Section.findByIdAndDelete(sectionId);
  }
  await Course.findByIdAndDelete(courseId);
  return res
    .status(200)
    .json(new ApiResponse(200, "Course deleted successfully", {}));
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
  if (!courseId) {
    return res.status(400).json(new ApiResponse(400, "Invalid id", {}));
  }
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

const getInstructorCourses = asyncHandler(async (req, res) => {
  const instructorId = req.user.id;
  const instructorCourses = await Course.find({
    instructor: instructorId,
  }).sort({ createdAt: -1 });
  if (!instructorCourses) {
    return res
      .status(500)
      .json(new ApiResponse(500, "Failed to retrieve the courses"));
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Successfully fetched the courses",
        instructorCourses
      )
    );
});

const getFullCourseDetails = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.id;
  const courseDetails = await Course.findOne(courseId)
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

  if (!courseDetails) {
    return res
      .status(404)
      .json(
        new ApiResponse(404, `Could not find course with id: ${courseId}`, {})
      );
  }

  let courseProgressCount = await CourseProgress.findOne({
    courseId: courseId,
    userId: userId,
  });
  console.log("courseProgressCount : ", courseProgressCount);

  let totalDurationInSeconds = 0;
  courseDetails.courseContent.forEach((content) => {
    content.subSection.forEach((subSection) => {
      const timeDurationInSeconds = parseInt(subSection.timeDuration);
      totalDurationInSeconds += timeDurationInSeconds;
    });
  });

  const totalDuration = convertSecondsToDuration(totalDurationInSeconds);
  return res.status(200).json(
    new ApiResponse(200, "Course details fetched successfully", {
      courseDetails,
      totalDuration,
    })
  );
});

export {
  createCourse,
  editCourse,
  deleteCourse,
  showAllCourses,
  getAllCoursedetails,
  getInstructorCourses,
  getFullCourseDetails,
};
