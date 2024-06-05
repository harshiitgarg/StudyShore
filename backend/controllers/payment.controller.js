import { Course } from "../models/course.model.js";
import { CourseProgress } from "../models/courseProgress.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mailSender from "../utils/mailSender.js";
import { instance } from "../utils/razorpay.js";
import { courseEnrollmentEmail } from "../mail/templates/courseEnrollementEmail.mjs";
import { paymentSuccessEmail } from "../mail/templates/paymentSuccessEmail.mjs";
import crypto from "crypto";

const capturePayment = asyncHandler(async (req, res) => {
  //get course and user id
  const { courses } = req.body;
  const userId = req.user._id;
  if (courses.length === 0) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Please provide course Id"));
  }
  let totalAmount = 0;
  for (const courseId of courses) {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json(new ApiResponse(404, "Course not found", {}));
    }
    // Check if the user is already enrolled in the course
    // const uid = new mongoose.Types.ObjectId(userId);
    if (course.studentsEnrolled.includes(userId)) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Student already enrolled", {}));
    }
    totalAmount += course.price;
  }

  const options = {
    currency: "INR",
    amount: totalAmount * 100,
    receipt: Math.random(Date.now()).toString(),
  };

  const response = await instance.orders.create(options);
  if (!response) {
    return res
      .status(500)
      .json(new ApiResponse(500, "Could not initiate the order", {}));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Successfully initiated the order", response));
});

const verifyPayment = asyncHandler(async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;

  const userId = req.user.id;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(400).json(new ApiResponse(400, "Payment failed", {}));
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    enrollStudents(courses, userId, res);
    return res.status(200).json(new ApiResponse(200, "Payment Verified", {}));
  }
  return res.status(500).json(new ApiResponse(500, "Payment Failed", {}));
});

const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Please Provide Course ID and User ID", {}));
  }
  for (const courseId of courses) {
    const enrolledCourse = await Course.findOneAndUpdate(
      { _id: courseId },
      { $push: { studentsEnrolled: userId } },
      { new: true }
    );
    if (!enrolledCourse) {
      return res.status(404).json(new ApiResponse(404, "No course found", {}));
    }

    const courseProgress = await CourseProgress.create({
      courseId: courseId,
      userId: userId,
      completedVideos: [],
    });

    const enrolledStudent = await User.findByIdAndUpdate(
      userId,
      {
        $push: { courses: courseId, courseProgress: courseProgress._id },
      },
      { new: true }
    );

    mailSender(
      enrolledStudent.email,
      `Successfully Enrolled into ${enrolledCourse.courseName}`,
      courseEnrollmentEmail(
        enrolledCourse.courseName,
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
      )
    );
  }
};

const sendPaymentSuccessEmail = asyncHandler(async (req, res) => {
  const { orderId, paymentId, amount } = req.body;

  const userId = req.user.id;

  if (!orderId || !paymentId || !amount) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Please provide all the details", {}));
  }

  const enrolledStudent = User.findById(userId);
  mailSender(
    enrolledStudent.email,
    "Payment Received",
    paymentSuccessEmail(
      `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
      amount / 100,
      orderId,
      paymentId
    )
  );
});

export { capturePayment, verifyPayment, sendPaymentSuccessEmail };
