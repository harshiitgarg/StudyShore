import { BASE_URL } from "../utils/constants";

export const categories = {
  CATEGORIES_API: BASE_URL + "/category/showAllCategories",
};

export const endpoints = {
  LOGIN_API: BASE_URL + "/users/login",
  SIGNUP_API: BASE_URL + "/users/register",
  SENDOTP_API: BASE_URL + "/users/sendOtp",
  RESET_PASSWORD_TOKEN_API: BASE_URL + "/users/reset-password-token",
  RESET_PASSWORD_API: BASE_URL + "/users/reset-password",
};

export const contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/reach/contact",
};

export const settingsEndpoints = {
  UPDATE_PROFILE_PICTURE: BASE_URL + "/profile/updateProfilePicture",
  UPDATE_PROFILE: BASE_URL + "/profile/updateDetails",
  DELETE_PROFILE: BASE_URL + "/profile/deleteProfile",
};

export const courseEndpoints = {
  COURSE_DETAILS_API: BASE_URL + "/course/getAllCoursedetails",
  COURSE_CATEGORIES_API: BASE_URL + "/category/showAllCategories",
  EDIT_COURSE_API: BASE_URL + "/course/editCourse",
  ADD_COURSE_API: BASE_URL + "/course/createCourse",
  DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",
  GET_INSTRUCTOR_COURSES_API: BASE_URL + "/course/getInstructorCourses",
  GET_FULL_COURSE_DETAILS_AUTHENTICATED:
    BASE_URL + "/course/getFullCourseDetails",
  LECTURE_COMPLETION_API: BASE_URL + "/course/updateCourseProgress",
};

export const sectionEndpoints = {
  CREATE_SECTION_API: BASE_URL + "/section/createSection",
  UPDATE_SECTION_API: BASE_URL + "/section/updateSection",
  DELETE_SECTION_API: BASE_URL + "/section/deleteSection",
};

export const subSectionEndpoints = {
  CREATE_SUBSECTION_API: BASE_URL + "/subSection/createSubSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/subSection/updateSubSection",
  DELETE_SUBSECTION_API: BASE_URL + "/subSection/deleteSubSection",
};

export const catalogData = {
  CATALOGPAGEDATA_API: BASE_URL + "/category/getCategoryPageDetails",
};

export const studentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  COURSE_VERIFY_API: BASE_URL + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
};

export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
  GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard",
};
