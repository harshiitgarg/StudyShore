import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useParams } from "react-router-dom";
import VideoDetailsSidebar from "../components/ViewCourse/VideoDetailsSidebar";
import CourseReviewModal from "../components/ViewCourse/CourseReviewModal";
import { getFullDetailsOfCourse } from "../services/operations/CourseAPI";
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice";

const ViewCourse = () => {
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [reviewModal, setReviewModal] = useState(false);
  // const location = useLocation();

  useEffect(() => {
    (async () => {
      console.log(courseId);
      const res = await getFullDetailsOfCourse(courseId, token);
      dispatch(setEntireCourseData(res.courseDetails));
      console.log(res);
      dispatch(setCourseSectionData(res.courseDetails.courseContent));
      dispatch(setCompletedLectures(res.completedVideos));
      let lectures = 0;
      res.courseDetails.courseContent.forEach((sec) => {
        lectures += sec.subSection.length;
      });
      dispatch(setTotalNoOfLectures(lectures));
    })();
  }, []);

  return (
    <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)]">
        <VideoDetailsSidebar setReviewModal={setReviewModal} />
        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
          <div className="mx-6">
            <Outlet />
          </div>
        </div>
      </div>
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  );
};

export default ViewCourse;
