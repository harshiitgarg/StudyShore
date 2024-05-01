import { useEffect, useState } from "react";
import IconBtn from "../common/IconBtn";
import { VscAdd } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import CoursesTable from "./InstructorCourses/CoursesTable";
import { useSelector } from "react-redux";
import { fetchInstructorCourses } from "../../services/operations/CourseAPI";

const MyCourses = () => {
  const navigate = useNavigate();
  const { token } = useSelector((store) => store.auth);
  const [courses, setCourses] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const response = await fetchInstructorCourses(token);
    if (response) {
      setCourses(response);
    }
  };

  return (
    <div>
      <div className="mb-14 flex items-center justify-between">
        <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>
        <IconBtn
          text="Add Course"
          onClick={() => navigate("/dashboard/add-course")}
        >
          <VscAdd />
        </IconBtn>
      </div>
      {courses && <CoursesTable courses={courses} setCourses={setCourses} />}
    </div>
  );
};

export default MyCourses;
