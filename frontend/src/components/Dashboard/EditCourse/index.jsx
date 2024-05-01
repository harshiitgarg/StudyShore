import React, { useEffect, useState } from "react";
import RenderSteps from "../AddCourse/RenderSteps";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getFullDetailsOfCourse } from "../../../services/operations/CourseAPI";
import { setCourse, setEditCourse } from "../../../slices/courseSlice";

const EditCourse = () => {
  const dispatch = useDispatch();
  const { courseId } = useParams();
  const { course } = useSelector((store) => store.course);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((store) => store.auth);

  useEffect(() => {
    (async () => {
      setLoading(true);
      console.log(courseId);
      const result = await getFullDetailsOfCourse(courseId, token);
      if (result?.courseDetails) {
        dispatch(setEditCourse(true));
        dispatch(setCourse(result?.courseDetails));
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">
        Edit Course
      </h1>
      <div className="mx-auto max-w-[600px]">
        {course ? (
          <RenderSteps />
        ) : (
          <p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
            Course not found
          </p>
        )}
      </div>
    </div>
  );
};

export default EditCourse;
