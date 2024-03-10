import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mailSender from "../utils/mailSender.js";
import { instance } from "../utils/razorpay.js";

const capturePayment = asyncHandler(async (req, res) => {
  //get course and user id
  const { courseId } = req.body;
  const userId = req.user._id;
  //   validate courseId
  if (!courseId) {
    return res.status(400).json(new ApiResponse(400, "Invalid course", {}));
  }
  let course;
  try {
    course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json(new ApiResponse(404, "Course not found", {}));
    }
    const uid = Types.ObjectId(userId);
    if (course.studentsEnrolled.includes(uid)) {
      return res
        .status(200)
        .json(
          new ApiResponse(200, "Student is already enrolled in the course", {})
        );
    }
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error.message, {}));
  }
  const totalAmount = course.price;
  const currency = "INR";
  const options = {
    amount: totalAmount * 100,
    currency,
    receipt: Math.random(Date.now()).toString(),
    notes: {
      courseId: course._id,
      userId: userId,
    },
  };
  const response = await instance.orders.create(options);
  if (!response) {
    return res
      .status(500)
      .json(new ApiResponse(500, "Order can't be initiated", {}));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Payment initiated successfully", response));
});

const verifyPayment = asyncHandler(async (req, res) => {
  const webHookSecret = "12345678";

  const signature = req.headers["x-razorpay-signature"];

  const shasum = crypto.createHmac("sha256", webHookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest;
  ("hex");

  if (signature === digest) {
    console.log("Payment is authorised");
    const { courseId, userId } = req.body.payload.payment.entity.notes;
    try {
      const enrolledCourse = await Course.findByIdAndUpdate(
        courseId,
        {
          $push: {
            studentsEnrolled: userId,
          },
        },
        { new: true }
      );
      if (!enrolledCourse) {
        return res
          .status(500)
          .json(new ApiResponse(500, "Course not found", {}));
      }
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
          },
        },
        { new: true }
      );
      if (!enrolledStudent) {
        return res
          .status(500)
          .json(new ApiResponse(500, "Student not found", {}));
      }
      const mailResponse = await mailSender(
        enrolledStudent.email,
        "Congratulations",
        "Congratulations, you are onboarded to our new course"
      );
      return res
        .status(200)
        .json(new ApiResponse(200, "Signature verified and course added", {}));
    } catch (error) {
      return res.status(500).json(new ApiResponse(500, error.message, {}));
    }
  }
});

export { capturePayment, verifyPayment };
