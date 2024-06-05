import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { courseEndpoints } from "../apis";

const {
  COURSE_CATEGORIES_API,
  EDIT_COURSE_API,
  ADD_COURSE_API,
  DELETE_COURSE_API,
  GET_INSTRUCTOR_COURSES_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
  COURSE_DETAILS_API,
  LECTURE_COMPLETION_API
} = courseEndpoints;

export const fetchCourseCategories = async () => {
  let result = [];
  try {
    const response = await apiConnector("GET", COURSE_CATEGORIES_API);
    console.log("COURSE_CATEGORIES_API API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories");
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("COURSE_CATEGORY_API API ERROR............", error);
    toast.error(error.message);
  }
  return result;
};

export const editCourseDetails = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", EDIT_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    console.log("EDIT COURSE API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Update Course Details");
    }
    toast.success("Course Details Updated Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("EDIT COURSE API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const addCourseDetails = async (data, token) => {
  let result;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", ADD_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    console.log("ADD COURSE API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Add Course Details");
    }
    toast.success("Course Details Added Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("ADD COURSE API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const fetchInstructorCourses = async (token) => {
  let result = [];
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector(
      "GET",
      GET_INSTRUCTOR_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("INSTRUCTOR COURSES API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Instructor Courses");
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("INSTRUCTOR COURSES API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const deleteCourse = async (courseId, token) => {
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("DELETE", DELETE_COURSE_API, courseId, {
      Authorization: `Bearer ${token}`,
    });
    console.log("DELETE COURSE API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Course Details");
    }
    toast.success("Course Details Deleted Successfully");
  } catch (error) {
    console.log("DELETE COURSE API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
};

export const getFullDetailsOfCourse = async (courseId, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    console.log(courseId);
    const response = await apiConnector(
      "POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      {courseId: courseId},
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("FULL COURSES DETAILS API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Instructor Courses");
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("FULL COURSES DETAILS API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const fetchCourseDetails = async (courseId) => {
  const toastId = toast.loading("Loading...");
  //   dispatch(setLoading(true));
  let result = null;
  try {
    const response = await apiConnector("POST", COURSE_DETAILS_API, {
      courseId,
    });
    console.log("COURSE_DETAILS_API API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response.data;
  } catch (error) {
    console.log("COURSE_DETAILS_API API ERROR............", error);
    result = error.response.data;
    // toast.error(error.response.data.message);
  }
  toast.dismiss(toastId);
  //   dispatch(setLoading(false));
  return result;
};

export const markLectureAsComplete = async (data, token) => {
  let result = null;
  console.log("mark complete data", data);
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", LECTURE_COMPLETION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log(
      "MARK_LECTURE_AS_COMPLETE_API API RESPONSE............",
      response
    );

    if (!response.data.message) {
      throw new Error(response.data.error);
    }
    toast.success("Lecture Completed");
    result = true;
  } catch (error) {
    console.log("MARK_LECTURE_AS_COMPLETE_API API ERROR............", error);
    toast.error(error.message);
    result = false;
  }
  toast.dismiss(toastId);
  return result;
};
