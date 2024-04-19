import React, { useState } from "react";

const EnrolledCourse = () => {
  const [enrolledCourses, setEnrolledCourses] = useState(null);
  return (
    <>
      <h1 className="text-3xl text-richblack-50">Enrolled Courses</h1>
      {!enrolledCourses ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          {/* <div className="spinner"></div> */}
          <h1 className="text-4xl text-richblack-50">Pending...</h1>
        </div>
      ) : !enrolledCourses.length ? (
        <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
          You have not enrolled in any course yet.
        </p>
      ) : (
        <div className="my-8 text-richblack-5">
          {/* Headings */}
          <div className="flex rounded-t-lg bg-richblack-500 ">
            <p className="w-[45%] px-5 py-3">Course Name</p>
            <p className="w-1/4 px-2 py-3">Duration</p>
            <p className="flex-1 px-2 py-3">Progress</p>
          </div>
        </div>
      )}
    </>
  );
};

export default EnrolledCourse;
